import { PrismaClient } from '@prisma/client';
import { EmailService } from './emailService';
import { createNotification } from '../modules/notifications/notifications.controller';
import { emailConfig } from '../config/email.config';

// Instance Prisma partagée - sera fermée dans le script d'exécution
const prisma = new PrismaClient();

export class CagnotteReminderService {
  /**
   * Vérifier et envoyer les rappels pour les cagnottes proches de la fin
   * Cette méthode doit être appelée quotidiennement (via cron job ou endpoint)
   */
  static async checkAndSendReminders() {
    try {
      console.log('🔔 Début de la vérification des rappels de cagnottes...\n');

      const now = new Date();
      
      // Récupérer toutes les cagnottes actives qui ne sont pas encore expirées
      const activeCagnottes = await prisma.cagnotte.findMany({
        where: {
          status: 'ACTIVE',
          endDate: {
            gte: now // Pas encore expirées
          }
        },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          promises: {
            where: {
              status: 'PENDING' // Promesses non encore honorées
            },
            include: {
              contributor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      });

      let remindersSent = 0;

      for (const cagnotte of activeCagnottes) {
        const daysRemaining = this.getDaysRemaining(cagnotte.endDate);
        
        // Log pour déboguer
        console.log(`  📋 Cagnotte "${cagnotte.title}" (ID: ${cagnotte.id})`);
        console.log(`     Date de fin: ${cagnotte.endDate.toISOString()}`);
        console.log(`     Jours restants calculés: ${daysRemaining}`);
        
        // Rappels au créateur : 7 jours, 3 jours, 1 jour avant la fin
        if (daysRemaining === 7 || daysRemaining === 3 || daysRemaining === 1) {
          console.log(`     ✅ Rappel à envoyer (${daysRemaining} jours)`);
          await this.sendCreatorReminder(cagnotte, daysRemaining);
          remindersSent++;
        } else {
          console.log(`     ⏭️  Pas de rappel (${daysRemaining} jours restants, pas dans les délais 7/3/1)`);
        }

        // Rappels aux donateurs avec promesses en attente : 3 jours et 1 jour avant la fin
        if (daysRemaining === 3 || daysRemaining === 1) {
          for (const promise of cagnotte.promises) {
            await this.sendDonorReminder(cagnotte, promise, daysRemaining);
            remindersSent++;
          }
        }
      }

      console.log(`✅ ${remindersSent} rappels envoyés\n`);
      return { remindersSent, cagnottesChecked: activeCagnottes.length };
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des rappels:', error);
      throw error;
    }
  }

  /**
   * Vérifier et traiter les cagnottes expirées
   * Change le statut et envoie des notifications
   */
  static async checkAndHandleExpiredCagnottes() {
    try {
      console.log('📅 Vérification des cagnottes expirées...\n');

      const now = new Date();
      
      const expiredCagnottes = await prisma.cagnotte.findMany({
        where: {
          endDate: {
            lt: now // Date de fin dépassée
          },
          status: 'ACTIVE' // Encore actives
        },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          beneficiary: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          promises: {
            where: {
              status: 'PENDING' // Promesses non encore honorées
            },
            include: {
              contributor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      });

      let processed = 0;

      for (const cagnotte of expiredCagnottes) {
        // Déterminer le statut final
        const reachedGoal = cagnotte.currentAmount >= cagnotte.goalAmount;
        const finalStatus = reachedGoal ? 'SUCCESS' : 'CLOSED';

        // Mettre à jour le statut
        await prisma.cagnotte.update({
          where: { id: cagnotte.id },
          data: { status: finalStatus }
        });

        // Envoyer les notifications
        await this.sendExpirationNotifications(cagnotte, reachedGoal);
        processed++;
      }

      console.log(`✅ ${processed} cagnottes expirées traitées\n`);
      return { processed };
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des cagnottes expirées:', error);
      throw error;
    }
  }

  /**
   * Calculer le nombre de jours restants avant la fin
   * Utilise le calcul basé sur les jours calendaires (mise à minuit)
   */
  private static getDaysRemaining(endDate: Date): number {
    const now = new Date();
    
    // Normaliser les dates à minuit pour un calcul basé sur les jours calendaires
    const endDateMidnight = new Date(endDate);
    endDateMidnight.setHours(0, 0, 0, 0);
    
    const nowMidnight = new Date(now);
    nowMidnight.setHours(0, 0, 0, 0);
    
    const diffTime = endDateMidnight.getTime() - nowMidnight.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  /**
   * Envoyer un rappel au créateur de la cagnotte
   */
  private static async sendCreatorReminder(cagnotte: any, daysRemaining: number) {
    try {
      const progressPercentage = ((cagnotte.currentAmount / cagnotte.goalAmount) * 100).toFixed(1);
      const amountNeeded = Math.max(0, cagnotte.goalAmount - cagnotte.currentAmount);

      const subject = `⏰ Rappel : Il reste ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} pour votre cagnotte "${cagnotte.title}"`;
      
      const text = `Bonjour ${cagnotte.creator.firstName},\n\nIl reste ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} avant la fin de votre cagnotte "${cagnotte.title}".\n\nProgression actuelle : ${cagnotte.currentAmount} TND / ${cagnotte.goalAmount} TND (${progressPercentage}%)\n${amountNeeded > 0 ? `Montant restant : ${amountNeeded} TND\n` : ''}\nPartagez votre cagnotte pour maximiser vos chances d'atteindre votre objectif !\n\nVoir ma cagnotte : ${emailConfig.FRONTEND_URL}/cagnottes/${cagnotte.id}\n\nCordialement,\nL'équipe Kollecta`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">⏰ Rappel : ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${cagnotte.creator.firstName} !</h2>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <p style="color: #856404; margin: 0; font-size: 18px; line-height: 1.6;">
                Il reste <strong>${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}</strong> avant la fin de votre cagnotte "<strong>${cagnotte.title}</strong>".
              </p>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
              <h3 style="color: #333; margin-top: 0;">📊 Progression actuelle</h3>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Montant collecté :</span>
                <strong style="color: #28a745; font-size: 18px;">${cagnotte.currentAmount.toLocaleString()} TND</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Objectif :</span>
                <strong style="color: #333;">${cagnotte.goalAmount.toLocaleString()} TND</strong>
              </div>
              <div style="background: #e9ecef; border-radius: 4px; height: 20px; margin-top: 10px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); height: 100%; width: ${progressPercentage}%; transition: width 0.3s;"></div>
              </div>
              <p style="text-align: center; margin: 10px 0 0 0; color: #666; font-size: 14px;">
                <strong>${progressPercentage}%</strong> de l'objectif atteint
              </p>
              ${amountNeeded > 0 ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #dc3545; font-weight: bold;">
                  💰 Montant restant : ${amountNeeded.toLocaleString()} TND
                </p>
              </div>
              ` : `
              <div style="margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 4px;">
                <p style="margin: 0; color: #155724; font-weight: bold; text-align: center;">
                  🎉 Objectif atteint !
                </p>
              </div>
              `}
            </div>
            
            <div style="background: #e8f4fd; border: 1px solid #b3d9ff; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <p style="color: #004085; margin: 0; line-height: 1.6;">
                <strong>💡 Astuce :</strong> Partagez votre cagnotte sur les réseaux sociaux et avec vos proches pour maximiser vos chances d'atteindre votre objectif !
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${emailConfig.FRONTEND_URL}/cagnottes/${cagnotte.id}" 
                 style="background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;">
                📢 Partager ma cagnotte
              </a>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 14px;">© 2025 Kollecta. Tous droits réservés.</p>
          </div>
        </div>
      `;

      await EmailService.sendEmail(cagnotte.creator.email, subject, text, html);

      // Créer aussi une notification dans l'app
      await createNotification(
        cagnotte.creator.id,
        'CAGNOTTE',
        `⏰ ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`,
        `Il reste ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} avant la fin de votre cagnotte "${cagnotte.title}". Montant collecté : ${cagnotte.currentAmount} TND / ${cagnotte.goalAmount} TND (${progressPercentage}%).`,
        `/cagnottes/${cagnotte.id}`,
        {
          cagnotteId: cagnotte.id,
          cagnotteTitle: cagnotte.title,
          daysRemaining,
          currentAmount: cagnotte.currentAmount,
          goalAmount: cagnotte.goalAmount,
          type: 'deadline_reminder'
        }
      );

      console.log(`  ✅ Rappel envoyé au créateur de "${cagnotte.title}" (${daysRemaining} jours)`);
    } catch (error) {
      console.error(`  ⚠️ Erreur lors de l'envoi du rappel au créateur:`, error);
    }
  }

  /**
   * Envoyer un rappel au donateur qui a une promesse en attente
   */
  private static async sendDonorReminder(cagnotte: any, promise: any, daysRemaining: number) {
    try {
      const subject = `💚 Rappel : Honorez votre promesse pour "${cagnotte.title}"`;
      
      const text = `Bonjour ${promise.contributor.firstName},\n\nIl reste ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} avant la fin de la cagnotte "${cagnotte.title}" pour laquelle vous avez fait une promesse de ${promise.amount} DT.\n\nN'oubliez pas d'honorer votre engagement le jour J ! 💚\n\nVoir la cagnotte : ${emailConfig.FRONTEND_URL}/cagnottes/${cagnotte.id}\nVoir mes promesses : ${emailConfig.FRONTEND_URL}/promises\n\nCordialement,\nL'équipe Kollecta`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">💚 Rappel : Honorez votre promesse</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${promise.contributor.firstName} !</h2>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <p style="color: #856404; margin: 0; font-size: 18px; line-height: 1.6;">
                Il reste <strong>${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}</strong> avant la fin de la cagnotte "<strong>${cagnotte.title}</strong>".
              </p>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #28a745;">
              <h3 style="color: #333; margin-top: 0;">📝 Votre engagement</h3>
              <p style="color: #666; margin: 10px 0;">
                <strong>Montant promis :</strong> <span style="color: #28a745; font-size: 18px; font-weight: bold;">${promise.amount} TND</span>
              </p>
              <p style="color: #666; margin: 10px 0;">
                <strong>Statut :</strong> <span style="color: #ffc107; font-weight: bold;">⏳ En attente d'honorer</span>
              </p>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <p style="color: #155724; margin: 0; line-height: 1.6;">
                <strong>💚 N'oubliez pas d'honorer votre engagement le jour J !</strong><br>
                Connectez-vous à votre compte pour marquer votre promesse comme "honorée" une fois le don effectué.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${emailConfig.FRONTEND_URL}/promises" 
                 style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;">
                Voir mes promesses
              </a>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 14px;">© 2025 Kollecta. Tous droits réservés.</p>
          </div>
        </div>
      `;

      await EmailService.sendEmail(promise.contributor.email, subject, text, html);

      // Créer aussi une notification dans l'app
      await createNotification(
        promise.contributor.id,
        'DONATION',
        '💚 Rappel : Honorez votre promesse',
        `Il reste ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} avant la fin de la cagnotte "${cagnotte.title}". N'oubliez pas d'honorer votre promesse de ${promise.amount} DT.`,
        `/promises`,
        {
          promiseId: promise.id,
          cagnotteId: cagnotte.id,
          cagnotteTitle: cagnotte.title,
          amount: promise.amount,
          daysRemaining,
          type: 'promise_reminder'
        }
      );

      console.log(`  ✅ Rappel envoyé au donateur ${promise.contributor.email} (${daysRemaining} jours)`);
    } catch (error) {
      console.error(`  ⚠️ Erreur lors de l'envoi du rappel au donateur:`, error);
    }
  }

  /**
   * Envoyer les notifications quand une cagnotte expire
   */
  private static async sendExpirationNotifications(cagnotte: any, reachedGoal: boolean) {
    try {
      // Notification au créateur
      await this.sendCreatorExpirationEmail(cagnotte, reachedGoal);

      // Notifications aux donateurs avec promesses en attente
      for (const promise of cagnotte.promises) {
        await this.sendDonorExpirationEmail(cagnotte, promise, reachedGoal);
      }

      console.log(`  ✅ Notifications d'expiration envoyées pour "${cagnotte.title}"`);
    } catch (error) {
      console.error(`  ⚠️ Erreur lors de l'envoi des notifications d'expiration:`, error);
    }
  }

  /**
   * Email au créateur quand la cagnotte expire
   */
  private static async sendCreatorExpirationEmail(cagnotte: any, reachedGoal: boolean) {
    try {
      const progressPercentage = ((cagnotte.currentAmount / cagnotte.goalAmount) * 100).toFixed(1);
      
      if (reachedGoal) {
        const subject = `🎉 Félicitations ! Votre cagnotte "${cagnotte.title}" a atteint son objectif !`;
        const text = `Bonjour ${cagnotte.creator.firstName},\n\n🎉 Excellente nouvelle ! Votre cagnotte "${cagnotte.title}" a atteint son objectif avec ${cagnotte.currentAmount} TND collectés.\n\nMerci pour votre confiance en Kollecta !\n\nVoir ma cagnotte : ${emailConfig.FRONTEND_URL}/cagnottes/${cagnotte.id}\n\nCordialement,\nL'équipe Kollecta`;
        
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Objectif atteint !</h1>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px;">Félicitations ${cagnotte.creator.firstName} !</h2>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <p style="color: #155724; margin: 0; font-size: 18px; line-height: 1.6; text-align: center;">
                  Votre cagnotte "<strong>${cagnotte.title}</strong>" a <strong>atteint son objectif</strong> ! 🎉
                </p>
              </div>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #333; margin-top: 0;">📊 Résultat final</h3>
                <p style="color: #666; margin: 10px 0;">
                  <strong>Montant collecté :</strong> <span style="color: #28a745; font-size: 20px; font-weight: bold;">${cagnotte.currentAmount.toLocaleString()} TND</span>
                </p>
                <p style="color: #666; margin: 10px 0;">
                  <strong>Objectif :</strong> ${cagnotte.goalAmount.toLocaleString()} TND
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${emailConfig.FRONTEND_URL}/cagnottes/${cagnotte.id}" 
                   style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          font-size: 16px;">
                  Voir ma cagnotte
                </a>
              </div>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center; color: white; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 14px;">© 2025 Kollecta. Tous droits réservés.</p>
            </div>
          </div>
        `;

        await EmailService.sendEmail(cagnotte.creator.email, subject, text, html);

        // Notification dans l'app
        await createNotification(
          cagnotte.creator.id,
          'CAGNOTTE',
          '🎉 Objectif atteint !',
          `Félicitations ! Votre cagnotte "${cagnotte.title}" a atteint son objectif avec ${cagnotte.currentAmount} TND collectés.`,
          `/cagnottes/${cagnotte.id}`,
          {
            cagnotteId: cagnotte.id,
            cagnotteTitle: cagnotte.title,
            currentAmount: cagnotte.currentAmount,
            goalAmount: cagnotte.goalAmount,
            type: 'goal_reached'
          }
        );
      } else {
        const subject = `📅 Votre cagnotte "${cagnotte.title}" est terminée`;
        const text = `Bonjour ${cagnotte.creator.firstName},\n\nVotre cagnotte "${cagnotte.title}" est arrivée à son terme.\n\nRésultat : ${cagnotte.currentAmount} TND collectés sur ${cagnotte.goalAmount} TND (${progressPercentage}% de l'objectif).\n\nMerci pour votre confiance en Kollecta !\n\nVoir ma cagnotte : ${emailConfig.FRONTEND_URL}/cagnottes/${cagnotte.id}\n\nCordialement,\nL'équipe Kollecta`;
        
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">📅 Cagnotte terminée</h1>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${cagnotte.creator.firstName} !</h2>
              
              <div style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <p style="color: #004085; margin: 0; font-size: 18px; line-height: 1.6; text-align: center;">
                  Votre cagnotte "<strong>${cagnotte.title}</strong>" est arrivée à son terme.
                </p>
              </div>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #333; margin-top: 0;">📊 Résultat final</h3>
                <p style="color: #666; margin: 10px 0;">
                  <strong>Montant collecté :</strong> <span style="font-size: 18px; font-weight: bold;">${cagnotte.currentAmount.toLocaleString()} TND</span>
                </p>
                <p style="color: #666; margin: 10px 0;">
                  <strong>Objectif :</strong> ${cagnotte.goalAmount.toLocaleString()} TND
                </p>
                <p style="color: #666; margin: 10px 0;">
                  <strong>Progression :</strong> ${progressPercentage}%
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${emailConfig.FRONTEND_URL}/cagnottes/${cagnotte.id}" 
                   style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          font-size: 16px;">
                  Voir ma cagnotte
                </a>
              </div>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center; color: white; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 14px;">© 2025 Kollecta. Tous droits réservés.</p>
            </div>
          </div>
        `;

        await EmailService.sendEmail(cagnotte.creator.email, subject, text, html);

        // Notification dans l'app
        await createNotification(
          cagnotte.creator.id,
          'CAGNOTTE',
          '📅 Cagnotte terminée',
          `Votre cagnotte "${cagnotte.title}" est terminée. Résultat : ${cagnotte.currentAmount} TND collectés sur ${cagnotte.goalAmount} TND (${progressPercentage}%).`,
          `/cagnottes/${cagnotte.id}`,
          {
            cagnotteId: cagnotte.id,
            cagnotteTitle: cagnotte.title,
            currentAmount: cagnotte.currentAmount,
            goalAmount: cagnotte.goalAmount,
            type: 'cagnotte_expired'
          }
        );
      }
    } catch (error) {
      console.error('  ⚠️ Erreur lors de l\'envoi de l\'email d\'expiration au créateur:', error);
    }
  }

  /**
   * Email au donateur quand la cagnotte expire
   */
  private static async sendDonorExpirationEmail(cagnotte: any, promise: any, reachedGoal: boolean) {
    try {
      if (reachedGoal) {
        const subject = `🎉 La cagnotte "${cagnotte.title}" a atteint son objectif !`;
        const text = `Bonjour ${promise.contributor.firstName},\n\n🎉 Excellente nouvelle ! La cagnotte "${cagnotte.title}" pour laquelle vous avez fait une promesse de ${promise.amount} DT a atteint son objectif.\n\nMerci pour votre générosité ! N'oubliez pas d'honorer votre promesse si vous ne l'avez pas encore fait.\n\nVoir mes promesses : ${emailConfig.FRONTEND_URL}/promises\n\nCordialement,\nL'équipe Kollecta`;
        
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Objectif atteint !</h1>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${promise.contributor.firstName} !</h2>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <p style="color: #155724; margin: 0; font-size: 18px; line-height: 1.6; text-align: center;">
                  La cagnotte "<strong>${cagnotte.title}</strong>" a <strong>atteint son objectif</strong> ! 🎉
                </p>
              </div>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="color: #856404; margin: 0; line-height: 1.6;">
                  <strong>💚 Votre promesse :</strong> ${promise.amount} TND<br>
                  ${promise.status === 'PENDING' ? '<strong>⚠️ Action requise :</strong> N\'oubliez pas d\'honorer votre engagement !' : '✅ Déjà honorée'}
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${emailConfig.FRONTEND_URL}/promises" 
                   style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          font-size: 16px;">
                  Voir mes promesses
                </a>
              </div>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center; color: white; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 14px;">© 2025 Kollecta. Tous droits réservés.</p>
            </div>
          </div>
        `;

        await EmailService.sendEmail(promise.contributor.email, subject, text, html);
      } else {
        const subject = `📅 La cagnotte "${cagnotte.title}" est terminée - Honorez votre promesse`;
        const text = `Bonjour ${promise.contributor.firstName},\n\nLa cagnotte "${cagnotte.title}" pour laquelle vous avez fait une promesse de ${promise.amount} DT est arrivée à son terme.\n\nRésultat : ${cagnotte.currentAmount} TND collectés sur ${cagnotte.goalAmount} TND.\n\nN'oubliez pas d'honorer votre promesse si vous ne l'avez pas encore fait ! 💚\n\nVoir mes promesses : ${emailConfig.FRONTEND_URL}/promises\n\nCordialement,\nL'équipe Kollecta`;
        
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">📅 Cagnotte terminée</h1>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${promise.contributor.firstName} !</h2>
              
              <div style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <p style="color: #004085; margin: 0; font-size: 18px; line-height: 1.6; text-align: center;">
                  La cagnotte "<strong>${cagnotte.title}</strong>" est arrivée à son terme.
                </p>
              </div>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #333; margin-top: 0;">📊 Résultat final</h3>
                <p style="color: #666; margin: 10px 0;">
                  <strong>Montant collecté :</strong> ${cagnotte.currentAmount.toLocaleString()} TND
                </p>
                <p style="color: #666; margin: 10px 0;">
                  <strong>Objectif :</strong> ${cagnotte.goalAmount.toLocaleString()} TND
                </p>
              </div>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="color: #856404; margin: 0; line-height: 1.6;">
                  <strong>💚 Votre promesse :</strong> ${promise.amount} TND<br>
                  <strong>Statut :</strong> ⏳ En attente d'honorer
                </p>
              </div>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="color: #155724; margin: 0; line-height: 1.6;">
                  <strong>💡 Rappel :</strong> N'oubliez pas d'honorer votre promesse si vous ne l'avez pas encore fait !
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${emailConfig.FRONTEND_URL}/promises" 
                   style="background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block; 
                          font-weight: bold;
                          font-size: 16px;">
                  Voir mes promesses
                </a>
              </div>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center; color: white; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 14px;">© 2025 Kollecta. Tous droits réservés.</p>
            </div>
          </div>
        `;

        await EmailService.sendEmail(promise.contributor.email, subject, text, html);
      }

      // Notification dans l'app
      await createNotification(
        promise.contributor.id,
        'DONATION',
        reachedGoal ? '🎉 Cagnotte terminée avec succès' : '📅 Cagnotte terminée',
        `La cagnotte "${cagnotte.title}" est terminée${reachedGoal ? ' et a atteint son objectif' : ''}. ${promise.status === 'PENDING' ? 'N\'oubliez pas d\'honorer votre promesse de ' + promise.amount + ' DT.' : ''}`,
        `/promises`,
        {
          promiseId: promise.id,
          cagnotteId: cagnotte.id,
          cagnotteTitle: cagnotte.title,
          amount: promise.amount,
          reachedGoal,
          type: 'cagnotte_expired'
        }
      );
    } catch (error) {
      console.error('  ⚠️ Erreur lors de l\'envoi de l\'email d\'expiration au donateur:', error);
    }
  }
}

