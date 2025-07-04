'use client'

import { format, isAfter } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Check, Trash2, Clock, AlertCircle, ExternalLink } from 'lucide-react'
import { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onToggleComplete: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  isUpdating: boolean
}

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
}

const priorityLabels = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  URGENT: '緊急',
}

export function TodoItem({ todo, onToggleComplete, onDelete, isUpdating }: TodoItemProps) {
  const isOverdue = todo.dueDate && !todo.completed && isAfter(new Date(), new Date(todo.dueDate))
  
  const handleOpenObsidian = () => {
    if (todo.obsidianNote) {
      // obsidian:// protocol to open note in Obsidian
      window.open(`obsidian://open?vault=main&file=${encodeURIComponent(todo.obsidianNote)}`)
    }
  }

  return (
    <div className={`card transition-all duration-200 ${
      todo.completed ? 'opacity-60' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onToggleComplete(todo.id, !todo.completed)}
          disabled={isUpdating}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-slack-purple'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`mt-1 text-sm ${
                  todo.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                priorityColors[todo.priority]
              }`}>
                {priorityLabels[todo.priority]}
              </span>

              {todo.obsidianNote && (
                <button
                  onClick={handleOpenObsidian}
                  className="text-gray-400 hover:text-obsidian-dark transition-colors"
                  title="Obsidianで開く"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => onDelete(todo.id)}
                disabled={isUpdating}
                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                title="削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {todo.dueDate && (
            <div className={`mt-2 flex items-center text-sm ${
              isOverdue 
                ? 'text-red-600' 
                : todo.completed 
                  ? 'text-gray-400' 
                  : 'text-gray-600'
            }`}>
              {isOverdue ? (
                <AlertCircle className="w-4 h-4 mr-1" />
              ) : (
                <Clock className="w-4 h-4 mr-1" />
              )}
              <span>
                期日: {format(new Date(todo.dueDate), 'yyyy年M月d日 HH:mm', { locale: ja })}
                {isOverdue && ' (期限切れ)'}
              </span>
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500">
            作成日: {format(new Date(todo.createdAt), 'yyyy年M月d日', { locale: ja })}
          </div>
        </div>
      </div>
    </div>
  )
}