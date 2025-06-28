import { useCallback, useEffect, useRef } from 'react'
import { API_CONFIG, UserRole, getApiHeaders } from '@/config/api'
import { useToast } from '@/components/ui/use-toast'

export interface Todo {
  _id: string
  title: string
  notes: string
  completed: boolean
}

export interface CreateTodoData {
  title: string
  notes?: string
}

export interface UpdateTodoData {
  title: string
  notes?: string
}

interface UseTodosReturn {
  todos: Todo[]
  loading: boolean
  error: string | null
  fetchTodos: () => Promise<void>
  createTodo: (data: CreateTodoData) => Promise<void>
  updateTodo: (id: string, data: UpdateTodoData) => Promise<void>
  toggleTodo: (id: string, completed: boolean) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
}

export function useTodos(role: UserRole): UseTodosReturn {
  const todosRef = useRef<Todo[]>([])
  const loadingRef = useRef(false)
  const errorRef = useRef<string | null>(null)
  const { toast } = useToast()
  const forceUpdateRef = useRef(0)

  const forceUpdate = useCallback(() => {
    forceUpdateRef.current += 1
  }, [])

  const fetchTodos = useCallback(async () => {
    loadingRef.current = true
    errorRef.current = null
    forceUpdate()

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TODOS}`, {
        headers: getApiHeaders(role),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }

      const data = await response.json()
      todosRef.current = data
    } catch (error) {
      errorRef.current = error instanceof Error ? error.message : 'An error occurred'
      toast({
        title: 'Error',
        description: 'Failed to fetch todos',
        variant: 'destructive',
      })
    } finally {
      loadingRef.current = false
      forceUpdate()
    }
  }, [role, toast, forceUpdate])

  const createTodo = useCallback(async (data: CreateTodoData) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TODOS}`, {
        method: 'POST',
        headers: getApiHeaders(role),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create todo')
      }

      await fetchTodos()
      toast({
        title: 'Success',
        description: 'Todo created successfully',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create todo'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      throw error
    }
  }, [role, fetchTodos, toast])

  const updateTodo = useCallback(async (id: string, data: UpdateTodoData) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TODOS}/${id}`, {
        method: 'PUT',
        headers: getApiHeaders(role),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update todo')
      }

      await fetchTodos()
      toast({
        title: 'Success',
        description: 'Todo updated successfully',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update todo'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      throw error
    }
  }, [role, fetchTodos, toast])

  const toggleTodo = useCallback(async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TODOS}/${id}/complete`, {
        method: 'PATCH',
        headers: getApiHeaders(role),
        body: JSON.stringify({ completed }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to toggle todo')
      }

      await fetchTodos()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle todo'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      throw error
    }
  }, [role, fetchTodos, toast])

  const deleteTodo = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TODOS}/${id}`, {
        method: 'DELETE',
        headers: getApiHeaders(role),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete todo')
      }

      await fetchTodos()
      toast({
        title: 'Success',
        description: 'Todo deleted successfully',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete todo'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      throw error
    }
  }, [role, fetchTodos, toast])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return {
    todos: todosRef.current,
    loading: loadingRef.current,
    error: errorRef.current,
    fetchTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  }
}