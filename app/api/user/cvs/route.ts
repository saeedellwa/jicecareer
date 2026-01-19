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

    const user = await sql(
      'SELECT id, user_type FROM users WHERE id = $1',
      [decoded.id]
    )

    if (user.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    let cvs: any[] = []

    if (user[0].user_type === 'individual') {
      const individual = await sql(
        'SELECT id FROM individuals WHERE user_id = $1',
        [decoded.id]
      )

      if (individual.length > 0) {
        cvs = await sql(
          `SELECT id, individual_id, passport_number, submission_status, submitted_at, cv_file_url
           FROM cv_submissions WHERE individual_id = $1
           ORDER BY submitted_at DESC`,
          [individual[0].id]
        )
      }
    } else if (user[0].user_type === 'agent') {
      const agent = await sql(
        'SELECT id FROM agents WHERE user_id = $1',
        [decoded.id]
      )

      if (agent.length > 0) {
        cvs = await sql(
          `SELECT id, agent_id, passport_number, applicant_full_name, submission_status, submitted_at, cv_file_url
           FROM agent_cv_submissions WHERE agent_id = $1
           ORDER BY submitted_at DESC`,
          [agent[0].id]
        )
      }
    }

    return NextResponse.json(cvs)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Error fetching CVs' }, { status: 500 })
  }
}
