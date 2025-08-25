import { Request, Response } from 'express';
import { KYCService } from '../../services/kycService';
import { authMiddleware } from '../../middleware/auth.middleware';

export class KYCController {
  /**
   * Initie une vérification KYC
   * POST /api/kyc/verify
   */
  static async initiateVerification(req: Request, res: Response) {
    try {
      const { documentType } = req.body;
      const userId = req.user?.id;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      if (!documentType) {
        return res.status(400).json({ 
          message: 'Type de document requis' 
        });
      }

      if (!['CARTE_IDENTITE', 'PASSEPORT'].includes(documentType)) {
        return res.status(400).json({ 
          message: 'Type de document non supporté. Utilisez CARTE_IDENTITE ou PASSEPORT' 
        });
      }

      // Extraire les URLs des fichiers
      const documentFrontUrl = files['documentFront']?.[0]?.path;
      const documentBackUrl = files['documentBack']?.[0]?.path;

      if (!documentFrontUrl) {
        return res.status(400).json({ 
          message: 'Document recto requis' 
        });
      }

      // Vérifier le verso pour la carte d'identité
      if (documentType === 'CARTE_IDENTITE' && !documentBackUrl) {
        return res.status(400).json({ 
          message: 'Document verso requis pour la carte d\'identité' 
        });
      }

      const result = await KYCService.initiateVerification({
        userId,
        documentType,
        documentFrontUrl,
        documentBackUrl,
      });

      if (result.success) {
        res.status(200).json({
          message: 'Vérification KYC initiée avec succès',
          verificationId: result.verificationId,
          jumioReference: result.jumioReference,
        });
      } else {
        res.status(400).json({
          message: 'Échec de l\'initiation KYC',
          error: result.error,
        });
      }

    } catch (error) {
      console.error('Erreur dans initiateVerification:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  /**
   * Récupère le statut KYC d'un utilisateur
   * GET /api/kyc/status
   */
  static async getKYCStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      const kycStatus = await KYCService.getUserKYCStatus(userId);

      if (!kycStatus) {
        return res.status(404).json({ message: 'Aucun statut KYC trouvé' });
      }

      res.status(200).json({
        message: 'Statut KYC récupéré avec succès',
        data: kycStatus,
      });

    } catch (error) {
      console.error('Erreur dans getKYCStatus:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  /**
   * Met à jour les informations KYC
   * PUT /api/kyc/update
   */
  static async updateKYCInfo(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Aucune mise à jour fournie' });
      }

      const updated = await KYCService.updateKYCInfo(userId, updates);

      res.status(200).json({
        message: 'Informations KYC mises à jour avec succès',
        data: updated,
      });

    } catch (error) {
      console.error('Erreur dans updateKYCInfo:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  /**
   * Webhook pour Jumio
   * POST /api/kyc/webhook
   */
  static async handleWebhook(req: Request, res: Response) {
    try {
      // Vérifier la signature du webhook (optionnel mais recommandé)
      const signature = req.headers['x-jumio-signature'];
      
      // Traiter le webhook
      await KYCService.processWebhook(req.body);

      res.status(200).json({ message: 'Webhook traité avec succès' });

    } catch (error) {
      console.error('Erreur dans le webhook KYC:', error);
      res.status(500).json({
        message: 'Erreur lors du traitement du webhook',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  /**
   * Récupère l'historique des vérifications KYC (Admin seulement)
   * GET /api/kyc/history
   */
  static async getKYCHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 10 } = req.query;

      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      // Vérifier que l'utilisateur est admin
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const offset = (Number(page) - 1) * Number(limit);

      // Récupérer l'historique des logs KYC
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const logs = await prisma.kYCAuditLog.findMany({
        take: Number(limit),
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          admin: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        }
      });

      const total = await prisma.kYCAuditLog.count();

      res.status(200).json({
        message: 'Historique KYC récupéré avec succès',
        data: {
          logs,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          }
        }
      });

    } catch (error) {
      console.error('Erreur dans getKYCHistory:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }
} 