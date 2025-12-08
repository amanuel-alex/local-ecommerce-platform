import { ReactNode } from 'react'
import { DashboardNav } from '../../components/dashboard/nav'

// For now, we'll use a simple layout without authentication
// You can add authentication later

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}