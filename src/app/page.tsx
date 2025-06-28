'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TodoFeature } from '@/features/todo/TodoFeature'
import { TaskFeature } from '@/features/tasks/TaskFeature'
import { RoleSelector } from '@/components/RoleSelector'
import { ExportButtons } from '@/components/ExportButtons'
import { CheckSquare, ListTodo } from 'lucide-react'

export default function Home() {
  const [currentRole, setCurrentRole] = useState<'admin' | 'user' | 'guest'>('user')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo & Task Manager</h1>
          <p className="text-gray-600 mb-6">Organize your todos and manage your tasks efficiently</p>
          <div className="flex justify-center items-center gap-4 mb-4">
            <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
            <ExportButtons currentRole={currentRole} />
          </div>
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="todos" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Todos
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <Card>
              <CardHeader>
                <CardTitle>Todo Management</CardTitle>
                <CardDescription>
                  Create and manage your personal todos with notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TodoFeature currentRole={currentRole} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  Create and manage tasks with deadlines and categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskFeature currentRole={currentRole} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}