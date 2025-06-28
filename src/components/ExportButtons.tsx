import { Button } from '@/components/ui/button'
import { UserRole, API_CONFIG } from '@/config/api'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ExportButtonsProps {
  currentRole: UserRole
}

export function ExportButtons({ currentRole }: ExportButtonsProps) {
  const { toast } = useToast()

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (currentRole === 'guest') {
      toast({
        title: 'Access Denied',
        description: 'You need admin or user privileges to export data.',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EXPORT}/tasks/${format}`, {
        headers: {
          'x-user-role': currentRole,
        },
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `tasks.${format === 'excel' ? 'xlsx' : 'pdf'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Export Successful',
        description: `Tasks exported to ${format.toUpperCase()} successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export tasks. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('excel')}
        disabled={currentRole === 'guest'}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('pdf')}
        disabled={currentRole === 'guest'}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  )
}