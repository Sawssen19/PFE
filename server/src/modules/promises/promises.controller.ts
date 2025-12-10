import { Request, Response } from 'express';
import promisesService from './promises.service';

export class PromisesController {
  private promisesService = promisesService;

  /**
   * Créer une nouvelle promesse de don
   * POST /api/promises
   */
  async createPromise(req: Request, res: Response) {
    try {
      const { cagnotteId, amount, message, isAnonymous } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Vous devez être connecté pour faire une promesse de don'
        });
      }

      if (!cagnotteId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Les champs cagnotteId et amount sont requis'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Le montant doit être supérieur à 0'
        });
      }

      const promise = await this.promisesService.createPromise({
        cagnotteId,
        contributorId: userId,
        amount: parseFloat(amount),
        message,
        isAnonymous: isAnonymous ?? false
      });

      res.status(201).json({
        success: true,
        data: promise,
        message: 'Promesse de don créée avec succès'
      });
    } catch (error) {
      console.error('Erreur création promesse:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la création de la promesse'
      });
    }
  }

  /**
   * Récupérer une promesse par ID
   * GET /api/promises/:id
   */
  async getPromiseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const promise = await this.promisesService.getPromiseById(id);

      res.status(200).json({
        success: true,
        data: promise,
        message: 'Promesse récupérée avec succès'
      });
    } catch (error) {
      console.error('Erreur récupération promesse:', error);
      const statusCode = error instanceof Error && error.message === 'Promesse non trouvée' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération de la promesse'
      });
    }
  }

  /**
   * Récupérer les promesses d'une cagnotte
   * GET /api/promises/cagnotte/:cagnotteId
   */
  async getCagnottePromises(req: Request, res: Response) {
    try {
      const { cagnotteId } = req.params;
      const { status, page, limit } = req.query;

      const result = await this.promisesService.getCagnottePromises(cagnotteId, {
        status: status as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Promesses récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur récupération promesses cagnotte:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des promesses'
      });
    }
  }

  /**
   * Récupérer les promesses de l'utilisateur connecté
   * GET /api/promises/user/my-promises
   */
  async getUserPromises(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { status, page, limit } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const result = await this.promisesService.getUserPromises(userId, {
        status: status as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Promesses récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur récupération promesses utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des promesses'
      });
    }
  }

  /**
   * Modifier une promesse (montant, message, isAnonymous)
   * PUT /api/promises/:id
   */
  async updatePromise(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount, message, isAnonymous } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      // Vérifier qu'au moins un champ est fourni
      if (amount === undefined && message === undefined && isAnonymous === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Au moins un champ (amount, message, isAnonymous) doit être fourni'
        });
      }

      const promise = await this.promisesService.updatePromise(id, {
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        message,
        isAnonymous
      }, userId);

      res.status(200).json({
        success: true,
        data: promise,
        message: 'Promesse modifiée avec succès'
      });
    } catch (error) {
      console.error('Erreur modification promesse:', error);
      const statusCode = error instanceof Error && 
        (error.message === 'Promesse non trouvée' || 
         error.message.includes('ne pouvez') ||
         error.message.includes('en attente')) ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la modification de la promesse'
      });
    }
  }

  /**
   * Mettre à jour le statut d'une promesse
   * PUT /api/promises/:id/status
   * LOGIQUE : L'utilisateur peut marquer sa propre promesse comme "payée" quand il honore son engagement
   */
  async updatePromiseStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      if (!status || !['PENDING', 'PAID', 'CANCELLED'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Le statut doit être PENDING, PAID ou CANCELLED'
        });
      }

      const promise = await this.promisesService.updatePromiseStatus(id, {
        status: status as 'PENDING' | 'PAID' | 'CANCELLED',
        adminNotes
      }, userId);

      let message = 'Statut de la promesse mis à jour avec succès';
      if (status === 'PAID') {
        message = 'Votre promesse a été marquée comme honorée. Merci pour votre générosité !';
      } else if (status === 'CANCELLED') {
        message = 'La promesse a été annulée';
      }

      res.status(200).json({
        success: true,
        data: promise,
        message
      });
    } catch (error) {
      console.error('Erreur mise à jour statut promesse:', error);
      const statusCode = error instanceof Error && 
        (error.message === 'Promesse non trouvée' || 
         error.message.includes('ne pouvez')) ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du statut'
      });
    }
  }

  /**
   * Supprimer une promesse
   * DELETE /api/promises/:id
   */
  async deletePromise(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      await this.promisesService.deletePromise(id, userId);

      res.status(200).json({
        success: true,
        message: 'Promesse supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur suppression promesse:', error);
      const statusCode = error instanceof Error && 
        (error.message.includes('non trouvée') || 
         error.message.includes('non autorisé') || 
         error.message.includes('en attente')) ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la suppression de la promesse'
      });
    }
  }

  /**
   * Obtenir les statistiques des promesses
   * GET /api/promises/stats
   */
  async getPromiseStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { cagnotteId } = req.query;

      // Si userId n'est pas fourni, on peut le récupérer du token (pour les stats personnelles)
      // Sinon, stats globales ou pour une cagnotte spécifique
      const stats = await this.promisesService.getPromiseStats(
        userId,
        cagnotteId as string
      );

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Statistiques récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur récupération statistiques promesses:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      });
    }
  }
}

export default new PromisesController();

