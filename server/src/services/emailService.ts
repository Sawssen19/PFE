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
   * Send password reset email
   */
  static async sendPasswordResetEmail(userEmail: string, firstName: string, resetToken: string): Promise<boolean> {
    try {
      const resetUrl = `${emailConfig.RESET_PASSWORD_URL}?token=${resetToken}`;
      
      const msg = {
        to: userEmail,
        from: emailConfig.FROM_EMAIL,
        subject: emailConfig.RESET_PASSWORD_SUBJECT,
        text: `Bonjour ${firstName},\n\nVous avez demandé la réinitialisation de votre mot de passe sur Kollecta. Cliquez sur ce lien pour créer un nouveau mot de passe :\n\n${resetUrl}\n\nCe lien expirera dans ${emailConfig.RESET_TOKEN_EXPIRATION_HOURS} heure(s).\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nCordialement,\nL'équipe Kollecta`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🔑 Réinitialisation de mot de passe</h1>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${firstName} !</h2>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
                Vous avez demandé la réinitialisation de votre mot de passe sur Kollecta. 
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #ff6b35, #f7931e); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          font-size: 16px;">
                  🔑 Réinitialiser mon mot de passe
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 25px;">
                <strong>Important :</strong> Ce lien de réinitialisation expirera dans ${emailConfig.RESET_TOKEN_EXPIRATION_HOURS} heure(s).
              </p>
              
              <p style="color: #666; font-size: 14px;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${resetUrl}" style="color: #ff6b35; word-break: break-all;">${resetUrl}</a>
              </p>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>⚠️ Sécurité :</strong> Si vous n'avez pas demandé cette réinitialisation, 
                  ignorez cet email. Votre mot de passe actuel reste inchangé.
                </p>
              </div>
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
      console.log(`✅ Email de réinitialisation de mot de passe envoyé à ${userEmail}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi de l'email de réinitialisation à ${userEmail}:`, error);
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
   * Send KYC approval email to user
   */
  static async sendKYCApprovalEmail(userEmail: string, firstName: string, lastName: string): Promise<boolean> {
    try {
      const msg = {
        to: userEmail,
        from: emailConfig.FROM_EMAIL,
        subject: emailConfig.KYC_APPROVAL_SUBJECT,
        text: `Bonjour ${firstName},\n\n🎉 Excellente nouvelle ! Votre compte Kollecta a été approuvé avec succès.\n\nVotre vérification KYC a été validée et vous pouvez maintenant :\n✅ Créer des cagnottes\n✅ Participer aux campagnes\n✅ Accéder à toutes les fonctionnalités\n\nConnectez-vous sur ${emailConfig.FRONTEND_URL} pour commencer à utiliser votre compte.\n\nCordialement,\nL'équipe Kollecta`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Compte Approuvé !</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Votre vérification KYC est validée</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${firstName} !</h2>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #155724; margin: 0 0 15px 0;">✅ Votre compte a été approuvé avec succès !</h3>
                <p style="color: #155724; margin: 0; line-height: 1.6;">
                  Félicitations ! Votre vérification KYC a été validée par notre équipe d'administration. 
                  Votre compte est maintenant entièrement fonctionnel.
                </p>
              </div>
              
              <h3 style="color: #333; margin-bottom: 15px;">🚀 Ce que vous pouvez faire maintenant :</h3>
              <ul style="color: #555; line-height: 1.8; margin-bottom: 25px;">
                <li>✅ <strong>Créer des cagnottes</strong> pour vos projets</li>
                <li>✅ <strong>Participer aux campagnes</strong> de financement</li>
                <li>✅ <strong>Accéder à toutes les fonctionnalités</strong> de la plateforme</li>
                <li>✅ <strong>Gérer votre profil</strong> et vos préférences</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${emailConfig.FRONTEND_URL}" 
                   style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          font-size: 16px;">
                  🚀 Commencer à utiliser mon compte
                </a>
              </div>
              
              <div style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="color: #004085; margin: 0; font-size: 14px;">
                  <strong>💡 Conseil :</strong> Connectez-vous dès maintenant pour explorer toutes les fonctionnalités 
                  et commencer à créer vos premières cagnottes !
                </p>
              </div>
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
      console.log(`✅ Email d'approbation KYC envoyé à ${userEmail}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi de l'email d'approbation KYC à ${userEmail}:`, error);
      return false;
    }
  }

  /**
   * Send suspension email to user
   */
  static async sendSuspensionEmail(userEmail: string, firstName: string, lastName: string): Promise<boolean> {
    try {
      const msg = {
        to: userEmail,
        from: emailConfig.FROM_EMAIL,
        subject: '⚠️ Votre compte a été suspendu - Kollecta',
        text: `Bonjour ${firstName},\n\n⚠️ Votre compte Kollecta a été suspendu par notre équipe d'administration.\n\nCette suspension peut être due à :\n- Non-respect des conditions d'utilisation\n- Activité suspecte détectée\n- Documents KYC non conformes\n\nPour plus d'informations ou pour demander une réactivation, contactez notre support : support@kollecta.com\n\nCordialement,\nL'équipe Kollecta`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">⚠️ Compte Suspendu</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Action administrative requise</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${firstName} !</h2>
              
              <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #721c24; margin: 0 0 15px 0;">⚠️ Votre compte a été suspendu</h3>
                <p style="color: #721c24; margin: 0; line-height: 1.6;">
                  Notre équipe d'administration a suspendu votre compte Kollecta. 
                  Cette mesure est temporaire et peut être levée.
                </p>
              </div>
              
              <h3 style="color: #333; margin-bottom: 15px;">🔍 Raisons possibles de la suspension :</h3>
              <ul style="color: #555; line-height: 1.8; margin-bottom: 25px;">
                <li>⚠️ <strong>Non-respect des conditions d'utilisation</strong></li>
                <li>⚠️ <strong>Activité suspecte détectée</strong></li>
                <li>⚠️ <strong>Documents KYC non conformes</strong></li>
                <li>⚠️ <strong>Comportement inapproprié</strong></li>
              </ul>
              
              <div style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h4 style="color: #004085; margin: 0 0 15px 0;">📞 Que faire maintenant ?</h4>
                <p style="color: #004085; margin: 0; line-height: 1.6;">
                  Pour plus d'informations ou pour demander une réactivation de votre compte, 
                  contactez notre équipe de support :
                </p>
                <p style="color: #004085; margin: 15px 0 0 0;">
                  <strong>📧 Email :</strong> support@kollecta.com<br>
                  <strong>⏰ Réponse sous 24-48h</strong>
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:support@kollecta.com" 
                   style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          font-size: 16px;">
                  📧 Contacter le support
                </a>
              </div>
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
      console.log(`✅ Email de suspension envoyé à ${userEmail}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi de l'email de suspension à ${userEmail}:`, error);
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

  /**
   * Send user modification notification email
   */
  static async sendUserModificationEmail(
    userEmail: string, 
    firstName: string, 
    lastName: string, 
    modifications: {
      role?: { old: string; new: string };
      status?: { old: string; new: string };
      isActive?: { old: boolean; new: boolean };
      isVerified?: { old: boolean; new: boolean };
    }
  ): Promise<boolean> {
    try {
      // Construire le message des modifications
      const changes = [];
      if (modifications.role) {
        changes.push(`• Rôle : ${modifications.role.old} → ${modifications.role.new}`);
      }
      if (modifications.status) {
        changes.push(`• Statut : ${modifications.status.old} → ${modifications.status.new}`);
      }
      if (modifications.isActive !== undefined) {
        changes.push(`• Compte actif : ${modifications.isActive.old ? 'Oui' : 'Non'} → ${modifications.isActive.new ? 'Oui' : 'Non'}`);
      }
      if (modifications.isVerified !== undefined) {
        changes.push(`• Email vérifié : ${modifications.isVerified.old ? 'Oui' : 'Non'} → ${modifications.isVerified.new ? 'Oui' : 'Non'}`);
      }

      const changesText = changes.join('\n');
      const changesHtml = changes.map(change => `<li style="margin: 8px 0; color: #555;">${change}</li>`).join('');

      const msg = {
        to: userEmail,
        from: emailConfig.FROM_EMAIL,
        subject: '🔔 Modifications de votre compte Kollecta',
        text: `Bonjour ${firstName},\n\nVotre compte Kollecta a été modifié par un administrateur.\n\nModifications apportées :\n${changesText}\n\nCes modifications ont été effectuées pour assurer la sécurité et le bon fonctionnement de votre compte.\n\nSi vous avez des questions, n'hésitez pas à contacter notre équipe support.\n\nCordialement,\nL'équipe Kollecta`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🔔 Modifications de votre compte</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Votre compte a été modifié par un administrateur</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${firstName} !</h2>
              
              <div style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #0056b3; margin: 0 0 15px 0;">ℹ️ Modifications apportées à votre compte</h3>
                <p style="color: #0056b3; margin: 0; line-height: 1.6;">
                  Un administrateur a modifié certaines informations de votre compte Kollecta. 
                  Ces modifications ont été effectuées pour assurer la sécurité et le bon fonctionnement de votre compte.
                </p>
              </div>
              
              <h3 style="color: #333; margin-bottom: 15px;">📝 Détail des modifications :</h3>
              <ul style="background: white; border-radius: 8px; padding: 20px; border-left: 4px solid #007bff; margin: 0;">
                ${changesHtml}
              </ul>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-top: 25px;">
                <h4 style="color: #856404; margin: 0 0 10px 0;">💡 Que faire maintenant ?</h4>
                <p style="color: #856404; margin: 0; line-height: 1.6;">
                  Vous pouvez vous connecter à votre compte pour vérifier les modifications. 
                  Si vous avez des questions ou si vous pensez qu'une erreur a été commise, 
                  n'hésitez pas à contacter notre équipe support.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${emailConfig.FRONTEND_URL}/login" 
                   style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          font-size: 16px;">
                  🔐 Accéder à mon compte
                </a>
              </div>
              
              <p style="color: #666; margin-top: 25px; font-size: 14px;">
                <strong>Important :</strong> Cet email a été envoyé automatiquement suite aux modifications apportées à votre compte.
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
      console.log(`✅ Email de notification de modification envoyé à ${userEmail}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi de l'email de notification de modification à ${userEmail}:`, error);
      return false;
    }
  }
} 