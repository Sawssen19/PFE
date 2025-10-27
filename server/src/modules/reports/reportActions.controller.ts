import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ReportNotificationService } from '../../services/reportNotificationService';
import { emailConfig } from '../../config/emailConfig';

const prisma = new PrismaClient();

// Fonction utilitaire pour trouver l'ID utilisateur à partir de l'email
async function getReporterIdByEmail(email: string): Promise<string | undefined> {
  try {
    const reporter = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });
    return reporter?.id;
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'utilisateur:', error);
    return undefined;
  }
}

// Schémas de validation pour les actions
const investigateReportSchema = z.object({
  adminNotes: z.string().optional(),
});

const resolveReportSchema = z.object({
  adminNotes: z.string().optional(),
  cagnotteAction: z.enum(['SUSPEND', 'DELETE', 'NONE']).optional(),
});

const rejectReportSchema = z.object({
  adminNotes: z.string().optional(),
});

const blockCagnotteSchema = z.object({
  adminNotes: z.string().optional(),
});

const deleteReportSchema = z.object({
  adminNotes: z.string().optional(),
});

/**
 * 🕒 Enquêter sur un signalement
 */
export const investigateReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNotes } = investigateReportSchema.parse(req.body);
    const adminId = (req as any).user?.id;

    // Récupérer le signalement avec les détails
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

    // Mettre à jour le statut
    const updatedReport = await prisma.cagnotteReport.update({
      where: { id },
      data: {
        status: 'UNDER_REVIEW',
        adminNotes: adminNotes || `Enquête lancée par l'admin`,
        adminId,
        updatedAt: new Date()
      },
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

    // Envoyer notification à l'utilisateur
    try {
      // Trouver l'ID de l'utilisateur à partir de l'email
      const reporter = await prisma.user.findUnique({
        where: { email: report.reporterEmail },
        select: { id: true }
      });

      await ReportNotificationService.sendReportResolutionEmail(
        report.reporterEmail,
        report.reporterName,
        report.cagnotte.title,
        report.id,
        'UNDER_REVIEW',
        adminNotes,
        reporter?.id // Ajout de l'ID utilisateur
      );
    } catch (error) {
      console.error('Erreur envoi notification utilisateur:', error);
    }

    res.json({
      success: true,
      message: 'Enquête lancée sur le signalement',
      data: updatedReport
    });

  } catch (error) {
    console.error('Erreur lors de l\'enquête:', error);
    
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

/**
 * ✔️ Résoudre un signalement
 */
export const resolveReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNotes, cagnotteAction = 'NONE' } = resolveReportSchema.parse(req.body);
    const adminId = (req as any).user?.id;

    // Récupérer le signalement
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
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Signalement non trouvé'
      });
    }

    // Mettre à jour le statut du signalement
    const updatedReport = await prisma.cagnotteReport.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        adminNotes: adminNotes || `Signalement résolu par l'admin`,
        adminId,
        updatedAt: new Date()
      }
    });

    // Action sur la cagnotte si nécessaire
    let cagnotteActionTaken = 'NONE';
    console.log('🔧 Action sur la cagnotte demandée:', cagnotteAction);
    console.log('🔧 ID de la cagnotte:', report.cagnotteId);
    
    if (cagnotteAction === 'SUSPEND') {
      // Suspendre la cagnotte
      console.log('🔧 Suspension de la cagnotte...');
      const updatedCagnotte = await prisma.cagnotte.update({
        where: { id: report.cagnotteId },
        data: { 
          status: 'SUSPENDED',
          updatedAt: new Date()
        }
      });
      console.log('✅ Cagnotte suspendue:', updatedCagnotte.status);
      cagnotteActionTaken = 'SUSPENDED';
    } else if (cagnotteAction === 'DELETE') {
      // Supprimer la cagnotte
      console.log('🔧 Suppression de la cagnotte...');
      await prisma.cagnotte.delete({
        where: { id: report.cagnotteId }
      });
      console.log('✅ Cagnotte supprimée');
      cagnotteActionTaken = 'DELETED';
    } else {
      console.log('ℹ️ Aucune action sur la cagnotte (NONE)');
    }

    // Envoyer notifications
    try {
      // Notification à l'utilisateur qui a signalé
      const reporterId = await getReporterIdByEmail(report.reporterEmail);
      await ReportNotificationService.sendReportResolutionEmail(
        report.reporterEmail,
        report.reporterName,
        report.cagnotte.title,
        report.id,
        'RESOLVED',
        adminNotes,
        reporterId
      );

      // Notification au créateur de la cagnotte si action prise
      if (cagnotteActionTaken !== 'NONE') {
        await ReportNotificationService.sendCagnotteActionEmail(
          report.cagnotte.creator.email,
          `${report.cagnotte.creator.firstName} ${report.cagnotte.creator.lastName}`,
          report.cagnotte.title,
          cagnotteActionTaken,
          adminNotes
        );
      }
    } catch (error) {
      console.error('Erreur envoi notifications:', error);
    }

    res.json({
      success: true,
      message: 'Signalement résolu',
      data: {
        ...updatedReport,
        cagnotteAction: cagnotteActionTaken
      }
    });

  } catch (error) {
    console.error('Erreur lors de la résolution:', error);
    
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

/**
 * ⚠️ Rejeter un signalement
 */
export const rejectReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNotes } = rejectReportSchema.parse(req.body);
    const adminId = (req as any).user?.id;

    // Récupérer le signalement
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
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Signalement non trouvé'
      });
    }

    // Mettre à jour le statut
    const updatedReport = await prisma.cagnotteReport.update({
      where: { id },
      data: {
        status: 'DISMISSED',
        adminNotes: adminNotes || `Signalement rejeté par l'admin`,
        adminId,
        updatedAt: new Date()
      }
    });

    // Envoyer notifications
    try {
      // Notification à l'utilisateur qui a signalé
      const reporterId = await getReporterIdByEmail(report.reporterEmail);
      await ReportNotificationService.sendReportResolutionEmail(
        report.reporterEmail,
        report.reporterName,
        report.cagnotte.title,
        report.id,
        'DISMISSED',
        adminNotes,
        reporterId
      );

      // Notification au créateur de la cagnotte (cagnotte approuvée)
      await ReportNotificationService.sendCagnotteActionEmail(
        report.cagnotte.creator.email,
        `${report.cagnotte.creator.firstName} ${report.cagnotte.creator.lastName}`,
        report.cagnotte.title,
        'APPROVED',
        'Votre cagnotte a été vérifiée et approuvée suite à un signalement non fondé'
      );
    } catch (error) {
      console.error('Erreur envoi notifications:', error);
    }

    res.json({
      success: true,
      message: 'Signalement rejeté',
      data: updatedReport
    });

  } catch (error) {
    console.error('Erreur lors du rejet:', error);
    
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

/**
 * 🚫 Bloquer l'élément (cagnotte)
 */
export const blockCagnotte = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNotes } = blockCagnotteSchema.parse(req.body);
    const adminId = (req as any).user?.id;

    // Récupérer le signalement
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
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Signalement non trouvé'
      });
    }

    // Mettre à jour le statut du signalement
    const updatedReport = await prisma.cagnotteReport.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        adminNotes: adminNotes || `Cagnotte bloquée par l'admin`,
        adminId,
        updatedAt: new Date()
      }
    });

    // Bloquer la cagnotte en la suspendant
    await prisma.cagnotte.update({
      where: { id: report.cagnotteId },
      data: { 
        status: 'SUSPENDED',
        updatedAt: new Date()
      }
    });

    // Envoyer notifications
    try {
      // Notification à l'utilisateur qui a signalé
      const reporterId = await getReporterIdByEmail(report.reporterEmail);
      await ReportNotificationService.sendReportResolutionEmail(
        report.reporterEmail,
        report.reporterName,
        report.cagnotte.title,
        report.id,
        'BLOCKED',
        adminNotes,
        reporterId
      );

      // Notification au créateur de la cagnotte
      await ReportNotificationService.sendCagnotteActionEmail(
        report.cagnotte.creator.email,
        `${report.cagnotte.creator.firstName} ${report.cagnotte.creator.lastName}`,
        report.cagnotte.title,
        'BLOCKED',
        adminNotes
      );
    } catch (error) {
      console.error('Erreur envoi notifications:', error);
    }

    res.json({
      success: true,
      message: 'Cagnotte bloquée',
      data: updatedReport
    });

  } catch (error) {
    console.error('Erreur lors du blocage:', error);
    
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

/**
 * 🔄 Réactiver une cagnotte suspendue
 */
export const reactivateCagnotte = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNotes } = z.object({
      adminNotes: z.string().optional(),
    }).parse(req.body);
    const adminId = (req as any).user?.id;

    // Récupérer le signalement
    const report = await prisma.cagnotteReport.findUnique({
      where: { id },
      include: {
        cagnotte: {
          select: {
            id: true,
            title: true,
            status: true,
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

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Signalement non trouvé'
      });
    }

    // Réactiver la cagnotte
    const updatedCagnotte = await prisma.cagnotte.update({
      where: { id: report.cagnotteId },
      data: { 
        status: 'ACTIVE',
        updatedAt: new Date()
      }
    });

    // Mettre à jour le signalement
    const updatedReport = await prisma.cagnotteReport.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        adminNotes: adminNotes || `Cagnotte réactivée par l'admin`,
        adminId,
        updatedAt: new Date()
      }
    });

    // Envoyer notifications
    try {
      // Notification au créateur de la cagnotte
      await ReportNotificationService.sendCagnotteActionEmail(
        report.cagnotte.creator.email,
        `${report.cagnotte.creator.firstName} ${report.cagnotte.creator.lastName}`,
        report.cagnotte.title,
        'REACTIVATED',
        adminNotes || 'Votre cagnotte a été réactivée'
      );
    } catch (error) {
      console.error('Erreur envoi notification:', error);
    }

    res.json({
      success: true,
      message: 'Cagnotte réactivée',
      data: {
        ...updatedReport,
        cagnotte: updatedCagnotte
      }
    });

  } catch (error) {
    console.error('Erreur lors de la réactivation:', error);
    
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

/**
 * 🗑️ Supprimer un signalement
 */
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNotes } = deleteReportSchema.parse(req.body);
    const adminId = (req as any).user?.id;

    // Récupérer le signalement avant suppression
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
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Signalement non trouvé'
      });
    }

    // Supprimer le signalement
    await prisma.cagnotteReport.delete({
      where: { id }
    });

    // Envoyer notification à l'utilisateur (signalement supprimé)
    try {
      const reporterId = await getReporterIdByEmail(report.reporterEmail);
      await ReportNotificationService.sendReportResolutionEmail(
        report.reporterEmail,
        report.reporterName,
        report.cagnotte.title,
        report.id,
        'DELETED',
        adminNotes || 'Signalement supprimé car non fondé',
        reporterId
      );
    } catch (error) {
      console.error('Erreur envoi notification:', error);
    }

    res.json({
      success: true,
      message: 'Signalement supprimé',
      data: { id }
    });

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    
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