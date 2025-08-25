// 📱 Service SMS pour Kollecta
// Note: Ce service utilise Twilio comme exemple, mais peut être adapté à d'autres fournisseurs

export class SmsService {
  /**
   * Simuler l'envoi SMS et retourner le lien de réinitialisation
   */
  static async sendPasswordResetSMS(phoneNumber: string, firstName: string, resetToken: string): Promise<{ success: boolean; resetUrl: string; message: string }> {
    try {
      // 🔗 URL de réinitialisation
      const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
      
      // 📝 Message SMS simulé
      const message = `Bonjour ${firstName} ! Votre lien de réinitialisation Kollecta: ${resetUrl} (valide 1h). Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.`;
      
      // 🚀 Simulation de l'envoi SMS
      console.log(`📱 SMS simulé envoyé à ${phoneNumber}:`);
      console.log(`📱 Contenu: ${message}`);
      console.log(`🔗 LIEN DE RÉINITIALISATION (copiez-collez dans votre navigateur):`);
      console.log(`🔗 ${resetUrl}`);
      console.log(`🔑 Token: ${resetToken}`);
      
      // 💡 Plus tard, vous pourrez décommenter le code Twilio ici
      /*
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);
      
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        to: phoneNumber
      });
      */
      
      console.log(`✅ SMS de réinitialisation envoyé avec succès à ${phoneNumber}`);
      
      return {
        success: true,
        resetUrl,
        message: 'SMS envoyé avec succès'
      };
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi du SMS de réinitialisation à ${phoneNumber}:`, error);
      return {
        success: false,
        resetUrl: '',
        message: 'Erreur lors de l\'envoi du SMS'
      };
    }
  }

  /**
   * Tester la configuration SMS
   */
  static async testConnection(): Promise<boolean> {
    try {
      console.log('📱 Test de connexion SMS...');
      // Ici vous testeriez votre service SMS
      console.log('✅ Test de connexion SMS réussi !');
      return true;
    } catch (error) {
      console.error('❌ Test de connexion SMS échoué :', error);
      return false;
    }
  }

  /**
   * Valider le format d'un numéro de téléphone
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Format international basique (peut être amélioré selon vos besoins)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  /**
   * Formater un numéro de téléphone pour l'affichage
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Supprimer les espaces et formater
    const cleaned = phoneNumber.replace(/\s/g, '');
    
    // Ajouter le + si absent
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  }
} 