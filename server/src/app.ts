import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/auth/profile.routes';
import accountRoutes from './modules/account/accountRoutes';

// Configuration des variables d'environnement
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques uploadés
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'API Kollecta fonctionne correctement' });
});

// Route de test directe
app.get('/api/test-direct', (req, res) => {
  res.json({ message: 'Route de test directe fonctionne!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/account', accountRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});