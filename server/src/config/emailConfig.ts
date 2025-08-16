export const emailConfig = {
  // SendGrid Configuration
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  FROM_EMAIL: 'sawssen.yazidi@sesame.com.tn',
  
  // URLs
  FRONTEND_URL: 'http://localhost:3000',
  VERIFICATION_URL: 'http://localhost:3000/verify-email',
  
  // Token expiration (24 hours)
  TOKEN_EXPIRATION_HOURS: 24,
  
  // Email templates
  VERIFICATION_SUBJECT: 'Vérifiez votre compte Kollecta',
  ADMIN_NOTIFICATION_SUBJECT: 'Nouveau compte utilisateur créé - Kollecta',
  
  // Admin email for notifications
  ADMIN_EMAIL: 'sawssen.yazidi@sesame.com.tn'
}; 