import { Router } from 'express';
import { 
  createAccountRequest, 
  getAllAccountRequests, 
  getAccountRequest, 
  updateAccountRequestStatus 
} from './accountController';

const router = Router();

// Route de test temporaire
router.get('/test', (req, res) => {
  res.json({ message: 'Routes de compte chargées avec succès!' });
});

// Route pour créer une demande de suppression/désactivation (sans auth temporairement)
router.post('/request', createAccountRequest);

// Route pour récupérer toutes les demandes (admin) (sans auth temporairement)
router.get('/requests', getAllAccountRequests);

// Route pour récupérer une demande spécifique (sans auth temporairement)
router.get('/request/:id', getAccountRequest);

// Route pour mettre à jour le statut d'une demande (admin) (sans auth temporairement)
router.put('/request/:id/status', updateAccountRequestStatus);

export default router; 