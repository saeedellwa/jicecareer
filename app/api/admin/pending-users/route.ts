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

    const users = await sql(
      `SELECT id, email, full_name, user_type, approval_status, created_at
       FROM users WHERE approval_status = 'pending'
       ORDER BY created_at ASC`
    )

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Error fetching pending users' }, { status: 500 })
  }
}
