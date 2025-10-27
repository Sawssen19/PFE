import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchService, SearchParams } from '../features/search/searchService';
import { Search as SearchIcon, Filter, X, ChevronDown } from 'lucide-react';
import './SearchPage.css';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // États
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Filtres
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  // Catégories
  const categories = [
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

  // Options de tri
  const sortOptions = [
    { value: 'relevance', label: 'Plus pertinents' },
    { value: 'recent', label: 'Plus récents' },
    { value: 'amount', label: 'Montant collecté' },
    { value: 'ending', label: 'Bientôt terminés' },
  ];

  // Fonction de recherche
  const performSearch = async (resetPage = true) => {
    setLoading(true);
    try {
      const params: SearchParams = {
        q: query,
        category: selectedCategory === 'all' || selectedCategory === 'Tous' ? undefined : selectedCategory,
        sortBy,
        page: resetPage ? 1 : page,
        limit: 20,
      };

      const result = await searchService.searchCagnottes(params);
      
      if (resetPage) {
        setResults(result.cagnottes);
        setPage(1);
      } else {
        setResults([...results, ...result.cagnottes]);
      }
      
      setTotal(result.total);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  // Recherche au chargement et quand les filtres changent
  useEffect(() => {
    performSearch(true);
  }, [query, selectedCategory, sortBy]);

  // Gestion de la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(true);
  };

  // Charger plus de résultats
  const loadMore = () => {
    setPage(page + 1);
    performSearch(false);
  };

  // Calculer le pourcentage de progression
  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  // Formater le montant
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Composant SVG placeholder pour les cagnottes sans image
  const PlaceholderImage = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );

  return (
    <div className="search-page">
      {/* Header de recherche */}
      <div className="search-header">
        <div className="search-header-content">
          <h1>🔍 Rechercher une cagnotte</h1>
          <p>Trouvez et soutenez des causes qui vous tiennent à cœur</p>
          
          {/* Barre de recherche principale */}
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-wrapper">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher par titre, description, créateur..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="clear-button"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <button type="submit" className="search-button">
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* Filtres et résultats */}
      <div className="search-content">
        <div className="search-container">
          {/* Sidebar avec filtres */}
          <aside className={`search-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="sidebar-header">
              <h3>Filtres</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Catégories */}
            <div className="filter-section">
              <h4>Catégorie</h4>
              <div className="category-list">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Réinitialiser */}
            <button 
              className="reset-filters"
              onClick={() => {
                setSelectedCategory('all');
                setSortBy('relevance');
              }}
            >
              Réinitialiser les filtres
            </button>
          </aside>

          {/* Résultats */}
          <main className="search-results">
            {/* Barre d'actions */}
            <div className="results-header">
              <div className="results-info">
                {loading ? (
                  <p>Recherche en cours...</p>
                ) : (
                  <p>
                    <strong>{total}</strong> {total > 1 ? 'cagnottes trouvées' : 'cagnotte trouvée'}
                    {query && ` pour "${query}"`}
                  </p>
                )}
              </div>

              <div className="results-actions">
                {/* Bouton filtres mobile */}
                <button 
                  className="filter-button mobile-only"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={20} />
                  Filtres
                </button>

                {/* Tri */}
                <div className="sort-dropdown">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="dropdown-icon" size={16} />
                </div>
              </div>
            </div>

            {/* Liste des résultats */}
            {loading && results.length === 0 ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Recherche en cours...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="empty-state">
                <SearchIcon size={64} />
                <h3>Aucun résultat trouvé</h3>
                <p>
                  {query 
                    ? `Aucune cagnotte ne correspond à "${query}"`
                    : 'Essayez de modifier vos critères de recherche'}
                </p>
                <button 
                  className="create-button"
                  onClick={() => navigate('/create-campaign')}
                >
                  Créer une cagnotte
                </button>
              </div>
            ) : (
              <>
                <div className="results-grid">
                  {results.map((cagnotte) => (
                    <div 
                      key={cagnotte.id} 
                      className="cagnotte-card"
                      onClick={() => navigate(`/cagnottes/${cagnotte.id}`)}
                    >
                      <div className="card-image">
                        {cagnotte.coverImage ? (
                          <img 
                            src={cagnotte.coverImage} 
                            alt={cagnotte.title}
                          />
                        ) : (
                          <div className="placeholder-image">
                            <PlaceholderImage />
                          </div>
                        )}
                        <span className="card-category">
                          {cagnotte.category?.name || 'Autre'}
                        </span>
                      </div>
                      
                      <div className="card-content">
                        <h3 className="card-title">{cagnotte.title}</h3>
                        <p className="card-description">
                          {cagnotte.description?.substring(0, 120)}
                          {cagnotte.description?.length > 120 && '...'}
                        </p>

                        <div className="card-creator">
                          Par {cagnotte.creator?.firstName} {cagnotte.creator?.lastName}
                        </div>

                        <div className="card-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${getProgressPercentage(cagnotte.currentAmount, cagnotte.goalAmount)}%` }}
                            />
                          </div>
                          <div className="progress-info">
                            <span className="amount-raised">
                              {formatAmount(cagnotte.currentAmount)} collectés
                            </span>
                            <span className="amount-goal">
                              sur {formatAmount(cagnotte.goalAmount)}
                            </span>
                          </div>
                          <div className="progress-percentage">
                            {Math.round(getProgressPercentage(cagnotte.currentAmount, cagnotte.goalAmount))}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bouton "Charger plus" */}
                {hasMore && (
                  <div className="load-more-container">
                    <button 
                      className="load-more-button"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? 'Chargement...' : 'Voir plus de résultats'}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

