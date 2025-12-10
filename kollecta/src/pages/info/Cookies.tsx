import React, { useState } from 'react';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './Cookies.css';

const Cookies: React.FC = () => {
  const [preferences, setPreferences] = useState({
    essential: true, // Toujours activé
    analytics: false,
    marketing: false,
  });

  const handleToggle = (type: 'analytics' | 'marketing') => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = () => {
    // Sauvegarder les préférences dans localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Vos préférences de cookies ont été enregistrées.');
  };

  return (
    <InfoPageLayout
      heroTitle="Gérer les préférences de cookies"
      heroSubtitle="Contrôlez les cookies utilisés sur Kollecta"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Qu'est-ce qu'un cookie ?</h2>
          <p className="legal-text">
            Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. 
            Il permet au site de se souvenir de vos préférences et d'améliorer votre expérience de navigation.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Types de cookies utilisés</h2>
          
          <div className="cookie-type">
            <div className="cookie-type-header">
              <h3 className="cookie-type-title">Cookies essentiels</h3>
              <span className="cookie-badge required">Requis</span>
            </div>
            <p className="cookie-type-description">
              Ces cookies sont nécessaires au fonctionnement de la plateforme. Ils permettent l'authentification, 
              la sécurité et la mémorisation de vos préférences de session.
            </p>
            <div className="cookie-toggle disabled">
              <span className="cookie-toggle-label">Toujours activé</span>
            </div>
          </div>

          <div className="cookie-type">
            <div className="cookie-type-header">
              <h3 className="cookie-type-title">Cookies analytiques</h3>
              <span className="cookie-badge optional">Optionnel</span>
            </div>
            <p className="cookie-type-description">
              Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site en collectant des 
              informations anonymes. Cela nous permet d'améliorer nos services.
            </p>
            <div className="cookie-toggle">
              <label className="cookie-switch">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => handleToggle('analytics')}
                />
                <span className="cookie-slider"></span>
              </label>
              <span className="cookie-toggle-label">
                {preferences.analytics ? 'Activé' : 'Désactivé'}
              </span>
            </div>
          </div>

          <div className="cookie-type">
            <div className="cookie-type-header">
              <h3 className="cookie-type-title">Cookies marketing</h3>
              <span className="cookie-badge optional">Optionnel</span>
            </div>
            <p className="cookie-type-description">
              Ces cookies sont utilisés pour vous proposer des contenus et publicités personnalisés. 
              Actuellement, Kollecta n'utilise pas de cookies marketing.
            </p>
            <div className="cookie-toggle">
              <label className="cookie-switch">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => handleToggle('marketing')}
                  disabled
                />
                <span className="cookie-slider"></span>
              </label>
              <span className="cookie-toggle-label">Non disponible</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gérer vos préférences</h2>
          <p className="legal-text">
            Vous pouvez modifier vos préférences de cookies à tout moment en utilisant les contrôles ci-dessus. 
            Cliquez sur "Enregistrer les préférences" pour appliquer vos choix.
          </p>
          <div className="cookies-actions">
            <button className="cookies-save-button" onClick={handleSave}>
              Enregistrer les préférences
            </button>
            <button 
              className="cookies-accept-all-button" 
              onClick={() => {
                setPreferences({ essential: true, analytics: true, marketing: false });
                handleSave();
              }}
            >
              Accepter tous les cookies
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Plus d'informations</h2>
          <p className="legal-text">
            Pour en savoir plus sur notre utilisation des cookies, consultez notre 
            <a href="/privacy" className="legal-link">Avis de confidentialité</a>.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default Cookies;

