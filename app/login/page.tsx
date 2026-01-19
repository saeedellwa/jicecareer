import Link from 'next/link'
import Navbar from '@/components/navbar'
import LoginForm from '@/components/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Sign In</h1>
              <p className="text-foreground/70">Welcome back to JICE Career</p>
            </div>

            <LoginForm />

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-center text-foreground/70 mb-4">New to JICE Career?</p>
              <Link
                href="/register?type=individual"
                className="block text-center py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition font-semibold mb-2"
              >
                Create Job Seeker Account
              </Link>
              <Link
                href="/register?type=agent"
                className="block text-center py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition font-semibold"
              >
                Create Agent Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
