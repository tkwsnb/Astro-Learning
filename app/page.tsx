'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TodoForm } from '@/components/TodoForm'
import { TodoList } from '@/components/TodoList'
import { StatsCard } from '@/components/StatsCard'
import { Plus, Calendar, CheckCircle, Clock } from 'lucide-react'
import { Todo } from '@/types'

const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch('/api/todos')
  if (!response.ok) {
    throw new Error('Failed to fetch todos')
  }
  return response.json()
}

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const { data: todos = [], isLoading, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    pending: todos.filter(todo => !todo.completed).length,
    overdue: todos.filter(todo => 
      !todo.completed && 
      todo.dueDate && 
      new Date(todo.dueDate) < new Date()
    ).length,
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'pending') return !todo.completed
    return true
  })

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="総タスク"
          value={stats.total}
          icon={<Calendar className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="完了済み"
          value={stats.completed}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="未完了"
          value={stats.pending}
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
        />
        <StatsCard
          title="期限切れ"
          value={stats.overdue}
          icon={<Clock className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* Action Section */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slack-purple text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-slack-purple text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            未完了
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-slack-purple text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            完了済み
          </button>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>新しいタスク</span>
        </button>
      </div>

      {/* Todo List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slack-purple"></div>
          </div>
        ) : (
          <TodoList todos={filteredTodos} onUpdate={refetch} />
        )}
      </div>

      {/* Todo Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">新しいタスクを作成</h2>
            <TodoForm
              onSuccess={() => {
                setShowForm(false)
                refetch()
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}