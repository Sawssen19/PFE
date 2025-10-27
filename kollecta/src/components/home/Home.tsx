import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, selectIsAuthenticated, logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { HERO_CATEGORIES, MAIN_FILTER_CATEGORIES, MORE_CATEGORIES } from '../../constants/categories';

// Types pour les cagnottes
interface Cagnotte {
  id: number;
  cagnotteId?: string; // ID de la cagnotte dans la base de données (pour l'API)
  title: string;
  description: string;
  image: string;
  donations: string;
  collected: string;
  progress: number;
  category: string;
  goal?: string;
  daysLeft?: string;
}

interface CagnottePage {
  featured: Cagnotte;
  small: Cagnotte[];
}

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentCagnottesPage, setCurrentCagnottesPage] = useState(0);
  const [activeFilter, setActiveFilter] = useState('Toutes');
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [loadingCagnottes, setLoadingCagnottes] = useState(false);

  // Catégories pour le carousel hero
  const categories = HERO_CATEGORIES;

  // Catégories supplémentaires pour le menu déroulant "Plus"
  const moreCategories = MORE_CATEGORIES;

  // Mapping des titres vers les IDs des cagnottes en base
  const cagnotteIds = {
    "Aider Youssef à vaincre le cancer": "ee62b2f6-2277-43e7-ad4b-bfbb17e344a2",
    "Bourse d'étude pour Amina": "e944a7d7-4626-4636-9ba1-b2bd6fac3ef1",
    "Reconstruction maison familiale": "9632ed69-18cb-41e7-bd9e-e4f73ef8213d",
    "Soins pour Noura": "c8d4ff6d-571e-46e6-8c3c-172c40656145",
    "Startup écologique": "d009acee-a262-4fec-a1f0-ed89ce1627e8",
    "Aide aux sinistrés de Sfax": "c85713b4-07b6-405b-8245-f98679449e5c",
    "Équipement pour école rurale": "6e5616b2-8850-48be-8ba6-a0a043779301",
    "Soins vétérinaires pour refuge": "219bbc6c-2f06-47fc-8182-9b644cbc77b9",
    "Formation professionnelle": "c188442a-529b-489f-8964-3773a362c8d5",
    "Aide aux personnes âgées": "55611946-f06a-4c83-ac83-68e47f884512",
    "Projet agricole communautaire": "82002d3d-ea29-4eb1-9390-4145c3193772",
    "Bibliothèque mobile": "043f88f0-77bb-44f6-9ea3-63360e6d0eef",
    "Centre de réhabilitation": "aa24d11d-714a-44dc-8b21-69a0893c0fd8",
    "Projet artistique": "12472c9d-50d7-47c6-b366-71066b25aac1",
    "Aide alimentaire d'urgence": "39e95d47-ff6b-4636-8ff3-629c715eff9f",
    "Aide Saeb à poursuivre ses études en informatique": "30afa078-48d9-4283-b65c-44f6b1a65182",
    "Bourse d'études pour Nour en médecine": "14f1fb5c-ccdc-4d29-9222-25685b430fbf",
    "Équipement informatique pour l'école rurale": "b29a33a9-2d0c-4fbb-ab27-0ddd9ccf6f58"
  };

  // Toutes les cagnottes avec leurs catégories
  const allCagnottes: Cagnotte[] = [
    {
      id: 1,
      title: "Aider Youssef à vaincre le cancer",
      description: "Soutien pour le traitement de Youssef, 8 ans, atteint d'une leucémie aiguë",
      image: "http://localhost:3000/uploads/cagnottes/youssef.webp",
      donations: "2,458 dons",
      collected: "78 000 DT",
      goal: "100 000 DT",
      progress: 78,
      daysLeft: "22 jours restants",
      category: "Santé"
    },
    {
      id: 2,
      title: "Bourse d'étude pour Amina",
      description: "Permettre à Amina de poursuivre ses études d'ingénieur",
      image: "http://localhost:3000/uploads/cagnottes/Bourses-amina.webp",
      donations: "756 dons",
      collected: "13 000 DT",
      progress: 65,
      category: "Éducation"
    },
    {
      id: 3,
      title: "Reconstruction maison familiale",
      description: "Aide pour la famille Ben Ali après l'incendie de leur maison",
      image: "http://localhost:3000/uploads/cagnottes/incendie.jpg",
      donations: "1,245 dons",
      collected: "46 000 DT",
      progress: 92,
      category: "Urgences"
    },
    {
      id: 4,
      title: "Soins pour Noura",
      description: "Traitement médical urgent pour Noura, 5 ans",
      image: "http://localhost:3000/uploads/cagnottes/aide%20noura.jpg",
      donations: "1,842 dons",
      collected: "22 500 DT",
      progress: 45,
      category: "Santé"
    },
    {
      id: 5,
      title: "Startup écologique",
      description: "Soutien à un jeune entrepreneur tunisien",
      image: "	http://localhost:3000/uploads/cagnottes/innovation%20%C3%A9cologie.avif",
      donations: "523 dons",
      collected: "16 000 DT",
      progress: 32,
      category: "Entreprises"
    },
    {
      id: 6,
      title: "Aide aux sinistrés de Sfax",
      description: "Soutien aux familles touchées par les inondations récentes",
      image: "http://localhost:3000/uploads/cagnottes/1639410564746.jpg",
      donations: "3,127 dons",
      collected: "125 000 DT",
      goal: "200 000 DT",
      progress: 62,
      daysLeft: "15 jours restants",
      category: "Urgences"
    },
    {
      id: 7,
      title: "Équipement pour école rurale",
      description: "Fournitures scolaires pour l'école primaire de Douz",
      image: "http://localhost:3000/uploads/cagnottes/pack-princess-pack-princess-03.jpg",
      donations: "892 dons",
      collected: "28 500 DT",
      progress: 71,
      category: "Éducation"
    },
    {
      id: 8,
      title: "Soins vétérinaires pour refuge",
      description: "Aide au refuge pour animaux abandonnés de Tunis",
      image: "http://localhost:3000/uploads/cagnottes/animals%20tunis.jpg",
      donations: "1,634 dons",
      collected: "34 200 DT",
      progress: 68,
      category: "Santé"
    },
    {
      id: 9,
      title: "Formation professionnelle",
      description: "Formation en informatique pour jeunes défavorisés",
      image: "http://localhost:3000/uploads/cagnottes/centre-de-formation-d-informatique-en-sfax_.jpg",
      donations: "445 dons",
      collected: "18 750 DT",
      progress: 47,
      category: "Éducation"
    },
    {
      id: 10,
      title: "Aide aux personnes âgées",
      description: "Soutien pour les soins à domicile des seniors isolés",
      image: "http://localhost:3000/uploads/cagnottes/personnes%20%C3%A2g%C3%A9es.jpg",
      donations: "2,156 dons",
      collected: "67 800 DT",
      progress: 85,
      category: "Santé"
    },
    {
      id: 11,
      title: "Projet agricole communautaire",
      description: "Développement d'une ferme coopérative dans le sud tunisien",
      image: "http://localhost:3000/uploads/cagnottes/societe_agricole.jpg",
      donations: "1,789 dons",
      collected: "89 500 DT",
      goal: "150 000 DT",
      progress: 60,
      daysLeft: "8 jours restants",
      category: "Entreprises"
    },
    {
      id: 12,
      title: "Bibliothèque mobile",
      description: "Camion-bibliothèque pour les villages isolés",
      image: "	http://localhost:3000/uploads/cagnottes/Camion-biblioth%C3%A8que.avif",
      donations: "567 dons",
      collected: "22 300 DT",
      progress: 56,
      category: "Éducation"
    },
    {
      id: 13,
      title: "Centre de réhabilitation",
      description: "Centre pour personnes en situation de handicap",
      image: "http://localhost:3000/uploads/cagnottes/Centre%20de%20r%C3%A9habilitation.webp",
      donations: "2,891 dons",
      collected: "156 000 DT",
      progress: 78,
      category: "Santé"
    },
    {
      id: 14,
      title: "Projet artistique",
      description: "Ateliers d'art pour enfants des quartiers populaires",
      image: "http://localhost:3000/uploads/cagnottes/K-LIVE-KIDS-atelierrrr.png",
      donations: "734 dons",
      collected: "19 800 DT",
      progress: 40,
      category: "Éducation"
    },
    {
      id: 15,
      title: "Aide alimentaire d'urgence",
      description: "Distribution de paniers alimentaires aux plus démunis",
      image: "http://localhost:3000/uploads/cagnottes/boite-donation.jpg",
      donations: "4,123 dons",
      collected: "203 500 DT",
      progress: 92,
      category: "Urgences"
    },
    // Cagnottes pour les nouvelles catégories
    {
      id: 16,
      title: "Refuge pour animaux abandonnés",
      description: "Construction d'un nouveau refuge pour chiens et chats errants",
      image: "http://localhost:3000/uploads/cagnottes/refuge-animaux.jpg",
      donations: "1,234 dons",
      collected: "45 000 DT",
      progress: 60,
      category: "Animaux"
    },
    {
      id: 17,
      title: "Startup technologique",
      description: "Développement d'une application mobile innovante",
      image: "http://localhost:3000/uploads/cagnottes/startup-tech.jpg",
      donations: "856 dons",
      collected: "67 500 DT",
      progress: 45,
      category: "Technologie"
    },
    {
      id: 18,
      title: "Festival de musique locale",
      description: "Organisation d'un festival pour promouvoir les artistes tunisiens",
      image: "http://localhost:3000/uploads/cagnottes/festival-musique.jpg",
      donations: "2,145 dons",
      collected: "89 000 DT",
      progress: 74,
      category: "Culture"
    },
    {
      id: 19,
      title: "Équipement sportif pour jeunes",
      description: "Achat d'équipements pour le club de football local",
      image: "http://localhost:3000/uploads/cagnottes/sport-equipement.jpg",
      donations: "1,567 dons",
      collected: "34 200 DT",
      progress: 68,
      category: "Sport"
    },
    {
      id: 20,
      title: "Construction d'une mosquée",
      description: "Financement de la construction d'une mosquée dans le quartier",
      image: "http://localhost:3000/uploads/cagnottes/mosquee-construction.jpg",
      donations: "3,245 dons",
      collected: "156 800 DT",
      progress: 78,
      category: "Religion"
    },
    // Cagnottes supplémentaires pour les catégories manquantes
    {
      id: 21,
      title: "Projet de reforestation",
      description: "Planter des arbres pour lutter contre la désertification",
      image: "http://localhost:3000/uploads/cagnottes/environnement.jpg",
      donations: "1,856 dons",
      collected: "67 300 DT",
      progress: 55,
      category: "Environnement"
    },
    {
      id: 22,
      title: "Centre culturel local",
      description: "Création d'un espace culturel pour jeunes artistes",
      image: "http://localhost:3000/uploads/cagnottes/culture.jpg",
      donations: "2,134 dons",
      collected: "89 200 DT",
      progress: 71,
      category: "Culture"
    },
    {
      id: 23,
      title: "Mémorial pour les héros",
      description: "Ériger un monument en mémoire des héros locaux",
      image: "http://localhost:3000/uploads/cagnottes/memorial.jpg",
      donations: "4,567 dons",
      collected: "234 500 DT",
      progress: 88,
      category: "Mémorial"
    },
    {
      id: 24,
      title: "Projet de solidarité communautaire",
      description: "Aide aux familles les plus démunies du quartier",
      image: "http://localhost:3000/uploads/cagnottes/solidarite.jpg",
      donations: "3,789 dons",
      collected: "145 600 DT",
      progress: 76,
      category: "Solidarité"
    },
    {
      id: 25,
      title: "Programme de bénévolat",
      description: "Organiser des actions bénévoles pour la communauté",
      image: "http://localhost:3000/uploads/cagnottes/benevolat.jpg",
      donations: "1,234 dons",
      collected: "45 800 DT",
      progress: 61,
      category: "Bénévolat"
    },
    {
      id: 26,
      title: "Soutien aux familles monoparentales",
      description: "Aide aux mères célibataires et leurs enfants",
      image: "http://localhost:3000/uploads/cagnottes/famille.jpg",
      donations: "2,456 dons",
      collected: "78 900 DT",
      progress: 68,
      category: "Famille"
    },
    {
      id: 27,
      title: "Festival de musique en plein air",
      description: "Organisation d'un événement musical pour la jeunesse",
      image: "http://localhost:3000/uploads/cagnottes/evenements.jpg",
      donations: "3,567 dons",
      collected: "112 400 DT",
      progress: 74,
      category: "Événements"
    },
    {
      id: 28,
      title: "Aventure écologique au désert",
      description: "Expedition éco-responsable pour jeunes aventuriers",
      image: "http://localhost:3000/uploads/cagnottes/voyages.jpg",
      donations: "1,123 dons",
      collected: "34 600 DT",
      progress: 52,
      category: "Voyages"
    },
    {
      id: 29,
      title: "Projet innovant divers",
      description: "Soutenir une cause unique et innovante",
      image: "http://localhost:3000/uploads/cagnottes/autre.jpg",
      donations: "876 dons",
      collected: "28 500 DT",
      progress: 43,
      category: "Autre"
    }
  ];

  // Charger les cagnottes depuis l'API
  const [allCagnottesFromAPI, setAllCagnottesFromAPI] = useState<Cagnotte[]>([]);

  useEffect(() => {
    const fetchCagnottes = async () => {
      setLoadingCagnottes(true);
      try {
        const response = await fetch('http://localhost:5000/api/cagnottes?status=ACTIVE&limit=50');
        if (response.ok) {
          const result = await response.json();
          const cagnottes = result.data.cagnottes || result.data || [];
          
          // Transformer les données de l'API en format Cagnotte
          const transformedCagnottes: Cagnotte[] = cagnottes.map((cagnotte: any, index: number) => ({
            id: cagnotte.id || index + 1,
            cagnotteId: cagnotte.id, // 👈 Ajouter l'ID de la cagnotte de la base de données
            title: cagnotte.title,
            description: cagnotte.description,
            image: cagnotte.coverImage || "http://localhost:3000/uploads/cagnottes/default.jpg",
            donations: `${cagnotte.donations?.length || 0} dons`,
            collected: `${(cagnotte.currentAmount || 0).toLocaleString()} DT`,
            goal: `${(cagnotte.goalAmount || 0).toLocaleString()} DT`,
            progress: cagnotte.goalAmount ? Math.round((cagnotte.currentAmount / cagnotte.goalAmount) * 100) : 0,
            daysLeft: cagnotte.endDate ? `Jours restants: ${Math.ceil((new Date(cagnotte.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}` : undefined,
            category: cagnotte.category?.name || "Autre"
          }));
          
          setAllCagnottesFromAPI(transformedCagnottes);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des cagnottes:', error);
        // En cas d'erreur, utiliser les cagnottes statiques
        setAllCagnottesFromAPI(allCagnottes);
      } finally {
        setLoadingCagnottes(false);
      }
    };

    fetchCagnottes();
  }, []);

  // Filtrage des cagnottes par catégorie
  const getFilteredCagnottes = () => {
    // Utiliser les cagnottes de l'API si disponibles, sinon les statiques
    const cagnottesToFilter = allCagnottesFromAPI.length > 0 ? allCagnottesFromAPI : allCagnottes;
    
    if (activeFilter === 'Toutes') {
      return cagnottesToFilter;
    }
    return cagnottesToFilter.filter(cagnotte => cagnotte.category === activeFilter);
  };

  const filteredCagnottes = getFilteredCagnottes();

  // Organisation des cagnottes filtrées en pages (1 featured + 4 small par page)
  const organizeCagnottesIntoPages = (): CagnottePage[] => {
    const pages: CagnottePage[] = [];
    const cagnottes = [...filteredCagnottes];
    
    while (cagnottes.length > 0) {
      const featured = cagnottes.shift(); // Premier élément comme featured
      const small = cagnottes.splice(0, 4); // Les 4 suivants comme small
      
      if (featured) {
        pages.push({ featured, small });
      }
    }
    
    return pages.length > 0 ? pages : [{
      featured: filteredCagnottes[0] || allCagnottes[0],
      small: []
    }];
  };

  const cagnottesData: CagnottePage[] = organizeCagnottesIntoPages();

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

  // Gestion des filtres de catégories
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentCagnottesPage(0); // Réinitialiser à la première page lors du changement de filtre
    setShowMoreCategories(false); // Fermer le menu déroulant
  };

  // Gestion du menu déroulant "Plus"
  const toggleMoreCategories = () => {
    setShowMoreCategories(!showMoreCategories);
  };

  // Réinitialiser la page si elle dépasse le nombre de pages disponibles
  useEffect(() => {
    if (currentCagnottesPage >= cagnottesData.length && cagnottesData.length > 0) {
      setCurrentCagnottesPage(0);
    }
  }, [activeFilter, cagnottesData.length, currentCagnottesPage]);

  // Fermer le menu déroulant quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-more-container')) {
        setShowMoreCategories(false);
      }
    };

    if (showMoreCategories) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreCategories]);

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
  const currentCagnottes = cagnottesData[currentCagnottesPage] || cagnottesData[0];

  return (
    <div className="home-hero-bubbles">
      {/* Styles pour le menu déroulant */}
      <style>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes dropdownFadeOut {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
        }
        
        .more-categories-dropdown {
          animation: dropdownFadeIn 0.2s ease-out;
        }
        
        @media (max-width: 768px) {
          .more-categories-dropdown {
            left: 0 !important;
            transform: none !important;
            width: 100% !important;
          }
          
          @keyframes dropdownFadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
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
              <button 
                className={`filter-button ${activeFilter === 'Toutes' ? 'filter-active' : ''}`}
                onClick={() => handleFilterChange('Toutes')}
              >
                Toutes
              </button>
              {MAIN_FILTER_CATEGORIES.map((category) => (
                <button 
                  key={category}
                  className={`filter-button ${activeFilter === category ? 'filter-active' : ''}`}
                  onClick={() => handleFilterChange(category)}
                >
                  {category}
                </button>
              ))}
              <div className="filter-more-container" style={{ position: 'relative', display: 'inline-block' }}>
                <button 
                  className={`filter-button filter-more ${showMoreCategories ? 'active' : ''}`}
                  onClick={toggleMoreCategories}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative',
                    zIndex: 1001
                  }}
                >
                  Plus
                  <svg 
                    className={`filter-icon ${showMoreCategories ? 'rotated' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ 
                      transform: showMoreCategories ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      width: '16px',
                      height: '16px'
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {/* Menu déroulant */}
                {showMoreCategories && (
                  <div 
                    className="more-categories-dropdown"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      minWidth: windowWidth > 768 ? '200px' : '160px',
                      maxWidth: windowWidth > 768 ? '250px' : '200px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
                      zIndex: 1000,
                      padding: '12px 0',
                      marginTop: '4px',
                      backdropFilter: 'blur(10px)',
                      animation: 'dropdownFadeIn 0.2s ease-out'
                    }}
                  >
                    {moreCategories.map((category, index) => (
                      <button
                        key={index}
                        className={`dropdown-category-button ${activeFilter === category ? 'active' : ''}`}
                        onClick={() => handleFilterChange(category)}
                        style={{
                          width: '100%',
                          padding: windowWidth > 768 ? '12px 20px' : '10px 16px',
                          border: 'none',
                          backgroundColor: activeFilter === category ? '#f0fdf4' : 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: windowWidth > 768 ? '14px' : '13px',
                          fontWeight: activeFilter === category ? '600' : '400',
                          color: activeFilter === category ? '#16a34a' : '#374151',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          if (activeFilter !== category) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                            e.currentTarget.style.color = '#1f2937';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeFilter !== category) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#374151';
                          }
                        }}
                      >
                        {activeFilter === category && (
                          <div 
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#16a34a',
                              flexShrink: 0
                            }}
                          />
                        )}
                        <span>{category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
          {loadingCagnottes ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <p style={{ fontSize: '18px' }}>Chargement des cagnottes...</p>
            </div>
          ) : filteredCagnottes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>Aucune cagnotte trouvée dans cette catégorie</p>
              <p style={{ fontSize: '14px' }}>Essayez une autre catégorie ou consultez toutes les cagnottes</p>
            </div>
          ) : (
            <div className="cagnottes-grid">
              {/* Cagnotte principale (à gauche) */}
              <div className="cagnotte-featured">
              <div 
                className="cagnotte-link" 
                onClick={() => {
                  const cagnotteId = currentCagnottes.featured.cagnotteId || cagnotteIds[currentCagnottes.featured.title];
                  if (cagnotteId && cagnotteId !== '#') {
                    navigate(`/cagnottes/${cagnotteId}`);
                  } else {
                    console.warn('ID de cagnotte non trouvé pour:', currentCagnottes.featured.title);
                    alert('Impossible de charger cette cagnotte. ID non trouvé.');
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
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
              </div>
            </div>

            {/* Liste des 4 cagnottes (à droite) */}
            <div className="cagnottes-list">
              {currentCagnottes.small.map((cagnotte) => (
                <div key={cagnotte.id} className="cagnotte-item">
                  <div 
                    className="cagnotte-link" 
                    onClick={() => {
                      const cagnotteId = cagnotte.cagnotteId || cagnotteIds[cagnotte.title];
                      if (cagnotteId && cagnotteId !== '#') {
                        navigate(`/cagnottes/${cagnotteId}`);
                      } else {
                        console.warn('ID de cagnotte non trouvé pour:', cagnotte.title);
                        alert('Impossible de charger cette cagnotte. ID non trouvé.');
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
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
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

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