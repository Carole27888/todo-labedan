import { Todo, UpdateTodoData } from '@/hooks/useTodos'
import { UserRole } from '@/config/api'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  currentRole: UserRole
  onUpdate: (id: string, data: UpdateTodoData) => Promise<void>
  onToggle: (id: string, completed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TodoList({ todos, currentRole, onUpdate, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No todos found. Create your first todo above!</p>
      </div>
    )
  }

  const completedTodos = todos.filter(todo => todo.completed)
  const incompleteTodos = todos.filter(todo => !todo.completed)

  return (
    <div className="space-y-6">
      {incompleteTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Active Todos ({incompleteTodos.length})</h3>
          <div className="space-y-2">
            {incompleteTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                currentRole={currentRole}
                onUpdate={onUpdate}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
            Completed Todos ({completedTodos.length})
          </h3>
          <div className="space-y-2">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                currentRole={currentRole}
                onUpdate={onUpdate}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}