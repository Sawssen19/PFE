import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './Terms.css';

const Terms: React.FC = () => {
  return (
    <InfoPageLayout
      heroTitle="Conditions d'utilisation"
      heroSubtitle="Dernière mise à jour : 2025"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Acceptation des conditions</h2>
          <p className="legal-text">
            En accédant et en utilisant la plateforme Kollecta, vous acceptez d'être lié par ces conditions d'utilisation. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Description du service</h2>
          <p className="legal-text">
            Kollecta est une plateforme de financement participatif basée sur le système de promesses de dons. 
            Nous facilitons la création de cagnottes et la collecte de promesses de contributions, sans paiement immédiat.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Utilisation de la plateforme</h2>
          <p className="legal-text">
            Vous vous engagez à utiliser Kollecta uniquement à des fins légales et conformément à ces conditions. 
            Il est interdit de :
          </p>
          <ul className="legal-list">
            <li>Créer des cagnottes frauduleuses ou trompeuses</li>
            <li>Utiliser la plateforme à des fins illégales</li>
            <li>Violer les droits de propriété intellectuelle</li>
            <li>Harceler ou menacer d'autres utilisateurs</li>
            <li>Transmettre des virus ou codes malveillants</li>
          </ul>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Système de promesses</h2>
          <p className="legal-text">
            Les promesses de dons sur Kollecta sont des engagements moraux. Les contributeurs peuvent :
          </p>
          <ul className="legal-list">
            <li>Faire une promesse sans paiement immédiat</li>
            <li>Modifier ou annuler leur promesse avant l'échéance</li>
            <li>Honorer leur promesse de manière flexible</li>
          </ul>
          <p className="legal-text">
            Kollecta n'est pas responsable de l'honorisation des promesses par les contributeurs.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>5. Création de cagnottes</h2>
          <p className="legal-text">
            Pour créer une cagnotte, vous devez :
          </p>
          <ul className="legal-list">
            <li>Être résident de Tunisie et majeur (18 ans minimum)</li>
            <li>Fournir des informations exactes et complètes</li>
            <li>Passer la vérification KYC (Know Your Customer)</li>
            <li>Respecter les règles de la plateforme</li>
          </ul>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>6. Gratuité du service</h2>
          <p className="legal-text">
            Kollecta est une plateforme 100% gratuite. Aucun frais n'est prélevé sur les créateurs de cagnottes 
            ou les contributeurs. Nous ne facturons aucune commission.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>7. Propriété intellectuelle</h2>
          <p className="legal-text">
            Tous les contenus de la plateforme Kollecta (textes, logos, images, design) sont protégés par les droits 
            de propriété intellectuelle. Vous ne pouvez pas les reproduire sans autorisation.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>8. Limitation de responsabilité</h2>
          <p className="legal-text">
            Kollecta agit en tant qu'intermédiaire. Nous ne garantissons pas le succès des cagnottes ni l'honorisation 
            des promesses. Nous ne sommes pas responsables des litiges entre créateurs et contributeurs.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>9. Modification des conditions</h2>
          <p className="legal-text">
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront publiées 
            sur cette page avec la date de mise à jour.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>10. Contact</h2>
          <p className="legal-text">
            Pour toute question concernant ces conditions, veuillez nous contacter via notre 
            <a href="/support" className="legal-link">Centre d'assistance</a>.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default Terms;

