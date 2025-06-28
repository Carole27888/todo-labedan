import { useCallback, useEffect, useRef } from 'react'
import { API_CONFIG, UserRole, getApiHeaders } from '@/config/api'
import { useToast } from '@/components/ui/use-toast'

export interface Task {
  _id: string
  title: string
  type: string
  maxEndDate: string
  completed: boolean
}

export interface CreateTaskData {
  title: string
  type: string
  maxEndDate: string
}

export interface UpdateTaskData {
  title: string
  type: string
  maxEndDate: string
}

interface UseTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  createTask: (data: CreateTaskData) => Promise<void>
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>
  toggleTask: (id: string, completed: boolean) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export function useTasks(role: UserRole): UseTasksReturn {
  const tasksRef = useRef<Task[]>([])
  const loadingRef = useRef(false)
  const errorRef = useRef<string | null>(null)
  const { toast } = useToast()
  const forceUpdateRef = useRef(0)

  const forceUpdate = useCallback(() => {
    forceUpdateRef.current += 1
  }, [])

  const fetchTasks = useCallback(async () => {
    loadingRef.current = true
    errorRef.current = null
    forceUpdate()

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASKS}`, {
        headers: getApiHeaders(role),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()
      tasksRef.current = data
    } catch (error) {
      errorRef.current = error instanceof Error ? error.message : 'An error occurred'
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      })
    } finally {
      loadingRef.current = false
      forceUpdate()
    }
  }, [role, toast, forceUpdate])

  const createTask = useCallback(async (data: CreateTaskData) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASKS}`, {
        method: 'POST',
        headers: getApiHeaders(role),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create task')
      }

      await fetchTasks()
      toast({
        title: 'Success',
        description: 'Task created successfully',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create task'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      throw error
    }
  }, [role, fetchTasks, toast])

  const updateTask = useCallback(async (id: string, data: UpdateTaskData) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASKS}/${id}`, {
        method: 'PUT',
        headers: getApiHeaders(role),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update task')
      }

      await fetchTasks()
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      throw error
    }
  }, [role, fetchTasks, toast])

  const toggleTask = useCallback(async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASKS}/${id}/complete`, {
        method: 'PATCH',
        headers: getApiHeaders(role),
        body: JSON.stringify({ completed }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to toggle task')
      }

      await fetchTasks()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle task'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      throw error
    }
  }, [role, fetchTasks, toast])

  const deleteTask = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASKS}/${id}`, {
        method: 'DELETE',
        headers: getApiHeaders(role),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete task')
      }

      await fetchTasks()
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete task'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      throw error
    }
  }, [role, fetchTasks, toast])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks: tasksRef.current,
    loading: loadingRef.current,
    error: errorRef.current,
    fetchTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  }
}