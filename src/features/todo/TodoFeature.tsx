import { UserRole } from '@/config/api'
import { useTodos } from '@/hooks/useTodos'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { TodoStats } from './components/TodoStats'

interface TodoFeatureProps {
  currentRole: UserRole
}

export function TodoFeature({ currentRole }: TodoFeatureProps) {
  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos(currentRole)

  if (loading && todos.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading todos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TodoStats todos={todos} />
      
      {(currentRole === 'admin' || currentRole === 'user') && (
        <TodoForm onSubmit={createTodo} />
      )}
      
      <TodoList
        todos={todos}
        currentRole={currentRole}
        onUpdate={updateTodo}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  )
}