// 🔧 Configuration email pour Kollecta avec SendGrid
export const emailConfig = {
  // 📧 Configuration SendGrid
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@kollecta.com',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'kollectapfe@gmail.com',
  
  // 🌐 URLs de l'application
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  VERIFICATION_URL: process.env.VERIFICATION_URL || 'http://localhost:3000/verify-email',
  RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL || 'http://localhost:3000/reset-password',
  
  // ⏰ Expiration des tokens (en heures)
  TOKEN_EXPIRATION_HOURS: 24,
  RESET_TOKEN_EXPIRATION_HOURS: 24,
  
  // 📝 Templates d'emails
  VERIFICATION_SUBJECT: '🎯 Vérifiez votre email - Kollecta',
  RESET_PASSWORD_SUBJECT: '🔑 Réinitialisation de votre mot de passe - Kollecta',
  ADMIN_NOTIFICATION_SUBJECT: '👤 Nouveau compte utilisateur créé - Kollecta',
  KYC_APPROVAL_SUBJECT: '✅ Votre compte a été approuvé - Kollecta',
  
  // Configuration SendGrid (pour compatibilité)
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key',
    fromEmail: process.env.FROM_EMAIL || 'noreply@kollecta.com',
    fromName: 'Kollecta'
  },
  
  // URLs de l'application (pour compatibilité)
  urls: {
    frontend: process.env.FRONTEND_URL || 'http://localhost:3000',
    verification: '/verify-email'
  },
  
  // Expiration des tokens (en heures) (pour compatibilité)
  tokenExpiration: 24,
  
  // Templates d'emails (pour compatibilité)
  templates: {
    verification: {
      subject: '🎯 Vérifiez votre email - Kollecta',
      from: 'Kollecta <noreply@kollecta.com>'
    },
    resend: {
      subject: '🔄 Nouveau code de vérification - Kollecta',
      from: 'Kollecta <noreply@kollecta.com>'
    }
  }
};

// 🧪 Configuration de test
export const testEmailConfig = {
  ...emailConfig,
  sendgrid: {
    ...emailConfig.sendgrid,
    apiKey: 'test-api-key'
  }
};