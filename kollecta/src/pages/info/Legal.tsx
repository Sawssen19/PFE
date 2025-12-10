import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './Terms.css';

const Legal: React.FC = () => {
  return (
    <InfoPageLayout
      heroTitle="Mentions légales"
      heroSubtitle="Informations légales sur Kollecta"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Éditeur du site</h2>
          <p className="legal-text">
            <strong>Kollecta</strong><br />
            Plateforme de financement participatif à promesses de dons<br />
            Créée en 2025<br />
            <br />
            <strong>Contact :</strong><br />
            Email : support@kollecta.tn<br />
            Site web : <a href="/support" className="legal-link">Centre d'assistance</a>
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Hébergement</h2>
          <p className="legal-text">
            Le site Kollecta est hébergé sur des serveurs sécurisés en Tunisie, conformément aux réglementations 
            locales sur la protection des données.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Propriété intellectuelle</h2>
          <p className="legal-text">
            L'ensemble du contenu de ce site (textes, images, logos, design, code source) est la propriété exclusive 
            de Kollecta ou de ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Responsabilité</h2>
          <p className="legal-text">
            Kollecta agit en tant qu'intermédiaire technique. Nous ne sommes pas responsables :
          </p>
          <ul className="legal-list">
            <li>Du contenu des cagnottes créées par les utilisateurs</li>
            <li>De l'honorisation des promesses de dons par les contributeurs</li>
            <li>Des litiges entre créateurs et contributeurs</li>
            <li>Des dommages résultant de l'utilisation de la plateforme</li>
          </ul>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>5. Protection des données</h2>
          <p className="legal-text">
            Conformément à la loi tunisienne sur la protection des données personnelles, Kollecta s'engage à protéger 
            les informations personnelles de ses utilisateurs. Pour plus d'informations, consultez notre 
            <a href="/privacy" className="legal-link">Avis de confidentialité</a>.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>6. Conditions d'utilisation</h2>
          <p className="legal-text">
            L'utilisation de la plateforme Kollecta est soumise à l'acceptation de nos 
            <a href="/terms" className="legal-link">Conditions d'utilisation</a>.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>7. Signalement de contenus</h2>
          <p className="legal-text">
            Si vous constatez un contenu inapproprié ou frauduleux, vous pouvez le signaler directement depuis 
            la page de la cagnotte concernée. Nous examinerons chaque signalement dans les plus brefs délais.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>8. Loi applicable</h2>
          <p className="legal-text">
            Les présentes mentions légales sont régies par la loi tunisienne. Tout litige relatif à leur interprétation 
            ou à leur exécution relève des tribunaux compétents de Tunisie.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>9. Contact légal</h2>
          <p className="legal-text">
            Pour toute question d'ordre légal, veuillez nous contacter via notre 
            <a href="/support" className="legal-link">Centre d'assistance</a>.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default Legal;
