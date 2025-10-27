// Catégories synchronisées avec la base de données
// Générées après nettoyage des redondances

export interface Category {
  id: string;
  name: string;
  description: string;
}

// Liste finale des 17 catégories après nettoyage
export const CATEGORIES = [
  { name: 'Animaux', description: 'Protection et soins des animaux' },
  { name: 'Autre', description: 'Catégorie pour Autre' },
  { name: 'Bénévolat', description: 'Projets de bénévolat et associations caritatives' },
  { name: 'Culture', description: 'Projets culturels et artistiques' },
  { name: 'Éducation', description: 'Projets éducatifs et scolaires' },
  { name: 'Événements', description: 'Fêtes, anniversaires et célébrations' },
  { name: 'Environnement', description: 'Protection de l\'environnement' },
  { name: 'Entreprises', description: 'Campagnes entrepreneuriales' },
  { name: 'Famille', description: 'Cagnottes familiales et événements personnels' },
  { name: 'Mémorial', description: 'Campagnes commémoratives' },
  { name: 'Religion', description: 'Projets religieux et spirituels' },
  { name: 'Santé', description: 'Aide médicale et soins de santé' },
  { name: 'Solidarité', description: 'Aide sociale et humanitaire' },
  { name: 'Sport', description: 'Équipements et événements sportifs' },
  { name: 'Technologie', description: 'Innovation et projets technologiques' },
  { name: 'Urgences', description: 'Situations d\'urgence et catastrophes' },
  { name: 'Voyages', description: 'Financement de voyages et expéditions' },
];

// Catégories pour les filtres principaux de la page d'accueil
export const MAIN_FILTER_CATEGORIES = [
  'Santé',
  'Éducation', 
  'Urgences',
  'Entreprises'
];

// Catégories pour le menu déroulant "Plus"
export const MORE_CATEGORIES = [
  'Animaux',
  'Sport',
  'Religion',
  'Environnement',
  'Culture',
  'Technologie',
  'Mémorial',
  'Solidarité',
  'Bénévolat',
  'Famille',
  'Événements',
  'Voyages',
  'Autre'
];

// Catégories pour le carousel hero (différentes des filtres)
export const HERO_CATEGORIES = [
  { name: 'Votre cause', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { name: 'Santé', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { name: 'Urgences', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { name: 'Entreprises', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { name: 'Animaux', image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { name: 'Éducation', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
];

// Fonction utilitaire pour vérifier si une catégorie existe
export const isValidCategory = (categoryName: string): boolean => {
  return CATEGORIES.some(cat => cat.name === categoryName);
};

// Fonction utilitaire pour obtenir la description d'une catégorie
export const getCategoryDescription = (categoryName: string): string => {
  const category = CATEGORIES.find(cat => cat.name === categoryName);
  return category?.description || '';
};
