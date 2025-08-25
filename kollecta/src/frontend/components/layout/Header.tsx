import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAuthenticated, logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { Search, Menu, X } from 'lucide-react';
import { profileService } from '../../services/profile/profileService';
import { setProfileData } from '../../store/slices/profileSlice';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profileData = useSelector((state: RootState) => state.profile.data);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const displayName = user?.firstName || 'Utilisateur';

  // Recharger automatiquement les données de profil si elles ne sont pas disponibles
  useEffect(() => {
    const loadProfileData = async () => {
      if (isAuthenticated && user?.id && !profileData) {
        try {
          console.log('🔄 Rechargement automatique des données de profil...');
          const profile = await profileService.getProfile(user.id);
          dispatch(setProfileData(profile));
          console.log('✅ Données de profil rechargées:', profile);
        } catch (error) {
          console.error('❌ Erreur lors du rechargement du profil:', error);
        }
      }
    };

    // Délai court pour éviter les appels multiples
    const timer = setTimeout(loadProfileData, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user?.id, profileData, dispatch]);

  // Gestion du scroll pour la transparence
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // 🔧 NOUVEAU : Fonction pour corriger l'URL des images
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }
    return imagePath;
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleSignUpClick = () => {
    navigate('/register');
    setIsMobileMenuOpen(false);
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <header className={`header_homepage-header-fixed__JbfMx hrt-header hrt-header--fixed ${!isScrolled ? 'header_homepage-header-fixed--transparent__2lozc' : ''} default-header_shared-default-header__Nebuq`}>
        <a className="hrt-header-skip hrt-show-on-focus hrt-tertiary-button hrt-tertiary-button--inline hrt-tertiary-button--default hrt-base-button" href="#skipnav">
          Passer au contenu
        </a>
        
        <div className="hrt-width-full hrt-container">
          <nav className="hrt-header-nav" aria-label="Menu principal">
            {/* Partie gauche */}
            <div className="hrt-header-left">
              <a className="hrt-hide-min-md hrt-tertiary-icon-button hrt-tertiary-icon-button--medium hrt-tertiary-icon-button--default hrt-base-button" aria-label="Rechercher" href="/s">
                <Search className="hrt-icon hrt-icon--default" />
              </a>
              
              <a className="hrt-hide-max-md hrt-tertiary-button hrt-tertiary-button--inline hrt-tertiary-button--default hrt-base-button" aria-label="Rechercher" href="/s">
                <Search className="hrt-mr-1 hrt-icon hrt-icon--small" />
                Rechercher
              </a>
              
              <div className="hrt-hide-max-lg hrt-header-dropdown">
                <button className="hrt-ml-1 hrt-header-dropdown-button hrt-tertiary-button hrt-tertiary-button--inline hrt-tertiary-button--default hrt-base-button" type="button">
              Je soutiens
                  <div className="hrt-header-dropdown-caret"></div>
                </button>
                <div className="hrt-header-dropdown-content hrt-header-dropdown-content--left hrt-header-dropdown-content--multi-column">
                  <div className="hrt-header-dropdown-title">
                    <div className="hrt-spot-icon hrt-spot-icon--neutral hrt-spot-icon--large hrt-spot-icon--default">
                      <svg aria-hidden="true" className="hrt-icon hrt-icon--default" focusable="false" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
                      </svg>
                    </div>
                    <p className="hrt-text-legend hrt-mb-0">Découvrez les cagnottes que vous pouvez soutenir</p>
                  </div>
                  <ul className="hrt-list-unstyled">
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/discover">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Catégories</span>
                          <div className="hrt-base-list-item-description">Parcourir les cagnottes par catégorie</div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="hrt-hide-max-lg hrt-header-dropdown">
                <button className="hrt-ml-1 hrt-header-dropdown-button hrt-tertiary-button hrt-tertiary-button--inline hrt-tertiary-button--default hrt-base-button" type="button">
                  Collecter des fonds
                  <div className="hrt-header-dropdown-caret"></div>
                </button>
                <div className="hrt-header-dropdown-content hrt-header-dropdown-content--left hrt-header-dropdown-content--multi-column">
                  <div className="hrt-header-dropdown-title">
                    <div className="hrt-spot-icon hrt-spot-icon--neutral hrt-spot-icon--large hrt-spot-icon--default">
                      <svg aria-hidden="true" className="hrt-icon hrt-icon--default" focusable="false" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z"></path>
                      </svg>
                    </div>
                    <p className="hrt-text-legend hrt-mb-0">Démarrez une cagnotte, conseils et ressources</p>
                  </div>
                  <ul className="hrt-list-unstyled">
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/start">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Comment démarrer une cagnotte</span>
                          <div className="hrt-base-list-item-description">Aide guidée, exemples et plus encore</div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/team-fundraising">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Collecte de fonds en équipe</span>
                          <div className="hrt-base-list-item-description">Collectez des fonds en équipe</div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/blog">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Blog sur la collecte de fonds</span>
                          <div className="hrt-base-list-item-description">Ressources, conseils et bien plus encore</div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/fundraising-tips">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Conseils pour collecter des fonds</span>
                          <div className="hrt-base-list-item-description">Le guide de référence avec des conseils sur la collecte de fonds</div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/fundraising-ideas">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Idées de collecte de fonds</span>
                          <div className="hrt-base-list-item-description">Idées pour stimuler votre créativité</div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Logo centre */}
            <div className="hrt-header-center">
              <a className="hrt-link hrt-link--gray-dark hrt-link--unstyled" aria-label="Kollecta.com" href="/">
                <div className="kollecta-logo">
                  <span className="kollecta-logo-text">KOLLECTA</span>
                </div>
              </a>
            </div>
            
            {/* Partie droite (desktop) */}
            <div className="hrt-hide-max-lg hrt-header-right">
              <div className="hrt-hide-max-lg hrt-header-dropdown">
                <button className="hrt-header-dropdown-button hrt-tertiary-button hrt-tertiary-button--inline hrt-tertiary-button--default hrt-base-button" type="button">
                  À propos de
                  <div className="hrt-header-dropdown-caret"></div>
                </button>
                <div className="hrt-header-dropdown-content hrt-header-dropdown-content--right hrt-header-dropdown-content--multi-column">
                  <div className="hrt-header-dropdown-title">
                    <div className="hrt-spot-icon hrt-spot-icon--neutral hrt-spot-icon--large hrt-spot-icon--default">
                      <svg aria-hidden="true" className="hrt-icon hrt-icon--default" focusable="false" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                      </svg>
                    </div>
                    <p className="hrt-text-legend hrt-mb-0">Comment ça marche, les tarifs, et plus encore</p>
                  </div>
                  <ul className="hrt-list-unstyled">
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/how-it-works">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Comment fonctionne Kollecta</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/guarantee">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Garantie des dons Kollecta</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/supported-countries">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Pays couverts</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/pricing">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Tarifs</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/support">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Centre d'assistance</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/about">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">À propos de Kollecta</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/press">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Centre de presse</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a className="hrt-base-list-item--body-size hrt-base-list-item" href="/careers">
                        <div className="hrt-base-list-item-copy">
                          <span className="hrt-base-list-item-title">Emplois</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Menu utilisateur connecté ou boutons de connexion */}
              {isAuthenticated ? (
                <div className="hrt-hide-max-lg hrt-header-dropdown">
                  <button className="hrt-ml-1 hrt-header-dropdown-button hrt-tertiary-button hrt-tertiary-button--inline hrt-tertiary-button--default hrt-base-button" type="button">
                    <div className="hrt-position-relative">
                      <div className="hrt-default-avatar hrt-avatar hrt-avatar--default hrt-avatar--neutral">
                        {profileData?.profilePicture ? (
                          <img 
                            src={getImageUrl(profileData.profilePicture)} 
                            alt="Profile" 
                            className="hrt-profile-avatar"
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              console.log('❌ Erreur de chargement de l\'image de profil, affichage de l\'icône par défaut');
                              e.currentTarget.style.display = 'none';
                              // Afficher l'icône SVG par défaut
                              const svgElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (svgElement) {
                                svgElement.style.display = 'block';
                              }
                            }}
                          />
                        ) : null}
                        <svg 
                          aria-hidden="true" 
                          className="hrt-icon hrt-icon--default" 
                          focusable="false" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          width="24"
                          style={{
                            display: profileData?.profilePicture ? 'none' : 'block'
                          }}
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                        </svg>
                      </div>
                      <span className="hrt-text hrt-text-default hrt-text-body-md hrt-sr-only">menu du compte</span>
                    </div>
                    {displayName}
                    <div className="hrt-header-dropdown-caret"></div>
                  </button>
                  <div className="hrt-header-dropdown-content hrt-header-dropdown-content--right">
                    <ul className="hrt-list-unstyled">
                      {/* 🔐 LIEN ADMIN : Afficher le lien vers le dashboard admin pour les administrateurs */}
                      {user?.role === 'ADMIN' && (
                        <li>
                          <a className="hrt-base-list-item--body-size hrt-base-list-item" onClick={() => navigate('/admin')}>
                            <div className="hrt-base-list-item-copy">
                              <span className="hrt-base-list-item-title">🛡️ Dashboard Admin</span>
                            </div>
                          </a>
                        </li>
                      )}
                      {/* 👤 PROFIL : Afficher seulement pour les utilisateurs non-admin */}
                      {user?.role !== 'ADMIN' && (
                        <li>
                          <a className="hrt-base-list-item--body-size hrt-base-list-item" onClick={handleProfileClick}>
                            <div className="hrt-base-list-item-copy">
                              <span className="hrt-base-list-item-title">Profil</span>
                            </div>
                          </a>
                        </li>
                      )}
                      <li>
                        <a className="hrt-base-list-item--body-size hrt-base-list-item" onClick={() => navigate('/portee')}>
                          <div className="hrt-base-list-item-copy">
                            <span className="hrt-base-list-item-title">Portée de votre action</span>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a className="hrt-base-list-item--body-size hrt-base-list-item" onClick={() => navigate('/parametres')}>
                          <div className="hrt-base-list-item-copy">
                            <span className="hrt-base-list-item-title">Paramètres</span>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a className="hrt-base-list-item--body-size hrt-base-list-item" onClick={handleLogout}>
                          <div className="hrt-base-list-item-copy">
                            <span className="hrt-base-list-item-title">Se déconnecter</span>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <a className="hrt-ml-1 hrt-tertiary-button hrt-tertiary-button--inline hrt-tertiary-button--default hrt-base-button" onClick={handleLoginClick}>
                    Se connecter
                  </a>
                  
                  <a className="hrt-ml-2 hrt-rounded-full hrt-secondary-button hrt-secondary-button--inline hrt-secondary-button--small hrt-secondary-button--default hrt-base-button" onClick={handleSignUpClick}>
                    Démarrer une cagnotte
                  </a>
                </>
              )}
            </div>
            
            {/* Menu mobile */}
            <div className="hrt-hide-min-lg hrt-header-right">
              <button 
                className="hrt-tertiary-icon-button hrt-tertiary-icon-button--medium hrt-tertiary-icon-button--default hrt-base-button" 
                type="button" 
                aria-label="menu"
                onClick={openMobileMenu}
              >
                <Menu className="hrt-icon hrt-icon--default" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Overlay pour menu mobile */}
      <div className={`hrt-overlay ${isMobileMenuOpen ? 'show' : ''}`} onClick={closeMobileMenu}></div>

      {/* Menu mobile */}
      <div className={`hrt-rounded-0 hrt-side-modal hrt-side-modal-right ${isMobileMenuOpen ? 'show' : ''}`} style={{ width: '326px' }}>
        <div className="menu_menuContentContainer__2iG9n">
          <div className="menu_menuContent__uwNGY menu_menuContentActive__ovt8p">
            <div className="hrt-modal-header">
              <button 
                className="hrt-modal-header-button--close hrt-tertiary-icon-button hrt-tertiary-icon-button--medium hrt-tertiary-icon-button--default hrt-base-button" 
                type="button" 
                aria-label="Fermer la boîte de dialogue"
                onClick={closeMobileMenu}
              >
                <X className="hrt-icon hrt-icon--large" />
              </button>
            </div>
            <div className="hrt-modal-body">
              <nav aria-labelledby="dh-mobile-menu-us">
                <ul className="hrt-list-unstyled">
                  <li>
                    <a className="hrt-base-list-item" href="#">
                      <div className="hrt-base-list-item-copy">
                        <span className="hrt-base-list-item-title">Je soutiens</span>
                        <span className="hrt-base-list-item-description">Découvrez les cagnottes que vous pouvez soutenir</span>
                      </div>
                      <svg aria-hidden="true" className="hrt-icon hrt-icon--small" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a className="hrt-base-list-item" href="#">
                      <div className="hrt-base-list-item-copy">
                        <span className="hrt-base-list-item-title">Collecter des fonds</span>
                        <span className="hrt-base-list-item-description">Démarrez une cagnotte, conseils et ressources</span>
                      </div>
                      <svg aria-hidden="true" className="hrt-icon hrt-icon--small" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a className="hrt-base-list-item" href="#">
                      <div className="hrt-base-list-item-copy">
                        <span className="hrt-base-list-item-title">À propos de</span>
                        <span className="hrt-base-list-item-description">Comment ça marche, les tarifs, et plus encore</span>
                      </div>
                      <svg aria-hidden="true" className="hrt-icon hrt-icon--small" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a className="hrt-base-list-item" href="/support">
                      <div className="hrt-base-list-item-copy">
                        <span className="hrt-base-list-item-title">Centre d'assistance</span>
                        <span className="hrt-base-list-item-description">Support technique et aide</span>
                      </div>
                      <svg aria-hidden="true" className="hrt-icon hrt-icon--small" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </a>
                  </li>
                </ul>
                
                <div className="menu-bottom-buttons">
                  <a href="#" className="hrt-ml-2 hrt-rounded-full hrt-secondary-button hrt-secondary-button--inline hrt-secondary-button--small hrt-secondary-button--default hrt-base-button" onClick={handleSignUpClick}>Démarrer une cagnotte</a>
                  {isAuthenticated ? (
                    <a href="#" className="hrt-secondary-button" onClick={handleLogout}>Se déconnecter</a>
                  ) : (
                    <a href="#" className="hrt-secondary-button" onClick={handleLoginClick}>Se connecter</a>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;