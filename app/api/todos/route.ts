import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createObsidianNote } from '@/lib/obsidian'
import { sendSlackNotification } from '@/lib/slack'

// GET /api/todos - Todo一覧取得
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(todos)
  } catch (error) {
    console.error('Failed to fetch todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}

// POST /api/todos - Todo作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, priority = 'MEDIUM', dueDate } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // デモ用のユーザーID（実際の実装では認証から取得）
    const userId = 'demo-user-id'

    // ユーザーが存在しない場合は作成
    let user = await prisma.user.findFirst({
      where: { id: userId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          slackUserId: 'demo-slack-user',
          name: 'Demo User',
          email: 'demo@example.com',
        },
      })
    }

    // Todoを作成
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
      include: {
        user: true,
      },
    })

    // Obsidianノートを作成
    const obsidianNotePath = await createObsidianNote(
      todo.id,
      title,
      description,
      dueDate ? new Date(dueDate) : undefined,
      priority
    )

    // ObsidianノートのパスをDBに保存
    if (obsidianNotePath) {
      await prisma.todo.update({
        where: { id: todo.id },
        data: { obsidianNote: obsidianNotePath },
      })
    }

    // Slack通知（緊急または高優先度の場合）
    if (priority === 'URGENT' || priority === 'HIGH') {
      try {
        await sendSlackNotification(
          process.env.SLACK_CHANNEL_ID || '#general',
          `新しい${priority === 'URGENT' ? '緊急' : '高優先度'}タスクが作成されました: ${title}`
        )
      } catch (slackError) {
        console.error('Failed to send Slack notification:', slackError)
        // Slack通知の失敗はタスク作成を失敗させない
      }
    }

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('Failed to create todo:', error)
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}