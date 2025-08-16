import sgMail from '@sendgrid/mail';
import { emailConfig } from '../config/emailConfig';

// Configure SendGrid
sgMail.setApiKey(emailConfig.SENDGRID_API_KEY);

export class EmailService {
  /**
   * Send verification email to new user
   */
  static async sendVerificationEmail(userEmail: string, verificationToken: string, firstName: string): Promise<boolean> {
    try {
      const verificationUrl = `${emailConfig.VERIFICATION_URL}?token=${verificationToken}`;
      
      const msg = {
        to: userEmail,
        from: emailConfig.FROM_EMAIL,
        subject: emailConfig.VERIFICATION_SUBJECT,
        text: `Bonjour ${firstName},\n\nBienvenue sur Kollecta ! Veuillez vérifier votre compte en cliquant sur ce lien :\n\n${verificationUrl}\n\nCe lien expirera dans ${emailConfig.TOKEN_EXPIRATION_HOURS} heures.\n\nCordialement,\nL'équipe Kollecta`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Bienvenue sur Kollecta !</h1>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${firstName},</h2>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
                Merci de vous être inscrit sur Kollecta ! Pour commencer à utiliser votre compte, 
                vous devez d'abord vérifier votre adresse email.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          font-size: 16px;">
                  ✅ Vérifier mon compte
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 25px;">
                <strong>Important :</strong> Ce lien de vérification expirera dans ${emailConfig.TOKEN_EXPIRATION_HOURS} heures.
              </p>
              
              <p style="color: #666; font-size: 14px;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center; color: white;">
              <p style="margin: 0; font-size: 14px;">
                © 2025 Kollecta. Tous droits réservés.
              </p>
            </div>
          </div>
        `
      };

      await sgMail.send(msg);
      console.log(`✅ Email de vérification envoyé à ${userEmail}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi de l'email de vérification à ${userEmail}:`, error);
      return false;
    }
  }

  /**
   * Send resend verification email (for existing users)
   */
  static async sendResendVerificationEmail(userEmail: string, verificationToken: string, firstName: string): Promise<boolean> {
    try {
      const verificationUrl = `${emailConfig.VERIFICATION_URL}?token=${verificationToken}`;
      
      const msg = {
        to: userEmail,
        from: emailConfig.FROM_EMAIL,
        subject: '🔄 Nouveau code de vérification - Kollecta',
        text: `Bonjour ${firstName},\n\nVous avez demandé un nouveau code de vérification pour votre compte Kollecta. Cliquez sur ce lien pour vérifier votre email :\n\n${verificationUrl}\n\nCe lien expirera dans ${emailConfig.TOKEN_EXPIRATION_HOURS} heures.\n\nCordialement,\nL'équipe Kollecta`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🔄 Nouveau code de vérification</h1>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${firstName} !</h2>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
                Vous avez demandé un nouveau code de vérification pour votre compte Kollecta. 
                Cliquez sur le bouton ci-dessous pour vérifier votre email.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #ff6b35, #f7931e); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          font-size: 16px;">
                  ✅ Vérifier mon email
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
              </p>
              
              <p style="background: #e9e9e9; padding: 15px; border-radius: 5px; word-break: break-all; color: #333;">
                ${verificationUrl}
              </p>
              
              <p style="color: #999; font-size: 14px; margin-top: 30px;">
                Ce lien expirera dans ${emailConfig.TOKEN_EXPIRATION_HOURS} heures.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© 2025 Kollecta. Tous droits réservés.</p>
            </div>
          </div>
        `
      };

      await sgMail.send(msg);
      console.log(`✅ Email de renvoi de vérification envoyé à ${userEmail}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi de l'email de renvoi de vérification à ${userEmail}:`, error);
      return false;
    }
  }

  /**
   * Send admin notification email
   */
  static async sendAdminNotification(userEmail: string, firstName: string, lastName: string): Promise<boolean> {
    try {
      const msg = {
        to: emailConfig.ADMIN_EMAIL,
        from: emailConfig.FROM_EMAIL,
        subject: emailConfig.ADMIN_NOTIFICATION_SUBJECT,
        text: `Nouveau compte utilisateur créé :\n\nNom: ${firstName} ${lastName}\nEmail: ${userEmail}\nDate: ${new Date().toLocaleString('fr-FR')}\n\nCordialement,\nSystème Kollecta`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #28a745; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0;">🆕 Nouveau compte utilisateur créé</h2>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h3 style="color: #333; margin-bottom: 20px;">Détails du nouvel utilisateur :</h3>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                <p style="margin: 10px 0;"><strong>Nom complet :</strong> ${firstName} ${lastName}</p>
                <p style="margin: 10px 0;"><strong>Email :</strong> ${userEmail}</p>
                <p style="margin: 10px 0;"><strong>Date de création :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                <p style="margin: 10px 0;"><strong>Statut :</strong> <span style="color: #ffc107;">En attente de vérification</span></p>
              </div>
              
              <p style="color: #666; margin-top: 20px; font-size: 14px;">
                Cet email a été envoyé automatiquement par le système Kollecta.
              </p>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center; color: white;">
              <p style="margin: 0; font-size: 14px;">
                © 2025 Kollecta. Tous droits réservés.
              </p>
            </div>
          </div>
        `
      };

      await sgMail.send(msg);
      console.log(`✅ Email de notification admin envoyé à ${emailConfig.ADMIN_EMAIL}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi de l'email de notification admin:`, error);
      return false;
    }
  }

  /**
   * Test SendGrid connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      const msg = {
        to: emailConfig.ADMIN_EMAIL,
        from: emailConfig.FROM_EMAIL,
        subject: 'Test de connexion SendGrid - Kollecta',
        text: 'Ceci est un test de connexion SendGrid. Si vous recevez cet email, la configuration est correcte !',
        html: '<h2>Test de connexion SendGrid</h2><p>Ceci est un test de connexion SendGrid. Si vous recevez cet email, la configuration est correcte !</p>'
      };

      await sgMail.send(msg);
      console.log('✅ Test de connexion SendGrid réussi !');
      return true;
    } catch (error) {
      console.error('❌ Test de connexion SendGrid échoué :', error);
      return false;
    }
  }

  /**
   * Generic email sending method
   */
  static async sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
    try {
      const msg: any = {
        to,
        from: emailConfig.FROM_EMAIL,
        subject,
        text
      };

      if (html) {
        msg.html = html;
      }

      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi d'email à ${to}:`, error);
      return false;
    }
  }
} 