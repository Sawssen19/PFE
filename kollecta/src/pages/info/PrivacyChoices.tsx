import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './Terms.css';

const PrivacyChoices: React.FC = () => {
  return (
    <InfoPageLayout
      heroTitle="Vos choix en matière de confidentialité"
      heroSubtitle="Contrôlez vos données personnelles"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Vos droits en matière de confidentialité</h2>
          <p className="legal-text">
            Chez Kollecta, nous respectons votre vie privée et vous donnons le contrôle sur vos données personnelles. 
            Conformément à la loi tunisienne sur la protection des données, vous disposez des droits suivants :
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Droit d'accès</h2>
          <p className="legal-text">
            Vous avez le droit d'accéder à toutes les données personnelles que nous détenons sur vous. 
            Vous pouvez demander une copie de vos données en contactant notre 
            <a href="/support" className="legal-link">Centre d'assistance</a>.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Droit de rectification</h2>
          <p className="legal-text">
            Vous pouvez corriger ou mettre à jour vos informations personnelles à tout moment depuis votre 
            <a href="/parametres" className="legal-link">page de paramètres</a> ou en nous contactant.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Droit à l'effacement</h2>
          <p className="legal-text">
            Vous pouvez demander la suppression de vos données personnelles. Notez que certaines données peuvent 
            être conservées pour des raisons légales ou pour la sécurité de la plateforme.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Droit d'opposition</h2>
          <p className="legal-text">
            Vous pouvez vous opposer au traitement de vos données personnelles pour certaines finalités, notamment 
            les communications marketing. Vous pouvez gérer ces préférences dans vos paramètres.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>5. Droit à la portabilité</h2>
          <p className="legal-text">
            Vous pouvez demander à recevoir vos données dans un format structuré et couramment utilisé, 
            pour les transférer à un autre service si vous le souhaitez.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>6. Gestion de votre compte</h2>
          <p className="legal-text">
            Vous pouvez gérer la plupart de vos préférences directement depuis votre compte :
          </p>
          <ul className="legal-list">
            <li>Modifier vos informations de profil</li>
            <li>Changer votre mot de passe</li>
            <li>Gérer vos notifications</li>
            <li>Contrôler la visibilité de vos informations</li>
            <li>Gérer vos préférences de cookies</li>
          </ul>
          <p className="legal-text">
            Accédez à vos paramètres : <a href="/parametres" className="legal-link">Paramètres du compte</a>
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>7. Confidentialité de vos promesses</h2>
          <p className="legal-text">
            Vous pouvez choisir de faire des promesses anonymes. Dans ce cas, votre nom ne sera pas affiché 
            publiquement sur la cagnotte, mais le créateur pourra toujours voir votre engagement.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>8. Exercer vos droits</h2>
          <p className="legal-text">
            Pour exercer l'un de ces droits, vous pouvez :
          </p>
          <ul className="legal-list">
            <li>Utiliser les paramètres de votre compte</li>
            <li>Nous contacter via le <a href="/support" className="legal-link">Centre d'assistance</a></li>
            <li>Nous envoyer un email à support@kollecta.tn</li>
          </ul>
          <p className="legal-text">
            Nous répondrons à votre demande dans un délai raisonnable, généralement sous 30 jours.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>9. Protection des mineurs</h2>
          <p className="legal-text">
            Kollecta est destiné aux personnes majeures (18 ans et plus). Nous ne collectons pas sciemment 
            d'informations personnelles de mineurs. Si vous pensez qu'un mineur a fourni des informations, 
            contactez-nous immédiatement.
          </p>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="info-section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>10. Questions ou préoccupations</h2>
          <p className="legal-text">
            Si vous avez des questions ou des préoccupations concernant votre vie privée, n'hésitez pas à nous contacter. 
            Consultez également notre <a href="/privacy" className="legal-link">Avis de confidentialité complet</a> 
            pour plus d'informations.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default PrivacyChoices;
