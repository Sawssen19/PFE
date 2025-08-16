// 🔧 Configuration email pour Kollecta avec SendGrid
export const emailConfig = {
  // 📧 Configuration SendGrid
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key',
    fromEmail: process.env.FROM_EMAIL || 'noreply@kollecta.com',
    fromName: 'Kollecta'
  },
  
  // 🌐 URLs de l'application
  urls: {
    frontend: process.env.FRONTEND_URL || 'http://localhost:3000',
    verification: '/verify-email'
  },
  
  // ⏰ Expiration des tokens (en heures)
  tokenExpiration: 24,
  
  // 📝 Templates d'emails
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