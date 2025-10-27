// Service de recherche pour Kollecta

export interface SearchParams {
  q?: string;           // Query de recherche
  category?: string;    // Filtre par catégorie
  status?: string;      // Filtre par statut
  minAmount?: number;   // Montant minimum
  maxAmount?: number;   // Montant maximum
  sortBy?: string;      // Tri (relevance, recent, amount, ending)
  page?: number;        // Page actuelle
  limit?: number;       // Nombre de résultats par page
}

export interface SearchResult {
  cagnottes: any[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

class SearchService {
  private baseURL = 'http://localhost:5000/api/cagnottes';

  /**
   * Rechercher des cagnottes avec filtres
   */
  async searchCagnottes(params: SearchParams): Promise<SearchResult> {
    try {
      // Construction de l'URL avec les paramètres
      const queryParams = new URLSearchParams();
      
      if (params.q) queryParams.append('q', params.q);
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);
      if (params.minAmount !== undefined) queryParams.append('minAmount', params.minAmount.toString());
      if (params.maxAmount !== undefined) queryParams.append('maxAmount', params.maxAmount.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const url = `${this.baseURL}/search?${queryParams.toString()}`;
      
      console.log('🔍 Recherche:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const result = await response.json();
      
      console.log('✅ Résultats de recherche:', result);

      return result.data;
    } catch (error) {
      console.error('❌ Erreur recherche:', error);
      throw error;
    }
  }

  /**
   * Récupérer les catégories disponibles
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Si l'endpoint n'existe pas, retourner des catégories par défaut
        return [
          'Tous',
          'Solidarité',
          'Éducation',
          'Santé',
          'Environnement',
          'Culture',
          'Sport',
          'Entrepreneuriat',
          'Urgence',
          'Autre'
        ];
      }

      const result = await response.json();
      return ['Tous', ...result.map((cat: any) => cat.name)];
    } catch (error) {
      console.error('❌ Erreur récupération catégories:', error);
      // Retourner des catégories par défaut en cas d'erreur
      return [
        'Tous',
        'Solidarité',
        'Éducation',
        'Santé',
        'Environnement',
        'Culture',
        'Sport',
        'Entrepreneuriat',
        'Urgence',
        'Autre'
      ];
    }
  }

  /**
   * Recherche avec suggestions (debounced)
   */
  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const results = await this.searchCagnottes({
        q: query,
        limit: 5,
      });

      // Retourner les titres des cagnottes trouvées comme suggestions
      return results.cagnottes.map((c: any) => c.title);
    } catch (error) {
      console.error('❌ Erreur suggestions:', error);
      return [];
    }
  }
}

export const searchService = new SearchService();

