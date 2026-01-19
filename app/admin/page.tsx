'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Users, FileText } from 'lucide-react'
import PendingApprovals from '@/components/admin/pending-approvals'
import CVReviews from '@/components/admin/cv-reviews'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'approvals' | 'cvs'>('approvals')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated and is admin
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login')
        return
      }
      const user = await response.json()
      if (user.user_type !== 'admin') {
        router.push('/')
        return
      }
      setAuthenticated(true)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground py-4 px-6 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 hover:bg-secondary/80 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition border-b-2 ${
              activeTab === 'approvals'
                ? 'text-primary border-primary'
                : 'text-foreground/70 border-transparent hover:text-foreground'
            }`}
          >
            <Users size={20} />
            User Approvals
          </button>
          <button
            onClick={() => setActiveTab('cvs')}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition border-b-2 ${
              activeTab === 'cvs'
                ? 'text-primary border-primary'
                : 'text-foreground/70 border-transparent hover:text-foreground'
            }`}
          >
            <FileText size={20} />
            CV Reviews
          </button>
        </div>

        {/* Content */}
        {activeTab === 'approvals' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Pending User Approvals</h2>
            <PendingApprovals />
          </div>
        )}

        {activeTab === 'cvs' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Pending CV Reviews</h2>
            <CVReviews />
          </div>
        )}
      </main>
    </div>
  )
}
