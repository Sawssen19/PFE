import { PrismaClient } from '@prisma/client';
import { EmailService } from '../../services/emailService';
import { emailConfig } from '../../config/emailConfig';

const prisma = new PrismaClient();

export interface CreateCagnotteData {
  title: string;
  description: string;
  targetAmount: number;
  endDate: Date;
  category: string;
  createdBy: string;
  coverImage?: string;
  coverVideo?: string;
  mediaType?: string;
  mediaFilename?: string;
  status?: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'REJECTED';
  currentStep?: number;
}

export interface UpdateCagnotteData {
  title?: string;
  description?: string;
  goalAmount?: number;
  endDate?: Date;
  category?: any;
  status?: 'active' | 'completed' | 'cancelled';
  coverImage?: string;
  coverVideo?: string;
  mediaType?: string;
  mediaFilename?: string;
  currentStep?: number;
}

export interface CagnotteFilters {
  page: number;
  limit: number;
  category?: string;
  status?: string;
}

export class CagnottesService {
  // 🔐 Valider qu'un utilisateur peut créer une cagnotte
  async validateUserAccount(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          kycVerification: true,
          amlCheck: true
        }
      });

      if (!user) {
        return {
          isValid: false,
          message: 'Utilisateur non trouvé',
          details: { userId }
        };
      }

      // 🔧 LOGIQUE CORRIGÉE : Si le statut est ACTIVE, c'est que l'admin a approuvé l'utilisateur
      // Donc il peut créer des cagnottes même sans KYC complet
      if (user.status !== 'ACTIVE') {
        return {
          isValid: false,
          message: 'Votre compte n\'est pas actif. Veuillez contacter le support.',
          details: { 
            status: user.status,
            reason: 'Compte inactif ou suspendu'
          }
        };
      }

      // Vérifier le niveau de risque AML (seule restriction pour les comptes ACTIVE)
      if (user.amlCheck && user.amlCheck.riskLevel === 'BLOCKED') {
        return {
          isValid: false,
          message: 'Votre compte présente un niveau de risque élevé. Veuillez contacter le support.',
          details: { 
            riskLevel: user.amlCheck.riskLevel,
            reason: 'Niveau de risque critique'
          }
        };
      }

      // ✅ Si le statut est ACTIVE, l'utilisateur peut créer des cagnottes
      return {
        isValid: true,
        message: 'Compte validé avec succès',
        details: {
          userId: user.id,
          status: user.status,
          kycStatus: user.kycVerification?.verificationStatus || 'NOT_REQUIRED',
          riskLevel: user.amlCheck?.riskLevel || 'LOW',
          emailVerified: user.isVerified
        }
      };
    } catch (error) {
      console.error('Erreur validation compte utilisateur:', error);
      return {
        isValid: false,
        message: 'Erreur lors de la validation du compte',
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
      };
    }
  }

  // Créer une nouvelle cagnotte
  async createCagnotte(data: CreateCagnotteData) {
    try {
      // Créer d'abord la catégorie si elle n'existe pas
      let category = await prisma.category.findFirst({
        where: { name: data.category }
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: data.category,
            description: `Catégorie pour ${data.category}`
          }
        });
      }

      const cagnotte = await prisma.cagnotte.create({
        data: {
          title: data.title,
          description: data.description,
          goalAmount: data.targetAmount,
          currentAmount: 0,
          endDate: data.endDate,
          status: data.status || 'DRAFT', // Utiliser le status fourni ou DRAFT par défaut
          creatorId: data.createdBy,
          beneficiaryId: data.createdBy, // Pour l'instant, le créateur est aussi le bénéficiaire
          categoryId: category.id,
          coverImage: data.coverImage,
          coverVideo: data.coverVideo,
          mediaType: data.mediaType,
          mediaFilename: data.mediaFilename,
          currentStep: data.currentStep || 1
        },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        }
      });

      // 📧 Envoyer les emails de notification
      try {
        await this.sendCagnotteCreationEmails(cagnotte);
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi des emails de notification:', emailError);
        // Ne pas faire échouer la création de cagnotte si l'email échoue
      }

      return cagnotte;
    } catch (error) {
      console.error('Erreur création cagnotte:', error);
      throw new Error('Erreur lors de la création de la cagnotte');
    }
  }

  // 📧 Envoyer les emails lors de la création d'une cagnotte
  private async sendCagnotteCreationEmails(cagnotte: any) {
    try {
      // Email de confirmation au créateur
      // Envoyer l'email pour tous les statuts sauf DRAFT (brouillon)
      if (cagnotte.status === 'PENDING' || cagnotte.status === 'ACTIVE' || cagnotte.status === 'REJECTED') {
        await EmailService.sendCagnotteCreationConfirmationEmail(
          cagnotte.creator.email,
          cagnotte.creator.firstName,
          cagnotte.title,
          cagnotte.id
        );
        console.log('✅ Email de confirmation envoyé au créateur:', cagnotte.creator.email);
      }

      // Email de notification à l'admin (uniquement pour PENDING)
      if (cagnotte.status === 'PENDING') {
        await EmailService.sendCagnotteCreationAdminNotificationEmail(
          emailConfig.ADMIN_EMAIL,
          cagnotte.creator.firstName,
          cagnotte.creator.lastName,
          cagnotte.creator.email,
          cagnotte.title,
          cagnotte.id,
          cagnotte.goalAmount
        );
        console.log('✅ Email de notification envoyé à l\'admin:', emailConfig.ADMIN_EMAIL);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des emails de création:', error);
      throw error;
    }
  }

  // 📧 Envoyer un email ET créer une notification lors du changement de statut d'une cagnotte
  async sendCagnotteStatusChangeEmail(cagnotteId: string, oldStatus: string, newStatus: string, adminNotes?: string) {
    try {
      const cagnotte = await prisma.cagnotte.findUnique({
        where: { id: cagnotteId },
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

      // 1️⃣ Envoyer l'email de changement de statut au créateur
      await EmailService.sendCagnotteStatusChangeEmail(
        cagnotte.creator.email,
        cagnotte.creator.firstName,
        cagnotte.title,
        oldStatus,
        newStatus,
        cagnotte.id,
        adminNotes
      );

      // 2️⃣ Créer une notification en base de données
      await this.createCagnotteStatusNotification(
        cagnotte.creator.id,
        cagnotte.title,
        oldStatus,
        newStatus,
        cagnotte.id,
        adminNotes
      );

      console.log(`✅ Email et notification de changement de statut envoyés au créateur: ${cagnotte.creator.email} (${oldStatus} → ${newStatus})`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email/notification de changement de statut:', error);
      throw error;
    }
  }

  // 🔔 Créer une notification en base de données pour le changement de statut d'une cagnotte
  async createCagnotteStatusNotification(userId: string, cagnotteTitle: string, oldStatus: string, newStatus: string, cagnotteId: string, adminNotes?: string) {
    try {
      // Déterminer le type et le contenu de la notification selon le nouveau statut
      let notificationType: 'CAGNOTTE' = 'CAGNOTTE';
      let title: string;
      let message: string;
      let actionUrl: string = `/cagnottes/${cagnotteId}`;

      switch (newStatus) {
        case 'ACTIVE':
          title = '🎉 Votre cagnotte a été approuvée !';
          message = `Votre cagnotte "${cagnotteTitle}" est maintenant active et visible par tous les utilisateurs.`;
          break;
        case 'REJECTED':
          title = '❌ Votre cagnotte a été rejetée';
          message = `Votre cagnotte "${cagnotteTitle}" a été rejetée par l'administration.${adminNotes ? ` Raison: ${adminNotes}` : ''}`;
          break;
        case 'SUSPENDED':
          title = '⚠️ Votre cagnotte a été suspendue';
          message = `Votre cagnotte "${cagnotteTitle}" a été suspendue par l'administration.${adminNotes ? ` Raison: ${adminNotes}` : ''}`;
          break;
        case 'CLOSED':
          title = '🔒 Votre cagnotte a été fermée';
          message = `Votre cagnotte "${cagnotteTitle}" a été fermée.`;
          break;
        default:
          title = '📢 Statut de votre cagnotte modifié';
          message = `Le statut de votre cagnotte "${cagnotteTitle}" est passé de ${oldStatus} à ${newStatus}.`;
      }

      // Créer la notification en base de données
      await prisma.notification.create({
        data: {
          userId,
          type: notificationType,
          title,
          message,
          actionUrl,
          metadata: {
            cagnotteId,
            oldStatus,
            newStatus,
            cagnotteTitle,
            adminNotes: adminNotes || null
          }
        }
      });

      console.log(`✅ Notification créée pour l'utilisateur ${userId}: ${title}`);
    } catch (error) {
      console.error('❌ Erreur lors de la création de la notification:', error);
      // Ne pas faire échouer la fonction principale si la notification échoue
    }
  }

  // Récupérer toutes les cagnottes avec pagination et filtres
  async getAllCagnottes(filters: CagnotteFilters) {
    try {
      const { page, limit, category, status } = filters;
      const skip = (page - 1) * limit;

      const where: any = {};
      
      if (category) {
        where.category = {
          name: category
        };
      }
      
      if (status) {
        where.status = status;
      }

      const [cagnottes, total] = await Promise.all([
        prisma.cagnotte.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            creator: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true
              }
            },
            category: true,
            _count: {
              select: {
                promises: true
              }
            }
          }
        }),
        prisma.cagnotte.count({ where })
      ]);

      return {
        cagnottes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Erreur récupération cagnottes:', error);
      throw new Error('Erreur lors de la récupération des cagnottes');
    }
  }

  // Récupérer une cagnotte par ID
  async getCagnotteById(id: string) {
    try {
      const cagnotte = await prisma.cagnotte.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true,
          promises: {
            include: {
              contributor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profilePicture: true
                }
              }
            },
            orderBy: {
              promisedAt: 'desc'
            }
          },
          _count: {
            select: {
              promises: true
            }
          }
        }
      });

      return cagnotte;
    } catch (error) {
      console.error('Erreur récupération cagnotte:', error);
      throw new Error('Erreur lors de la récupération de la cagnotte');
    }
  }

  // Mettre à jour une cagnotte
  async updateCagnotte(id: string, data: UpdateCagnotteData, userId: string) {
    try {
      console.log('🔧 Service updateCagnotte - ID:', id);
      console.log('🔧 Service updateCagnotte - Data:', data);
      console.log('🔧 Service updateCagnotte - UserID:', userId);
      
      // Vérifier que l'utilisateur est le créateur de la cagnotte
      const existingCagnotte = await prisma.cagnotte.findUnique({
        where: { id },
        select: { 
          creatorId: true,
          status: true,
          title: true
        }
      });

      if (!existingCagnotte) {
        return null;
      }

      if (existingCagnotte.creatorId !== userId) {
        throw new Error('Non autorisé à modifier cette cagnotte');
      }

      const oldStatus = existingCagnotte.status;

      const updateData: any = {};
      
      if (data.title) updateData.title = data.title;
      if (data.description) updateData.description = data.description;
      if (data.goalAmount) updateData.goalAmount = data.goalAmount;
      if (data.endDate) updateData.endDate = new Date(data.endDate);
      if (data.status) updateData.status = data.status;
      if (data.coverImage) updateData.coverImage = data.coverImage;
      if (data.coverVideo) updateData.coverVideo = data.coverVideo;
      if (data.mediaType) updateData.mediaType = data.mediaType;
      if (data.mediaFilename) updateData.mediaFilename = data.mediaFilename;
      if (data.currentStep !== undefined) updateData.currentStep = data.currentStep;
      
      // Gérer la catégorie si elle est fournie
      if (data.category) {
        // Si c'est un objet avec connect, l'utiliser directement
        if (data.category.connect) {
          updateData.category = data.category;
        } else {
          // Sinon, traiter comme une chaîne de caractères
          let category = await prisma.category.findFirst({
            where: { name: data.category }
          });

          if (!category) {
            category = await prisma.category.create({
              data: {
                name: data.category,
                description: `Catégorie pour ${data.category}`
              }
            });
          }

          updateData.categoryId = category.id;
        }
      }

      console.log('🔧 Données de mise à jour finales:', updateData);

      const cagnotte = await prisma.cagnotte.update({
        where: { id },
        data: updateData,
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        }
      });

      // 📧 Envoyer les emails si le statut a changé
      try {
        const newStatus = cagnotte.status;
        if (oldStatus !== newStatus) {
          console.log(`📧 Changement de statut détecté: ${oldStatus} → ${newStatus}`);
          
          // Si c'est un passage de DRAFT à PENDING, envoyer les emails de création
          if (oldStatus === 'DRAFT' && newStatus === 'PENDING') {
            await this.sendCagnotteCreationEmails(cagnotte);
          } else {
            // Sinon, envoyer l'email de changement de statut
            await this.sendCagnotteStatusChangeEmail(cagnotte.id, oldStatus, newStatus);
          }
        }
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi des emails de notification:', emailError);
        // Ne pas faire échouer la mise à jour si l'email échoue
      }

      return cagnotte;
    } catch (error) {
      console.error('Erreur mise à jour cagnotte:', error);
      throw new Error('Erreur lors de la mise à jour de la cagnotte');
    }
  }

  // Supprimer une cagnotte
  async deleteCagnotte(id: string, userId: string) {
    try {
      // Vérifier que l'utilisateur est le créateur de la cagnotte
      const existingCagnotte = await prisma.cagnotte.findUnique({
        where: { id },
        select: { creatorId: true }
      });

      if (!existingCagnotte) {
        return false;
      }

      if (existingCagnotte.creatorId !== userId) {
        throw new Error('Non autorisé à supprimer cette cagnotte');
      }

      await prisma.cagnotte.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      console.error('Erreur suppression cagnotte:', error);
      throw new Error('Erreur lors de la suppression de la cagnotte');
    }
  }

  // Récupérer les cagnottes d'un utilisateur
  async getUserCagnottes(userId: string, pagination: { page: number; limit: number }) {
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      const [cagnottes, total] = await Promise.all([
        prisma.cagnotte.findMany({
          where: { creatorId: userId },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            category: true,
            _count: {
              select: {
                promises: true
              }
            }
          }
        }),
        prisma.cagnotte.count({
          where: { creatorId: userId }
        })
      ]);

      return {
        cagnottes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Erreur récupération cagnottes utilisateur:', error);
      throw new Error('Erreur lors de la récupération des cagnottes');
    }
  }

  // Mettre à jour le montant actuel d'une cagnotte
  async updateCagnotteAmount(cagnotteId: string) {
    try {
      const promises = await prisma.promise.findMany({
        where: {
          cagnotteId,
          status: 'PAID'
        },
        select: {
          amount: true
        }
      });

      const currentAmount = promises.reduce((sum, promise) => sum + promise.amount, 0);

      await prisma.cagnotte.update({
        where: { id: cagnotteId },
        data: {
          currentAmount
        }
      });

      return currentAmount;
    } catch (error) {
      console.error('Erreur mise à jour montant cagnotte:', error);
      throw new Error('Erreur lors de la mise à jour du montant');
    }
  }

  // Vérifier et mettre à jour le statut des cagnottes expirées
  async checkExpiredCagnottes() {
    try {
      const expiredCagnottes = await prisma.cagnotte.findMany({
        where: {
          endDate: {
            lt: new Date()
          },
          status: 'ACTIVE'
        }
      });

      for (const cagnotte of expiredCagnottes) {
        await prisma.cagnotte.update({
          where: { id: cagnotte.id },
          data: {
            status: 'CLOSED'
          }
        });
      }

      return expiredCagnottes.length;
    } catch (error) {
      console.error('Erreur vérification cagnottes expirées:', error);
      throw new Error('Erreur lors de la vérification des cagnottes expirées');
    }
  }

  // Soumettre une cagnotte pour validation admin (DRAFT → PENDING)
  async submitCagnotte(cagnotteId: string, userId: string) {
    try {
      // Vérifier que l'utilisateur est le créateur de la cagnotte
      const existingCagnotte = await prisma.cagnotte.findUnique({
        where: { id: cagnotteId },
        select: { creatorId: true, status: true, title: true }
      });

      if (!existingCagnotte) {
        throw new Error('Cagnotte non trouvée');
      }

      if (existingCagnotte.creatorId !== userId) {
        throw new Error('Non autorisé à soumettre cette cagnotte');
      }

      if (existingCagnotte.status !== 'DRAFT') {
        throw new Error('Seules les cagnottes en brouillon peuvent être soumises');
      }

      const cagnotte = await prisma.cagnotte.update({
        where: { id: cagnotteId },
        data: {
          status: 'PENDING'
        },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        }
      });

      // TODO: Envoyer notification email à l'admin
      console.log(`📧 Cagnotte "${existingCagnotte.title}" soumise pour validation admin`);

      return cagnotte;
    } catch (error) {
      console.error('Erreur soumission cagnotte:', error);
      throw new Error('Erreur lors de la soumission de la cagnotte');
    }
  }

  // Approuver une cagnotte (PENDING → ACTIVE) - Admin seulement
  async approveCagnotte(cagnotteId: string, adminId: string) {
    try {
      const existingCagnotte = await prisma.cagnotte.findUnique({
        where: { id: cagnotteId },
        select: { status: true, title: true, creator: { select: { email: true, firstName: true } } }
      });

      if (!existingCagnotte) {
        throw new Error('Cagnotte non trouvée');
      }

      if (existingCagnotte.status !== 'PENDING') {
        throw new Error('Seules les cagnottes en attente peuvent être approuvées');
      }

      const cagnotte = await prisma.cagnotte.update({
        where: { id: cagnotteId },
        data: {
          status: 'ACTIVE'
        },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        }
      });

      // 📧 Envoyer notification email au créateur
      try {
        await this.sendCagnotteStatusChangeEmail(cagnotteId, 'PENDING', 'ACTIVE');
        console.log(`✅ Email d'approbation envoyé au créateur: ${cagnotte.creator.email}`);
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi de l\'email d\'approbation:', emailError);
      }
      
      console.log(`✅ Cagnotte "${existingCagnotte.title}" approuvée par l'admin`);

      return cagnotte;
    } catch (error) {
      console.error('Erreur approbation cagnotte:', error);
      throw new Error('Erreur lors de l\'approbation de la cagnotte');
    }
  }

  // Rejeter une cagnotte (PENDING → REJECTED) - Admin seulement
  async rejectCagnotte(cagnotteId: string, adminId: string, reason?: string) {
    try {
      const existingCagnotte = await prisma.cagnotte.findUnique({
        where: { id: cagnotteId },
        select: { status: true, title: true, creator: { select: { email: true, firstName: true } } }
      });

      if (!existingCagnotte) {
        throw new Error('Cagnotte non trouvée');
      }

      if (existingCagnotte.status !== 'PENDING') {
        throw new Error('Seules les cagnottes en attente peuvent être rejetées');
      }

      const cagnotte = await prisma.cagnotte.update({
        where: { id: cagnotteId },
        data: {
          status: 'REJECTED'
        },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        }
      });

      // 📧 Envoyer notification email au créateur avec la raison
      try {
        await this.sendCagnotteStatusChangeEmail(cagnotteId, 'PENDING', 'REJECTED', reason);
        console.log(`✅ Email de rejet envoyé au créateur: ${cagnotte.creator.email}`);
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi de l\'email de rejet:', emailError);
      }
      
      console.log(`❌ Cagnotte "${existingCagnotte.title}" rejetée par l'admin. Raison: ${reason || 'Non spécifiée'}`);

      return cagnotte;
    } catch (error) {
      console.error('Erreur rejet cagnotte:', error);
      throw new Error('Erreur lors du rejet de la cagnotte');
    }
  }

  // Récupérer les cagnottes en attente de validation (Admin)
  async getPendingCagnottes() {
    try {
      const cagnottes = await prisma.cagnotte.findMany({
        where: { status: 'PENDING' },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        },
        orderBy: { createdAt: 'asc' }
      });

      return cagnottes;
    } catch (error) {
      console.error('Erreur récupération cagnottes en attente:', error);
      throw new Error('Erreur lors de la récupération des cagnottes en attente');
    }
  }

  // 🔍 Rechercher des cagnottes avec filtres avancés
  async searchCagnottes(params: {
    query?: string;
    category?: string;
    status?: string;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: string;
    page: number;
    limit: number;
  }) {
    try {
      const { query, category, status, minAmount, maxAmount, sortBy, page, limit } = params;

      // Construction de la clause WHERE dynamique
      const where: any = {
        // Ne chercher que les cagnottes actives par défaut (sauf si status spécifié)
        status: status || 'ACTIVE',
      };

      // Recherche textuelle sur titre et description
      if (query && query.trim() !== '') {
        where.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ];
      }

      // Filtre par catégorie
      if (category && category !== 'all') {
        where.category = {
          name: category
        };
      }

      // Filtre par montant
      if (minAmount !== undefined || maxAmount !== undefined) {
        where.goalAmount = {};
        if (minAmount !== undefined) {
          where.goalAmount.gte = minAmount;
        }
        if (maxAmount !== undefined) {
          where.goalAmount.lte = maxAmount;
        }
      }

      // Construction du tri
      let orderBy: any = { createdAt: 'desc' }; // Par défaut: plus récentes

      switch (sortBy) {
        case 'recent':
          orderBy = { createdAt: 'desc' };
          break;
        case 'amount':
          orderBy = { currentAmount: 'desc' };
          break;
        case 'ending':
          orderBy = { endDate: 'asc' };
          break;
        case 'relevance':
        default:
          // Pour la pertinence, on garde l'ordre par date de création
          orderBy = { createdAt: 'desc' };
          break;
      }

      // Pagination
      const skip = (page - 1) * limit;

      // Exécution de la requête
      const [cagnottes, total] = await Promise.all([
        prisma.cagnotte.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true,
              }
            },
            beneficiary: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                description: true,
              }
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.cagnotte.count({ where }),
      ]);

      console.log(`✅ Recherche effectuée: ${cagnottes.length} résultats sur ${total} total`);

      return {
        cagnottes,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + cagnottes.length < total,
      };
    } catch (error) {
      console.error('❌ Erreur lors de la recherche de cagnottes:', error);
      throw new Error('Erreur lors de la recherche de cagnottes');
    }
  }
}

export default new CagnottesService();