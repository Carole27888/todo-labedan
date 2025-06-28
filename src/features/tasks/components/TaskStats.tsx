import { Task } from '@/hooks/useTasks'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Circle, AlertTriangle, Clock } from 'lucide-react'
import { isOverdue, isDueSoon } from '@/lib/utils'

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const incompleteTasks = totalTasks - completedTasks
  const overdueTasks = tasks.filter(task => !task.completed && isOverdue(task.maxEndDate)).length
  const dueSoonTasks = tasks.filter(task => !task.completed && !isOverdue(task.maxEndDate) && isDueSoon(task.maxEndDate)).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{totalTasks}</p>
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
              <p className="text-2xl font-bold">{incompleteTasks}</p>
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
              <p className="text-2xl font-bold">{completedTasks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm text-muted-foreground">Due Soon</p>
              <p className="text-2xl font-bold text-yellow-600">{dueSoonTasks}</p>
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