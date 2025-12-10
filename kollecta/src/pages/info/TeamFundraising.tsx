import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';

const TeamFundraising: React.FC = () => {
  const navigate = useNavigate();

  return (
    <InfoPageLayout
      heroTitle="Collecte de fonds en équipe"
      heroSubtitle="Multipliez votre impact en collectant des fonds ensemble"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <h2 className="info-section-title">La force du collectif</h2>
        <p className="info-section-text">
          Collecter des fonds en équipe démultiplie vos chances de réussite. Que ce soit 
          pour une association, un événement sportif, un projet communautaire ou une cause 
          caritative, unir vos forces vous permet d'atteindre plus rapidement vos objectifs.
        </p>

        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-icon">🤝</div>
            <h3 className="info-card-title">Réseau étendu</h3>
            <p className="info-card-description">
              Chaque membre de l'équipe partage la cagnotte dans son propre réseau, 
              multipliant ainsi la portée et la visibilité de votre cause.
            </p>
          </div>

          <div className="info-card">
            <div className="info-card-icon">⚡</div>
            <h3 className="info-card-title">Motivation collective</h3>
            <p className="info-card-description">
              L'émulation de groupe stimule l'engagement de chacun. Les membres 
              se motivent mutuellement pour atteindre l'objectif commun.
            </p>
          </div>

          <div className="info-card">
            <div className="info-card-icon">🎯</div>
            <h3 className="info-card-title">Objectifs plus ambitieux</h3>
            <p className="info-card-description">
              En équipe, vous pouvez viser des montants plus importants et réaliser 
              des projets d'envergure qui seraient difficiles seul.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Comment organiser une collecte en équipe</h2>
        
        <h3 className="info-section-subtitle">1. Définissez un objectif commun clair</h3>
        <p className="info-section-text">
          Assurez-vous que tous les membres de l'équipe comprennent et adhèrent à la cause. 
          Un objectif bien défini et partagé renforce la cohésion du groupe.
        </p>

        <h3 className="info-section-subtitle">2. Désignez un coordinateur</h3>
        <p className="info-section-text">
          Une personne doit être responsable de la création et de la gestion de la cagnotte. 
          Elle centralise les informations et coordonne les efforts de communication.
        </p>

        <h3 className="info-section-subtitle">3. Répartissez les tâches</h3>
        <p className="info-section-text">
          Chaque membre peut avoir un rôle : création de contenu, partage sur les réseaux 
          sociaux, relance des donateurs, organisation d'événements, etc.
        </p>

        <h3 className="info-section-subtitle">4. Communiquez régulièrement</h3>
        <p className="info-section-text">
          Maintenez un canal de communication actif entre les membres de l'équipe. 
          Partagez les progrès, célébrez les succès et ajustez la stratégie si nécessaire.
        </p>

        <h3 className="info-section-subtitle">5. Organisez des événements</h3>
        <p className="info-section-text">
          Les événements de collecte (vente, concert, compétition sportive, etc.) créent 
          du lien et génèrent de l'engagement autour de votre cause.
        </p>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Idées pour collecter en équipe</h2>
        
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-icon">🏃</div>
            <h3 className="info-card-title">Défis sportifs</h3>
            <p className="info-card-description">
              Marathon, trail, tournoi sportif... Les défis physiques en équipe 
              mobilisent et inspirent les donateurs.
            </p>
          </div>

          <div className="info-card">
            <div className="info-card-icon">🎪</div>
            <h3 className="info-card-title">Événements festifs</h3>
            <p className="info-card-description">
              Concerts, spectacles, kermesses... Organisez des événements conviviaux 
              qui rassemblent votre communauté autour de votre cause.
            </p>
          </div>

          <div className="info-card">
            <div className="info-card-icon">🛍️</div>
            <h3 className="info-card-title">Ventes solidaires</h3>
            <p className="info-card-description">
              Vide-grenier, vente de pâtisseries, artisanat... Les ventes créent 
              une interaction directe avec les soutiens.
            </p>
          </div>

          <div className="info-card">
            <div className="info-card-icon">💻</div>
            <h3 className="info-card-title">Campagnes digitales</h3>
            <p className="info-card-description">
              Challenges sur les réseaux sociaux, live-streaming, webinaires... 
              Le digital amplifie votre portée.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Astuces pour maximiser votre collecte</h2>
        
        <ul className="info-list">
          <li className="info-list-item">
            Créez un planning de partage coordonné pour maximiser la visibilité
          </li>
          <li className="info-list-item">
            Utilisez des visuels cohérents avec l'identité de votre équipe
          </li>
          <li className="info-list-item">
            Célébrez chaque étape franchie pour maintenir la motivation
          </li>
          <li className="info-list-item">
            Remerciez nominativement les donateurs pour créer du lien
          </li>
          <li className="info-list-item">
            Partagez des témoignages et des histoires inspirantes
          </li>
          <li className="info-list-item">
            Fixez des sous-objectifs intermédiaires pour dynamiser la collecte
          </li>
        </ul>
      </div>

      <div className="info-cta">
        <h2 className="info-cta-title">Lancez votre collecte en équipe</h2>
        <p className="info-cta-text">
          Ensemble, vous pouvez accomplir de grandes choses
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

export default TeamFundraising;



