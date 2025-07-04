'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'
import { CreateTodoRequest } from '@/types'

interface TodoFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function TodoForm({ onSuccess, onCancel }: TodoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTodoRequest>()

  const onSubmit = async (data: CreateTodoRequest) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create todo')
      }

      toast.success('タスクが作成されました')
      onSuccess()
    } catch (error) {
      toast.error('タスクの作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">新しいタスク</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          タイトル *
        </label>
        <input
          {...register('title', { required: 'タイトルは必須です' })}
          type="text"
          id="title"
          className="input"
          placeholder="タスクのタイトルを入力"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          説明
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          className="textarea"
          placeholder="タスクの詳細説明（任意）"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            優先度
          </label>
          <select
            {...register('priority')}
            id="priority"
            className="select"
          >
            <option value="LOW">低</option>
            <option value="MEDIUM">中</option>
            <option value="HIGH">高</option>
            <option value="URGENT">緊急</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            期日
          </label>
          <input
            {...register('dueDate')}
            type="datetime-local"
            id="dueDate"
            className="input"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isLoading}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? '作成中...' : '作成'}
        </button>
      </div>
    </form>
  )
}