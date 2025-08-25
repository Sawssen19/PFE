import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import des routes
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/auth/profile.routes';
import kycRoutes from './modules/kyc/kyc.routes';
import adminRoutes from './modules/admin/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API KOLLECTA - Serveur KYC/AML actif' });
});

// Gestion des erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur KOLLECTA démarré sur le port ${PORT}`);
  console.log(`📋 API KYC/AML disponible sur /api/kyc`);
});