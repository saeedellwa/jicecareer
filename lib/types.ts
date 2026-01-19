export type UserType = 'individual' | 'agent' | 'admin'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  email: string
  full_name: string
  user_type: UserType
  approval_status: ApprovalStatus
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface Individual extends User {
  individual_id: string
  phone_number?: string
  date_of_birth?: string
  nationality?: string
}

export interface Agent extends User {
  agent_id: string
  company_name?: string
  license_number?: string
  phone_number?: string
}

export interface CVSubmission {
  id: string
  individual_id: string
  cv_file_url: string
  passport_number: string
  submission_status: SubmissionStatus
  rejection_reason?: string
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  updated_at: string
}

export interface AgentCVSubmission {
  id: string
  agent_id: string
  cv_file_url: string
  passport_number: string
  applicant_full_name: string
  submission_status: SubmissionStatus
  rejection_reason?: string
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  notification_type: string
  title: string
  message: string
  related_id?: string
  is_read: boolean
  created_at: string
}
