import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './Terms.css';

const Privacy: React.FC = () => {
  return (
    <InfoPageLayout
      heroTitle="Avis de confidentialité"
      heroSubtitle="Dernière mise à jour : 2025"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Introduction</h2>
          <p className="legal-text">
            Kollecta s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment 
            nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Informations que nous collectons</h2>
          <p className="legal-text">Nous collectons les informations suivantes :</p>
          <ul className="legal-list">
            <li><strong>Informations de compte :</strong> nom, email, mot de passe (haché)</li>
            <li><strong>Informations de profil :</strong> photo, biographie, coordonnées</li>
            <li><strong>Informations de cagnotte :</strong> titre, description, montant, catégorie</li>
            <li><strong>Informations de promesse :</strong> montant promis, message, statut</li>
            <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées</li>
            <li><strong>Informations KYC :</strong> pièce d'identité (pour les créateurs uniquement)</li>
          </ul>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Comment nous utilisons vos informations</h2>
          <p className="legal-text">Nous utilisons vos informations pour :</p>
          <ul className="legal-list">
            <li>Fournir et améliorer nos services</li>
            <li>Vérifier votre identité (KYC pour les créateurs)</li>
            <li>Vous envoyer des notifications importantes</li>
            <li>Assurer la sécurité de la plateforme</li>
            <li>Respecter nos obligations légales</li>
            <li>Analyser l'utilisation de la plateforme (données anonymisées)</li>
          </ul>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Partage de vos informations</h2>
          <p className="legal-text">
            Nous ne vendons jamais vos informations personnelles. Nous pouvons partager vos données uniquement dans 
            les cas suivants :
          </p>
          <ul className="legal-list">
            <li><strong>Avec votre consentement :</strong> lorsque vous autorisez explicitement le partage</li>
            <li><strong>Prestataires de services :</strong> pour les services techniques (hébergement, email)</li>
            <li><strong>Obligations légales :</strong> si requis par la loi tunisienne</li>
            <li><strong>Protection de nos droits :</strong> pour prévenir la fraude ou les abus</li>
          </ul>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>5. Sécurité des données</h2>
          <p className="legal-text">
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :
          </p>
          <ul className="legal-list">
            <li>Chiffrement des mots de passe (bcrypt)</li>
            <li>Connexions sécurisées (HTTPS)</li>
            <li>Accès restreint aux données personnelles</li>
            <li>Surveillance continue de la sécurité</li>
          </ul>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>6. Vos droits</h2>
          <p className="legal-text">Conformément à la loi tunisienne sur la protection des données, vous avez le droit de :</p>
          <ul className="legal-list">
            <li>Accéder à vos données personnelles</li>
            <li>Corriger vos informations inexactes</li>
            <li>Demander la suppression de vos données</li>
            <li>Vous opposer au traitement de vos données</li>
            <li>Demander la portabilité de vos données</li>
          </ul>
          <p className="legal-text">
            Pour exercer ces droits, contactez-nous via notre <a href="/support" className="legal-link">Centre d'assistance</a>.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>7. Cookies</h2>
          <p className="legal-text">
            Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences de cookies 
            via notre <a href="/cookies" className="legal-link">page de gestion des cookies</a>.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>8. Conservation des données</h2>
          <p className="legal-text">
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services ou 
            respecter nos obligations légales. Les données peuvent être supprimées à votre demande ou après une 
            période d'inactivité prolongée.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>9. Modifications de cette politique</h2>
          <p className="legal-text">
            Nous pouvons modifier cette politique de confidentialité. Les modifications seront publiées sur cette page 
            avec la date de mise à jour. Nous vous informerons des changements importants par email.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>10. Contact</h2>
          <p className="legal-text">
            Pour toute question concernant cette politique de confidentialité, contactez-nous via notre 
            <a href="/support" className="legal-link">Centre d'assistance</a>.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default Privacy;
