import { Router } from 'express';
import { LocalKYCController } from './localKYC.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configuration Multer pour l'upload des documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kyc/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `kyc-${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers JPEG, PNG et PDF sont autorisés'));
    }
  }
});

// Routes publiques (pour les tests)
router.get('/test', LocalKYCController.testConnection);

// Routes protégées (nécessitent une authentification)
router.use(authMiddleware);

// Initier une vérification KYC
router.post('/verify', 
  upload.fields([
    { name: 'documentFront', maxCount: 1 },
    { name: 'documentBack', maxCount: 1 }
  ]),
  LocalKYCController.initiateVerification
);

// Récupérer le statut KYC
router.get('/status', LocalKYCController.getKYCStatus);

// Mettre à jour les informations KYC
router.put('/update', LocalKYCController.updateKYCInfo);

export default router; 