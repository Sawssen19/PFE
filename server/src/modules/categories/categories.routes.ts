import { Router } from 'express';
import { categoriesService } from './categories.service';

const router = Router();

// GET /api/categories -> liste des catégories triées par nom
router.get('/', async (_req, res) => {
  try {
    const categories = await categoriesService.getAllCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Erreur /api/categories:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des catégories' });
  }
});

export default router;


