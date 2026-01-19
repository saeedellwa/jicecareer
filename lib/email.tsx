// Email service for sending notifications
// Using Resend as the email provider

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    // Using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'noreply@jicecareer.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Email templates
export const emailTemplates = {
  approvalNotification: (userName: string) => ({
    subject: 'Account Approved - JICE Career',
    html: `
      <h2>Welcome to JICE Career, ${userName}!</h2>
      <p>Your account has been approved by our admin team.</p>
      <p>You can now:</p>
      <ul>
        <li>Upload your CV</li>
        <li>Browse job opportunities</li>
        <li>Apply for positions</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background-color: #dc2626; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Login Now</a></p>
      <p>Best regards,<br/>JICE Career Team</p>
    `,
    text: `Your account has been approved. You can now log in and upload your CV.`,
  }),

  rejectionNotification: (userName: string) => ({
    subject: 'Account Status Update - JICE Career',
    html: `
      <h2>Account Status Update</h2>
      <p>Hello ${userName},</p>
      <p>Unfortunately, your account application has not been approved at this time.</p>
      <p>If you have questions, please contact our support team.</p>
      <p>Best regards,<br/>JICE Career Team</p>
    `,
    text: `Your account application was not approved. Please contact support for more details.`,
  }),

  cvApprovedNotification: (userName: string) => ({
    subject: 'CV Approved - JICE Career',
    html: `
      <h2>Your CV has been Approved!</h2>
      <p>Hello ${userName},</p>
      <p>Great news! Your CV has been reviewed and approved by our team.</p>
      <p>You are now eligible to apply for job opportunities.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #dc2626; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Your Dashboard</a></p>
      <p>Best regards,<br/>JICE Career Team</p>
    `,
    text: `Your CV has been approved. You can now apply for jobs!`,
  }),

  cvRejectedNotification: (userName: string) => ({
    subject: 'CV Status Update - JICE Career',
    html: `
      <h2>CV Review Complete</h2>
      <p>Hello ${userName},</p>
      <p>Your CV has been reviewed, but we need some adjustments before we can approve it.</p>
      <p>Please review your CV and try uploading again.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #dc2626; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Upload Revised CV</a></p>
      <p>Best regards,<br/>JICE Career Team</p>
    `,
    text: `Your CV needs some adjustments. Please upload a revised version.`,
  }),
}
