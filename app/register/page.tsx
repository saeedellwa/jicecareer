import Navbar from '@/components/navbar'
import RegisterForm from '@/components/register-form'

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
              <p className="text-foreground/70">Join JICE Career and start your journey</p>
            </div>

            <RegisterForm />
          </div>
        </div>
      </div>
    </main>
  )
}
