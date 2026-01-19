'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { User } from '@/lib/types'

export default function PendingApprovals() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch('/api/admin/pending-users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching pending users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/approve-user/${userId}`, {
        method: 'POST',
      })
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId))
      }
    } catch (error) {
      console.error('Error approving user:', error)
    }
  }

  const handleReject = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/reject-user/${userId}`, {
        method: 'POST',
      })
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId))
      }
    } catch (error) {
      console.error('Error rejecting user:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/70">
        No pending approvals
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
        >
          <div>
            <h3 className="font-semibold text-foreground">{user.full_name}</h3>
            <p className="text-sm text-foreground/70">{user.email}</p>
            <p className="text-xs text-primary mt-1">
              {user.user_type === 'individual' ? 'Job Seeker' : 'Recruitment Agent'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(user.id)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <CheckCircle size={18} />
              Approve
            </button>
            <button
              onClick={() => handleReject(user.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <XCircle size={18} />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
