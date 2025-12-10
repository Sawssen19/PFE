import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Que se passe-t-il si l'objectif n'est pas atteint ?",
      answer: "Si l'objectif n'est pas atteint avant la date limite, les promesses ne sont pas honorées et aucun paiement n'est effectué. Vous pouvez prolonger la cagnotte ou ajuster l'objectif pour relancer la collecte."
    },
    {
      question: "Combien de temps pour recevoir les fonds ?",
      answer: "Après validation KYC et encaissement des promesses, comptez 5-7 jours ouvrés pour le transfert sur votre compte bancaire en Tunisie. Les montants sont transférés en DT (Dinars tunisiens)."
    },
    {
      question: "Puis-je annuler ma promesse ?",
      answer: "Oui, tant que l'objectif n'est pas atteint, vous pouvez modifier ou annuler votre promesse depuis votre espace personnel 'Mes promesses'."
    },
    {
      question: "Kollecta est-il vraiment gratuit ?",
      answer: "Oui, absolument ! Kollecta est entièrement gratuit. Il n'y a aucun frais de création, aucun frais de plateforme, et aucun frais de paiement. La plateforme est financée par des partenaires pour rester accessible à tous."
    },
    {
      question: "Dans quelle devise fonctionne Kollecta ?",
      answer: "Kollecta fonctionne exclusivement en DT (Dinars tunisiens) pour le moment. Tous les montants, objectifs et collectes sont exprimés en DT."
    },
    {
      question: "Comment fonctionne le système de promesses de dons ?",
      answer: "Contrairement aux autres plateformes, les contributeurs font des promesses de don sans payer immédiatement. Ils ne sont débités que si votre objectif est atteint. Ce système 'tout ou rien' rassure les contributeurs et vous motive à partager activement."
    },
    {
      question: "Qu'est-ce que la vérification KYC ?",
      answer: "KYC (Know Your Customer) est un processus de vérification d'identité requis avant tout transfert de fonds. Cela garantit la sécurité et la conformité de la plateforme. Vous devrez fournir des documents d'identité valides."
    },
    {
      question: "Puis-je créer une cagnotte pour quelqu'un d'autre ?",
      answer: "Oui, vous pouvez créer une cagnotte pour quelqu'un d'autre et vous assurer que les fonds lui parviennent directement et en toute sécurité. Vous pouvez inviter le bénéficiaire à ajouter ses informations bancaires."
    }
  ];

  return (
    <InfoPageLayout
      heroTitle="Comment fonctionne Kollecta"
      heroSubtitle="Une plateforme simple, transparente et sécurisée pour vos collectes de fonds"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <h2 className="info-section-title">Le système de promesses unique de Kollecta</h2>
        <p className="info-section-text">
          Contrairement aux autres plateformes, Kollecta fonctionne sur un système de 
          promesses de dons. Cela signifie que les contributeurs s'engagent à donner, 
          mais ne paient qu'une fois l'objectif atteint. Ce modèle "tout ou rien" 
          rassure les contributeurs et motive les créateurs de cagnottes.
        </p>
      </div>

      <div className="info-section how-it-works-steps-section">
        <h2 className="info-section-title how-it-works-title">
          <span className="how-it-works-icon">🚀</span>
          Comment ça marche en 3 étapes simples
        </h2>
        
        <div className="how-it-works-steps-grid">
          <div className="how-it-works-step-card">
            <div className="how-it-works-step-number">1</div>
            <div className="how-it-works-step-visual">
              <div className="how-it-works-step-screen">
                <div className="how-it-works-screen-header"></div>
                <div className="how-it-works-screen-content">
                  <div className="how-it-works-form-line"></div>
                  <div className="how-it-works-form-line short"></div>
                  <div className="how-it-works-form-line"></div>
                </div>
              </div>
            </div>
            <h3 className="how-it-works-step-title">Créez votre cagnotte</h3>
            <p className="how-it-works-step-description">
              Racontez votre histoire, définissez votre objectif en DT et ajoutez des visuels. 
              C'est gratuit et sans engagement.
            </p>
          </div>

          <div className="how-it-works-step-card">
            <div className="how-it-works-step-number">2</div>
            <div className="how-it-works-step-visual">
              <div className="how-it-works-step-screen share">
                <div className="how-it-works-screen-header"></div>
                <div className="how-it-works-screen-content">
                  <div className="how-it-works-share-icons">
                    <div className="how-it-works-share-icon"></div>
                    <div className="how-it-works-share-icon"></div>
                    <div className="how-it-works-share-icon"></div>
                    <div className="how-it-works-share-icon"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="how-it-works-step-title">Partagez et collectez</h3>
            <p className="how-it-works-step-description">
              Partagez votre cagnotte sur vos réseaux. Les contributeurs font des promesses 
              de don sans payer immédiatement.
            </p>
          </div>

          <div className="how-it-works-step-card">
            <div className="how-it-works-step-number">3</div>
            <div className="how-it-works-step-visual">
              <div className="how-it-works-step-screen collect">
                <div className="how-it-works-screen-header"></div>
                <div className="how-it-works-screen-content collect-content">
                  <div className="how-it-works-collect-calendar">
                    <div className="how-it-works-calendar-header"></div>
                    <div className="how-it-works-calendar-body">
                      <div className="how-it-works-calendar-day">✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="how-it-works-step-title">Recevez les fonds</h3>
            <p className="how-it-works-step-description">
              Si l'objectif est atteint, les promesses sont honorées et les fonds sont 
              transférés sur votre compte après vérification KYC.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title how-it-works-title">
          <span className="how-it-works-icon">🛡️</span>
          Sécurité et confiance
        </h2>
        
        <div className="security-grid">
          <div className="security-card">
            <div className="security-icon">🔐</div>
            <h3 className="security-title">Vérification KYC/AML</h3>
            <p className="security-description">
              Pour garantir la sécurité de tous, nous vérifions l'identité des créateurs 
              de cagnottes avant tout transfert de fonds. Ce processus KYC (Know Your Customer) 
              et AML (Anti-Money Laundering) respecte les normes bancaires internationales.
            </p>
          </div>

          <div className="security-card">
            <div className="security-icon">👮</div>
            <h3 className="security-title">Modération active</h3>
            <p className="security-description">
              Notre équipe de modérateurs examine chaque cagnotte pour s'assurer qu'elle 
              respecte nos conditions d'utilisation. Les utilisateurs peuvent également 
              signaler les contenus inappropriés.
            </p>
          </div>

          <div className="security-card">
            <div className="security-icon">🔒</div>
            <h3 className="security-title">Protection des données</h3>
            <p className="security-description">
              Vos données personnelles et bancaires sont cryptées et sécurisées selon les 
              normes les plus strictes. Nous ne partageons jamais vos informations sans 
              votre consentement explicite.
            </p>
          </div>

          <div className="security-card">
            <div className="security-icon">✨</div>
            <h3 className="security-title">Transparence totale</h3>
            <p className="security-description">
              Chaque cagnotte affiche clairement le montant collecté en DT, le nombre de promesses, 
              et la progression vers l'objectif. Aucun frais caché, tout est transparent.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title how-it-works-title">
          <span className="how-it-works-icon">💚</span>
          Tarification : 100% gratuit
        </h2>
        
        <div className="pricing-highlight">
          <div className="pricing-badge">Gratuit</div>
          <h3 className="pricing-title">Kollecta est entièrement gratuit</h3>
          <p className="pricing-description">
            Créez votre cagnotte sans frais, sans abonnement, sans engagement. 
            Vous ne payez rien pour utiliser la plateforme. Kollecta est financé 
            par des partenaires et des subventions pour rester accessible à tous.
          </p>
        </div>

        <div className="pricing-features">
          <div className="pricing-feature">
            <div className="pricing-feature-icon">✅</div>
            <div className="pricing-feature-content">
              <h4 className="pricing-feature-title">Création gratuite</h4>
              <p className="pricing-feature-text">
                Créez autant de cagnottes que vous le souhaitez, sans aucun frais.
              </p>
            </div>
          </div>

          <div className="pricing-feature">
            <div className="pricing-feature-icon">✅</div>
            <div className="pricing-feature-content">
              <h4 className="pricing-feature-title">Aucun frais de plateforme</h4>
              <p className="pricing-feature-text">
                Nous ne prélevons aucun pourcentage sur vos collectes.
              </p>
            </div>
          </div>

          <div className="pricing-feature">
            <div className="pricing-feature-icon">✅</div>
            <div className="pricing-feature-content">
              <h4 className="pricing-feature-title">Aucun frais de paiement</h4>
              <p className="pricing-feature-text">
                Les contributeurs peuvent honorer leurs promesses sans frais supplémentaires.
              </p>
            </div>
          </div>

          <div className="pricing-feature">
            <div className="pricing-feature-icon">✅</div>
            <div className="pricing-feature-content">
              <h4 className="pricing-feature-title">Support gratuit</h4>
              <p className="pricing-feature-text">
                Notre équipe vous accompagne gratuitement dans votre collecte.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title how-it-works-title">
          <span className="how-it-works-icon">❓</span>
          Questions fréquentes
        </h2>
        
        <div className="how-it-works-faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="how-it-works-faq-item">
              <button 
                className={`how-it-works-faq-question ${openFAQ === index ? 'active' : ''}`}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className="how-it-works-faq-icon">{openFAQ === index ? '−' : '+'}</span>
              </button>
              {openFAQ === index && (
                <div className="how-it-works-faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="info-cta">
        <h2 className="info-cta-title">Tout est clair ? Lancez-vous !</h2>
        <p className="info-cta-text">
          Rejoignez la communauté Kollecta et transformez vos projets en réalité. 
          C'est 100% gratuit !
        </p>
        <button 
          className="info-cta-button"
          onClick={() => navigate('/create/fundraiser?new=true')}
        >
          Créer ma cagnotte gratuitement
        </button>
      </div>
    </InfoPageLayout>
  );
};

export default HowItWorks;
