// app/(dashboard)/[role]/profile/layout.tsx
import { notFound } from 'next/navigation'

export default function ProfileLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { role: string }
}) {
  const validRoles = ['customer', 'seller', 'admin']
  
  if (!validRoles.includes(params.role)) {
    notFound()
  }

  return children
}