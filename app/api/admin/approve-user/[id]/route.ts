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

    // Update user approval status
    await sql(
      'UPDATE users SET approval_status = $1 WHERE id = $2',
      ['approved', params.id]
    )

    // Get user email for notification
    const user = await sql(
      'SELECT email, full_name FROM users WHERE id = $1',
      [params.id]
    )

    // Send approval email notification
    try {
      const template = emailTemplates.approvalNotification(user[0].full_name)
      await sendEmail({
        to: user[0].email,
        ...template,
      })

      // Log email send
      await sql(
        `INSERT INTO email_logs (user_id, email_address, email_type, subject, status)
         VALUES ($1, $2, $3, $4, 'sent')`,
        [params.id, user[0].email, 'approval', template.subject]
      )
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ message: 'User approved successfully' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Error approving user' }, { status: 500 })
  }
}
