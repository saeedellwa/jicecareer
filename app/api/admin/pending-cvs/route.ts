import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any

    const admin = await sql(
      'SELECT user_type FROM users WHERE id = $1',
      [decoded.id]
    )

    if (admin[0].user_type !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    // Get pending individual CVs
    const individualCVs = await sql(
      `SELECT cv.id, cv.individual_id, NULL as agent_id, NULL as applicant_full_name,
              cv.passport_number, cv.cv_file_url, cv.submission_status, cv.submitted_at
       FROM cv_submissions cv
       WHERE cv.submission_status = 'pending'
       ORDER BY cv.submitted_at ASC`
    )

    // Get pending agent CVs
    const agentCVs = await sql(
      `SELECT id, NULL as individual_id, agent_id, applicant_full_name,
              passport_number, cv_file_url, submission_status, submitted_at
       FROM agent_cv_submissions
       WHERE submission_status = 'pending'
       ORDER BY submitted_at ASC`
    )

    const allCVs = [...individualCVs, ...agentCVs].sort(
      (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    )

    return NextResponse.json(allCVs)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Error fetching pending CVs' }, { status: 500 })
  }
}
