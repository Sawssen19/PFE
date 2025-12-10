import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Facebook, Youtube, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Je soutiens */}
          <div className="footer-column">
            <h4 className="footer-column-title">Je soutiens</h4>
            <ul className="footer-links">
              <li>
                <a 
                  href="/discover" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/discover');
                  }}
                >
                  Catégories
                </a>
              </li>
            </ul>
          </div>

          {/* Collecter des fonds */}
          <div className="footer-column">
            <h4 className="footer-column-title">Collecter des fonds</h4>
            <ul className="footer-links">
              <li>
                <a 
                  href="/start" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/start');
                  }}
                >
                  Comment démarrer une cagnotte
                </a>
              </li>
              <li>
                <a 
                  href="/team-fundraising" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/team-fundraising');
                  }}
                >
                  Collecte de fonds en équipe
                </a>
              </li>
              <li>
                <a 
                  href="/blog" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/blog');
                  }}
                >
                  Blog sur la collecte de fonds
                </a>
              </li>
              <li>
                <a 
                  href="/fundraising-tips" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/fundraising-tips');
                  }}
                >
                  Conseils pour collecter des fonds
                </a>
              </li>
            </ul>
          </div>

          {/* À propos de */}
          <div className="footer-column">
            <h4 className="footer-column-title">À propos de</h4>
            <ul className="footer-links">
              <li>
                <a 
                  href="/how-it-works" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/how-it-works');
                  }}
                >
                  Comment fonctionne Kollecta
                </a>
              </li>
              <li>
                <a 
                  href="/guarantee" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/guarantee');
                  }}
                >
                  Garantie des dons Kollecta
                </a>
              </li>
              <li>
                <a 
                  href="/supported-countries" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/supported-countries');
                  }}
                >
                  Pays couverts
                </a>
              </li>
              <li>
                <a 
                  href="/support" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/support');
                  }}
                >
                  Centre d'assistance
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/about');
                  }}
                >
                  À propos de Kollecta
                </a>
              </li>
            </ul>
          </div>

          {/* Info Box */}
          <div className="footer-column footer-info-column">
            <div className="footer-info-box">
              <p className="footer-info-text">
                Plateforme sécurisée de cagnottes collaboratives à promesses de dons.
                <br />
                <br />
                Kollecta facilite la collecte de fonds en Tunisie avec un système de promesses transparent et flexible.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-top">
            <div className="footer-location">
              <MapPin className="location-icon" size={16} />
              <span>Tunisie • Français</span>
            </div>
            
            <div className="footer-legal">
              <span>© 2025 Kollecta</span>
              <span className="footer-separator">•</span>
              <a 
                href="/terms" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('/terms');
                }}
              >
                Conditions
              </a>
              <span className="footer-separator">•</span>
              <a 
                href="/privacy" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('/privacy');
                }}
              >
                Avis de confidentialité
              </a>
              <span className="footer-separator">•</span>
              <a 
                href="/legal" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('/legal');
                }}
              >
                Mentions légales
              </a>
            </div>
          </div>
          
          <div className="footer-bottom-bottom">
            <div className="footer-cookies">
              <a 
                href="/cookies" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('/cookies');
                }}
              >
                Gérer les préférences en matière de cookies
              </a>
              <span className="footer-separator">•</span>
              <a 
                href="/privacy-choices" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('/privacy-choices');
                }}
              >
                Vos choix en matière de confidentialité
              </a>
            </div>
            
            <div className="footer-social">
              <a 
                href="#" 
                className="footer-social-link"
                aria-label="Facebook"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Add social links
                }}
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="footer-social-link"
                aria-label="YouTube"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Youtube size={20} />
              </a>
              <a 
                href="#" 
                className="footer-social-link"
                aria-label="Twitter"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="footer-social-link"
                aria-label="Instagram"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
