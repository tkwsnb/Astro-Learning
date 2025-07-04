import { WebClient } from '@slack/web-api'

export const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN)

export const sendSlackNotification = async (
  channel: string,
  message: string,
  blocks?: any[]
) => {
  try {
    const result = await slackClient.chat.postMessage({
      channel,
      text: message,
      blocks,
    })
    return result
  } catch (error) {
    console.error('Slack notification error:', error)
    throw error
  }
}

export const createTodoNotificationBlocks = (
  todos: Array<{
    id: string
    title: string
    dueDate?: Date | null
    priority: string
  }>
) => {
  const todoBlocks = todos.map(todo => ({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*${todo.title}*\n優先度: ${todo.priority}\n期日: ${
        todo.dueDate ? todo.dueDate.toLocaleDateString('ja-JP') : '未設定'
      }`,
    },
    accessory: {
      type: 'button',
      text: {
        type: 'plain_text',
        text: '完了',
      },
      action_id: `complete_todo_${todo.id}`,
      value: todo.id,
    },
  }))

  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '📋 未完了のタスクがあります',
      },
    },
    {
      type: 'divider',
    },
    ...todoBlocks,
  ]
}