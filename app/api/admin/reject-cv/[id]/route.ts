import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if it's an individual CV or agent CV
    const individualCV = await sql(
      'SELECT individual_id FROM cv_submissions WHERE id = $1',
      [params.id]
    )

    let userEmail = ''
    let userName = ''

    if (individualCV.length > 0) {
      await sql(
        'UPDATE cv_submissions SET submission_status = $1, reviewed_at = NOW(), reviewed_by = $2 WHERE id = $3',
        ['rejected', decoded.id, params.id]
      )

      // Get user info
      const individual = await sql(
        'SELECT user_id FROM individuals WHERE id = $1',
        [individualCV[0].individual_id]
      )

      const user = await sql(
        'SELECT email, full_name FROM users WHERE id = $1',
        [individual[0].user_id]
      )

      userEmail = user[0].email
      userName = user[0].full_name
    } else {
      await sql(
        'UPDATE agent_cv_submissions SET submission_status = $1, reviewed_at = NOW(), reviewed_by = $2 WHERE id = $3',
        ['rejected', decoded.id, params.id]
      )
    }

    // Send rejection notification email
    if (userEmail) {
      try {
        const template = emailTemplates.cvRejectedNotification(userName)
        await sendEmail({
          to: userEmail,
          ...template,
        })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
      }
    }

    return NextResponse.json({ message: 'CV rejected successfully' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Error rejecting CV' }, { status: 500 })
  }
}
