export type Priority = 'high' | 'medium' | 'low'

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
}
