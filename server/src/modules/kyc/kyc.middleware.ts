import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kyc/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `kyc-${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filtre des types de fichiers acceptés
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Utilisez JPEG, PNG ou WebP.'));
  }
};

// Configuration de multer
export const uploadKYC = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 2, // Max 2 fichiers (recto + verso)
  }
});

// Middleware de validation des documents KYC
export const validateKYCDocuments = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentType } = req.body;

    if (!documentType) {
      return res.status(400).json({
        message: 'Type de document requis',
        error: 'DOCUMENT_TYPE_REQUIRED'
      });
    }

    if (!['CARTE_IDENTITE', 'PASSEPORT'].includes(documentType)) {
      return res.status(400).json({
        message: 'Type de document non supporté',
        error: 'INVALID_DOCUMENT_TYPE',
        supportedTypes: ['CARTE_IDENTITE', 'PASSEPORT']
      });
    }

    // Vérifier que les fichiers sont présents
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: 'Aucun document fourni',
        error: 'NO_DOCUMENTS_PROVIDED'
      });
    }

    // Vérifier le recto (obligatoire)
    if (!req.files || !(req.files as any)['documentFront']) {
      return res.status(400).json({
        message: 'Document recto requis',
        error: 'FRONT_DOCUMENT_REQUIRED'
      });
    }

    // Vérifier le verso pour la carte d'identité
    if (documentType === 'CARTE_IDENTITE' && (!req.files || !(req.files as any)['documentBack'])) {
      return res.status(400).json({
        message: 'Document verso requis pour la carte d\'identité',
        error: 'BACK_DOCUMENT_REQUIRED_FOR_ID'
      });
    }

    next();
  } catch (error) {
    console.error('Erreur de validation KYC:', error);
    res.status(500).json({
      message: 'Erreur de validation des documents',
      error: 'VALIDATION_ERROR'
    });
  }
};

// Middleware de vérification du statut KYC
export const checkKYCStatus = (requiredStatus: string[] = ['VERIFIED']) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      // Récupérer le statut KYC de l'utilisateur
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const kycRecord = await prisma.kYCVerification.findUnique({
        where: { userId }
      });

      if (!kycRecord) {
        return res.status(403).json({
          message: 'Vérification KYC requise',
          error: 'KYC_REQUIRED'
        });
      }

      if (!requiredStatus.includes(kycRecord.verificationStatus)) {
        return res.status(403).json({
          message: `Statut KYC requis: ${requiredStatus.join(' ou ')}`,
          error: 'INSUFFICIENT_KYC_STATUS',
          currentStatus: kycRecord.verificationStatus,
          requiredStatus
        });
      }

      next();
    } catch (error) {
      console.error('Erreur de vérification du statut KYC:', error);
      res.status(500).json({
        message: 'Erreur de vérification du statut KYC',
        error: 'KYC_STATUS_CHECK_ERROR'
      });
    }
  };
};

// Middleware de vérification du score de risque
export const checkRiskScore = (maxRiskScore: number = 70) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const kycRecord = await prisma.kYCVerification.findUnique({
        where: { userId }
      });

      if (kycRecord && kycRecord.riskScore > maxRiskScore) {
        return res.status(403).json({
          message: 'Score de risque trop élevé',
          error: 'RISK_SCORE_TOO_HIGH',
          currentRiskScore: kycRecord.riskScore,
          maxAllowedRiskScore: maxRiskScore
        });
      }

      next();
    } catch (error) {
      console.error('Erreur de vérification du score de risque:', error);
      res.status(500).json({
        message: 'Erreur de vérification du score de risque',
        error: 'RISK_SCORE_CHECK_ERROR'
      });
    }
  };
}; 