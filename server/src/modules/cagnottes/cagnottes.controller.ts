import { Request, Response } from 'express';
import cagnottesService from './cagnottes.service';

export class CagnottesController {
  private cagnottesService = cagnottesService;

  // Créer une nouvelle cagnotte
  async createCagnotte(req: Request, res: Response) {
    try {
      const { 
        title, 
        story, 
        description,
        goalAmount, 
        targetAmount,
        endDate,
        currency, 
        category, 
        country, 
        postalCode, 
        beneficiaryType,
        status,
        coverImage: coverImageFromBody,
        imageUrl
      } = req.body;
      
      const userId = (req as any).user?.id; // Récupéré du middleware d'auth

      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      // 🔐 Vérifier que le compte est validé avant de permettre la création
      const userValidation = await this.cagnottesService.validateUserAccount(userId);
      
      if (!userValidation.isValid) {
        return res.status(403).json({
          success: false,
          message: userValidation.message,
          code: 'ACCOUNT_NOT_VALIDATED',
          details: userValidation.details
        });
      }

      // Gérer l'upload de média si présent
      let coverImage: string | undefined = undefined;
      let coverVideo: string | undefined = undefined;
      let mediaType: string | undefined = undefined;
      let mediaFilename: string | undefined = undefined;

      if (req.file) {
        const file = req.file;
        mediaFilename = file.filename;
        
        if (file.mimetype.startsWith('image/')) {
          coverImage = `/uploads/cagnottes/${file.filename}`;
          mediaType = 'image';
        } else if (file.mimetype.startsWith('video/')) {
          coverVideo = `/uploads/cagnottes/${file.filename}`;
          mediaType = 'video';
        }
      }

      // Calculer la date de fin (par défaut 30 jours) si pas fournie
      const finalEndDate = endDate ? new Date(endDate) : (() => {
        const defaultEndDate = new Date();
        defaultEndDate.setDate(defaultEndDate.getDate() + 30);
        return defaultEndDate;
      })();

      const cagnotte = await this.cagnottesService.createCagnotte({
        title,
        description: description || story,
        targetAmount: parseFloat(targetAmount || goalAmount),
        endDate: finalEndDate,
        category,
        createdBy: userId,
        coverImage: coverImage || coverImageFromBody || imageUrl,
        coverVideo,
        mediaType,
        mediaFilename,
        status: status as 'DRAFT' | 'PENDING' | 'ACTIVE' | 'REJECTED'
      });

      res.status(201).json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte créée avec succès'
      });
    } catch (error) {
      console.error('Erreur création cagnotte:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la cagnotte'
      });
    }
  }

  // Récupérer toutes les cagnottes
  async getAllCagnottes(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, category, status } = req.query;
      
      const cagnottes = await this.cagnottesService.getAllCagnottes({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        category: category as string,
        status: status as string
      });

      res.status(200).json({
        success: true,
        data: cagnottes,
        message: 'Cagnottes récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur récupération cagnottes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des cagnottes'
      });
    }
  }

  // Récupérer une cagnotte par ID
  async getCagnotteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const cagnotte = await this.cagnottesService.getCagnotteById(id);
      
      if (!cagnotte) {
        return res.status(404).json({
          success: false,
          message: 'Cagnotte non trouvée'
        });
      }

      res.status(200).json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte récupérée avec succès'
      });
    } catch (error) {
      console.error('Erreur récupération cagnotte:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la cagnotte'
      });
    }
  }

  // Mettre à jour une cagnotte
  async updateCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      console.log('🔄 Mise à jour cagnotte - ID:', id);
      console.log('🔄 User ID:', userId);
      console.log('🔄 Body:', req.body);

      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      // Extraire les données du formulaire
      const {
        title,
        story,
        goalAmount,
        currency,
        category,
        country,
        postalCode,
        beneficiaryType,
        endDate
      } = req.body;

      // Gérer le fichier média s'il existe
      let coverImage: string | undefined = undefined;
      let coverVideo: string | undefined = undefined;
      let mediaType: string | undefined = undefined;
      let mediaFilename: string | undefined = undefined;

      if (req.file) {
        const file = req.file;
        mediaFilename = file.filename;
        
        if (file.mimetype.startsWith('image/')) {
          coverImage = `/uploads/cagnottes/${file.filename}`;
          mediaType = 'image';
        } else if (file.mimetype.startsWith('video/')) {
          coverVideo = `/uploads/cagnottes/${file.filename}`;
          mediaType = 'video';
        }
      }

      // Préparer les données de mise à jour
      const updateData: any = {
        title,
        description: story,
        goalAmount: parseFloat(goalAmount),
        // Ne mettre à jour les médias que si un nouveau fichier est uploadé
        ...(coverImage && { coverImage }),
        ...(coverVideo && { coverVideo }),
        ...(mediaType && { mediaType }),
        ...(mediaFilename && { mediaFilename }),
        endDate: endDate ? new Date(endDate) : undefined
      };

      // Gérer la catégorie si elle est fournie
      if (category) {
        updateData.category = {
          connect: {
            name: category
          }
        };
      }

      console.log('🔄 Données de mise à jour:', updateData);
      
      const cagnotte = await this.cagnottesService.updateCagnotte(id, updateData, userId);

      console.log('✅ Cagnotte mise à jour:', cagnotte);

      if (!cagnotte) {
        return res.status(404).json({
          success: false,
          message: 'Cagnotte non trouvée ou non autorisée'
        });
      }

      res.status(200).json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte mise à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur mise à jour cagnotte:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la cagnotte'
      });
    }
  }

  // Supprimer une cagnotte
  async deleteCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      const success = await this.cagnottesService.deleteCagnotte(id, userId);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Cagnotte non trouvée ou non autorisée'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Cagnotte supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur suppression cagnotte:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la cagnotte'
      });
    }
  }

  // Récupérer les cagnottes d'un utilisateur
  async getUserCagnottes(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { page = 1, limit = 10 } = req.query;

      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      const cagnottes = await this.cagnottesService.getUserCagnottes(userId, {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });

      res.status(200).json({
        success: true,
        data: cagnottes,
        message: 'Cagnottes de l\'utilisateur récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur récupération cagnottes utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des cagnottes'
      });
    }
  }

  // Publier une cagnotte
  async publishCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      const cagnotte = await this.cagnottesService.submitCagnotte(id, userId);

      res.status(200).json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte publiée avec succès'
      });
    } catch (error) {
      console.error('Erreur publication cagnotte:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la publication de la cagnotte'
      });
    }
  }

  // Soumettre une cagnotte pour validation admin
  async submitCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }

      const cagnotte = await this.cagnottesService.submitCagnotte(id, userId);

      res.json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte soumise pour validation admin'
      });
    } catch (error) {
      console.error('Erreur soumission cagnotte:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la soumission de la cagnotte'
      });
    }
  }

  // Approuver une cagnotte (Admin seulement)
  async approveCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminId = (req as any).user?.id;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }

      const cagnotte = await this.cagnottesService.approveCagnotte(id, adminId);

      res.json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte approuvée avec succès'
      });
    } catch (error) {
      console.error('Erreur approbation cagnotte:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de l\'approbation de la cagnotte'
      });
    }
  }

  // Rejeter une cagnotte (Admin seulement)
  async rejectCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = (req as any).user?.id;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }

      const cagnotte = await this.cagnottesService.rejectCagnotte(id, adminId, reason);

      res.json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte rejetée'
      });
    } catch (error) {
      console.error('Erreur rejet cagnotte:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors du rejet de la cagnotte'
      });
    }
  }

  // Récupérer les cagnottes en attente (Admin seulement)
  async getPendingCagnottes(req: Request, res: Response) {
    try {
      const cagnottes = await this.cagnottesService.getPendingCagnottes();

      res.json({
        success: true,
        data: cagnottes,
        message: 'Cagnottes en attente récupérées'
      });
    } catch (error) {
      console.error('Erreur récupération cagnottes en attente:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération des cagnottes en attente'
      });
    }
  }

  // Auto-save pour les brouillons (utilisé par sendBeacon)
  async saveDraft(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      const { 
        title, 
        description, 
        targetAmount, 
        endDate, 
        category, 
        coverImage 
      } = req.body;

      // Créer un brouillon automatiquement
      const cagnotte = await this.cagnottesService.createCagnotte({
        title: title || 'Brouillon sans titre',
        description: description || '',
        targetAmount: parseFloat(targetAmount) || 0,
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: category || 'Autre',
        createdBy: userId,
        coverImage: coverImage || '',
        status: 'DRAFT',
        currentStep: 1
      });

      res.status(201).json({
        success: true,
        data: cagnotte,
        message: 'Brouillon sauvegardé automatiquement'
      });
    } catch (error) {
      console.error('Erreur auto-save brouillon:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde automatique'
      });
    }
  }

  // Mettre à jour un brouillon existant
  async updateDraft(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      const { 
        title, 
        description, 
        targetAmount, 
        endDate, 
        category, 
        coverImage: coverImageFromBody,
        currentStep,
        status
      } = req.body;

      console.log('🔧 Controller updateDraft - req.body:', req.body);
      console.log('🔧 Controller updateDraft - targetAmount:', targetAmount);
      console.log('🔧 Controller updateDraft - currentStep:', currentStep);

      // Gérer le fichier média s'il existe
      let coverImage: string | undefined = undefined;
      let coverVideo: string | undefined = undefined;
      let mediaType: string | undefined = undefined;
      let mediaFilename: string | undefined = undefined;

      if (req.file) {
        const file = req.file;
        mediaFilename = file.filename;
        
        if (file.mimetype.startsWith('image/')) {
          coverImage = `/uploads/cagnottes/${file.filename}`;
          mediaType = 'image';
        } else if (file.mimetype.startsWith('video/')) {
          coverVideo = `/uploads/cagnottes/${file.filename}`;
          mediaType = 'video';
        }
      }

      // Vérifier que la cagnotte appartient à l'utilisateur
      const existingCagnotte = await this.cagnottesService.getCagnotteById(id);
      if (!existingCagnotte || existingCagnotte.creatorId !== userId) {
        return res.status(404).json({ message: 'Cagnotte non trouvée' });
      }

      // Si on essaie de changer le statut vers PENDING, vérifier que c'est bien un brouillon
      if (status === 'PENDING' && existingCagnotte.status !== 'DRAFT') {
        return res.status(400).json({ message: 'Seuls les brouillons peuvent être finalisés' });
      }

      console.log('🔧 Controller updateDraft - existingCagnotte:', existingCagnotte);

      // Mettre à jour le brouillon
      const updateData: any = {
        title: title && title.trim() !== '' ? title : existingCagnotte.title,
        description: description && description.trim() !== '' ? description : existingCagnotte.description,
        goalAmount: targetAmount && parseFloat(targetAmount) > 0 ? parseFloat(targetAmount) : existingCagnotte.goalAmount,
        endDate: endDate ? new Date(endDate) : existingCagnotte.endDate,
        category: category && category.trim() !== '' ? category : existingCagnotte.category?.name,
        currentStep: currentStep ? parseInt(currentStep) : existingCagnotte.currentStep || 1,
        status: status || existingCagnotte.status // Permettre le changement de statut
      };

      // Ajouter les médias seulement s'ils sont fournis
      if (coverImage) {
        updateData.coverImage = coverImage;
      } else if (coverImageFromBody) {
        updateData.coverImage = coverImageFromBody;
      }
      
      if (coverVideo) updateData.coverVideo = coverVideo;
      if (mediaType) updateData.mediaType = mediaType;
      if (mediaFilename) updateData.mediaFilename = mediaFilename;

      console.log('🔧 Controller updateDraft - updateData:', updateData);

      const updatedCagnotte = await this.cagnottesService.updateCagnotte(id, updateData, userId);

      res.status(200).json({
        success: true,
        data: updatedCagnotte,
        message: 'Brouillon mis à jour'
      });
    } catch (error) {
      console.error('Erreur mise à jour brouillon:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du brouillon'
      });
    }
  }

  // 🔍 Rechercher des cagnottes
  async searchCagnottes(req: Request, res: Response) {
    try {
      const { 
        q,                    // Query de recherche
        category,             // Filtre par catégorie
        status,               // Filtre par statut
        minAmount,            // Montant minimum
        maxAmount,            // Montant maximum
        sortBy = 'relevance', // Tri (relevance, recent, amount, ending)
        page = 1, 
        limit = 20 
      } = req.query;

      console.log('🔍 Recherche de cagnottes:', { q, category, status, sortBy });

      const results = await this.cagnottesService.searchCagnottes({
        query: q as string,
        category: category as string,
        status: status as string,
        minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
        sortBy: sortBy as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });

      res.status(200).json({
        success: true,
        data: results,
        message: 'Recherche effectuée avec succès'
      });
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche'
      });
    }
  }
}

export default new CagnottesController(); 