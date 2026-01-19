import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const { email, password, full_name, user_type, company_name } = await request.json()

    // Validation
    if (!email || !password || !full_name || !user_type) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await sql('SELECT id FROM users WHERE email = $1', [email])
    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await sql(
      `INSERT INTO users (email, password_hash, full_name, user_type, approval_status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id, email, full_name, user_type, approval_status`,
      [email, hashedPassword, full_name, user_type]
    )

    const user = result[0]

    // Create individual or agent profile
    if (user_type === 'individual') {
      await sql(
        'INSERT INTO individuals (user_id) VALUES ($1)',
        [user.id]
      )
    } else if (user_type === 'agent') {
      await sql(
        'INSERT INTO agents (user_id, company_name) VALUES ($1, $2)',
        [user.id, company_name || null]
      )
    }

    return NextResponse.json(
      {
        message: 'Registration successful. Please wait for admin approval.',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          user_type: user.user_type,
          approval_status: user.approval_status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
