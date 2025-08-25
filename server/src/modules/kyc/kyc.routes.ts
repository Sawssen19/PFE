import { Router } from 'express';
import { KYCController } from './kyc.controller';
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

// ===== ROUTES PUBLIQUES (pour les tests) =====
router.get('/test', (req, res) => {
  res.json({
    message: 'Service KYC opérationnel',
    status: 'OK',
    endpoints: {
      public: ['/test'],
      protected: ['/verify', '/status', '/update', '/local/verify', '/local/status', '/local/update']
    },
    note: 'Ce service combine KYC Jumio et KYC Local'
  });
});

// ===== ROUTES KYC LOCAL (recommandées) =====
router.get('/local/test', LocalKYCController.testConnection);

// ===== ROUTES PROTÉGÉES =====
router.use(authMiddleware);

// Routes KYC Local (sans API externe)
router.post('/local/verify', 
  upload.fields([
    { name: 'documentFront', maxCount: 1 },
    { name: 'documentBack', maxCount: 1 }
  ]),
  LocalKYCController.initiateVerification
);

router.get('/local/status', LocalKYCController.getKYCStatus);
router.put('/local/update', LocalKYCController.updateKYCInfo);

// Routes KYC Jumio (anciennes - optionnelles)
router.post('/verify', 
  upload.fields([
    { name: 'documentFront', maxCount: 1 },
    { name: 'documentBack', maxCount: 1 }
  ]),
  KYCController.initiateVerification
);

router.get('/status', KYCController.getKYCStatus);

export default router; 