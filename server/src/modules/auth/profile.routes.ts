import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const profileController = new ProfileController();

// Route pour récupérer le profil
router.get('/:userId/profile', authMiddleware, profileController.getProfile.bind(profileController));

// Route pour mettre à jour le profil
router.put('/:userId/profile', authMiddleware, profileController.updateProfile.bind(profileController));

// Route pour uploader une photo de profil
router.post('/:userId/profile-picture', authMiddleware, profileController.uploadProfilePicture.bind(profileController));

// Route pour supprimer une photo de profil
router.delete('/:userId/profile-picture', authMiddleware, profileController.deleteProfilePicture.bind(profileController));

export default router; 