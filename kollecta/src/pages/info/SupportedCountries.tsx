import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './SupportedCountries.css';

const SupportedCountries: React.FC = () => {
  const navigate = useNavigate();

  return (
    <InfoPageLayout
      heroTitle="Pays couverts"
      heroSubtitle="Kollecta s'étend progressivement pour servir toujours plus de communautés"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <h2 className="info-section-title supported-title">
          <span className="supported-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 16H13V18H11V16ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.5 11 11.5 11 15H13C13 12.5 16 12.5 16 10C16 7.79 14.21 6 12 6Z" fill="#00b289"/>
            </svg>
          </span>
          Création de cagnottes : Disponible en Tunisie
        </h2>
        <p className="info-section-text">
          Actuellement, seuls les résidents de Tunisie peuvent créer des cagnottes sur Kollecta. 
          Les cagnottes sont créées en Dinars Tunisiens (DT) et nécessitent une vérification KYC locale.
        </p>

        <div className="tunisia-highlight">
          <h3 className="tunisia-title">Tunisie</h3>
          <div className="tunisia-badge">✓ Service Complet Disponible</div>
          <p className="tunisia-description">
            Collecte en Dinars Tunisiens (DT) • Vérification KYC locale • Support en français et arabe
          </p>
        </div>
      </div>

      <div className="info-section highlight-section">
        <h2 className="info-section-title supported-title">
          <span className="supported-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4C18.11 4 20 5.89 20 8C20 10.11 18.11 12 16 12C13.89 12 12 10.11 12 8C12 5.89 13.89 4 16 4ZM16 6C14.9 6 14 6.9 14 8C14 9.1 14.9 10 16 10C17.1 10 18 9.1 18 8C18 6.9 17.1 6 16 6ZM16 13C18.67 13 24 14.33 24 17V20H8V17C8 14.33 13.33 13 16 13ZM16 14.9C13.03 14.9 9.9 16.36 9.9 17V18.1H22.1V17C22.1 16.36 18.97 14.9 16 14.9ZM8 4C10.11 4 12 5.89 12 8C12 10.11 10.11 12 8 12C5.89 12 4 10.11 4 8C4 5.89 5.89 4 8 4ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM8 13C10.67 13 16 14.33 16 17V20H0V17C0 14.33 5.33 13 8 13ZM8 14.9C5.03 14.9 1.9 16.36 1.9 17V18.1H14.1V17C14.1 16.36 10.97 14.9 8 14.9Z" fill="#00b289"/>
            </svg>
          </span>
          Contribuer depuis n'importe où dans le monde
        </h2>
        <p className="info-section-text">
          <strong>Bonne nouvelle !</strong> Même si la création de cagnottes est limitée à la Tunisie, 
          vous pouvez faire des promesses de dons depuis n'importe quel pays dans le monde. 
          <strong> Aucune vérification KYC n'est requise pour les contributeurs</strong> - 
          il suffit de créer un compte avec votre email. Vous pouvez honorer votre engagement le jour J 
          de la manière qui vous convient.
        </p>

        <div className="contribution-features">
          <div className="contribution-feature">
            <div className="contribution-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
              </svg>
            </div>
            <div className="contribution-content">
              <h3 className="contribution-title">Promesses depuis l'étranger</h3>
              <p className="contribution-text">
                Vous pouvez créer un compte et faire des promesses de dons depuis n'importe quel pays. 
                <strong> Aucune vérification KYC n'est requise pour les contributeurs</strong> - 
                il suffit d'avoir un compte avec email et mot de passe. Votre localisation n'empêche pas votre générosité !
              </p>
            </div>
          </div>

          <div className="contribution-feature">
            <div className="contribution-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
              </svg>
            </div>
            <div className="contribution-content">
              <h3 className="contribution-title">Honorer votre promesse</h3>
              <p className="contribution-text">
                Le jour J, vous pouvez honorer votre promesse de la manière qui vous convient : 
                virement bancaire, transfert d'argent, ou tout autre moyen que vous et le créateur 
                de la cagnotte convenez.
              </p>
            </div>
          </div>

          <div className="contribution-feature">
            <div className="contribution-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
              </svg>
            </div>
            <div className="contribution-content">
              <h3 className="contribution-title">Flexibilité totale</h3>
              <p className="contribution-text">
                Vous gardez le contrôle : vous pouvez modifier, annuler ou honorer votre promesse 
                à tout moment, peu importe où vous vous trouvez dans le monde.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title supported-title">
          <span className="supported-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z" fill="#00b289"/>
            </svg>
          </span>
          Critères d'éligibilité
        </h2>
        
        <div className="eligibility-simple">
          <div className="eligibility-item">
            <h3 className="eligibility-item-title">Pour créer une cagnotte</h3>
            <p className="eligibility-item-text">
              Être résident de Tunisie, majeur (18 ans minimum), disposer d'un compte bancaire tunisien, 
              et pouvoir fournir une pièce d'identité valide pour la vérification KYC.
            </p>
          </div>

          <div className="eligibility-item">
            <h3 className="eligibility-item-title">Pour faire des promesses</h3>
            <p className="eligibility-item-text">
              Être majeur (18 ans minimum) et avoir un compte Kollecta. 
              <strong> Aucune vérification KYC requise</strong> et aucune restriction géographique ! 
              Vous pouvez contribuer depuis n'importe où dans le monde.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section waitlist-section">
        <h2 className="info-section-title">Votre pays n'est pas encore disponible ?</h2>
        <p className="info-section-text" style={{ maxWidth: '640px', margin: '0 auto 32px' }}>
          Inscrivez-vous à notre liste d'attente pour être parmi les premiers informés 
          dès que la création de cagnottes sera disponible dans votre pays.
        </p>
        <div className="waitlist-form">
          <input
            type="email"
            placeholder="Votre adresse email"
            className="waitlist-input"
          />
          <button className="waitlist-button">
            M'inscrire
          </button>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default SupportedCountries;
