import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './About.css';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <InfoPageLayout
      heroTitle="À propos de Kollecta"
      heroSubtitle="Notre mission : démocratiser l'accès au financement participatif grâce aux promesses de dons"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <h2 className="info-section-title about-section-title">
          <span className="about-title-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#00b289"/>
            </svg>
          </span>
          Notre histoire
        </h2>
        <div className="about-story">
          <p className="info-section-text">
            Kollecta est née d'un constat simple : les plateformes de financement participatif 
            traditionnelles obligent les contributeurs à payer immédiatement, même si l'objectif 
            n'est pas atteint. Cela freine la générosité et décourage les porteurs de projets.
          </p>
          <p className="info-section-text">
            <strong>En 2025, nous avons créé Kollecta</strong> avec une approche innovante : le système de promesses. 
            Les contributeurs s'engagent sans payer immédiatement, et peuvent honorer leur promesse 
            de manière flexible. Cette approche rassure les donateurs et motive les créateurs, 
            tout en restant 100% gratuit pour tous.
          </p>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title about-section-title">
          <span className="about-title-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12" stroke="#00b289" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </span>
          Nos valeurs
        </h2>
        
        <div className="about-values-grid">
          <div className="about-value-card">
            <div className="about-value-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4C18.11 4 20 5.89 20 8C20 10.11 18.11 12 16 12C13.89 12 12 10.11 12 8C12 5.89 13.89 4 16 4ZM16 6C14.9 6 14 6.9 14 8C14 9.1 14.9 10 16 10C17.1 10 18 9.1 18 8C18 6.9 17.1 6 16 6ZM16 13C18.67 13 24 14.33 24 17V20H8V17C8 14.33 13.33 13 16 13ZM8 4C10.11 4 12 5.89 12 8C12 10.11 10.11 12 8 12C5.89 12 4 10.11 4 8C4 5.89 5.89 4 8 4ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM8 13C10.67 13 16 14.33 16 17V20H0V17C0 14.33 5.33 13 8 13Z" fill="#00b289"/>
              </svg>
            </div>
            <h3 className="about-value-title">Confiance</h3>
            <p className="about-value-description">
              Nous vérifions chaque cagnotte et chaque créateur via notre processus KYC pour garantir 
              la sécurité et la transparence de la plateforme. Les contributeurs peuvent contribuer 
              en toute confiance.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4ZM12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 16C9.33 16 4 17.33 4 20V22H20V20C20 17.33 14.67 16 12 16Z" fill="#00b289"/>
              </svg>
            </div>
            <h3 className="about-value-title">Accessibilité</h3>
            <p className="about-value-description">
              Notre mission est de rendre le financement participatif accessible à tous, sans barrières 
              techniques ou financières. Kollecta est 100% gratuit et les contributeurs peuvent participer 
              depuis n'importe où dans le monde.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12" stroke="#00b289" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <h3 className="about-value-title">Innovation</h3>
            <p className="about-value-description">
              Nous repoussons les limites du crowdfunding avec notre système unique de promesses de dons. 
              Les contributeurs s'engagent sans payer immédiatement, créant une approche plus flexible 
              et rassurante.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#00b289"/>
              </svg>
            </div>
            <h3 className="about-value-title">Impact</h3>
            <p className="about-value-description">
              Chaque cagnotte réussie transforme une vie. Nous mesurons notre succès à l'impact créé 
              dans les communautés tunisiennes. Ensemble, nous construisons un avenir meilleur, 
              une promesse à la fois.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section about-stats-section">
        <h2 className="info-section-title about-section-title">
          <span className="about-title-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z" fill="#00b289"/>
            </svg>
          </span>
          Kollecta en chiffres
        </h2>
        
        <div className="about-stats-grid">
          <div className="about-stat-card">
            <div className="about-stat-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z" fill="#00b289"/>
              </svg>
            </div>
            <div className="about-stat-number">5000+</div>
            <h3 className="about-stat-title">Cagnottes créées</h3>
            <p className="about-stat-description">Projets lancés sur la plateforme</p>
          </div>

          <div className="about-stat-card">
            <div className="about-stat-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.5 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.5 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.5 11.8 10.9Z" fill="#00b289"/>
              </svg>
            </div>
            <div className="about-stat-number">6M DT</div>
            <h3 className="about-stat-title">Montant collecté</h3>
            <p className="about-stat-description">En promesses de dons</p>
          </div>

          <div className="about-stat-card">
            <div className="about-stat-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4C18.11 4 20 5.89 20 8C20 10.11 18.11 12 16 12C13.89 12 12 10.11 12 8C12 5.89 13.89 4 16 4ZM16 6C14.9 6 14 6.9 14 8C14 9.1 14.9 10 16 10C17.1 10 18 9.1 18 8C18 6.9 17.1 6 16 6ZM16 13C18.67 13 24 14.33 24 17V20H8V17C8 14.33 13.33 13 16 13ZM8 4C10.11 4 12 5.89 12 8C12 10.11 10.11 12 8 12C5.89 12 4 10.11 4 8C4 5.89 5.89 4 8 4ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM8 13C10.67 13 16 14.33 16 17V20H0V17C0 14.33 5.33 13 8 13Z" fill="#00b289"/>
              </svg>
            </div>
            <div className="about-stat-number">50K+</div>
            <h3 className="about-stat-title">Contributeurs actifs</h3>
            <p className="about-stat-description">Membres de la communauté</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title about-section-title">
          <span className="about-title-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4C18.11 4 20 5.89 20 8C20 10.11 18.11 12 16 12C13.89 12 12 10.11 12 8C12 5.89 13.89 4 16 4ZM8 4C10.11 4 12 5.89 12 8C12 10.11 10.11 12 8 12C5.89 12 4 10.11 4 8C4 5.89 5.89 4 8 4ZM16 13C18.67 13 24 14.33 24 17V20H8V17C8 14.33 13.33 13 16 13ZM8 13C10.67 13 16 14.33 16 17V20H0V17C0 14.33 5.33 13 8 13Z" fill="#00b289"/>
            </svg>
          </span>
          Notre équipe
        </h2>
        <div className="about-team">
          <p className="info-section-text">
            Kollecta est portée par une équipe passionnée et multidisciplinaire : développeurs, 
            designers, experts en financement et modérateurs dédiés. Nous travaillons chaque jour 
            pour améliorer la plateforme et accompagner notre communauté vers le succès.
          </p>
          <p className="info-section-text">
            <strong>Créée en 2025</strong>, Kollecta est une plateforme tunisienne qui révolutionne 
            le financement participatif avec son système innovant de promesses de dons, tout en 
            restant 100% gratuit pour tous les utilisateurs.
          </p>
        </div>
      </div>

      <div className="info-cta">
        <h2 className="info-cta-title">Rejoignez la communauté Kollecta</h2>
        <p className="info-cta-text">
          Ensemble, transformons les rêves en réalité
        </p>
        <button 
          className="info-cta-button"
          onClick={() => navigate('/create/fundraiser?new=true')}
        >
          Démarrer maintenant
        </button>
      </div>
    </InfoPageLayout>
  );
};

export default About;
