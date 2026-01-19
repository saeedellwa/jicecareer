import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-[600px] bg-gradient-to-br from-background to-secondary/10 py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Find Your Perfect
            <span className="text-primary"> Career Opportunity</span>
          </h1>
          <p className="text-lg text-foreground/80">
            Connect with top employers and showcase your skills. Whether you're looking for your first job or your next big opportunity, JICE Career is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register?type=individual"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
            >
              Register as Job Seeker
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/register?type=agent"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition font-semibold"
            >
              Register as Agent
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 aspect-square flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="text-5xl">👥</div>
              <h3 className="text-2xl font-bold text-foreground">Thousands of Opportunities</h3>
              <p className="text-foreground/70">Join millions of job seekers worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
