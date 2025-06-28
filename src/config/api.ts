export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    TODOS: '/api/todos',
    TASKS: '/api/tasks',
    EXPORT: '/api/export',
  },
} as const

export type UserRole = 'admin' | 'user' | 'guest'

export const getApiHeaders = (role: UserRole) => ({
  'Content-Type': 'application/json',
  'x-user-role': role,
})