import { Request, Response } from 'express';
import { geminiService } from '../../services/geminiService';

// 🤖 Contrôleur pour les fonctionnalités d'IA
export class AIController {
  /**
   * Génère une histoire de cagnotte avec l'IA Gemini
   * POST /api/ai/generate-story
   * Body: { title: string, category?: string }
   */
  async generateStory(req: Request, res: Response) {
    try {
      const { title, category } = req.body;

      console.log('📥 Requête reçue pour génération d\'histoire:');
      console.log('   Body:', req.body);
      console.log('   Title:', title);
      console.log('   Category:', category);

      // Validation
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        console.log('❌ Validation échouée: titre manquant');
        return res.status(400).json({
          success: false,
          message: 'Le titre est requis pour générer une histoire'
        });
      }

      if (title.trim().length < 5) {
        console.log('❌ Validation échouée: titre trop court');
        return res.status(400).json({
          success: false,
          message: 'Le titre doit contenir au moins 5 caractères'
        });
      }

      // Génération avec Gemini
      console.log(`🤖 Génération d'histoire IA pour: "${title}" (catégorie: ${category || 'non spécifiée'})`);
      const story = await geminiService.generateStory(title.trim(), category);
      console.log('✅ Histoire générée avec succès, longueur:', story.length);

      return res.status(200).json({
        success: true,
        message: 'Histoire générée avec succès',
        data: {
          story,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error('❌ Erreur lors de la génération d\'histoire:');
      console.error('   Type:', error?.constructor?.name);
      console.error('   Message:', error?.message);
      console.error('   Stack:', error?.stack);
      
      // Message d'erreur plus détaillé pour le client
      const errorMessage = error?.message || 'Erreur inconnue';
      const isApiKeyError = errorMessage.includes('API_KEY') || errorMessage.includes('GEMINI') || errorMessage.includes('clé API');
      const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('limit');
      
      return res.status(500).json({
        success: false,
        message: isApiKeyError 
          ? 'Clé API Gemini non configurée ou invalide. Veuillez contacter l\'administrateur.'
          : isQuotaError
          ? 'Quota API Gemini dépassé. Veuillez réessayer plus tard.'
          : 'Erreur lors de la génération de l\'histoire',
        error: errorMessage
      });
    }
  }

  /**
   * Améliore une histoire existante
   * POST /api/ai/improve-story
   * Body: { currentStory: string, feedback: string }
   */
  async improveStory(req: Request, res: Response) {
    try {
      const { currentStory, feedback } = req.body;

      // Validation
      if (!currentStory || typeof currentStory !== 'string' || currentStory.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'L\'histoire actuelle est requise'
        });
      }

      if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Les instructions d\'amélioration sont requises'
        });
      }

      // Amélioration avec Gemini
      console.log(`🤖 Amélioration d'histoire IA`);
      const improvedStory = await geminiService.improveStory(
        currentStory.trim(), 
        feedback.trim()
      );

      return res.status(200).json({
        success: true,
        message: 'Histoire améliorée avec succès',
        data: {
          story: improvedStory,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'amélioration d\'histoire:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'amélioration de l\'histoire',
        error: error.message || 'Erreur inconnue'
      });
    }
  }

  /**
   * Teste la connexion à l'API Gemini
   * GET /api/ai/test
   */
  async testConnection(req: Request, res: Response) {
    try {
      const testStory = await geminiService.generateStory(
        'Aide pour mon projet',
        'Autre'
      );

      return res.status(200).json({
        success: true,
        message: 'Connexion à Gemini AI fonctionnelle',
        data: {
          test: testStory,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erreur de connexion à Gemini AI',
        error: error.message
      });
    }
  }
}

// Export d'une instance
export const aiController = new AIController();











