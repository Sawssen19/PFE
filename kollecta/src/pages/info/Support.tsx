import React, { useState } from 'react';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './Support.css';

const Support: React.FC = () => {
  const [openFaqs, setOpenFaqs] = useState<{ [key: string]: boolean }>({});

  const toggleFaq = (key: string) => {
    setOpenFaqs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const faqs = [
    {
      category: "Créer une cagnotte",
      questions: [
        { 
          key: "create-how",
          q: "Comment créer une cagnotte ?", 
          a: "Pour créer une cagnotte sur Kollecta, vous devez être résident de Tunisie. Inscrivez-vous sur la plateforme, cliquez sur 'Démarrer une cagnotte', remplissez les informations (titre, description, montant objectif, catégorie), ajoutez une photo de couverture, et publiez. Une vérification KYC sera nécessaire pour recevoir les fonds." 
        },
        { 
          key: "create-modify",
          q: "Puis-je modifier ma cagnotte après publication ?", 
          a: "Oui, vous pouvez modifier le titre, la description, les photos et certaines informations de votre cagnotte à tout moment depuis votre espace 'Mes cagnottes'. Cependant, le montant objectif ne peut généralement pas être modifié une fois la cagnotte active." 
        },
        { 
          key: "create-cost",
          q: "Combien coûte la création d'une cagnotte ?", 
          a: "La création d'une cagnotte est entièrement gratuite sur Kollecta. Il n'y a aucun frais de création, aucun frais de plateforme, et aucun frais de paiement. Kollecta est 100% gratuit pour tous les utilisateurs." 
        },
        { 
          key: "create-kyc",
          q: "Dois-je faire une vérification KYC pour créer une cagnotte ?", 
          a: "Oui, une vérification KYC (Know Your Customer) est nécessaire pour créer une cagnotte. Cela permet de garantir la sécurité et la transparence de la plateforme. La vérification se fait en ligne avec une pièce d'identité valide." 
        }
      ]
    },
    {
      category: "Faire une promesse de don",
      questions: [
        { 
          key: "promise-how",
          q: "Comment faire une promesse de don ?", 
          a: "Pour faire une promesse de don, vous devez avoir un compte Kollecta (création gratuite avec email). Cliquez sur 'Faire une promesse' sur la cagnotte qui vous intéresse, indiquez le montant en DT (Dinars Tunisiens), ajoutez un message d'encouragement si vous le souhaitez, et confirmez. Aucune vérification KYC n'est requise pour les contributeurs." 
        },
        { 
          key: "promise-when-pay",
          q: "Quand dois-je honorer ma promesse ?", 
          a: "Vous pouvez honorer votre promesse à tout moment, même si l'objectif de la cagnotte n'est pas atteint. C'est un engagement moral que vous gérez librement. Le jour J, vous pouvez honorer votre promesse de la manière qui vous convient : virement bancaire, transfert d'argent, ou tout autre moyen que vous et le créateur de la cagnotte convenez." 
        },
        { 
          key: "promise-cancel",
          q: "Puis-je annuler ou modifier ma promesse ?", 
          a: "Oui, vous pouvez modifier ou annuler votre promesse à tout moment depuis votre espace 'Mes promesses', tant qu'elle n'a pas été honorée. Vous gardez le contrôle total sur vos engagements." 
        },
        { 
          key: "promise-kyc",
          q: "Ai-je besoin d'une vérification KYC pour faire une promesse ?", 
          a: "Non, aucune vérification KYC n'est requise pour faire des promesses de dons. Il suffit d'avoir un compte Kollecta (création gratuite avec email). Vous pouvez contribuer depuis n'importe où dans le monde." 
        },
        { 
          key: "promise-currency",
          q: "Dans quelle devise sont les promesses ?", 
          a: "Les promesses sont en DT (Dinars Tunisiens), la devise locale de la Tunisie. Tous les montants sur Kollecta sont exprimés en DT." 
        }
      ]
    },
    {
      category: "Gestion des fonds",
      questions: [
        { 
          key: "funds-receive",
          q: "Quand vais-je recevoir les fonds de ma cagnotte ?", 
          a: "Les fonds sont gérés directement entre vous et les contributeurs. Kollecta ne gère pas les paiements en ligne. Une fois qu'un contributeur honore sa promesse, il vous contacte directement ou vous pouvez le contacter pour organiser le transfert des fonds selon la méthode convenue (virement bancaire, transfert d'argent, etc.)." 
        },
        { 
          key: "funds-fees",
          q: "Y a-t-il des frais sur les fonds collectés ?", 
          a: "Non, Kollecta est entièrement gratuit. Il n'y a aucun frais de plateforme, aucun frais de traitement, et aucun frais de retrait. Les fonds sont transférés directement entre vous et les contributeurs sans intermédiaire." 
        },
        { 
          key: "funds-objective",
          q: "Que se passe-t-il si l'objectif n'est pas atteint ?", 
          a: "Même si l'objectif n'est pas atteint, les contributeurs peuvent toujours choisir d'honorer leurs promesses. C'est un engagement moral que chacun gère librement. Vous recevez les fonds des contributeurs qui décident d'honorer leur promesse, indépendamment de l'objectif." 
        }
      ]
    },
    {
      category: "Sécurité et garanties",
      questions: [
        { 
          key: "security-fraud",
          q: "Comment Kollecta protège-t-il contre la fraude ?", 
          a: "Kollecta protège contre la fraude grâce à la vérification KYC pour les créateurs de cagnottes, une modération active de toutes les cagnottes, et un système de signalement facile. Si une cagnotte s'avère frauduleuse, toutes les promesses sont automatiquement annulées." 
        },
        { 
          key: "security-data",
          q: "Mes données personnelles sont-elles sécurisées ?", 
          a: "Oui, Kollecta prend la sécurité des données très au sérieux. Vos informations sont protégées et ne sont partagées qu'avec votre consentement. Vous pouvez choisir de rester anonyme lors de vos promesses si vous le souhaitez." 
        },
        { 
          key: "security-report",
          q: "Comment signaler une cagnotte suspecte ?", 
          a: "Si vous suspectez une fraude ou un comportement suspect, vous pouvez signaler la cagnotte en un clic depuis la page de la cagnotte. Notre équipe enquêtera immédiatement et prendra les mesures nécessaires." 
        }
      ]
    },
    {
      category: "Compte et profil",
      questions: [
        { 
          key: "account-create",
          q: "Comment créer un compte ?", 
          a: "Pour créer un compte, cliquez sur 'S'inscrire' en haut de la page, remplissez vos informations (nom, prénom, email, mot de passe), confirmez votre email, et c'est tout ! La création de compte est gratuite et ne nécessite aucune vérification KYC pour les contributeurs." 
        },
        { 
          key: "account-countries",
          q: "Puis-je créer un compte depuis l'étranger ?", 
          a: "Oui, vous pouvez créer un compte depuis n'importe quel pays dans le monde. Cependant, seuls les résidents de Tunisie peuvent créer des cagnottes. Les contributeurs peuvent faire des promesses depuis n'importe où." 
        },
        { 
          key: "account-forgot",
          q: "J'ai oublié mon mot de passe, que faire ?", 
          a: "Cliquez sur 'Mot de passe oublié' sur la page de connexion, entrez votre email, et vous recevrez un lien de réinitialisation par email. Suivez les instructions pour créer un nouveau mot de passe." 
        }
      ]
    }
  ];

  return (
    <InfoPageLayout
      heroTitle="Centre d'assistance"
      heroSubtitle="Nous sommes là pour vous aider à réussir votre collecte de fonds"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <h2 className="info-section-title">Comment pouvons-nous vous aider ?</h2>
        
        <div className="support-contact-grid">
          <div className="support-contact-card">
            <div className="support-contact-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#00b289"/>
              </svg>
            </div>
            <h3 className="support-contact-title">Email</h3>
            <p className="support-contact-description">
              <a href="mailto:support@kollecta.tn" className="support-contact-link">
                support@kollecta.tn
              </a>
            </p>
            <p className="support-contact-time">
              Réponse sous 24h
            </p>
          </div>

          <div className="support-contact-card">
            <div className="support-contact-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="#00b289"/>
              </svg>
            </div>
            <h3 className="support-contact-title">Téléphone</h3>
            <p className="support-contact-description">
              <a href="tel:+21612345678" className="support-contact-link">
                +216 12 345 678
              </a>
            </p>
            <p className="support-contact-time">
              Du lundi au vendredi
            </p>
          </div>
        </div>
      </div>

      {faqs.map((section, index) => (
        <div key={index} className="info-section">
          <h2 className="info-section-title support-section-title">{section.category}</h2>
          <div className="support-faq-list">
            {section.questions.map((faq) => (
              <div key={faq.key} className="support-faq-item">
                <button
                  className={`support-faq-question ${openFaqs[faq.key] ? 'active' : ''}`}
                  onClick={() => toggleFaq(faq.key)}
                >
                  <span>{faq.q}</span>
                  <span className="support-faq-icon">
                    {openFaqs[faq.key] ? '−' : '+'}
                  </span>
                </button>
                {openFaqs[faq.key] && (
                  <div className="support-faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="info-section support-contact-section">
        <h2 className="info-section-title">Vous ne trouvez pas de réponse ?</h2>
        <p className="info-section-text">
          Contactez-nous directement et notre équipe vous répondra dans les plus brefs délais.
        </p>
        <div className="support-contact-form">
          <input
            type="text"
            placeholder="Votre nom"
            className="support-form-input"
          />
          <input
            type="email"
            placeholder="Votre email"
            className="support-form-input"
          />
          <textarea
            placeholder="Votre message"
            rows={5}
            className="support-form-textarea"
          />
          <button className="support-form-button">
            Envoyer
          </button>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default Support;
