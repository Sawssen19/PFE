import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, selectIsAuthenticated, logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentCagnottesPage, setCurrentCagnottesPage] = useState(0);

  const categories = [
    { name: 'Votre cause', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Santé', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Urgences', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Entreprises', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Animaux', image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Éducation', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
  ];

  // Données de cagnottes organisées par pages
  const cagnottesData = [
    // Page 1 - Cagnottes actuelles
    {
      featured: {
        id: 1,
        title: "Aider Youssef à vaincre le cancer",
        description: "Soutien pour le traitement de Youssef, 8 ans, atteint d'une leucémie aiguë",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        donations: "2,458 dons",
        collected: "78 000 DT",
        goal: "100 000 DT",
        progress: 78,
        daysLeft: "22 jours restants"
      },
      small: [
        {
          id: 2,
          title: "Bourse d'étude pour Amina",
          description: "Permettre à Amina de poursuivre ses études d'ingénieur",
          image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "756 dons",
          collected: "13 000 DT",
          progress: 65
        },
        {
          id: 3,
          title: "Reconstruction maison familiale",
          description: "Aide pour la famille Ben Ali après l'incendie de leur maison",
          image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "1,245 dons",
          collected: "46 000 DT",
          progress: 92
        },
        {
          id: 4,
          title: "Soins pour Noura",
          description: "Traitement médical urgent pour Noura, 5 ans",
          image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "1,842 dons",
          collected: "22 500 DT",
          progress: 45
        },
        {
          id: 5,
          title: "Startup écologique",
          description: "Soutien à un jeune entrepreneur tunisien",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "523 dons",
          collected: "16 000 DT",
          progress: 32
        }
      ]
    },
    // Page 2 - Nouvelles cagnottes
    {
      featured: {
        id: 6,
        title: "Aide aux sinistrés de Sfax",
        description: "Soutien aux familles touchées par les inondations récentes",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        donations: "3,127 dons",
        collected: "125 000 DT",
        goal: "200 000 DT",
        progress: 62,
        daysLeft: "15 jours restants"
      },
      small: [
        {
          id: 7,
          title: "Équipement pour école rurale",
          description: "Fournitures scolaires pour l'école primaire de Douz",
          image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "892 dons",
          collected: "28 500 DT",
          progress: 71
        },
        {
          id: 8,
          title: "Soins vétérinaires pour refuge",
          description: "Aide au refuge pour animaux abandonnés de Tunis",
          image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "1,634 dons",
          collected: "34 200 DT",
          progress: 68
        },
        {
          id: 9,
          title: "Formation professionnelle",
          description: "Formation en informatique pour jeunes défavorisés",
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "445 dons",
          collected: "18 750 DT",
          progress: 47
        },
        {
          id: 10,
          title: "Aide aux personnes âgées",
          description: "Soutien pour les soins à domicile des seniors isolés",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "2,156 dons",
          collected: "67 800 DT",
          progress: 85
        }
      ]
    },
    // Page 3 - Autres cagnottes
    {
      featured: {
        id: 11,
        title: "Projet agricole communautaire",
        description: "Développement d'une ferme coopérative dans le sud tunisien",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        donations: "1,789 dons",
        collected: "89 500 DT",
        goal: "150 000 DT",
        progress: 60,
        daysLeft: "8 jours restants"
      },
      small: [
        {
          id: 12,
          title: "Bibliothèque mobile",
          description: "Camion-bibliothèque pour les villages isolés",
          image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "567 dons",
          collected: "22 300 DT",
          progress: 56
        },
        {
          id: 13,
          title: "Centre de réhabilitation",
          description: "Centre pour personnes en situation de handicap",
          image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "2,891 dons",
          collected: "156 000 DT",
          progress: 78
        },
        {
          id: 14,
          title: "Projet artistique",
          description: "Ateliers d'art pour enfants des quartiers populaires",
          image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "734 dons",
          collected: "19 800 DT",
          progress: 40
        },
        {
          id: 15,
          title: "Aide alimentaire d'urgence",
          description: "Distribution de paniers alimentaires aux plus démunis",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          donations: "4,123 dons",
          collected: "203 500 DT",
          progress: 92
        }
      ]
    }
  ];

  // Gestion de la responsivité
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcul du nombre de cartes visibles selon la taille d'écran
  const getCardsPerView = () => {
    if (windowWidth > 1024) return 3;
    if (windowWidth > 768) return 2;
    return 1;
  };

  const handleStartFundraiser = () => {
    if (isAuthenticated) {
      navigate('/create-fundraiser');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const nextCategory = () => {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, categories.length - cardsPerView);
    setCurrentCategory((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevCategory = () => {
    setCurrentCategory((prev) => Math.max(prev - 1, 0));
  };

  // Navigation des cagnottes
  const nextCagnottes = () => {
    setCurrentCagnottesPage((prev) => (prev + 1) % cagnottesData.length);
  };

  const prevCagnottes = () => {
    setCurrentCagnottesPage((prev) => (prev - 1 + cagnottesData.length) % cagnottesData.length);
  };

  useEffect(() => {
    const interval = setInterval(nextCategory, 4000);
    return () => clearInterval(interval);
  }, [currentCategory, windowWidth]);

  // Calcul de la transformation responsive
  const getTransformValue = () => {
    const cardsPerView = getCardsPerView();
    return `translateX(-${currentCategory * (100 / cardsPerView)}%)`;
  };

  // Données actuelles des cagnottes
  const currentCagnottes = cagnottesData[currentCagnottesPage];

  return (
    <div className="home-hero-bubbles">
      {/* Hero Section avec bulles */}
      <div className="hero-bubbles_heroContent">
        <div className="hrt-container">
          {/* Images floues en arrière-plan */}
          <div className="blurred-images_blurredImagesOuter">
            <img alt="" className="blurred-images_blurredImage1" src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60" />
            <img alt="" className="blurred-images_blurredImage2" src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60" />
            <img alt="" className="blurred-images_blurredImage3" src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60" />
            <img alt="" className="blurred-images_blurredImage4" src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60" />
          </div>
          <div className="blurred-images_blurredImagesInner">
            <img alt="" className="blurred-images_blurredImage5" src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=60" />
            <img alt="" className="blurred-images_blurredImage6" src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=60" />
            <img alt="" className="blurred-images_blurredImage7" src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=60" />
          </div>

          {/* Titre principal */}
          <h1 className="hero-bubbles_fadeInText hrt-text hrt-text-center hrt-text-heading-sm">
            La plateforme n°1 de financement participatif en Tunisie
          </h1>
          
          <div className="hero-bubbles_heroHeadline">
            <h2 className="hero-bubbles_heroHeadlineText hero-bubbles_fadeInText hrt-text hrt-text-center hrt-text-display-lg">
              Les cagnottes à succès commencent ici
            </h2>
          </div>

          {/* Bouton CTA */}
          <button 
            onClick={handleStartFundraiser}
            className="hero-bubbles_button hrt-primary-button hrt-primary-button--inline hrt-primary-button--large"
          >
            {isAuthenticated ? 'Démarrer une cagnotte' : 'Se connecter pour commencer'}
          </button>

          {/* Nouveau Carousel de catégories moderne */}
          <div className="modern-categories-section">
            <div className="categories-header">
              <h3 className="categories-title">Explorez par catégorie</h3>
              <p className="categories-subtitle">Trouvez la cause qui vous touche le plus</p>
            </div>
            
            <div className="categories-carousel-container">
              <button 
                className="carousel-nav-button carousel-nav-prev" 
                onClick={prevCategory}
                aria-label="Catégorie précédente"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <div className="categories-carousel">
                <div 
                  className="categories-track"
                  style={{
                    transform: getTransformValue()
                  }}
                >
                  {categories.map((category, index) => (
                    <div 
                      key={index}
                      className={`category-card ${index === currentCategory ? 'active' : ''}`}
                      onClick={() => setCurrentCategory(index)}
                    >
                      <div className="category-card-image">
                        <img src={category.image} alt={category.name} />
                        <div className="category-overlay">
                          <div className="category-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="category-card-content">
                        <h4 className="category-name">{category.name}</h4>
                        <div className="category-stats">
                          <span className="category-count">+500 campagnes</span>
                          <span className="category-amount">2.5M DT collectés</span>
                        </div>
                      </div>
                      <div className="category-card-indicator">
                        <div className={`indicator-dot ${index === currentCategory ? 'active' : ''}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="carousel-nav-button carousel-nav-next" 
                onClick={nextCategory}
                aria-label="Catégorie suivante"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
            
            <div className="categories-indicators">
              {categories.map((_, index) => (
                <button
                  key={index}
                  className={`indicator-button ${index === currentCategory ? 'active' : ''}`}
                  onClick={() => setCurrentCategory(index)}
                  aria-label={`Aller à la catégorie ${index + 1}`}
                >
                  <span className="indicator-dot"></span>
                </button>
              ))}
            </div>
          </div>

          {/* Carousel de catégories */}
          {/* The old category carousel is removed as per the new_code */}
        </div>
      </div>

      {/* Section statistiques */}
      <div className="hero-bubbles_heroColumnContent hrt-px-3 hrt-container">
        <h2 className="hrt-text hrt-text-heading-lg">
          Plus de 45 millions de dinars sont collectés chaque semaine sur Kollecta.*
        </h2>
        <div>
          <p className="hrt-text hrt-text-supporting hrt-text-body-lg">
            Lancez-vous en quelques minutes. Grâce à de nouveaux outils utiles, vous pouvez choisir le titre parfait, rédiger une histoire captivante et la partager facilement avec le monde entier.
          </p>
        </div>
      </div>

      {/* Section cagnottes tunisiennes */}
      <section className="cagnottes-section">
        <div className="cagnottes-container">
          {/* Section Header */}
          <div className="cagnottes-header">
            <h2 className="cagnottes-title">Découvrez des cagnottes tunisiennes</h2>
            <p className="cagnottes-subtitle">Soutenez des causes locales qui vous tiennent à cœur</p>
          </div>

          {/* Filtres et Navigation */}
          <div className="cagnottes-controls">
            {/* Filtres */}
            <div className="cagnottes-filters">
              <button className="filter-button filter-active">Toutes</button>
              <button className="filter-button">Santé</button>
              <button className="filter-button">Éducation</button>
              <button className="filter-button">Urgences</button>
              <button className="filter-button">Entrepreneuriat</button>
              <button className="filter-button filter-more">
                Plus
                <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <div className="cagnottes-navigation">
              <button 
                className="nav-button" 
                aria-label="Précédent"
                onClick={prevCagnottes}
              >
                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button 
                className="nav-button" 
                aria-label="Suivant"
                onClick={nextCagnottes}
              >
                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Indicateur de page */}
          <div className="cagnottes-page-indicator">
            {cagnottesData.map((_, index) => (
              <div 
                key={index} 
                className={`page-dot ${index === currentCagnottesPage ? 'active' : ''}`}
                onClick={() => setCurrentCagnottesPage(index)}
              />
            ))}
          </div>

          {/* Grille des cagnottes */}
          <div className="cagnottes-grid">
            {/* Cagnotte principale (à gauche) */}
            <div className="cagnotte-featured">
              <a className="cagnotte-link" href="#">
                <div className="cagnotte-card cagnotte-featured-card">
                  <div className="cagnotte-image-container">
                    <img 
                      src={currentCagnottes.featured.image} 
                      alt={currentCagnottes.featured.title} 
                      className="cagnotte-image"
                    />
                    <div className="cagnotte-badge">{currentCagnottes.featured.donations}</div>
                  </div>
                  <div className="cagnotte-content">
                    <h3 className="cagnotte-title">{currentCagnottes.featured.title}</h3>
                    <p className="cagnotte-description">{currentCagnottes.featured.description}</p>
                    <div className="cagnotte-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${currentCagnottes.featured.progress}%`}}></div>
                      </div>
                      <div className="progress-stats">
                        <span>{currentCagnottes.featured.collected}</span>
                        <span>Objectif: {currentCagnottes.featured.goal}</span>
                      </div>
                    </div>
                    <div className="cagnotte-time">
                      <span>{currentCagnottes.featured.daysLeft}</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Liste des 4 cagnottes (à droite) */}
            <div className="cagnottes-list">
              {currentCagnottes.small.map((cagnotte) => (
                <div key={cagnotte.id} className="cagnotte-item">
                  <a className="cagnotte-link" href="#">
                    <div className="cagnotte-card cagnotte-small-card">
                      <div className="cagnotte-image-container">
                        <img 
                          src={cagnotte.image} 
                          alt={cagnotte.title} 
                          className="cagnotte-image"
                        />
                        <div className="cagnotte-badge">{cagnotte.donations}</div>
                      </div>
                      <div className="cagnotte-content">
                        <h3 className="cagnotte-title">{cagnotte.title}</h3>
                        <p className="cagnotte-description">{cagnotte.description}</p>
                        <div className="cagnotte-progress">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: `${cagnotte.progress}%`}}></div>
                          </div>
                          <span className="progress-amount">{cagnotte.collected}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton Voir plus */}
          <div className="cagnottes-more">
            <button className="cagnottes-more-button">
              Voir plus de cagnottes
            </button>
          </div>
        </div>
      </section>

      {/* Section comment ça marche */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="section-header">
            <h2 className="section-title">Comment fonctionne Kollecta</h2>
            <p className="section-subtitle">Trois étapes simples pour créer votre cagnotte</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="step-title">Créez votre cagnotte</h3>
              <p className="step-description">C'est simple à configurer. En quelques minutes, vous serez prêt à accepter les promesses de dons.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </div>
              <h3 className="step-title">Partagez avec vos amis</h3>
              <p className="step-description">Les gens partagent 7x plus sur Kollecta que sur toute autre plateforme.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="step-title">Gérez les promesses</h3>
              <p className="step-description">Notre plateforme sécurisée facilite la gestion des promesses de dons.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA finale */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Prêt à commencer la collecte ?</h2>
          <p className="cta-description">Rejoignez des millions de personnes qui lèvent des fonds pour les causes qui leur tiennent à cœur.</p>
          <button 
            onClick={handleStartFundraiser}
            className="cta-button"
          >
            {isAuthenticated ? 'Démarrer une cagnotte' : 'Se connecter pour commencer'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;