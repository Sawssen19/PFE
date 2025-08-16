import { authService } from '../../frontend/services/auth/authService';

export interface AccountDeletionRequest {
  userId: string;
  email: string;
  reason?: string;
  requestType: 'deletion' | 'deactivation';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text: string;
}

class AccountService {
  private baseURL = 'http://localhost:5000';

  // Méthode privée pour récupérer le token
  private getToken(): string | null {
    // Essayer d'abord localStorage, puis Redux store
    const token = localStorage.getItem('token');
    if (token) return token;
    
    // Si pas dans localStorage, essayer de récupérer depuis le store Redux
    // Note: Cette méthode nécessite que le composant qui utilise AccountService
    // soit dans un composant React avec accès au store Redux
    console.warn('Token non trouvé dans localStorage, vérifiez que l\'utilisateur est connecté');
    return null;
  }

  // Envoyer une demande de suppression/désactivation
  async submitAccountRequest(request: Omit<AccountDeletionRequest, 'status' | 'submittedAt'>, token?: string): Promise<AccountDeletionRequest> {
    try {
      const authToken = token || this.getToken();
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${this.baseURL}/api/account/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...request,
          submittedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi de la demande');
      }

      const result = await response.json();
      
      // Envoyer les emails de notification
      await this.sendNotificationEmails(request);
      
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      throw error;
    }
  }

  // Envoyer les emails de notification
  private async sendNotificationEmails(request: Omit<AccountDeletionRequest, 'status' | 'submittedAt'>): Promise<void> {
    try {
      // Email à l'équipe Kollecta
      const teamEmail: EmailNotification = {
        to: 'admin@kollecta.com', // À remplacer par l'email réel de l'équipe
        subject: `Nouvelle demande de ${request.requestType === 'deletion' ? 'suppression' : 'désactivation'} de compte`,
        html: this.generateTeamEmailHTML(request),
        text: this.generateTeamEmailText(request)
      };

      // Email de confirmation à l'utilisateur
      const userEmail: EmailNotification = {
        to: request.email,
        subject: `Confirmation de votre demande de ${request.requestType === 'deletion' ? 'suppression' : 'désactivation'} de compte`,
        html: this.generateUserEmailHTML(request),
        text: this.generateUserEmailText(request)
      };

      // Envoyer les emails via l'API
      await this.sendEmail(teamEmail);
      await this.sendEmail(userEmail);

      console.log('✅ Emails de notification envoyés avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des emails:', error);
      // Ne pas faire échouer la demande principale si les emails échouent
    }
  }

  // Envoyer un email via l'API
  private async sendEmail(emailData: EmailNotification): Promise<void> {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.baseURL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  }

  // Générer le HTML de l'email pour l'équipe
  private generateTeamEmailHTML(request: Omit<AccountDeletionRequest, 'status' | 'submittedAt'>): string {
    const requestType = request.requestType === 'deletion' ? 'suppression définitive' : 'désactivation temporaire';
    const actionText = request.requestType === 'deletion' ? 'supprimer définitivement' : 'désactiver temporairement';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvelle demande de ${requestType}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #00b289; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .alert { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .details { background: white; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .button { display: inline-block; background: #00b289; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Nouvelle demande de ${requestType}</h1>
            <p>Une demande nécessite votre attention immédiate</p>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>⚠️ Action requise :</strong> Un utilisateur a demandé la ${requestType} de son compte.
            </div>
            
            <div class="details">
              <h3>📋 Détails de la demande :</h3>
              <p><strong>Type :</strong> ${requestType}</p>
              <p><strong>Utilisateur :</strong> ${request.email}</p>
              <p><strong>ID Utilisateur :</strong> ${request.userId}</p>
              <p><strong>Date de soumission :</strong> ${new Date().toLocaleString('fr-FR')}</p>
              ${request.reason ? `<p><strong>Raison :</strong> ${request.reason}</p>` : ''}
            </div>
            
            <p><strong>Action requise :</strong> L'équipe Kollecta doit examiner cette demande et décider de la ${actionText} du compte.</p>
            
            <a href="${this.baseURL}/admin/requests" class="button">Voir la demande dans l'admin</a>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Cet email a été envoyé automatiquement par le système Kollecta.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Générer le texte de l'email pour l'équipe
  private generateTeamEmailText(request: Omit<AccountDeletionRequest, 'status' | 'submittedAt'>): string {
    const requestType = request.requestType === 'deletion' ? 'suppression définitive' : 'désactivation temporaire';
    
    return `
NOUVELLE DEMANDE DE ${requestType.toUpperCase()}

Une demande nécessite votre attention immédiate.

DÉTAILS DE LA DEMANDE :
- Type : ${requestType}
- Utilisateur : ${request.email}
- ID Utilisateur : ${request.userId}
- Date de soumission : ${new Date().toLocaleString('fr-FR')}
${request.reason ? `- Raison : ${request.reason}` : ''}

ACTION REQUISE : L'équipe Kollecta doit examiner cette demande et décider de la ${request.requestType === 'deletion' ? 'suppression définitive' : 'désactivation temporaire'} du compte.

Accédez à l'interface d'administration : ${this.baseURL}/admin/requests

---
Cet email a été envoyé automatiquement par le système Kollecta.
    `;
  }

  // Générer le HTML de l'email pour l'utilisateur
  private generateUserEmailHTML(request: Omit<AccountDeletionRequest, 'status' | 'submittedAt'>): string {
    const requestType = request.requestType === 'deletion' ? 'suppression définitive' : 'désactivation temporaire';
    const actionText = request.requestType === 'deletion' ? 'supprimé définitivement' : 'désactivé temporairement';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmation de votre demande</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #00b289; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .success { background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .info { background: #dbeafe; border: 1px solid #3b82f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .details { background: white; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Demande reçue et confirmée</h1>
            <p>Votre demande de ${requestType} a été enregistrée</p>
          </div>
          
          <div class="content">
            <div class="success">
              <strong>✅ Confirmation :</strong> Nous avons bien reçu votre demande de ${requestType} de compte.
            </div>
            
            <div class="info">
              <h3>📋 Prochaines étapes :</h3>
              <p>1. <strong>Réception :</strong> Votre demande a été reçue et enregistrée</p>
              <p>2. <strong>Examen :</strong> L'équipe Kollecta va examiner votre demande</p>
              <p>3. <strong>Décision :</strong> Vous recevrez une notification de la décision finale</p>
            </div>
            
            <div class="details">
              <h3>📝 Détails de votre demande :</h3>
              <p><strong>Type :</strong> ${requestType}</p>
              <p><strong>Date de soumission :</strong> ${new Date().toLocaleString('fr-FR')}</p>
              <p><strong>Statut actuel :</strong> En attente d'examen</p>
              ${request.reason ? `<p><strong>Raison fournie :</strong> ${request.reason}</p>` : ''}
            </div>
            
            <p><strong>⏰ Délai de traitement :</strong> L'examen de votre demande prend généralement 24-48 heures ouvrables.</p>
            
            <p><strong>📧 Contact :</strong> Si vous avez des questions, contactez-nous à support@kollecta.com</p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Cet email confirme la réception de votre demande. Votre compte reste actif jusqu'à la décision finale de l'équipe Kollecta.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Générer le texte de l'email pour l'utilisateur
  private generateUserEmailText(request: Omit<AccountDeletionRequest, 'status' | 'submittedAt'>): string {
    const requestType = request.requestType === 'deletion' ? 'suppression définitive' : 'désactivation temporaire';
    
    return `
CONFIRMATION DE VOTRE DEMANDE

Votre demande de ${requestType} de compte a été reçue et confirmée.

PROCHAINES ÉTAPES :
1. Réception : Votre demande a été reçue et enregistrée
2. Examen : L'équipe Kollecta va examiner votre demande
3. Décision : Vous recevrez une notification de la décision finale

DÉTAILS DE VOTRE DEMANDE :
- Type : ${requestType}
- Date de soumission : ${new Date().toLocaleString('fr-FR')}
- Statut actuel : En attente d'examen
${request.reason ? `- Raison fournie : ${request.reason}` : ''}

DÉLAI DE TRAITEMENT : L'examen de votre demande prend généralement 24-48 heures ouvrables.

CONTACT : Si vous avez des questions, contactez-nous à support@kollecta.com

---
Votre compte reste actif jusqu'à la décision finale de l'équipe Kollecta.
    `;
  }

  // Déconnecter l'utilisateur après la demande
  async logoutAfterRequest(): Promise<void> {
    try {
      // Appeler l'API de déconnexion
      const token = this.getToken();
      if (token) {
        await fetch(`${this.baseURL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Nettoyer le stockage local
      authService.logout();
      
      console.log('✅ Utilisateur déconnecté avec succès après la demande');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      // Forcer la déconnexion même en cas d'erreur
      authService.logout();
    }
  }

  // Vérifier le statut d'une demande
  async getRequestStatus(requestId: string): Promise<AccountDeletionRequest | null> {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`${this.baseURL}/api/account/request/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      return null;
    }
  }
}

export const accountService = new AccountService(); 