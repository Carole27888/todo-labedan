import { useState } from 'react'
import { Task, UpdateTaskData } from '@/hooks/useTasks'
import { UserRole } from '@/config/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { TaskEditDialog } from './TaskEditDialog'
import { Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate, isOverdue, isDueSoon } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  currentRole: UserRole
  onUpdate: (id: string, data: UpdateTaskData) => Promise<void>
  onToggle: (id: string, completed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TaskItem({ task, currentRole, onUpdate, onToggle, onDelete }: TaskItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const canModify = currentRole === 'admin' || currentRole === 'user'
  const overdue = isOverdue(task.maxEndDate)
  const dueSoon = isDueSoon(task.maxEndDate)

  const handleToggle = async () => {
    if (!canModify || isToggling) return
    
    setIsToggling(true)
    try {
      await onToggle(task._id, !task.completed)
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    if (!canModify || isDeleting) return
    
    setIsDeleting(true)
    try {
      await onDelete(task._id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (data: UpdateTaskData) => {
    await onUpdate(task._id, data)
    setIsEditOpen(false)
  }

  const getTaskPriority = () => {
    if (task.completed) return null
    if (overdue) return { label: 'Overdue', color: 'bg-red-100 text-red-800 border-red-200' }
    if (dueSoon) return { label: 'Due Soon', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    return null
  }

  const priority = getTaskPriority()

  return (
    <>
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md",
        task.completed && "opacity-75",
        overdue && !task.completed && "border-red-200 bg-red-50",
        dueSoon && !task.completed && !overdue && "border-yellow-200 bg-yellow-50"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center pt-1">
              <Checkbox
                checked={task.completed}
                onCheckedChange={handleToggle}
                disabled={!canModify || isToggling}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className={cn(
                  "font-medium text-sm",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h4>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="secondary" className="text-xs">
                    {task.type}
                  </Badge>
                  {priority && (
                    <Badge className={cn("text-xs", priority.color)}>
                      {priority.label}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className={cn(
                  task.completed && "line-through",
                  overdue && !task.completed && "text-red-600 font-medium",
                  dueSoon && !task.completed && !overdue && "text-yellow-600 font-medium"
                )}>
                  Due: {formatDate(task.maxEndDate)}
                </span>
                {(overdue || dueSoon) && !task.completed && (
                  <AlertTriangle className={cn(
                    "h-4 w-4",
                    overdue ? "text-red-600" : "text-yellow-600"
                  )} />
                )}
              </div>
            </div>

            {canModify && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskEditDialog
        task={task}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={handleUpdate}
      />
    </>
  )
}