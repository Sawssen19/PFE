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
  { name: 'Voyages', description: 'Projets de voyage et découverte' },
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

// Mapping des images héro pour chaque catégorie (images significatives et pertinentes)
// Images Unsplash soigneusement sélectionnées pour représenter chaque catégorie
export const CATEGORY_HERO_IMAGES: Record<string, string> = {
  // Animaux - Chien et chat heureux
  'Animaux': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Autre - Mains qui se joignent en cercle (solidarité universelle)
  'Autre': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Bénévolat - Bénévoles aidant des personnes
  'Bénévolat': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Culture - Artiste peignant ou performance artistique
  'Culture': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Éducation - Étudiants en classe ou diplômés
  'Éducation': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Événements - Fête ou célébration
  'Événements': 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Environnement - Nature préservée ou bénévoles plantant des arbres
  'Environnement': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Entreprises - Équipe en réunion ou entrepreneur au travail
  'Entreprises': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Famille - Famille réunie et heureuse
  'Famille': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Mémorial - Bougie allumée ou fleurs blanches (recueillement)
  'Mémorial': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Religion - Livre ouvert sur un support en bois (Quran/Coran) - Photo d'Ahmed
  // Source: https://unsplash.com/photos/an-open-book-sitting-on-top-of-a-wooden-cross-bPS8HB2UMcM
  'Religion': 'https://plus.unsplash.com/premium_photo-1676929358405-7b65c955630d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Santé - Médecin avec patient ou soins médicaux
  'Santé': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Solidarité - Communauté unie ou bénévoles en action
  'Solidarité': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Sport - Équipe en compétition ou athlète en action
  'Sport': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Technologie - Innovation, coding, ou technologie moderne
  'Technologie': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Urgences - Secours en action ou situation d'urgence
  'Urgences': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // Voyages - Destination de voyage ou paysage exotique
  'Voyages': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
};

// Catégories pour le carousel hero (différentes des filtres)
export const HERO_CATEGORIES = [
  { name: 'Votre cause', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { name: 'Santé', image: CATEGORY_HERO_IMAGES['Santé'] },
  { name: 'Urgences', image: CATEGORY_HERO_IMAGES['Urgences'] },
  { name: 'Entreprises', image: CATEGORY_HERO_IMAGES['Entreprises'] },
  { name: 'Animaux', image: CATEGORY_HERO_IMAGES['Animaux'] },
  { name: 'Éducation', image: CATEGORY_HERO_IMAGES['Éducation'] }
];

// Fonction pour obtenir l'image héro d'une catégorie
export const getCategoryHeroImage = (categoryName: string): string => {
  return CATEGORY_HERO_IMAGES[categoryName] || CATEGORY_HERO_IMAGES['Autre'];
};

// Fonction utilitaire pour vérifier si une catégorie existe
export const isValidCategory = (categoryName: string): boolean => {
  return CATEGORIES.some(cat => cat.name === categoryName);
};

// Fonction utilitaire pour obtenir la description d'une catégorie
export const getCategoryDescription = (categoryName: string): string => {
  const category = CATEGORIES.find(cat => cat.name === categoryName);
  return category?.description || '';
};
