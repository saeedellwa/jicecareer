-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('individual', 'agent', 'admin')),
  approval_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual applicants table
CREATE TABLE individuals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20),
  date_of_birth DATE,
  nationality VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CV submissions table
CREATE TABLE cv_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  individual_id UUID NOT NULL REFERENCES individuals(id) ON DELETE CASCADE,
  cv_file_url VARCHAR(500) NOT NULL,
  passport_number VARCHAR(100) NOT NULL,
  submission_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (submission_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  license_number VARCHAR(100),
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent CV submissions table (for multiple CVs uploaded by agents)
CREATE TABLE agent_cv_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  cv_file_url VARCHAR(500) NOT NULL,
  passport_number VARCHAR(100) NOT NULL,
  applicant_full_name VARCHAR(255),
  submission_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (submission_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email logs table
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_address VARCHAR(255) NOT NULL,
  email_type VARCHAR(100) NOT NULL,
  subject VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_approval_status ON users(approval_status);
CREATE INDEX idx_individuals_user_id ON individuals(user_id);
CREATE INDEX idx_cv_submissions_individual_id ON cv_submissions(individual_id);
CREATE INDEX idx_cv_submissions_status ON cv_submissions(submission_status);
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agent_cv_submissions_agent_id ON agent_cv_submissions(agent_id);
CREATE INDEX idx_agent_cv_submissions_status ON agent_cv_submissions(submission_status);
CREATE INDEX idx_agent_cv_submissions_passport ON agent_cv_submissions(passport_number);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);

-- Create admin user
INSERT INTO users (email, password_hash, full_name, user_type, approval_status)
VALUES (
  'admin@jicecareer.com',
  '$2a$10$YIUhzaGhGhyGhyGhyGhyGhyGhyGhyGhyGhyGhyGhyGhyGhyGhyGhy',
  'Admin',
  'admin',
  'approved'
)
ON CONFLICT (email) DO NOTHING;
