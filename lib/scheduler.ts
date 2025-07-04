import cron from 'node-cron'
import { prisma } from './prisma'
import { sendSlackNotification, createTodoNotificationBlocks } from './slack'

export function startNotificationScheduler() {
  // 毎日午前9時に未完了タスクをチェック
  cron.schedule(process.env.NOTIFICATION_CRON || '0 9 * * *', async () => {
    console.log('Running daily todo notification check...')
    await checkAndNotifyOverdueTodos()
  })

  // 毎時間、期限が近いタスクをチェック
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly due date check...')
    await checkAndNotifyUpcomingTodos()
  })

  console.log('Notification scheduler started')
}

async function checkAndNotifyOverdueTodos() {
  try {
    const overdueTodos = await prisma.todo.findMany({
      where: {
        completed: false,
        dueDate: {
          lt: new Date(),
        },
      },
      include: {
        user: true,
      },
    })

    if (overdueTodos.length === 0) {
      console.log('No overdue todos found')
      return
    }

    const blocks = createTodoNotificationBlocks(
      overdueTodos.map(todo => ({
        id: todo.id,
        title: todo.title,
        dueDate: todo.dueDate,
        priority: todo.priority,
      }))
    )

    await sendSlackNotification(
      process.env.SLACK_CHANNEL_ID || '#general',
      `⚠️ ${overdueTodos.length}件の期限切れタスクがあります`,
      blocks
    )

    console.log(`Sent notification for ${overdueTodos.length} overdue todos`)
  } catch (error) {
    console.error('Failed to check overdue todos:', error)
  }
}

async function checkAndNotifyUpcomingTodos() {
  try {
    const now = new Date()
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

    const upcomingTodos = await prisma.todo.findMany({
      where: {
        completed: false,
        dueDate: {
          gte: now,
          lte: oneHourFromNow,
        },
      },
      include: {
        user: true,
      },
    })

    if (upcomingTodos.length === 0) {
      return
    }

    const blocks = createTodoNotificationBlocks(
      upcomingTodos.map(todo => ({
        id: todo.id,
        title: todo.title,
        dueDate: todo.dueDate,
        priority: todo.priority,
      }))
    )

    await sendSlackNotification(
      process.env.SLACK_CHANNEL_ID || '#general',
      `⏰ ${upcomingTodos.length}件のタスクの期限が1時間以内に迫っています`,
      blocks
    )

    console.log(`Sent notification for ${upcomingTodos.length} upcoming todos`)
  } catch (error) {
    console.error('Failed to check upcoming todos:', error)
  }
}