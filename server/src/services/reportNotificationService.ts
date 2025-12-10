import { EmailService } from './emailService';
import { emailConfig } from '../config/email.config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportNotificationService {
  /**
   * Envoyer une notification de confirmation à l'utilisateur qui a signalé
   */
  static async sendReportConfirmationEmail(
    reporterEmail: string,
    reporterName: string,
    cagnotteTitle: string,
    reportId: string,
    reporterId?: string
  ): Promise<boolean> {
    const subject = '📧 Votre signalement a été reçu - Kollecta';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Kollecta</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Votre signalement a été reçu</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Bonjour ${reporterName},</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Nous avons bien reçu votre signalement concernant la cagnotte <strong>"${cagnotteTitle}"</strong>.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">📋 Détails de votre signalement</h3>
            <p style="margin: 5px 0;"><strong>ID du signalement:</strong> #${reportId}</p>
            <p style="margin: 5px 0;"><strong>Cagnotte signalée:</strong> ${cagnotteTitle}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Notre équipe va examiner votre signalement dans les plus brefs délais. 
            Vous recevrez une notification dès qu'une action sera prise.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${emailConfig.FRONTEND_URL}/dashboard" 
               style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Voir mon tableau de bord
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Merci de nous aider à maintenir un environnement sûr sur Kollecta.
          </p>
        </div>
      </div>
    `;

    const text = `
      Bonjour ${reporterName},
      
      Nous avons bien reçu votre signalement concernant la cagnotte "${cagnotteTitle}".
      
      Détails de votre signalement:
      - ID: #${reportId}
      - Cagnotte: ${cagnotteTitle}
      - Date: ${new Date().toLocaleDateString('fr-FR')}
      
      Notre équipe va examiner votre signalement dans les plus brefs délais.
      
      Merci de nous aider à maintenir un environnement sûr sur Kollecta.
      
      L'équipe Kollecta
    `;

    // 📧 Envoyer l'email
    const emailSent = await EmailService.sendEmail(reporterEmail, subject, text, html);

    // 🔔 Créer une notification en base de données si on a l'ID de l'utilisateur
    if (reporterId) {
      try {
        await prisma.notification.create({
          data: {
            userId: reporterId,
            type: 'REPORT',
            title: '📧 Votre signalement a été reçu',
            message: `Votre signalement concernant la cagnotte "${cagnotteTitle}" a été reçu. Notre équipe va l'examiner dans les plus brefs délais.`,
            actionUrl: `/dashboard`,
            metadata: {
              reportId,
              cagnotteTitle,
              type: 'report_confirmation'
            }
          }
        });
        console.log(`✅ Notification de confirmation de signalement créée pour l'utilisateur ${reporterId}`);
      } catch (error) {
        console.error('❌ Erreur lors de la création de la notification:', error);
      }
    }

    return emailSent;
  }

  /**
   * Envoyer une notification d'alerte à l'admin
   */
  static async sendAdminAlertEmail(
    adminEmail: string,
    reportId: string,
    reporterName: string,
    cagnotteTitle: string,
    reportType: string,
    priority: string
  ): Promise<boolean> {
    const subject = `🚨 Nouveau signalement reçu - ${priority} - Kollecta`;
    
    const priorityColors = {
      'URGENT': '#dc3545',
      'HIGH': '#fd7e14',
      'MEDIUM': '#007bff',
      'LOW': '#28a745'
    };

    const typeColors = {
      'FRAUD': '#dc3545',
      'INAPPROPRIATE': '#fd7e14',
      'SPAM': '#6c757d',
      'DUPLICATE': '#6c757d',
      'COMMENT': '#17a2b8',
      'OTHER': '#28a745'
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚨 Alerte Admin</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Nouveau signalement reçu</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <span style="background: ${typeColors[reportType as keyof typeof typeColors] || '#28a745'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
              ${reportType}
            </span>
            <span style="background: ${priorityColors[priority as keyof typeof priorityColors] || '#007bff'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
              ${priority}
            </span>
          </div>
          
          <h2 style="color: #333; margin-top: 0;">Nouveau signalement #${reportId}</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Signalant:</strong> ${reporterName}</p>
            <p style="margin: 5px 0;"><strong>Cagnotte:</strong> ${cagnotteTitle}</p>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${reportType}</p>
            <p style="margin: 5px 0;"><strong>Priorité:</strong> ${priority}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${emailConfig.FRONTEND_URL}/admin/reports" 
               style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Examiner le signalement
            </a>
          </div>
        </div>
      </div>
    `;

    const text = `
      Nouveau signalement reçu - ${priority}
      
      ID: #${reportId}
      Signalant: ${reporterName}
      Cagnotte: ${cagnotteTitle}
      Type: ${reportType}
      Priorité: ${priority}
      Date: ${new Date().toLocaleDateString('fr-FR')}
      
      Veuillez examiner ce signalement dans l'interface d'administration.
      
      L'équipe Kollecta
    `;

    return await EmailService.sendEmail(adminEmail, subject, text, html);
  }

  /**
   * Envoyer une notification de résolution à l'utilisateur
   */
  static async sendReportResolutionEmail(
    reporterEmail: string,
    reporterName: string,
    cagnotteTitle: string,
    reportId: string,
    action: string,
    adminNotes?: string,
    reporterId?: string
  ): Promise<boolean> {
    const subject = `✅ Votre signalement a été traité - Kollecta`;
    
    const actionMessages = {
      'RESOLVED': 'Votre signalement a été résolu',
      'DISMISSED': 'Votre signalement a été rejeté',
      'BLOCKED': 'L\'élément signalé a été bloqué',
      'DELETED': 'L\'élément signalé a été supprimé'
    };

    const actionColors = {
      'RESOLVED': '#28a745',
      'DISMISSED': '#6c757d',
      'BLOCKED': '#dc3545',
      'DELETED': '#dc3545'
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✅ Kollecta</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">${actionMessages[action as keyof typeof actionMessages] || 'Votre signalement a été traité'}</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Bonjour ${reporterName},</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Nous avons traité votre signalement concernant la cagnotte <strong>"${cagnotteTitle}"</strong>.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${actionColors[action as keyof typeof actionColors] || '#28a745'};">
            <h3 style="color: ${actionColors[action as keyof typeof actionColors] || '#28a745'}; margin-top: 0;">📋 Détails de l'action</h3>
            <p style="margin: 5px 0;"><strong>Signalement:</strong> #${reportId}</p>
            <p style="margin: 5px 0;"><strong>Cagnotte:</strong> ${cagnotteTitle}</p>
            <p style="margin: 5px 0;"><strong>Action:</strong> ${actionMessages[action as keyof typeof actionMessages] || action}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            ${adminNotes ? `<p style="margin: 5px 0;"><strong>Notes:</strong> ${adminNotes}</p>` : ''}
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Merci de nous avoir aidés à maintenir un environnement sûr sur Kollecta.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${emailConfig.FRONTEND_URL}/dashboard" 
               style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Voir mon tableau de bord
            </a>
          </div>
        </div>
      </div>
    `;

    const text = `
      Bonjour ${reporterName},
      
      Nous avons traité votre signalement concernant la cagnotte "${cagnotteTitle}".
      
      Détails de l'action:
      - Signalement: #${reportId}
      - Cagnotte: ${cagnotteTitle}
      - Action: ${actionMessages[action as keyof typeof actionMessages] || action}
      - Date: ${new Date().toLocaleDateString('fr-FR')}
      ${adminNotes ? `- Notes: ${adminNotes}` : ''}
      
      Merci de nous avoir aidés à maintenir un environnement sûr sur Kollecta.
      
      L'équipe Kollecta
    `;

    // 📧 Envoyer l'email
    const emailSent = await EmailService.sendEmail(reporterEmail, subject, text, html);

    // 🔔 Créer une notification en base de données
    if (reporterId) {
      try {
        const actionMessages = {
          'RESOLVED': '✅ Votre signalement a été résolu',
          'DISMISSED': '❌ Votre signalement a été rejeté',
          'BLOCKED': '🚫 L\'élément signalé a été bloqué',
          'DELETED': '🗑️ L\'élément signalé a été supprimé',
          'INVESTIGATED': '🔍 Votre signalement est en cours d\'enquête'
        };

        await prisma.notification.create({
          data: {
            userId: reporterId,
            type: 'REPORT',
            title: actionMessages[action as keyof typeof actionMessages] || '📢 Votre signalement a été traité',
            message: `Le signalement concernant "${cagnotteTitle}" a été traité.${adminNotes ? ` Notes: ${adminNotes}` : ''}`,
            actionUrl: `/dashboard`,
            metadata: {
              reportId,
              cagnotteTitle,
              action,
              adminNotes: adminNotes || undefined,
              type: 'report_resolution'
            }
          }
        });
        console.log(`✅ Notification de résolution créée pour l'utilisateur ${reporterId}`);
      } catch (error) {
        console.error('❌ Erreur lors de la création de la notification:', error);
      }
    }

    return emailSent;
  }

  /**
   * Envoyer une notification au créateur de la cagnotte
   */
  static async sendCagnotteActionEmail(
    creatorEmail: string,
    creatorName: string,
    cagnotteTitle: string,
    action: string,
    reason?: string
  ): Promise<boolean> {
    const subject = `⚠️ Action prise sur votre cagnotte - Kollecta`;
    
    const actionMessages = {
      'BLOCKED': 'Votre cagnotte a été bloquée',
      'DELETED': 'Votre cagnotte a été supprimée',
      'SUSPENDED': 'Votre cagnotte a été suspendue',
      'APPROVED': 'Votre cagnotte a été vérifiée et approuvée'
    };

    const actionColors = {
      'BLOCKED': '#dc3545',
      'DELETED': '#dc3545',
      'SUSPENDED': '#fd7e14',
      'APPROVED': '#28a745'
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #fd7e14 0%, #e55a00 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ Kollecta</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">${actionMessages[action as keyof typeof actionMessages] || 'Action prise sur votre cagnotte'}</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Bonjour ${creatorName},</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Une action a été prise concernant votre cagnotte <strong>"${cagnotteTitle}"</strong> suite à un signalement.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${actionColors[action as keyof typeof actionColors] || '#fd7e14'};">
            <h3 style="color: ${actionColors[action as keyof typeof actionColors] || '#fd7e14'}; margin-top: 0;">📋 Détails de l'action</h3>
            <p style="margin: 5px 0;"><strong>Cagnotte:</strong> ${cagnotteTitle}</p>
            <p style="margin: 5px 0;"><strong>Action:</strong> ${actionMessages[action as keyof typeof actionMessages] || action}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            ${reason ? `<p style="margin: 5px 0;"><strong>Raison:</strong> ${reason}</p>` : ''}
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            ${action === 'APPROVED' 
              ? 'Votre cagnotte a été vérifiée et peut continuer à recevoir des dons.' 
              : 'Si vous pensez qu\'il s\'agit d\'une erreur, vous pouvez contacter notre équipe de support.'}
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${emailConfig.FRONTEND_URL}/dashboard" 
               style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Voir mes cagnottes
            </a>
          </div>
        </div>
      </div>
    `;

    const text = `
      Bonjour ${creatorName},
      
      Une action a été prise concernant votre cagnotte "${cagnotteTitle}" suite à un signalement.
      
      Détails de l'action:
      - Cagnotte: ${cagnotteTitle}
      - Action: ${actionMessages[action as keyof typeof actionMessages] || action}
      - Date: ${new Date().toLocaleDateString('fr-FR')}
      ${reason ? `- Raison: ${reason}` : ''}
      
      ${action === 'APPROVED' 
        ? 'Votre cagnotte a été vérifiée et peut continuer à recevoir des dons.' 
        : 'Si vous pensez qu\'il s\'agit d\'une erreur, vous pouvez contacter notre équipe de support.'}
      
      L'équipe Kollecta
    `;

    return await EmailService.sendEmail(creatorEmail, subject, text, html);
  }
}