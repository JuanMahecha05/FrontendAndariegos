import { redirect } from 'next/navigation'
import { getCustomServerSession } from '@/lib/server-utils'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getCustomServerSession()

  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
} 