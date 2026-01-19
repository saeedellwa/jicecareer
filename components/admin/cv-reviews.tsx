'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, FileText } from 'lucide-react'

interface CVSubmission {
  id: string
  individual_id?: string
  agent_id?: string
  applicant_full_name?: string
  passport_number: string
  cv_file_url: string
  submission_status: string
  submitted_at: string
}

export default function CVReviews() {
  const [cvs, setCVs] = useState<CVSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingCVs()
  }, [])

  const fetchPendingCVs = async () => {
    try {
      const response = await fetch('/api/admin/pending-cvs')
      const data = await response.json()
      setCVs(data)
    } catch (error) {
      console.error('Error fetching CVs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveCCV = async (cvId: string) => {
    try {
      const response = await fetch(`/api/admin/approve-cv/${cvId}`, {
        method: 'POST',
      })
      if (response.ok) {
        setCVs(cvs.filter(cv => cv.id !== cvId))
      }
    } catch (error) {
      console.error('Error approving CV:', error)
    }
  }

  const handleRejectCV = async (cvId: string) => {
    try {
      const response = await fetch(`/api/admin/reject-cv/${cvId}`, {
        method: 'POST',
      })
      if (response.ok) {
        setCVs(cvs.filter(cv => cv.id !== cvId))
      }
    } catch (error) {
      console.error('Error rejecting CV:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (cvs.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/70">
        No pending CV reviews
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cvs.map((cv) => (
        <div
          key={cv.id}
          className="bg-card border border-border rounded-lg p-4"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-primary" size={20} />
                <h3 className="font-semibold text-foreground">
                  {cv.applicant_full_name || 'Applicant'}
                </h3>
              </div>
              <p className="text-sm text-foreground/70">Passport: {cv.passport_number}</p>
              <p className="text-xs text-foreground/50 mt-2">
                Submitted: {new Date(cv.submitted_at).toLocaleDateString()}
              </p>
            </div>
            <a
              href={cv.cv_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm"
            >
              View CV
            </a>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => handleApproveCCV(cv.id)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <CheckCircle size={18} />
              Approve
            </button>
            <button
              onClick={() => handleRejectCV(cv.id)}
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
