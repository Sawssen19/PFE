import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './Guarantee.css';

const Guarantee: React.FC = () => {
  const navigate = useNavigate();

  return (
    <InfoPageLayout
      heroTitle="Garantie des promesses Kollecta"
      heroSubtitle="Nous protégeons vos promesses de dons et garantissons la transparence de chaque collecte"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <h2 className="info-section-title">Notre engagement envers vous</h2>
        <p className="info-section-text">
          Chez Kollecta, nous prenons la confiance très au sérieux. Notre garantie 
          des promesses de dons assure que chaque DT que vous promettez est utilisé de manière 
          responsable et transparente. Avec notre système de promesses, vous ne payez que si 
          l'objectif est atteint, ce qui vous protège naturellement.
        </p>

        <div className="info-grid">
          <div className="info-card guarantee-card">
            <div className="info-card-icon">🔐</div>
            <h3 className="info-card-title">Vérification d'identité</h3>
            <p className="info-card-description">
              Tous les créateurs de cagnottes sont vérifiés via notre processus KYC 
              avant de pouvoir recevoir des fonds. Votre sécurité est notre priorité.
            </p>
          </div>

          <div className="info-card guarantee-card">
            <div className="info-card-icon">👮</div>
            <h3 className="info-card-title">Modération active</h3>
            <p className="info-card-description">
              Notre équipe examine chaque cagnotte pour s'assurer qu'elle respecte 
              nos conditions et est légitime. Les signalements sont traités rapidement.
            </p>
          </div>

          <div className="info-card guarantee-card">
            <div className="info-card-icon">🛡️</div>
            <h3 className="info-card-title">Système de promesses flexible</h3>
            <p className="info-card-description">
              Vous faites une promesse d'engagement moral. Vous choisissez quand et comment 
              honorer votre promesse, que l'objectif soit atteint ou non. Vous gardez le contrôle.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Comment nous protégeons vos promesses</h2>
        
        <div className="guarantee-features">
          <div className="guarantee-feature">
            <div className="guarantee-feature-icon">✓</div>
            <div className="guarantee-feature-content">
              <h3 className="guarantee-feature-title">Engagement moral flexible</h3>
              <p className="guarantee-feature-text">
                Votre promesse est un engagement moral que vous pouvez honorer à tout moment. 
                Vous pouvez choisir d'honorer votre promesse même si l'objectif n'est pas atteint, 
                ou l'annuler si vous changez d'avis. C'est vous qui décidez.
              </p>
            </div>
          </div>

          <div className="guarantee-feature">
            <div className="guarantee-feature-icon">✓</div>
            <div className="guarantee-feature-content">
              <h3 className="guarantee-feature-title">Contrôle total sur vos promesses</h3>
              <p className="guarantee-feature-text">
                Vous pouvez modifier, annuler ou honorer votre promesse à tout moment depuis 
                votre espace "Mes promesses". Vous décidez quand et comment honorer votre 
                engagement, indépendamment de l'objectif de la cagnotte.
              </p>
            </div>
          </div>

          <div className="guarantee-feature">
            <div className="guarantee-feature-icon">✓</div>
            <div className="guarantee-feature-content">
              <h3 className="guarantee-feature-title">Traçabilité complète</h3>
              <p className="guarantee-feature-text">
                Vous pouvez suivre en temps réel l'utilisation des fonds et recevoir des 
                mises à jour régulières du créateur de la cagnotte. La transparence est 
                garantie.
              </p>
            </div>
          </div>

          <div className="guarantee-feature">
            <div className="guarantee-feature-icon">✓</div>
            <div className="guarantee-feature-content">
              <h3 className="guarantee-feature-title">Signalement facile</h3>
              <p className="guarantee-feature-text">
                Si vous suspectez une fraude ou un comportement suspect, vous pouvez signaler 
                la cagnotte en un clic. Notre équipe enquêtera immédiatement et prendra 
                les mesures nécessaires.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Protection contre la fraude</h2>
        <p className="info-section-text">
          Si une cagnotte s'avère frauduleuse ou ne respecte pas nos conditions, nous prenons 
          des mesures immédiates pour protéger tous les contributeurs :
        </p>
        
        <div className="protection-list">
          <div className="protection-item">
            <div className="protection-icon">🚫</div>
            <div className="protection-content">
              <h3 className="protection-title">Suspension immédiate</h3>
              <p className="protection-text">
                La cagnotte est suspendue dès qu'un signalement est confirmé, empêchant 
                toute nouvelle promesse.
              </p>
            </div>
          </div>

          <div className="protection-item">
            <div className="protection-icon">🔍</div>
            <div className="protection-content">
              <h3 className="protection-title">Enquête approfondie</h3>
              <p className="protection-text">
                Notre équipe de modération examine tous les éléments et contacte les parties 
                concernées pour clarifier la situation.
              </p>
            </div>
          </div>

          <div className="protection-item">
            <div className="protection-icon">📢</div>
            <div className="protection-content">
              <h3 className="protection-title">Notification des contributeurs</h3>
              <p className="protection-text">
                Tous les contributeurs qui ont fait des promesses sont notifiés si une cagnotte 
                est suspendue ou fermée pour fraude.
              </p>
            </div>
          </div>

          <div className="protection-item">
            <div className="protection-icon">✅</div>
            <div className="protection-content">
              <h3 className="protection-title">Annulation des promesses</h3>
              <p className="protection-text">
                Si une fraude est confirmée, toutes les promesses sont automatiquement annulées 
                et les contributeurs sont notifiés. Chacun peut alors décider de ne pas honorer 
                sa promesse sans aucun engagement.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section highlight-section">
        <h2 className="info-section-title">Pourquoi notre système vous protège</h2>
        <div className="highlight-box">
          <p className="highlight-text">
            <strong>Le système de promesses de Kollecta vous protège naturellement :</strong>
          </p>
          <ul className="highlight-list">
            <li>Vous ne faites qu'une <strong>promesse</strong>, pas un paiement immédiat</li>
            <li>Vous choisissez quand et comment honorer votre promesse, indépendamment de l'objectif</li>
            <li>Vous pouvez modifier ou annuler votre promesse à tout moment</li>
            <li>Vous pouvez honorer votre promesse même si l'objectif n'est pas atteint</li>
            <li>C'est un engagement moral que vous gérez librement</li>
            <li>Les montants sont en DT (Dinars tunisiens), la devise locale</li>
          </ul>
        </div>
      </div>

      <div className="info-cta">
        <h2 className="info-cta-title">Faites des promesses en toute confiance</h2>
        <p className="info-cta-text">
          Avec Kollecta, vos promesses de dons sont protégées et votre générosité fait la différence
        </p>
        <button 
          className="info-cta-button"
          onClick={() => navigate('/discover')}
        >
          Découvrir les cagnottes
        </button>
      </div>
    </InfoPageLayout>
  );
};

export default Guarantee;
