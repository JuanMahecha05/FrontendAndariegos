import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/server-utils'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
} 