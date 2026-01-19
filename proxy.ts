import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/admin', '/dashboard']
const publicRoutes = ['/login', '/register', '/']

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  // Get the token from cookies
  const token = request.cookies.get('auth_token')?.value

  // If trying to access protected route without token
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg).*)'],
}
