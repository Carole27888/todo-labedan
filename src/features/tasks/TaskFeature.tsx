import { UserRole } from '@/config/api'
import { useTasks } from '@/hooks/useTasks'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskStats } from './components/TaskStats'

interface TaskFeatureProps {
  currentRole: UserRole
}

export function TaskFeature({ currentRole }: TaskFeatureProps) {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks(currentRole)

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
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
      <TaskStats tasks={tasks} />
      
      {(currentRole === 'admin' || currentRole === 'user') && (
        <TaskForm onSubmit={createTask} />
      )}
      
      <TaskList
        tasks={tasks}
        currentRole={currentRole}
        onUpdate={updateTask}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  )
}