import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './modules/auth/routes/auth.routes';

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Gestion des erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Une erreur est survenue sur le serveur',
  });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\x1b[32m%s\x1b[0m', '🚀 Server is running on port ' + PORT);
  console.log('\x1b[36m%s\x1b[0m', '📱 Frontend: http://localhost:3000');
  console.log('\x1b[33m%s\x1b[0m', '🔑 API: http://localhost:' + PORT + '/api');
});