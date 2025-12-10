import { Router } from 'express';
import { aiController } from './ai.controller';

const router = Router();

/**
 * @route   POST /api/ai/generate-story
 * @desc    Génère une histoire de cagnotte avec l'IA
 * @access  Public
 */
router.post('/generate-story', (req, res) => aiController.generateStory(req, res));

/**
 * @route   POST /api/ai/improve-story
 * @desc    Améliore une histoire existante avec l'IA
 * @access  Public
 */
router.post('/improve-story', (req, res) => aiController.improveStory(req, res));

/**
 * @route   GET /api/ai/test
 * @desc    Teste la connexion à l'API Gemini
 * @access  Public
 */
router.get('/test', (req, res) => aiController.testConnection(req, res));

export default router;











