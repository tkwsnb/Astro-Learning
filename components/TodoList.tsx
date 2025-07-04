'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { TodoItem } from './TodoItem'
import { Todo } from '@/types'

interface TodoListProps {
  todos: Todo[]
  onUpdate: () => void
}

export function TodoList({ todos, onUpdate }: TodoListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleToggleComplete = async (todoId: string, completed: boolean) => {
    setUpdatingId(todoId)
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }

      toast.success(completed ? 'タスクを完了しました' : 'タスクを未完了にしました')
      onUpdate()
    } catch (error) {
      toast.error('タスクの更新に失敗しました')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (todoId: string) => {
    if (!confirm('このタスクを削除しますか？')) return

    setUpdatingId(todoId)
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }

      toast.success('タスクを削除しました')
      onUpdate()
    } catch (error) {
      toast.error('タスクの削除に失敗しました')
    } finally {
      setUpdatingId(null)
    }
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          タスクがありません
        </h3>
        <p className="text-gray-600">
          新しいタスクを作成して始めましょう
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          isUpdating={updatingId === todo.id}
        />
      ))}
    </div>
  )
}