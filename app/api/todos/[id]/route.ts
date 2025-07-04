import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateObsidianNote, deleteObsidianNote } from '@/lib/obsidian'

interface Params {
  id: string
}

// PATCH /api/todos/[id] - Todo更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, completed, priority, dueDate } = body

    // 既存のTodoを取得
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    })

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    // Todoを更新
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { 
          dueDate: dueDate ? new Date(dueDate) : null 
        }),
      },
      include: {
        user: true,
      },
    })

    // Obsidianノートを更新（完了状態が変更された場合）
    if (completed !== undefined && existingTodo.obsidianNote) {
      await updateObsidianNote(existingTodo.obsidianNote, completed)
    }

    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Failed to update todo:', error)
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}

// DELETE /api/todos/[id] - Todo削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = params

    // 既存のTodoを取得
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    })

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    // Obsidianノートを削除
    if (existingTodo.obsidianNote) {
      await deleteObsidianNote(existingTodo.obsidianNote)
    }

    // Todoを削除
    await prisma.todo.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete todo:', error)
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
}