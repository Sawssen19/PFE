import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoriesService {
  // Récupérer toutes les catégories
  async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc'
        }
      });

      return categories;
    } catch (error) {
      console.error('Erreur récupération catégories:', error);
      throw new Error('Erreur lors de la récupération des catégories');
    }
  }

  // Récupérer une catégorie par ID
  async getCategoryById(id: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              cagnottes: true
            }
          }
        }
      });

      if (!category) {
        throw new Error('Catégorie non trouvée');
      }

      return category;
    } catch (error) {
      console.error('Erreur récupération catégorie:', error);
      throw error;
    }
  }

  // Récupérer une catégorie par nom
  async getCategoryByName(name: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { name }
      });

      return category;
    } catch (error) {
      console.error('Erreur récupération catégorie par nom:', error);
      throw error;
    }
  }
}

export const categoriesService = new CategoriesService();

