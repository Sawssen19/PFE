import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HowToStart.css';

interface Cagnotte {
  id: string;
  titre?: string;
  title?: string;
  description: string;
  categorie?: string;
  category?: {
    name: string;
  };
  montantObjectif?: number;
  goalAmount?: number;
  montantCollecte?: number;
  currentAmount?: number;
  statut?: string;
  status?: string;
  dateEvenement?: string;
  coverImage?: string;
}

const HowToStart: React.FC = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [cagnottes, setCagnottes] = useState<Cagnotte[]>([]);
  const [loadingCagnottes, setLoadingCagnottes] = useState(true);

  // Charger les vraies cagnottes depuis l'API
  useEffect(() => {
    const fetchCagnottes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cagnottes');
        if (response.ok) {
          const result = await response.json();
          
          // Gérer différentes structures de réponse API
          let allCagnottes: Cagnotte[] = [];
          if (result.data && result.data.cagnottes) {
            allCagnottes = result.data.cagnottes;
          } else if (Array.isArray(result)) {
            allCagnottes = result;
          } else if (result.cagnottes && Array.isArray(result.cagnottes)) {
            allCagnottes = result.cagnottes;
          }
          
          // Essayer d'abord les cagnottes approuvées/actives, sinon prendre toutes les cagnottes
          let displayCagnottes = allCagnottes
            .filter((c: Cagnotte) => {
              const statut = c.statut || c.status || '';
              const statutLower = statut.toLowerCase();
              return statutLower === 'approuvée' || 
                     statutLower === 'approuvee' || 
                     statutLower === 'approved' ||
                     statutLower === 'active' ||
                     statutLower === 'actif';
            })
            .slice(0, 3);
          
          // Si aucune approuvée, prendre les 3 premières disponibles
          if (displayCagnottes.length === 0 && allCagnottes.length > 0) {
            displayCagnottes = allCagnottes.slice(0, 3);
          }
          
          setCagnottes(displayCagnottes);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des cagnottes:', error);
      } finally {
        setLoadingCagnottes(false);
      }
    };

    fetchCagnottes();
  }, []);

  // Mappage des catégories vers des emojis
  const getCategoryIcon = (categorie: string): string => {
    const iconMap: { [key: string]: string } = {
      'Médical': '🏥',
      'Éducation': '🎓',
      'Urgence': '🚨',
      'Association': '🤝',
      'Environnement': '🌱',
      'Sport': '⚽',
      'Arts': '🎨',
      'Business': '🚀',
      'Communauté': '🏘️',
      'Animaux': '🐾',
      'Mariage': '💒',
      'Mémorial': '❤️',
    };
    return iconMap[categorie] || '🎯';
  };

  const faqs = [
    {
      question: "Puis-je créer une cagnotte pour moi-même ?",
      answer: "Oui, des milliers de personnes ont créé une cagnotte sur Kollecta pour eux-mêmes ou leur famille en cas de crise financière. Frais médicaux, urgences, projets personnels... tous les besoins légitimes trouvent du soutien via le financement participatif."
    },
    {
      question: "Puis-je créer une cagnotte pour quelqu'un d'autre ?",
      answer: "Oui, vous pouvez créer une cagnotte pour quelqu'un d'autre et vous assurer que les fonds lui parviennent directement et en toute sécurité. Vous pouvez inviter le bénéficiaire à ajouter ses informations bancaires."
    },
    {
      question: "Quels sont les frais pour créer une cagnotte ?",
      answer: "Il n'y a aucun frais pour créer une cagnotte sur Kollecta. Nous prélevons uniquement une commission de 5% sur les fonds collectés, plus les frais de transaction bancaire de 2,9%. Tout le reste va directement à votre cause."
    },
    {
      question: "Combien de temps faut-il pour recevoir l'argent ?",
      answer: "Le processus de vérification KYC et de transfert prend 5 à 7 jours ouvrés. Une fois votre premier transfert envoyé, il faut en moyenne 2 à 5 jours ouvrés pour que les fonds soient déposés sur votre compte bancaire."
    },
    {
      question: "Comment fonctionne le système de promesses ?",
      answer: "Contrairement aux autres plateformes, les contributeurs font des promesses de don sans payer immédiatement. Ils ne sont débités que si votre objectif est atteint. Ce système 'tout ou rien' rassure les donateurs et vous motive à partager activement."
    },
    {
      question: "Y a-t-il une limite de temps pour ma cagnotte ?",
      answer: "Vous définissez vous-même la date de fin de votre cagnotte. Vous pouvez la prolonger si nécessaire avant l'échéance. Il n'y a pas de limite imposée par la plateforme."
    },
    {
      question: "Comment puis-je partager ma cagnotte ?",
      answer: "Vous pouvez partager votre cagnotte via les boutons de partage dans votre tableau de bord : réseaux sociaux, email, WhatsApp, etc. Plus vous partagez, plus vous collectez !"
    },
    {
      question: "Dans quels pays Kollecta est-il disponible ?",
      answer: "Kollecta est actuellement disponible en Tunisie. Nous travaillons activement pour étendre notre service à d'autres pays prochainement."
    }
  ];

  return (
    <div className="start-page">
      {/* Hero Section */}
      <section className="start-hero">
        <div className="start-hero-container">
          <div className="start-hero-text-panel">
            <h1 className="start-hero-title">
              Démarrez votre collecte<br />sur Kollecta
            </h1>
            <p className="start-hero-subtitle">
              Tout ce dont vous avez besoin pour réussir votre cagnotte est ici. 
              Démarrez votre collecte sur la plateforme #1 en Tunisie dès aujourd'hui.
            </p>
            <button 
              className="start-hero-button"
              onClick={() => navigate('/create/fundraiser?new=true')}
            >
              Créer une cagnotte
            </button>
          </div>
          <div className="start-hero-visual-panel">
            <div className="hero-visual-content">
              <div className="hero-visual-icon">🤝</div>
              <div className="hero-visual-text">
                <span className="visual-number">50K+</span>
                <span className="visual-label">DT collectés chaque semaine</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Start Section */}
      <section className="start-steps">
        <div className="start-container">
          <h2 className="start-section-title">Comment démarrer une cagnotte</h2>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-visual">
                <div className="step-screen">
                  <div className="screen-header"></div>
                  <div className="screen-content">
                    <div className="form-line"></div>
                    <div className="form-line short"></div>
                    <div className="form-line"></div>
                    <div className="form-line medium"></div>
                  </div>
                </div>
              </div>
              <h3 className="step-title">Nos outils vous aident à créer votre cagnotte</h3>
              <p className="step-description">
                Cliquez sur 'Démarrer ma cagnotte' pour commencer. Vous serez guidé pour 
                ajouter les détails et définir votre objectif, modifiable à tout moment.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-visual">
                <div className="step-screen share">
                  <div className="screen-header"></div>
                  <div className="screen-content">
                    <div className="share-icons">
                      <div className="share-icon"></div>
                      <div className="share-icon"></div>
                      <div className="share-icon"></div>
                      <div className="share-icon"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="step-title">Partagez votre lien pour toucher des donateurs</h3>
              <p className="step-description">
                Une fois publiée, partagez votre cagnotte avec vos amis et votre famille. 
                Vous trouverez aussi des ressources utiles dans votre tableau de bord.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-visual">
                <div className="step-screen collect">
                  <div className="screen-header"></div>
                  <div className="screen-content collect-content">
                    <div className="collect-calendar">
                      <div className="calendar-header"></div>
                      <div className="calendar-body">
                        <div className="calendar-day">15</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="step-title">Collectez le jour J de votre événement</h3>
              <p className="step-description">
                Les contributeurs font des promesses de don sans paiement immédiat. 
                Si votre objectif est atteint, la collecte finale se fait automatiquement le jour de l'événement.
              </p>
            </div>
          </div>

          <div className="start-cta-center">
            <button 
              className="start-button-primary"
              onClick={() => navigate('/create/fundraiser?new=true')}
            >
              Démarrer ma cagnotte
            </button>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="start-examples">
        <div className="start-container">
          <h2 className="start-section-title">Cagnottes actives sur Kollecta</h2>
          <p className="start-section-subtitle">
            Découvrez des projets réels soutenus par notre communauté
          </p>
          
          {loadingCagnottes ? (
            <div className="examples-loading">
              <div className="loading-spinner"></div>
              <p>Chargement des cagnottes...</p>
            </div>
          ) : cagnottes.length > 0 ? (
            <div className="examples-grid">
              {cagnottes.map((cagnotte) => {
                // Gérer les différentes structures de propriétés
                const titre = cagnotte.titre || cagnotte.title || 'Sans titre';
                const categorie = cagnotte.categorie || cagnotte.category?.name || 'Autre';
                const montantCollecte = cagnotte.montantCollecte || cagnotte.currentAmount || 0;
                const montantObjectif = cagnotte.montantObjectif || cagnotte.goalAmount || 0;
                const pourcentage = montantObjectif > 0 
                  ? Math.round((montantCollecte / montantObjectif) * 100)
                  : 0;
                
                return (
                  <div 
                    key={cagnotte.id} 
                    className="example-card cagnotte-card"
                    onClick={() => navigate(`/cagnottes/${cagnotte.id}`)}
                  >
                    <div className="cagnotte-image-wrapper">
                      {cagnotte.coverImage ? (
                        <img 
                          src={cagnotte.coverImage} 
                          alt={titre} 
                          className="cagnotte-image"
                        />
                      ) : (
                        <div className="cagnotte-image-placeholder">
                          <div className="placeholder-icon">{getCategoryIcon(categorie)}</div>
                        </div>
                      )}
                      <div className="cagnotte-category-badge">
                        {categorie}
                      </div>
                    </div>
                    
                    <div className="cagnotte-content-wrapper">
                      <h3 className="cagnotte-title">{titre}</h3>
                      <p className="cagnotte-description">
                        {cagnotte.description && cagnotte.description.length > 100 
                          ? `${cagnotte.description.substring(0, 100)}...` 
                          : (cagnotte.description || 'Aucune description')}
                      </p>
                      
                      <div className="cagnotte-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${Math.min(pourcentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="cagnotte-stats">
                          <div className="stat">
                            <span className="stat-amount">{montantCollecte.toLocaleString()} DT</span>
                            <span className="stat-text">collectés sur {montantObjectif.toLocaleString()} DT</span>
                          </div>
                          <div className="stat-percent">{pourcentage}%</div>
                        </div>
                      </div>
                      
                      <div className="cagnotte-footer">
                        <span className="view-link">Voir la cagnotte →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="examples-empty">
              <div className="empty-icon">📋</div>
              <p>Aucune cagnotte disponible pour le moment.</p>
              <p className="empty-subtitle">Soyez le premier à créer la vôtre !</p>
              <button 
                className="start-button-primary"
                onClick={() => navigate('/create/fundraiser?new=true')}
              >
                Créer ma cagnotte
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Resources Section */}
      <section className="start-resources">
        <div className="start-container">
          <h2 className="start-section-title">Ressources pour collecter des fonds</h2>
          <p className="start-section-subtitle">
            De la configuration de votre cagnotte aux conseils pour atteindre votre objectif—nous sommes là pour vous aider.
          </p>
          
          <div className="resources-grid">
            <div className="resource-card" onClick={() => navigate('/fundraising-tips')}>
              <h3 className="resource-title">Meilleurs conseils pour votre cagnotte</h3>
              <div className="resource-arrow">→</div>
            </div>

            <div className="resource-card" onClick={() => navigate('/fundraising-tips')}>
              <h3 className="resource-title">Conseils pour raconter une belle histoire</h3>
              <div className="resource-arrow">→</div>
            </div>

            <div className="resource-card" onClick={() => navigate('/fundraising-tips')}>
              <h3 className="resource-title">Conseils pour partager votre cagnotte</h3>
              <div className="resource-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="start-faq">
        <div className="start-container">
          <h2 className="start-section-title">Questions fréquentes</h2>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className={`faq-question ${openFAQ === index ? 'active' : ''}`}
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openFAQ === index ? '−' : '+'}</span>
                </button>
                {openFAQ === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="start-categories">
        <div className="start-container">
          <h2 className="start-section-title">Pour quoi peut-on créer une cagnotte ?</h2>
          
          <div className="categories-grid">
            <div className="category-tag">Médical</div>
            <div className="category-tag">Mémorial</div>
            <div className="category-tag">Urgence</div>
            <div className="category-tag">Éducation</div>
            <div className="category-tag">Association</div>
            <div className="category-tag">Animaux</div>
            <div className="category-tag">Mariage</div>
            <div className="category-tag">Sport</div>
            <div className="category-tag">Business</div>
            <div className="category-tag">Environnement</div>
            <div className="category-tag">Arts</div>
            <div className="category-tag">Communauté</div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="start-help">
        <div className="start-container">
          <h2 className="help-title">Besoin d'aide ?<br/>Nous sommes là pour vous.</h2>
          <button 
            className="help-button"
            onClick={() => navigate('/support')}
          >
            Visiter le centre d'assistance
          </button>
        </div>
      </section>
    </div>
  );
};

export default HowToStart;
