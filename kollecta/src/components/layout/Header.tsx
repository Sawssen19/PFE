import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAuthenticated, logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { Search, Menu, X, Bell } from 'lucide-react';
import { profileService } from '../../features/profile/profileService';
import { setProfileData } from '../../store/slices/profileSlice';
import { notificationsService } from '../../features/notifications/notificationsService';
import { setNotifications, setUnreadCount } from '../../store/slices/notificationsSlice';
import NotificationDropdown from '../notifications/NotificationDropdown';
import './NotificationButton.css';
import './MobileMenu.css';
import './HeaderButtons.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profileData = useSelector((state: RootState) => state.profile.data);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  // Charger les notifications de l'utilisateur connecté (sauf pour les admins)
  useEffect(() => {
    const loadNotifications = async () => {
      // Ne pas charger les notifications pour les admins
      if (isAuthenticated && user?.id && user?.role !== 'ADMIN') {
        try {
          const response = await notificationsService.getNotifications(1, 20);
          if (response.success) {
            dispatch(setNotifications(response.data.notifications));
            dispatch(setUnreadCount(response.data.unreadCount));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des notifications:', error);
        }
      }
    };

    // Charger immédiatement
    loadNotifications();
    
    // Recharger les notifications toutes les 60 secondes (sauf pour les admins)
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id, user?.role, dispatch]);

  // Recharger les notifications lors des changements de page
  useEffect(() => {
    if (isAuthenticated && user?.id && user?.role !== 'ADMIN') {
      const loadNotifications = async () => {
        try {
          const response = await notificationsService.getNotifications(1, 20);
          if (response.success) {
            dispatch(setNotifications(response.data.notifications));
            dispatch(setUnreadCount(response.data.unreadCount));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des notifications:', error);
        }
      };
      
      // Délai court pour éviter les appels multiples lors de la navigation rapide
      const timer = setTimeout(loadNotifications, 300);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isAuthenticated, user?.id, user?.role, dispatch]);

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
    document.body.classList.add('menu-open');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedMenu(null);
    document.body.classList.remove('menu-open');
  };

  const toggleSubMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
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
              <button 
                className={`hrt-hide-min-md header-icon-button ${isMobileMenuOpen ? 'hidden' : ''}`}
                aria-label="Rechercher" 
                onClick={() => navigate('/search')}
              >
                <Search size={22} />
              </button>
              
              <button 
                className="hrt-hide-max-md hrt-tertiary-button hrt-tertiary-button--inline hrt-tertiary-button--default hrt-base-button" 
                aria-label="Rechercher" 
                onClick={() => navigate('/search')}
                style={{ cursor: 'pointer' }}
              >
                <Search className="hrt-mr-1 hrt-icon hrt-icon--small" />
                Rechercher
              </button>
              
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
                  </ul>
                </div>
              </div>
              
              {/* Menu utilisateur connecté ou boutons de connexion */}
              {isAuthenticated ? (
                <>
                  {/* Icône de notification améliorée - Masquée pour les admins car ils ont leur dashboard */}
                  {user?.role !== 'ADMIN' && (
                    <div className="notification-container" style={{ position: 'relative', marginLeft: '8px', zIndex: 10000, overflow: 'visible' }}>
                      <button 
                        className={`notification-button ${showNotifications ? 'active' : ''}`}
                        onClick={() => setShowNotifications(!showNotifications)}
                        aria-label="Notifications"
                        style={{ 
                          position: 'relative', 
                          zIndex: 10000, 
                          overflow: 'visible',
                          opacity: 1,
                          color: '#FFFFFF'
                        }}
                      >
                        <Bell 
                          size={22} 
                          style={{
                            strokeWidth: showNotifications ? 2.5 : 2,
                            transition: 'all 0.2s ease',
                            position: 'relative',
                            zIndex: 1,
                            opacity: 1,
                            color: '#6b7280',
                            stroke: '#6b7280',
                            fill: 'none'
                          }}
                        />
                        
                        {/* Badge de notification non lues */}
                        {unreadCount > 0 && (
                          <span 
                            className="notification-badge" 
                            style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: unreadCount > 9 ? '26px' : '22px',
                              height: '22px',
                              padding: unreadCount > 9 ? '0 6px' : '0 7px',
                              background: '#ef4444',
                              color: '#FFFFFF',
                              WebkitTextFillColor: '#FFFFFF',
                              borderRadius: '11px',
                              fontSize: '12px',
                              fontWeight: '800',
                              border: '3px solid white',
                              boxShadow: '0 3px 8px rgba(239, 68, 68, 0.5), 0 0 0 2px rgba(239, 68, 68, 0.2)',
                              animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                              lineHeight: '1',
                              whiteSpace: 'nowrap',
                              zIndex: 10001,
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                            }}
                          >
                            <span style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}>
                              {unreadCount > 9 ? '+9' : unreadCount}
                            </span>
                          </span>
                        )}
                      </button>
                      
                      <NotificationDropdown 
                        isOpen={showNotifications} 
                        onClose={() => setShowNotifications(false)} 
                      />
                    </div>
                  )}

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
                        <a className="hrt-base-list-item--body-size hrt-base-list-item" onClick={() => navigate('/my-cagnottes')}>
                          <div className="hrt-base-list-item-copy">
                            <span className="hrt-base-list-item-title">Mes cagnottes</span>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a className="hrt-base-list-item--body-size hrt-base-list-item" onClick={() => navigate('/promises')}>
                          <div className="hrt-base-list-item-copy">
                            <span className="hrt-base-list-item-title">Mes promesses</span>
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
                </>
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
                className="header-icon-button header-menu-button"
                type="button" 
                aria-label="menu"
                onClick={openMobileMenu}
              >
                <Menu size={22} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Overlay pour menu mobile */}
      <div className={`hrt-overlay ${isMobileMenuOpen ? 'show' : ''}`} onClick={closeMobileMenu}></div>

      {/* Menu mobile */}
      <div className={`hrt-rounded-0 hrt-side-modal hrt-side-modal-right mobile-menu-container ${isMobileMenuOpen ? 'show' : ''}`}>
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
        <div className="hrt-modal-body mobile-menu-body">
              <nav aria-labelledby="dh-mobile-menu-us">
                <ul className="mobile-menu-list">
                  {/* Je soutiens */}
                  <li className="mobile-menu-item">
                    <a 
                      className="mobile-menu-link" 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/discover');
                        closeMobileMenu();
                      }}
                    >
                      <div className="mobile-menu-link-content">
                        <span className="mobile-menu-link-title">Je soutiens</span>
                        <span className="mobile-menu-link-description">Découvrez les cagnottes que vous pouvez soutenir</span>
                      </div>
                      <svg aria-hidden="true" className="mobile-menu-arrow" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </a>
                  </li>

                  {/* Collecter des fonds - avec sous-menu */}
                  <li className="mobile-menu-item">
                    <button 
                      className={`mobile-menu-link mobile-menu-toggle ${expandedMenu === 'fundraising' ? 'expanded' : ''}`}
                      onClick={() => toggleSubMenu('fundraising')}
                    >
                      <div className="mobile-menu-link-content">
                        <span className="mobile-menu-link-title">Collecter des fonds</span>
                        <span className="mobile-menu-link-description">Démarrez une cagnotte, conseils et ressources</span>
                      </div>
                      <svg 
                        aria-hidden="true" 
                        className={`mobile-menu-arrow ${expandedMenu === 'fundraising' ? 'rotated' : ''}`} 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24"
                      >
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </button>
                    {expandedMenu === 'fundraising' && (
                      <ul className="mobile-submenu">
                        <li>
                          <a 
                            className="mobile-submenu-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/start');
                              closeMobileMenu();
                            }}
                          >
                            Comment démarrer une cagnotte
                          </a>
                        </li>
                        <li>
                          <a 
                            className="mobile-submenu-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/team-fundraising');
                              closeMobileMenu();
                            }}
                          >
                            Collecte de fonds en équipe
                          </a>
                        </li>
                        <li>
                          <a 
                            className="mobile-submenu-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/blog');
                              closeMobileMenu();
                            }}
                          >
                            Blog sur la collecte de fonds
                          </a>
                        </li>
                        <li>
                          <a 
                            className="mobile-submenu-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/fundraising-tips');
                              closeMobileMenu();
                            }}
                          >
                            Conseils pour collecter des fonds
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>

                  {/* À propos de - avec sous-menu */}
                  <li className="mobile-menu-item">
                    <button 
                      className={`mobile-menu-link mobile-menu-toggle ${expandedMenu === 'about' ? 'expanded' : ''}`}
                      onClick={() => toggleSubMenu('about')}
                    >
                      <div className="mobile-menu-link-content">
                        <span className="mobile-menu-link-title">À propos de</span>
                        <span className="mobile-menu-link-description">Comment ça marche, et plus encore</span>
                      </div>
                      <svg 
                        aria-hidden="true" 
                        className={`mobile-menu-arrow ${expandedMenu === 'about' ? 'rotated' : ''}`} 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24"
                      >
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </button>
                    {expandedMenu === 'about' && (
                      <ul className="mobile-submenu">
                        <li>
                          <a 
                            className="mobile-submenu-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/how-it-works');
                              closeMobileMenu();
                            }}
                          >
                            Comment fonctionne Kollecta
                          </a>
                        </li>
                        <li>
                          <a 
                            className="mobile-submenu-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/guarantee');
                              closeMobileMenu();
                            }}
                          >
                            Garantie des dons Kollecta
                          </a>
                        </li>
                        <li>
                          <a 
                            className="mobile-submenu-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/supported-countries');
                              closeMobileMenu();
                            }}
                          >
                            Pays couverts
                          </a>
                        </li>
                        <li>
                          <a 
                            className="mobile-submenu-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/about');
                              closeMobileMenu();
                            }}
                          >
                            À propos de Kollecta
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>

                  {/* Centre d'assistance */}
                  <li className="mobile-menu-item">
                    <a 
                      className="mobile-menu-link" 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/support');
                        closeMobileMenu();
                      }}
                    >
                      <div className="mobile-menu-link-content">
                        <span className="mobile-menu-link-title">Centre d'assistance</span>
                        <span className="mobile-menu-link-description">Support technique et aide</span>
                      </div>
                      <svg aria-hidden="true" className="mobile-menu-arrow" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </a>
                  </li>

                  {/* Menu utilisateur connecté */}
                  {isAuthenticated && (
                    <>
                      <li className="mobile-menu-divider"></li>
                      {user?.role === 'ADMIN' && (
                        <li className="mobile-menu-item">
                          <a 
                            className="mobile-menu-link" 
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/admin');
                              closeMobileMenu();
                            }}
                          >
                            <div className="mobile-menu-link-content">
                              <span className="mobile-menu-link-title">🛡️ Dashboard Admin</span>
                            </div>
                            <svg aria-hidden="true" className="mobile-menu-arrow" width="16" height="16" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                            </svg>
                          </a>
                        </li>
                      )}
                      {user?.role !== 'ADMIN' && (
                        <li className="mobile-menu-item">
                          <a 
                            className="mobile-menu-link" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleProfileClick();
                              closeMobileMenu();
                            }}
                          >
                            <div className="mobile-menu-link-content">
                              <span className="mobile-menu-link-title">Profil</span>
                            </div>
                            <svg aria-hidden="true" className="mobile-menu-arrow" width="16" height="16" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                            </svg>
                          </a>
                        </li>
                      )}
                      <li className="mobile-menu-item">
                        <a 
                          className="mobile-menu-link" 
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('/my-cagnottes');
                            closeMobileMenu();
                          }}
                        >
                          <div className="mobile-menu-link-content">
                            <span className="mobile-menu-link-title">Mes cagnottes</span>
                          </div>
                          <svg aria-hidden="true" className="mobile-menu-arrow" width="16" height="16" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                          </svg>
                        </a>
                      </li>
                      <li className="mobile-menu-item">
                        <a 
                          className="mobile-menu-link" 
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('/promises');
                            closeMobileMenu();
                          }}
                        >
                          <div className="mobile-menu-link-content">
                            <span className="mobile-menu-link-title">Mes promesses</span>
                          </div>
                          <svg aria-hidden="true" className="mobile-menu-arrow" width="16" height="16" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                          </svg>
                        </a>
                      </li>
                      <li className="mobile-menu-item">
                        <a 
                          className="mobile-menu-link" 
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('/parametres');
                            closeMobileMenu();
                          }}
                        >
                          <div className="mobile-menu-link-content">
                            <span className="mobile-menu-link-title">Paramètres</span>
                          </div>
                          <svg aria-hidden="true" className="mobile-menu-arrow" width="16" height="16" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                          </svg>
                        </a>
                      </li>
                    </>
                  )}
                </ul>
                
                <div className="mobile-menu-buttons">
                  <button 
                    className="mobile-menu-button-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSignUpClick();
                      closeMobileMenu();
                    }}
                  >
                    Démarrer une cagnotte
                  </button>
                  {isAuthenticated ? (
                    <button 
                      className="mobile-menu-button-secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                        closeMobileMenu();
                      }}
                    >
                      Se déconnecter
                    </button>
                  ) : (
                    <button 
                      className="mobile-menu-button-secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLoginClick();
                        closeMobileMenu();
                      }}
                    >
                      Se connecter
                    </button>
                  )}
                </div>
              </nav>
        </div>
      </div>
    </>
  );
};

export default Header;