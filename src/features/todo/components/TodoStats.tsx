import { Todo } from '@/hooks/useTodos'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Circle, ListTodo } from 'lucide-react'

interface TodoStatsProps {
  todos: Todo[]
}

export function TodoStats({ todos }: TodoStatsProps) {
  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const incompleteTodos = totalTodos - completedTodos
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{totalTodos}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Circle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{incompleteTodos}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedTodos}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-600 to-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}