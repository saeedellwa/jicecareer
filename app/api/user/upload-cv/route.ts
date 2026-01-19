import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any

    const formData = await request.formData()
    const cv = formData.get('cv') as File
    const passportNumber = formData.get('passport_number') as string
    const applicantName = formData.get('applicant_full_name') as string

    if (!cv || !passportNumber) {
      return NextResponse.json(
        { message: 'CV and passport number are required' },
        { status: 400 }
      )
    }

    // Upload file to Vercel Blob (recommended for Vercel deployments)
    // Requires env var: BLOB_READ_WRITE_TOKEN (Vercel Storage → Blob → Tokens)
    const safeName = cv.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const blob = await put(
      `cvs/${Date.now()}-${safeName}`,
      cv,
      {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    )
    const cvUrl = blob.url

    const user = await sql(
      'SELECT id, user_type FROM users WHERE id = $1',
      [decoded.id]
    )

    if (user.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    let result: any

    if (user[0].user_type === 'individual') {
      const individual = await sql(
        'SELECT id FROM individuals WHERE user_id = $1',
        [decoded.id]
      )

      // Individuals can upload only once (no re-upload / edit)
      const existing = await sql(
        'SELECT id FROM cv_submissions WHERE individual_id = $1 LIMIT 1',
        [individual[0].id]
      )
      if (existing.length > 0) {
        return NextResponse.json(
          { message: 'CV already submitted. You cannot upload again.' },
          { status: 409 }
        )
      }

      result = await sql(
        `INSERT INTO cv_submissions (individual_id, cv_file_url, passport_number)
         VALUES ($1, $2, $3)
         RETURNING id, individual_id, passport_number, submission_status, submitted_at, cv_file_url`,
        [individual[0].id, cvUrl, passportNumber]
      )
    } else if (user[0].user_type === 'agent') {
      const agent = await sql(
        'SELECT id FROM agents WHERE user_id = $1',
        [decoded.id]
      )

      result = await sql(
        `INSERT INTO agent_cv_submissions (agent_id, cv_file_url, passport_number, applicant_full_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, agent_id, passport_number, applicant_full_name, submission_status, submitted_at, cv_file_url`,
        [agent[0].id, cvUrl, passportNumber, applicantName]
      )
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Error uploading CV' }, { status: 500 })
  }
}
