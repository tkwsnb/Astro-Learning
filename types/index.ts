export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
  slackMessageId?: string
  obsidianNote?: string
}

export interface User {
  id: string
  slackUserId: string
  name: string
  email?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTodoRequest {
  title: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
}

export interface UpdateTodoRequest {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
}

export interface SlackMessage {
  channel: string
  text: string
  blocks?: any[]
}

export interface NotificationSettings {
  enabled: boolean
  time: string
  channels: string[]
}