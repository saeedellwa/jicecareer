'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Upload, Clock, CheckCircle, XCircle } from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string
  user_type: 'individual' | 'agent'
  approval_status: string
}

interface CVSubmission {
  id: string
  passport_number: string
  submission_status: string
  submitted_at: string
  cv_file_url?: string
  applicant_full_name?: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [cvs, setCVs] = useState<CVSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [searchPassport, setSearchPassport] = useState('')

  useEffect(() => {
    checkAuth()
    fetchCVs()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login')
        return
      }
      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchCVs = async () => {
    try {
      const response = await fetch('/api/user/cvs')
      if (response.ok) {
        const data = await response.json()
        setCVs(data)
      }
    } catch (error) {
      console.error('Error fetching CVs:', error)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handleCVUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setUploadLoading(true)
    try {
      const response = await fetch('/api/user/upload-cv', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const newCV = await response.json()
        setCVs([newCV, ...cvs])
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (error) {
      console.error('Error uploading CV:', error)
    } finally {
      setUploadLoading(false)
    }
  }

  const filteredCVs = searchPassport
    ? cvs.filter(cv => cv.passport_number.includes(searchPassport))
    : cvs

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground py-4 px-6 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{user.full_name}</h1>
            <p className="text-sm opacity-80">
              {user.user_type === 'individual' ? 'Job Seeker' : 'Recruitment Agent'}
            </p>
          </div>
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
        {/* Approval Status */}
        {user.approval_status !== 'approved' && (
          <div className={`mb-8 p-4 rounded-lg ${
            user.approval_status === 'approved'
              ? 'bg-green-100 text-green-800'
              : user.approval_status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {user.approval_status === 'pending' && (
              <>
                <p className="font-semibold">Your account is pending approval</p>
                <p className="text-sm">Admin will review your account and send you an email notification once approved.</p>
              </>
            )}
            {user.approval_status === 'rejected' && (
              <>
                <p className="font-semibold">Your account was rejected</p>
                <p className="text-sm">Please contact support for more information.</p>
              </>
            )}
          </div>
        )}

        {user.approval_status === 'approved' && (
          <>
            {/* CV Upload Section */}
            <div className="bg-card border border-border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Upload CV</h2>
              <form onSubmit={handleCVUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    CV File
                  </label>
                  <input
                    type="file"
                    name="cv"
                    accept=".pdf,.doc,.docx"
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    name="passport_number"
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>

                {user.user_type === 'agent' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Applicant Full Name
                    </label>
                    <input
                      type="text"
                      name="applicant_full_name"
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition font-semibold"
                >
                  <Upload size={20} />
                  {uploadLoading ? 'Uploading...' : 'Upload CV'}
                </button>
              </form>
            </div>

            {/* Search for Agent */}
            {user.user_type === 'agent' && (
              <div className="bg-card border border-border rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Search CV Status</h2>
                <input
                  type="text"
                  placeholder="Search by passport number..."
                  value={searchPassport}
                  onChange={(e) => setSearchPassport(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                />
              </div>
            )}

            {/* CVs List */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {user.user_type === 'individual' ? 'Your CV' : 'Submitted CVs'}
              </h2>

              {filteredCVs.length === 0 ? (
                <p className="text-foreground/70">No CVs submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {filteredCVs.map((cv) => (
                    <div key={cv.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          {cv.applicant_full_name && (
                            <h3 className="font-semibold text-foreground">{cv.applicant_full_name}</h3>
                          )}
                          <p className="text-sm text-foreground/70">Passport: {cv.passport_number}</p>
                          <p className="text-xs text-foreground/50 mt-2">
                            Submitted: {new Date(cv.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {cv.submission_status === 'pending' && (
                            <>
                              <Clock className="text-yellow-600" size={20} />
                              <span className="text-sm font-semibold text-yellow-600">Under Review</span>
                            </>
                          )}
                          {cv.submission_status === 'approved' && (
                            <>
                              <CheckCircle className="text-green-600" size={20} />
                              <span className="text-sm font-semibold text-green-600">Approved</span>
                            </>
                          )}
                          {cv.submission_status === 'rejected' && (
                            <>
                              <XCircle className="text-red-600" size={20} />
                              <span className="text-sm font-semibold text-red-600">Rejected</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
