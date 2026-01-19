import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import JobsSection from '@/components/jobs-section'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <JobsSection />
      
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-4">&copy; 2024 JICE Career. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact Us</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
