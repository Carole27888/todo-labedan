import { UserRole } from '@/config/api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Shield, User, UserX } from 'lucide-react'

interface RoleSelectorProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
}

export function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'user':
        return <User className="h-4 w-4" />
      case 'guest':
        return <UserX className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'text-red-600'
      case 'user':
        return 'text-blue-600'
      case 'guest':
        return 'text-gray-600'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="role-select" className="text-sm font-medium">
        Current Role:
      </Label>
      <Select value={currentRole} onValueChange={onRoleChange}>
        <SelectTrigger className="w-32">
          <SelectValue>
            <div className={`flex items-center gap-2 ${getRoleColor(currentRole)}`}>
              {getRoleIcon(currentRole)}
              <span className="capitalize">{currentRole}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">
            <div className="flex items-center gap-2 text-red-600">
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </div>
          </SelectItem>
          <SelectItem value="user">
            <div className="flex items-center gap-2 text-blue-600">
              <User className="h-4 w-4" />
              <span>User</span>
            </div>
          </SelectItem>
          <SelectItem value="guest">
            <div className="flex items-center gap-2 text-gray-600">
              <UserX className="h-4 w-4" />
              <span>Guest</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}