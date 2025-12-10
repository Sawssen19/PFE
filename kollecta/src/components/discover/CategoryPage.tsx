import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CATEGORIES, getCategoryDescription, getCategoryHeroImage } from '../../constants/categories';
import './CategoryPage.css';

interface Cagnotte {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  coverImage?: string;
  category: {
    id: string;
    name: string;
  };
  creator: {
    firstName: string;
    lastName: string;
  };
  endDate: string;
  status: string;
  country?: string;
  postalCode?: string;
}

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const [cagnottes, setCagnottes] = useState<Cagnotte[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryDescription, setCategoryDescription] = useState<string>('');
  const [heroImage, setHeroImage] = useState<string>('');

  // Extraire le nom de la catégorie depuis le slug (ex: "santé-fundraiser" -> "Santé")
  useEffect(() => {
    if (categorySlug) {
      // Enlever "-fundraiser" du slug
      const slugWithoutSuffix = categorySlug.replace(/-fundraiser$/, '');
      
      // Trouver la catégorie correspondante (insensible à la casse)
      const category = CATEGORIES.find(
        cat => cat.name.toLowerCase() === slugWithoutSuffix.toLowerCase()
      );

      if (category) {
        setCategoryName(category.name);
        setCategoryDescription(getCategoryDescription(category.name));
        
        // Obtenir l'image héro pour cette catégorie
        const categoryImage = getCategoryHeroImage(category.name);
        setHeroImage(categoryImage);
      } else {
        // Si la catégorie n'existe pas, rediriger vers discover
        navigate('/discover');
      }
    }
  }, [categorySlug, navigate]);

  // Charger les cagnottes de la catégorie (actives et terminées)
  useEffect(() => {
    const fetchCagnottes = async () => {
      if (!categoryName) return;

      setLoading(true);
      try {
        // Récupérer les cagnottes avec plusieurs statuts (ACTIVE, CLOSED, SUCCESS)
        // Comme dans la page de recherche, on affiche les cagnottes visibles publiquement
        const response = await fetch(
          `http://localhost:5000/api/cagnottes?limit=100&category=${encodeURIComponent(categoryName)}`
        );
        if (response.ok) {
          const result = await response.json();
          const allCagnottes = result.data.cagnottes || result.data || [];
          
          // Filtrer pour garder uniquement les statuts visibles publiquement
          const visibleCagnottes = allCagnottes.filter(
            (cagnotte: Cagnotte) => 
              ['ACTIVE', 'CLOSED', 'SUCCESS'].includes(cagnotte.status)
          );
          
          setCagnottes(visibleCagnottes);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des cagnottes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCagnottes();
  }, [categoryName]);

  const getProgressPercentage = (current: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLocation = (cagnotte: Cagnotte): string => {
    if (cagnotte.postalCode && cagnotte.country) {
      return `${cagnotte.postalCode}, ${cagnotte.country}`;
    } else if (cagnotte.postalCode) {
      return cagnotte.postalCode;
    } else if (cagnotte.country) {
      return cagnotte.country;
    }
    return 'Tunisie';
  };

  if (loading) {
    return (
      <div className="category-page-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des cagnottes...</p>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Hero Header Section - Similar to KOLLECTA */}
      <div className="category-hero-section">
        <div className="category-page-container">
          <div className="category-hero-content">
            <div className="category-hero-text">
              <h1 className="category-hero-title">
                Découvrez les cagnottes {categoryName.toLowerCase()} sur Kollecta
              </h1>
              <p className="category-hero-description">
                Aidez les autres en faisant un don à leur cagnotte, ou créez-en une pour quelqu'un qui vous tient à cœur.
              </p>
              <Link 
                to="/create/fundraiser?new=true" 
                className="category-hero-cta-button"
              >
                Créer une cagnotte
              </Link>
            </div>
            {heroImage && (
              <div className="category-hero-image">
                <img src={heroImage} alt={categoryName} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Browse Section - Similar to KOLLECTA */}
      <div className="category-browse-section">
        <div className="category-page-container">
          <div className="category-browse-header">
            <h2 className="category-browse-title">Parcourir les cagnottes {categoryName.toLowerCase()}</h2>
          </div>
          
          {cagnottes.length === 0 ? (
            <div className="category-empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h2>Aucune cagnotte trouvée</h2>
              <p>Il n'y a pas encore de cagnottes dans cette catégorie.</p>
              <Link to="/discover" className="empty-state-link">
                Explorer d'autres catégories
              </Link>
            </div>
          ) : (
            <div className="category-cagnottes-grid">
            {cagnottes.map((cagnotte) => {
              const progress = getProgressPercentage(cagnotte.currentAmount, cagnotte.goalAmount);

              return (
                <Link
                  key={cagnotte.id}
                  to={`/cagnottes/${cagnotte.id}`}
                  className="category-cagnotte-card"
                >
                  <div className="cagnotte-card-image-wrapper">
                    {cagnotte.coverImage ? (
                      <img
                        src={cagnotte.coverImage.startsWith('http') 
                          ? cagnotte.coverImage 
                          : `http://localhost:5000${cagnotte.coverImage}`}
                        alt={cagnotte.title}
                        className="cagnotte-card-image"
                      />
                    ) : (
                      <div className="cagnotte-card-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                    <div className="cagnotte-card-location">
                      {getLocation(cagnotte)}
                    </div>
                  </div>

                  <div className="cagnotte-card-content">
                    <h3 className="cagnotte-card-title">{cagnotte.title}</h3>
                    
                    <div className="cagnotte-card-amount">
                      <span className="amount-raised">{formatAmount(cagnotte.currentAmount)} DT</span>
                      <span className="amount-label">collectés</span>
                    </div>
                    
                    <div className="cagnotte-card-progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </Link>
              );
            })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

