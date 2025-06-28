import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function isOverdue(date: string | Date): boolean {
  return new Date(date) < new Date()
}

export function isDueSoon(date: string | Date, hours: number = 24): boolean {
  const dueDate = new Date(date)
  const now = new Date()
  const timeDiff = dueDate.getTime() - now.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)
  return hoursDiff > 0 && hoursDiff <= hours
}