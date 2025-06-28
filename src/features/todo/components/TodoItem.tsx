import { useState } from 'react'
import { Todo, UpdateTodoData } from '@/hooks/useTodos'
import { UserRole } from '@/config/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { TodoEditDialog } from './TodoEditDialog'
import { Check, Edit, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TodoItemProps {
  todo: Todo
  currentRole: UserRole
  onUpdate: (id: string, data: UpdateTodoData) => Promise<void>
  onToggle: (id: string, completed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TodoItem({ todo, currentRole, onUpdate, onToggle, onDelete }: TodoItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const canModify = currentRole === 'admin' || currentRole === 'user'

  const handleToggle = async () => {
    if (!canModify || isToggling) return
    
    setIsToggling(true)
    try {
      await onToggle(todo._id, !todo.completed)
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    if (!canModify || isDeleting) return
    
    setIsDeleting(true)
    try {
      await onDelete(todo._id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (data: UpdateTodoData) => {
    await onUpdate(todo._id, data)
    setIsEditOpen(false)
  }

  return (
    <>
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md",
        todo.completed && "opacity-75"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center pt-1">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggle}
                disabled={!canModify || isToggling}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-medium text-sm",
                todo.completed && "line-through text-muted-foreground"
              )}>
                {todo.title}
              </h4>
              {todo.notes && (
                <p className={cn(
                  "text-sm text-muted-foreground mt-1",
                  todo.completed && "line-through"
                )}>
                  {todo.notes}
                </p>
              )}
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

      <TodoEditDialog
        todo={todo}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={handleUpdate}
      />
    </>
  )
}