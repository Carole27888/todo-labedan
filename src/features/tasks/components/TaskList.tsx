import { Task, UpdateTaskData } from '@/hooks/useTasks'
import { UserRole } from '@/config/api'
import { TaskItem } from './TaskItem'
import { isOverdue, isDueSoon } from '@/lib/utils'

interface TaskListProps {
  tasks: Task[]
  currentRole: UserRole
  onUpdate: (id: string, data: UpdateTaskData) => Promise<void>
  onToggle: (id: string, completed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TaskList({ tasks, currentRole, onUpdate, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tasks found. Create your first task above!</p>
      </div>
    )
  }

  const completedTasks = tasks.filter(task => task.completed)
  const incompleteTasks = tasks.filter(task => !task.completed)
  
  // Sort incomplete tasks by priority (overdue, due soon, then by date)
  const sortedIncompleteTasks = incompleteTasks.sort((a, b) => {
    const aOverdue = isOverdue(a.maxEndDate)
    const bOverdue = isOverdue(b.maxEndDate)
    const aDueSoon = isDueSoon(a.maxEndDate)
    const bDueSoon = isDueSoon(b.maxEndDate)
    
    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1
    if (aDueSoon && !bDueSoon) return -1
    if (!aDueSoon && bDueSoon) return 1
    
    return new Date(a.maxEndDate).getTime() - new Date(b.maxEndDate).getTime()
  })

  return (
    <div className="space-y-6">
      {sortedIncompleteTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Active Tasks ({sortedIncompleteTasks.length})</h3>
          <div className="space-y-2">
            {sortedIncompleteTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                currentRole={currentRole}
                onUpdate={onUpdate}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
            Completed Tasks ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
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