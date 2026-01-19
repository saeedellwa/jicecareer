import { MapPin, Briefcase, Clock } from 'lucide-react'

const featuredJobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Tech Company A',
    location: 'Dubai, UAE',
    type: 'Full-time',
    description: 'Looking for experienced software engineer with 5+ years experience in modern web development.',
    salary: '$80,000 - $120,000',
  },
  {
    id: 2,
    title: 'Marketing Manager',
    company: 'Global Marketing Group',
    location: 'Abu Dhabi, UAE',
    type: 'Full-time',
    description: 'Lead marketing initiatives for a growing international company. Manage digital and traditional campaigns.',
    salary: '$60,000 - $90,000',
  },
  {
    id: 3,
    title: 'HR Specialist',
    company: 'Human Resources Pro',
    location: 'Dubai, UAE',
    type: 'Full-time',
    description: 'Join our HR team and help shape company culture and recruitment strategies.',
    salary: '$50,000 - $75,000',
  },
  {
    id: 4,
    title: 'Project Manager',
    company: 'Construction & Development',
    location: 'Sharjah, UAE',
    type: 'Full-time',
    description: 'Oversee large-scale projects and lead cross-functional teams to successful completion.',
    salary: '$70,000 - $100,000',
  },
  {
    id: 5,
    title: 'Data Analyst',
    company: 'Analytics Solutions',
    location: 'Dubai, UAE',
    type: 'Full-time',
    description: 'Analyze data and provide insights to drive business decisions. Python and SQL required.',
    salary: '$55,000 - $85,000',
  },
  {
    id: 6,
    title: 'Customer Service Manager',
    company: 'Service Excellence Ltd',
    location: 'Dubai, UAE',
    type: 'Full-time',
    description: 'Lead customer service team and ensure exceptional customer experience across all channels.',
    salary: '$45,000 - $70,000',
  },
]

export default function JobsSection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Job Opportunities
          </h2>
          <p className="text-xl text-foreground/70">
            Browse through our latest job openings
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">{job.title}</h3>
                <p className="text-primary font-semibold mb-2">{job.company}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-foreground/70">
                  <MapPin size={18} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Briefcase size={18} />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Clock size={18} />
                  <span>{job.salary}</span>
                </div>
              </div>

              <p className="text-foreground/80 text-sm mb-6">{job.description}</p>

              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold">
                View Details
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition font-semibold">
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  )
}
