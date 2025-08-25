import { Request, Response } from 'express';
import { LocalKYCService } from '../../services/localKYCService';
import { authMiddleware } from '../../middleware/auth.middleware';

export class LocalKYCController {
  /**
   * Initie une vérification KYC locale
   * POST /api/kyc/local/verify
   */
  static async initiateVerification(req: Request, res: Response) {
    try {
      console.log('🔍 DEBUG - Données reçues:');
      console.log('   Body:', req.body);
      console.log('   Files:', req.files);
      console.log('   User:', req.user);
      
      const { documentType } = req.body;
      const userId = req.user?.id;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!userId) {
        console.log('❌ Utilisateur non authentifié');
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      if (!documentType) {
        console.log('❌ Type de document manquant:', documentType);
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

      console.log('🚀 Début de la vérification KYC locale...');
      console.log('📋 Type de document:', documentType);
      console.log('📁 Fichiers reçus:', { documentFrontUrl, documentBackUrl });

      const result = await LocalKYCService.initiateVerification({
        userId,
        documentType,
        documentFrontUrl,
        documentBackUrl,
      });

      if (result.success) {
        console.log('✅ Vérification KYC locale terminée avec succès');
        res.status(200).json({
          message: 'Vérification KYC locale terminée avec succès',
          verificationId: result.verificationId,
          note: 'Cette vérification a été effectuée localement sans API externe',
        });
      } else {
        console.log('❌ Échec de la vérification KYC locale:', result.error);
        res.status(400).json({
          message: 'Échec de la vérification KYC locale',
          error: result.error,
        });
      }

    } catch (error) {
      console.error('Erreur dans initiateVerification locale:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  /**
   * Récupère le statut KYC d'un utilisateur
   * GET /api/kyc/local/status
   */
  static async getKYCStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      const kycStatus = await LocalKYCService.getUserKYCStatus(userId);

      if (!kycStatus) {
        return res.status(404).json({ message: 'Aucun statut KYC trouvé' });
      }

      res.status(200).json({
        message: 'Statut KYC récupéré avec succès',
        data: kycStatus,
        note: 'Vérification effectuée localement',
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
   * Met à jour les informations KYC d'un utilisateur
   * PUT /api/kyc/local/update
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

      const updatedKYC = await LocalKYCService.updateKYCInfo(userId, updates);

      res.status(200).json({
        message: 'Informations KYC mises à jour avec succès',
        data: updatedKYC,
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
   * Test de la connexion KYC locale
   * GET /api/kyc/local/test
   */
  static async testConnection(req: Request, res: Response) {
    try {
      res.status(200).json({
        message: 'Service KYC local opérationnel',
        status: 'OK',
        features: [
          'Validation de documents',
          'Calcul de score de risque',
          'Vérification AML locale',
          'Audit et logs',
          'Pas de dépendance API externe'
        ],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erreur dans testConnection:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }
} 