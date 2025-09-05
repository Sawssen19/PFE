import React from 'react';
import { MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h4>Je soutiens</h4>
            <ul>
              <li><a href="#">Catégories</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Collecter des fonds</h4>
            <ul>
              <li><a href="#">Comment démarrer une cagnotte</a></li>
              <li><a href="#">Collecte de fonds en équipe</a></li>
              <li><a href="#">Blog sur la collecte de fonds</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>À propos de</h4>
            <ul>
              <li><a href="#">Comment fonctionne Kollecta</a></li>
              <li><a href="#">Garantie des dons Kollecta</a></li>
              <li><a href="#">Pays couverts</a></li>
              <li><a href="#">Tarifs</a></li>
              <li><a href="#">Centre d'assistance</a></li>
              <li><a href="#">À propos de Kollecta</a></li>
              <li><a href="#">Centre de presse</a></li>
              <li><a href="#">Emplois</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <div className="footer-info-box">
              <p className="footer-info-text">
                Cagnotte sécurisée et limitatile avec IXOPAY et tant 
                qu'intermédiaire en financement 
                Participant FFP.I sous le numéro 
                d'immatriculation • IFP07511
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-location">
              <MapPin className="location-icon" />
              <span>Tunisie • français</span>
            </div>
            
            <div className="footer-legal">
              <span>© 2010-2025 Kollecta</span>
              <span className="mx-2">•</span>
              <a href="#">Conditions</a>
              <span className="mx-2">•</span>
              <a href="#">Avis de confidentialité</a>
              <span className="mx-2">•</span>
              <a href="#">Fria juridiques</a>
            </div>
          </div>
          
          <div className="footer-final">
            <p className="footer-cookies">
              Gérer les préférences en matière de cookies • Vos choix en matière de confidentialité
            </p>
            
            <div className="app-badges">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Google Play" />
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;