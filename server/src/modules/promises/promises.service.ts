import { PrismaClient } from '@prisma/client';
import { createNotification } from '../notifications/notifications.controller';
import cagnottesService from '../cagnottes/cagnottes.service';
import { EmailService } from '../../services/emailService';

const prisma = new PrismaClient();

export interface CreatePromiseData {
  cagnotteId: string;
  contributorId: string; // Obligatoire : nécessite un compte
  amount: number;
  message?: string;
  isAnonymous?: boolean;
}

export interface UpdatePromiseData {
  amount?: number;
  message?: string;
  isAnonymous?: boolean;
}

export interface UpdatePromiseStatusData {
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  adminNotes?: string;
}

export class PromisesService {
  /**
   * Créer une nouvelle promesse de don
   */
  async createPromise(data: CreatePromiseData) {
    try {
      // Vérifier que la cagnotte existe et est active
      const cagnotte = await prisma.cagnotte.findUnique({
        where: { id: data.cagnotteId },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      if (!cagnotte) {
        throw new Error('Cagnotte non trouvée');
      }

      if (cagnotte.status !== 'ACTIVE') {
        throw new Error('Seules les cagnottes actives peuvent recevoir des promesses de dons');
      }

      // Vérifier que l'utilisateur n'est pas le créateur de la cagnotte
      if (cagnotte.creatorId === data.contributorId) {
        throw new Error('Vous ne pouvez pas faire de promesse de don à votre propre cagnotte');
      }

      // Créer la promesse avec statut PENDING
      // LOGIQUE : Une promesse = engagement moral, elle compte dans le montant de la cagnotte
      // L'utilisateur doit avoir un compte pour faire une promesse
      // L'anonymat masque uniquement l'affichage public, mais les infos sont enregistrées
      const promise = await prisma.promise.create({
        data: {
          amount: data.amount,
          status: 'PENDING', // Promesse en attente d'être honorée
          contributorId: data.contributorId,
          cagnotteId: data.cagnotteId,
          message: data.message || null,
          isAnonymous: data.isAnonymous ?? false
        },
        include: {
          contributor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          cagnotte: {
            select: {
              id: true,
              title: true,
              creatorId: true
            }
          }
        }
      });

      // Mettre à jour le montant de la cagnotte (la promesse compte même en PENDING)
      await cagnottesService.updateCagnotteAmount(data.cagnotteId);

      // Créer des notifications et envoyer des emails
      try {
        // Déterminer le nom d'affichage du contributeur
        const contributorDisplayName = promise.isAnonymous 
          ? 'Un donateur anonyme' 
          : `${promise.contributor.firstName} ${promise.contributor.lastName}`;
        const contributorFullName = `${promise.contributor.firstName} ${promise.contributor.lastName}`;

        // Notification pour le créateur de la cagnotte
        await createNotification(
          cagnotte.creatorId,
          'DONATION',
          '🤝 Nouvelle promesse de don !',
          `${contributorDisplayName} s'engage à donner ${promise.amount} DT pour votre cagnotte "${cagnotte.title}". Merci pour ce soutien !`,
          `/cagnottes/${cagnotte.id}`,
          {
            promiseId: promise.id,
            amount: promise.amount,
            contributorName: promise.isAnonymous ? 'Anonyme' : contributorFullName,
            cagnotteTitle: cagnotte.title,
            type: 'promise_created',
            isAnonymous: promise.isAnonymous
          }
        );

        // Envoyer un email au créateur de la cagnotte (si emailNotifications est activé)
        try {
          // Vérifier les préférences emailNotifications
          const creatorUser = await prisma.user.findUnique({
            where: { id: cagnotte.creatorId },
            select: { notificationPreferences: true }
          });

          const creatorPrefs = creatorUser?.notificationPreferences as { emailNotifications?: boolean } | null;
          const shouldSendEmail = creatorPrefs?.emailNotifications !== false; // true par défaut si non défini

          if (shouldSendEmail) {
          const emailSubject = '🤝 Nouvelle promesse de don pour votre cagnotte !';
          const emailText = `Bonjour ${cagnotte.creator.firstName},\n\n${contributorDisplayName} s'engage à donner ${promise.amount} DT pour votre cagnotte "${cagnotte.title}".\n\n${promise.message ? `Message : "${promise.message}"\n\n` : ''}Merci pour ce soutien !\n\nVoir la cagnotte : http://localhost:3000/cagnottes/${cagnotte.id}\n\nCordialement,\nL'équipe Kollecta`;
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #00b289 0%, #008f73 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">🤝 Nouvelle promesse de don !</h1>
              </div>
              
              <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${cagnotte.creator.firstName} !</h2>
                
                <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                  <p style="color: #155724; margin: 0; font-size: 18px; line-height: 1.6;">
                    <strong>${contributorDisplayName}</strong> s'engage à donner <strong>${promise.amount} DT</strong> pour votre cagnotte "<strong>${cagnotte.title}</strong>".
                  </p>
                </div>
                
                ${promise.message ? `
                <div style="background: #e8f4fd; border: 1px solid #b3d9ff; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                  <p style="color: #004085; margin: 0; font-style: italic;">"${promise.message}"</p>
                </div>
                ` : ''}
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="http://localhost:3000/cagnottes/${cagnotte.id}" 
                     style="background: linear-gradient(135deg, #00b289 0%, #008f73 100%); 
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
              
              <div style="background: #333; padding: 20px; text-align: center; color: white;">
                <p style="margin: 0; font-size: 14px;">© 2025 Kollecta. Tous droits réservés.</p>
              </div>
            </div>
          `;
          await EmailService.sendEmail(cagnotte.creator.email, emailSubject, emailText, emailHtml);
          console.log(`✅ Email envoyé au créateur ${cagnotte.creator.email}`);
          } else {
            console.log(`⏭️ Email non envoyé au créateur ${cagnotte.creator.email} (emailNotifications désactivé)`);
          }
        } catch (emailError) {
          console.error('⚠️ Erreur lors de l\'envoi de l\'email au créateur:', emailError);
        }

        // Notification pour le contributeur
        await createNotification(
          data.contributorId,
          'DONATION',
          '✅ Promesse enregistrée',
          `Votre promesse de ${promise.amount} DT pour "${cagnotte.title}" est enregistrée. N'oubliez pas d'honorer votre engagement le jour J ! 💚`,
          `/cagnottes/${cagnotte.id}`,
          {
            promiseId: promise.id,
            amount: promise.amount,
            cagnotteTitle: cagnotte.title,
            type: 'promise_created'
          }
        );

        // Envoyer un email au contributeur (si emailNotifications est activé)
        try {
          // Vérifier les préférences emailNotifications
          const contributorUser = await prisma.user.findUnique({
            where: { id: data.contributorId },
            select: { notificationPreferences: true }
          });

          const contributorPrefs = contributorUser?.notificationPreferences as { emailNotifications?: boolean } | null;
          const shouldSendEmail = contributorPrefs?.emailNotifications !== false; // true par défaut si non défini

          if (shouldSendEmail) {
          const contributorEmailSubject = '✅ Votre promesse de don est enregistrée';
          const contributorEmailText = `Bonjour ${promise.contributor.firstName},\n\nVotre promesse de ${promise.amount} DT pour la cagnotte "${cagnotte.title}" est enregistrée avec succès.\n\nN'oubliez pas d'honorer votre engagement le jour J ! 💚\n\nVoir la cagnotte : http://localhost:3000/cagnottes/${cagnotte.id}\n\nCordialement,\nL'équipe Kollecta`;
          const contributorEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">✅ Promesse enregistrée</h1>
              </div>
              
              <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${promise.contributor.firstName} !</h2>
                
                <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                  <p style="color: #155724; margin: 0; font-size: 18px; line-height: 1.6;">
                    Votre promesse de <strong>${promise.amount} DT</strong> pour la cagnotte "<strong>${cagnotte.title}</strong>" est enregistrée avec succès.
                  </p>
                </div>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                  <p style="color: #856404; margin: 0; line-height: 1.6;">
                    <strong>💚 N'oubliez pas d'honorer votre engagement le jour J !</strong>
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="http://localhost:3000/cagnottes/${cagnotte.id}" 
                     style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                            color: white; 
                            padding: 15px 30px; 
                            text-decoration: none; 
                            border-radius: 25px; 
                            display: inline-block; 
                            font-weight: bold;
                            font-size: 16px;">
                    Voir la cagnotte
                  </a>
                </div>
              </div>
              
              <div style="background: #333; padding: 20px; text-align: center; color: white;">
                <p style="margin: 0; font-size: 14px;">© 2025 Kollecta. Tous droits réservés.</p>
              </div>
            </div>
          `;
          await EmailService.sendEmail(promise.contributor.email, contributorEmailSubject, contributorEmailText, contributorEmailHtml);
          console.log(`✅ Email envoyé au contributeur ${promise.contributor.email}`);
          } else {
            console.log(`⏭️ Email non envoyé au contributeur ${promise.contributor.email} (emailNotifications désactivé)`);
          }
        } catch (emailError) {
          console.error('⚠️ Erreur lors de l\'envoi de l\'email au contributeur:', emailError);
        }

        console.log(`✅ Notifications et emails créés pour la promesse ${promise.id}`);
      } catch (error) {
        console.error('⚠️ Erreur lors de la création des notifications:', error);
        // Ne pas faire échouer la création de promesse si les notifications échouent
      }

      return promise;
    } catch (error) {
      console.error('Erreur création promesse:', error);
      throw error;
    }
  }

  /**
   * Récupérer une promesse par ID
   */
  async getPromiseById(id: string) {
    try {
      const promise = await prisma.promise.findUnique({
        where: { id },
        include: {
          contributor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
              email: true
            }
          },
          cagnotte: {
            select: {
              id: true,
              title: true,
              description: true,
              goalAmount: true,
              currentAmount: true,
              status: true,
              creator: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      if (!promise) {
        throw new Error('Promesse non trouvée');
      }

      return promise;
    } catch (error) {
      console.error('Erreur récupération promesse:', error);
      throw error;
    }
  }

  /**
   * Récupérer les promesses d'une cagnotte
   */
  async getCagnottePromises(cagnotteId: string, filters?: { status?: string; page?: number; limit?: number }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { cagnotteId };
      if (filters?.status) {
        where.status = filters.status;
      }

      const [promises, total] = await Promise.all([
        prisma.promise.findMany({
          where,
          skip,
          take: limit,
          orderBy: { promisedAt: 'desc' },
          include: {
            contributor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true
              }
            }
          }
        }),
        prisma.promise.count({ where })
      ]);

      return {
        promises,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Erreur récupération promesses cagnotte:', error);
      throw error;
    }
  }

  /**
   * Récupérer les promesses d'un utilisateur
   */
  async getUserPromises(userId: string, filters?: { status?: string; page?: number; limit?: number }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { contributorId: userId };
      if (filters?.status) {
        where.status = filters.status;
      }

      const [promises, total] = await Promise.all([
        prisma.promise.findMany({
          where,
          skip,
          take: limit,
          orderBy: { promisedAt: 'desc' },
          include: {
            cagnotte: {
              select: {
                id: true,
                title: true,
                description: true,
                goalAmount: true,
                currentAmount: true,
                status: true,
                coverImage: true,
                creator: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        }),
        prisma.promise.count({ where })
      ]);

      return {
        promises,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Erreur récupération promesses utilisateur:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le statut d'une promesse
   * LOGIQUE : Permettre à l'utilisateur de marquer sa promesse comme "payée" quand il honore son engagement
   */
  async updatePromiseStatus(id: string, data: UpdatePromiseStatusData, userId?: string) {
    try {
      const existingPromise = await prisma.promise.findUnique({
        where: { id },
        include: {
          contributor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          cagnotte: {
            select: {
              id: true,
              title: true,
              creatorId: true,
              creator: {
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

      if (!existingPromise) {
        throw new Error('Promesse non trouvée');
      }

      // Vérifier que seul le contributeur peut mettre sa promesse à PAID
      if (data.status === 'PAID' && userId && existingPromise.contributorId !== userId) {
        throw new Error('Vous ne pouvez marquer comme payée que vos propres promesses');
      }

      // Vérifier que seul le contributeur peut annuler sa promesse
      if (data.status === 'CANCELLED' && userId && existingPromise.contributorId !== userId) {
        throw new Error('Vous ne pouvez annuler que vos propres promesses');
      }

      const oldStatus = existingPromise.status;
      const updateData: any = {
        status: data.status
      };

      // Si la promesse est payée, mettre à jour paidAt
      if (data.status === 'PAID' && oldStatus !== 'PAID') {
        updateData.paidAt = new Date();
      }

      // Si la promesse est annulée, on ne compte plus le montant
      // (mais le montant sera recalculé automatiquement)

      const promise = await prisma.promise.update({
        where: { id },
        data: updateData,
        include: {
          contributor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true
            }
          },
          cagnotte: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      // Mettre à jour le montant actuel de la cagnotte
      // Note: Les promesses PENDING et PAID comptent toutes les deux
      await cagnottesService.updateCagnotteAmount(promise.cagnotteId);

      // Créer des notifications si le statut a changé
      if (oldStatus !== data.status) {
        try {
          if (data.status === 'PAID') {
            // Notification pour le créateur de la cagnotte
            await createNotification(
              existingPromise.cagnotte.creatorId,
              'DONATION',
              '🎉 Engagement honoré !',
              `${existingPromise.contributor.firstName} ${existingPromise.contributor.lastName} a honoré sa promesse de ${promise.amount} DT pour votre cagnotte "${existingPromise.cagnotte.title}". Merci infiniment !`,
              `/cagnottes/${existingPromise.cagnotte.id}`,
              {
                promiseId: promise.id,
                amount: promise.amount,
                contributorName: `${existingPromise.contributor.firstName} ${existingPromise.contributor.lastName}`,
                cagnotteTitle: existingPromise.cagnotte.title,
                type: 'promise_honored'
              }
            );

            // Notification pour le contributeur
            await createNotification(
              existingPromise.contributor.id,
              'DONATION',
              '✨ Engagement honoré !',
              `Vous avez honoré votre promesse de ${promise.amount} DT pour "${existingPromise.cagnotte.title}". Merci pour votre générosité et votre engagement ! 💚`,
              `/cagnottes/${existingPromise.cagnotte.id}`,
              {
                promiseId: promise.id,
                amount: promise.amount,
                cagnotteTitle: existingPromise.cagnotte.title,
                type: 'promise_honored'
              }
            );
          } else if (data.status === 'CANCELLED') {
            // Notification pour le créateur de la cagnotte
            await createNotification(
              existingPromise.cagnotte.creatorId,
              'DONATION',
              '⚠️ Promesse annulée',
              `${existingPromise.contributor.firstName} ${existingPromise.contributor.lastName} a annulé sa promesse de ${promise.amount} DT pour votre cagnotte "${existingPromise.cagnotte.title}".`,
              `/cagnottes/${existingPromise.cagnotte.id}`,
              {
                promiseId: promise.id,
                amount: promise.amount,
                contributorName: `${existingPromise.contributor.firstName} ${existingPromise.contributor.lastName}`,
                cagnotteTitle: existingPromise.cagnotte.title,
                type: 'promise_cancelled'
              }
            );

            // Notification pour le contributeur
            await createNotification(
              existingPromise.contributor.id,
              'DONATION',
              'ℹ️ Promesse annulée',
              `Votre promesse de don de ${promise.amount} DT pour "${existingPromise.cagnotte.title}" a été annulée.`,
              `/cagnottes/${existingPromise.cagnotte.id}`,
              {
                promiseId: promise.id,
                amount: promise.amount,
                cagnotteTitle: existingPromise.cagnotte.title,
                type: 'promise_cancelled'
              }
            );
          }

          console.log(`✅ Notifications créées pour le changement de statut de la promesse ${promise.id}`);
        } catch (error) {
          console.error('⚠️ Erreur lors de la création des notifications:', error);
        }
      }

      return promise;
    } catch (error) {
      console.error('Erreur mise à jour statut promesse:', error);
      throw error;
    }
  }

  /**
   * Modifier une promesse (montant, message, isAnonymous)
   * Seulement si elle est en PENDING et que l'utilisateur est le contributeur
   */
  async updatePromise(id: string, data: UpdatePromiseData, userId: string) {
    try {
      const existingPromise = await prisma.promise.findUnique({
        where: { id },
        include: {
          contributor: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          cagnotte: {
            select: {
              id: true,
              title: true,
              creatorId: true,
              creator: {
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

      if (!existingPromise) {
        throw new Error('Promesse non trouvée');
      }

      // Vérifier que l'utilisateur est le contributeur
      if (existingPromise.contributorId !== userId) {
        throw new Error('Vous ne pouvez modifier que vos propres promesses');
      }

      // Ne permettre la modification que si la promesse est en PENDING
      if (existingPromise.status !== 'PENDING') {
        throw new Error('Seules les promesses en attente peuvent être modifiées');
      }

      // Préparer les données de mise à jour
      const updateData: any = {};
      if (data.amount !== undefined) {
        if (data.amount <= 0) {
          throw new Error('Le montant doit être supérieur à 0');
        }
        updateData.amount = data.amount;
      }
      if (data.message !== undefined) {
        updateData.message = data.message || null;
      }
      if (data.isAnonymous !== undefined) {
        updateData.isAnonymous = data.isAnonymous;
      }

      // Mettre à jour la promesse
      const promise = await prisma.promise.update({
        where: { id },
        data: updateData,
        include: {
          contributor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true
            }
          },
          cagnotte: {
            select: {
              id: true,
              title: true,
              description: true,
              creatorId: true,
              creator: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      // Si le montant a changé, mettre à jour le montant de la cagnotte
      if (data.amount !== undefined) {
        await cagnottesService.updateCagnotteAmount(existingPromise.cagnotteId);
      }

      return promise;
    } catch (error) {
      console.error('Erreur modification promesse:', error);
      throw error;
    }
  }

  /**
   * Supprimer une promesse (seulement si elle est en PENDING)
   */
  async deletePromise(id: string, userId: string) {
    try {
      const promise = await prisma.promise.findUnique({
        where: { id },
        select: {
          contributorId: true,
          status: true
        }
      });

      if (!promise) {
        throw new Error('Promesse non trouvée');
      }

      // Vérifier que l'utilisateur est le contributeur
      if (promise.contributorId !== userId) {
        throw new Error('Vous n\'êtes pas autorisé à supprimer cette promesse');
      }

      // Ne permettre la suppression que si la promesse est en PENDING
      if (promise.status !== 'PENDING') {
        throw new Error('Seules les promesses en attente peuvent être supprimées');
      }

      await prisma.promise.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      console.error('Erreur suppression promesse:', error);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques des promesses
   */
  async getPromiseStats(userId?: string, cagnotteId?: string) {
    try {
      const where: any = {};
      if (userId) {
        where.contributorId = userId;
      }
      if (cagnotteId) {
        where.cagnotteId = cagnotteId;
      }

      const [
        totalPromises,
        pendingPromises,
        paidPromises,
        cancelledPromises,
        allPromises
      ] = await Promise.all([
        prisma.promise.count({ where }),
        prisma.promise.count({ where: { ...where, status: 'PENDING' } }),
        prisma.promise.count({ where: { ...where, status: 'PAID' } }),
        prisma.promise.count({ where: { ...where, status: 'CANCELLED' } }),
        prisma.promise.findMany({
          where,
          select: {
            amount: true,
            status: true
          }
        })
      ]);

      const totalAmount = allPromises.reduce((sum, p) => sum + p.amount, 0);
      const paidAmount = allPromises
        .filter(p => p.status === 'PAID')
        .reduce((sum, p) => sum + p.amount, 0);
      const pendingAmount = allPromises
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        totalPromises,
        pendingPromises,
        paidPromises,
        cancelledPromises,
        totalAmount,
        paidAmount,
        pendingAmount
      };
    } catch (error) {
      console.error('Erreur récupération statistiques promesses:', error);
      throw error;
    }
  }
}

export default new PromisesService();

