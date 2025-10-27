import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ReportNotificationService } from '../../services/reportNotificationService';
import { emailConfig } from '../../config/emailConfig';

const prisma = new PrismaClient();

// Schémas de validation
const createReportSchema = z.object({
  cagnotteId: z.string().uuid(),
  reason: z.string().min(1, 'La raison est requise'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  reporterName: z.string().min(1, 'Le nom du signalant est requis'),
  reporterEmail: z.string().email('Email invalide'),
});

const updateReportStatusSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED']),
  adminNotes: z.string().optional(),
});

// Fonction pour analyser et déterminer le type et la priorité d'un signalement
function analyzeReport(reason: string, description: string): { type: string; priority: string } {
  const text = (reason + ' ' + description).toLowerCase();
  
  // Détection du type de signalement
  let type = 'OTHER';
  let priority = 'MEDIUM';
  
  // FRAUD - Arnaque ou fraude
  if (text.includes('arnaque') || text.includes('fraude') || text.includes('vol') || 
      text.includes('détournement') || text.includes('escroquerie') || text.includes('phishing')) {
    type = 'FRAUD';
    priority = 'HIGH';
  }
  // INAPPROPRIATE - Contenu inapproprié
  else if (text.includes('inapproprié') || text.includes('offensant') || text.includes('harcèlement') || 
           text.includes('propos') || text.includes('racisme') || text.includes('discrimination')) {
    type = 'INAPPROPRIATE';
    priority = 'HIGH';
  }
  // SPAM - Spam ou répétition
  else if (text.includes('spam') || text.includes('répétitif') || text.includes('multiples') || 
           text.includes('publicité') || text.includes('marketing')) {
    type = 'SPAM';
    priority = 'LOW';
  }
  // DUPLICATE - Duplication
  else if (text.includes('dupliqué') || text.includes('copie') || text.includes('identique') || 
           text.includes('déjà existant')) {
    type = 'DUPLICATE';
    priority = 'LOW';
  }
  // COMMENT - Problème de commentaire
  else if (text.includes('commentaire') || text.includes('post') || text.includes('message')) {
    type = 'COMMENT';
    priority = 'MEDIUM';
  }
  
  // Ajustement de la priorité basé sur des mots-clés critiques
  if (text.includes('urgent') || text.includes('grave') || text.includes('danger')) {
    priority = 'URGENT';
  } else if (text.includes('important') || text.includes('sérieux')) {
    priority = 'HIGH';
  } else if (text.includes('mineur') || text.includes('léger')) {
    priority = 'LOW';
  }
  
  return { type, priority };
}

// Extraire les mots-clés pertinents du texte
function extractKeywords(text: string): string[] {
  const keywords = [];
  const lowerText = text.toLowerCase();
  
  const keywordMap = {
    'arnaque': ['arnaque', 'fraude', 'vol', 'détournement', 'escroquerie', 'phishing'],
    'inapproprié': ['inapproprié', 'offensant', 'harcèlement', 'racisme', 'discrimination'],
    'spam': ['spam', 'répétitif', 'multiples', 'publicité', 'marketing'],
    'dupliqué': ['dupliqué', 'copie', 'identique', 'déjà existant'],
    'commentaire': ['commentaire', 'post', 'message'],
    'urgent': ['urgent', 'grave', 'danger'],
    'important': ['important', 'sérieux'],
    'mineur': ['mineur', 'léger']
  };
  
  for (const [category, words] of Object.entries(keywordMap)) {
    for (const word of words) {
      if (lowerText.includes(word)) {
        keywords.push(word);
      }
    }
  }
  
  return Array.from(new Set(keywords)); // Supprimer les doublons
}

// Calculer la confiance de l'analyse
function calculateConfidence(text: string, type: string, priority: string): number {
  let confidence = 0.5; // Base de confiance
  
  const lowerText = text.toLowerCase();
  
  // Augmenter la confiance selon le nombre de mots-clés trouvés
  const keywordCount = extractKeywords(text).length;
  confidence += Math.min(keywordCount * 0.1, 0.4);
  
  // Augmenter la confiance pour les types spécifiques
  if (type === 'FRAUD' && (lowerText.includes('arnaque') || lowerText.includes('fraude'))) {
    confidence += 0.2;
  }
  
  if (type === 'INAPPROPRIATE' && (lowerText.includes('offensant') || lowerText.includes('harcèlement'))) {
    confidence += 0.2;
  }
  
  // Augmenter la confiance pour les priorités élevées
  if (priority === 'URGENT' && (lowerText.includes('urgent') || lowerText.includes('grave'))) {
    confidence += 0.1;
  }
  
  return Math.min(Math.max(confidence, 0.1), 1.0); // Entre 0.1 et 1.0
}

// Créer un signalement
export const createReport = async (req: Request, res: Response) => {
  try {
    const { cagnotteId, reason, description, reporterName, reporterEmail } = createReportSchema.parse(req.body);

    // Vérifier que la cagnotte existe et récupérer plus d'informations
    const cagnotte = await prisma.cagnotte.findUnique({
      where: { id: cagnotteId },
      select: { 
        id: true, 
        title: true, 
        status: true,
        creatorId: true,
        creator: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    if (!cagnotte) {
      return res.status(404).json({
        success: false,
        message: 'Cagnotte non trouvée'
      });
    }

    // Vérifier que la cagnotte est active
    if (cagnotte.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Seules les cagnottes actives peuvent être signalées'
      });
    }

    // Vérifier que l'utilisateur ne signale pas sa propre cagnotte
    if (cagnotte.creator.email === reporterEmail) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas signaler votre propre cagnotte'
      });
    }

    // Analyser le signalement pour déterminer le type et la priorité
    const { type, priority } = analyzeReport(reason, description);
    
    console.log(`🔍 Signalement analysé - Type: ${type}, Priorité: ${priority}`);

    // Créer les métadonnées d'analyse
    const analysisMetadata = {
      type,
      priority,
      analyzedAt: new Date().toISOString(),
      keywords: extractKeywords(reason + ' ' + description),
      confidence: calculateConfidence(reason + ' ' + description, type, priority)
    };

    // Créer le signalement avec l'analyse dans adminNotes
    const report = await prisma.cagnotteReport.create({
      data: {
        cagnotteId,
        reason,
        description,
        reporterName,
        reporterEmail,
        adminNotes: JSON.stringify(analysisMetadata), // Stocker l'analyse dans adminNotes
      },
      include: {
        cagnotte: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    });

    // Envoyer les notifications
    try {
      // Trouver l'ID de l'utilisateur à partir de l'email
      const reporter = await prisma.user.findUnique({
        where: { email: reporterEmail },
        select: { id: true }
      });

      // Notification de confirmation à l'utilisateur
      await ReportNotificationService.sendReportConfirmationEmail(
        reporterEmail,
        reporterName,
        cagnotte.title,
        report.id,
        reporter?.id // Ajout de l'ID utilisateur
      );

      // Notification d'alerte à l'admin
      await ReportNotificationService.sendAdminAlertEmail(
        emailConfig.ADMIN_EMAIL,
        report.id,
        reporterName,
        cagnotte.title,
        type,
        priority
      );

      console.log('✅ Notifications envoyées pour le signalement:', report.id);
    } catch (error) {
      console.error('❌ Erreur envoi notifications:', error);
      // Ne pas faire échouer la création du signalement si les notifications échouent
    }

    res.status(201).json({
      success: true,
      message: 'Signalement créé avec succès',
      data: {
        ...report,
        analysis: analysisMetadata // Inclure l'analyse dans la réponse
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création du signalement:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.issues
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Récupérer tous les signalements (admin)
export const getAllReports = async (req: Request, res: Response) => {
  try {
  const { 
    page = '1', 
    limit = '10', 
    status, 
    search 
  } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construire les filtres
    const where: any = {};
    
    if (status && status !== 'ALL') {
      where.status = status;
    }
    
    
    if (search) {
      where.OR = [
        { reason: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { reporterName: { contains: search as string, mode: 'insensitive' } },
        { reporterEmail: { contains: search as string, mode: 'insensitive' } },
        { cagnotte: { title: { contains: search as string, mode: 'insensitive' } } }
      ];
    }

    // Récupérer les signalements avec pagination
    const [reports, total] = await Promise.all([
      prisma.cagnotteReport.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          cagnotte: {
            select: {
              id: true,
              title: true,
              description: true,
              creator: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          admin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      prisma.cagnotteReport.count({ where })
    ]);

    // Analyser les signalements qui n'ont pas de métadonnées d'analyse
    const reportsWithAnalysis = await Promise.all(
      reports.map(async (report) => {
        let analysis = null;
        
        // Vérifier si le signalement a déjà des métadonnées d'analyse
        if (report.adminNotes) {
          try {
            analysis = JSON.parse(report.adminNotes);
          } catch (e) {
            // Si adminNotes n'est pas du JSON valide, analyser le signalement
            analysis = null;
          }
        }
        
        // Si pas d'analyse, analyser le signalement
        if (!analysis || !analysis.type || !analysis.priority) {
          const { type, priority } = analyzeReport(report.reason, report.description);
          
          analysis = {
            type,
            priority,
            analyzedAt: new Date().toISOString(),
            keywords: extractKeywords(report.reason + ' ' + report.description),
            confidence: calculateConfidence(report.reason + ' ' + report.description, type, priority)
          };
          
          // Mettre à jour la base de données avec l'analyse
          await prisma.cagnotteReport.update({
            where: { id: report.id },
            data: { adminNotes: JSON.stringify(analysis) }
          });
        }
        
        return {
          ...report,
          analysis
        };
      })
    );

    // Calculer les statistiques
    const stats = await prisma.cagnotteReport.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        reports: reportsWithAnalysis,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        stats: {
          total,
          pending: statusCounts.PENDING || 0,
          underReview: statusCounts.UNDER_REVIEW || 0,
          resolved: statusCounts.RESOLVED || 0,
          dismissed: statusCounts.DISMISSED || 0
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des signalements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Récupérer un signalement par ID
export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const report = await prisma.cagnotteReport.findUnique({
      where: { id },
      include: {
        cagnotte: {
          select: {
            id: true,
            title: true,
            description: true,
            creator: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Signalement non trouvé'
      });
    }

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du signalement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Mettre à jour le statut d'un signalement (admin)
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = updateReportStatusSchema.parse(req.body);
    const adminId = (req as any).user?.id;

    const report = await prisma.cagnotteReport.update({
      where: { id },
      data: {
        status,
        adminNotes,
        adminId,
        updatedAt: new Date()
      },
      include: {
        cagnotte: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Statut du signalement mis à jour',
      data: report
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du signalement:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.issues
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Supprimer un signalement (admin)
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.cagnotteReport.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Signalement supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du signalement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};