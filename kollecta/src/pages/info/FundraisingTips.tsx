import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './FundraisingTips.css';

const FundraisingTips: React.FC = () => {
  const navigate = useNavigate();

  return (
    <InfoPageLayout
      heroTitle="Conseils pour collecter des fonds"
      heroSubtitle="Le guide de référence avec des conseils pratiques pour maximiser votre collecte sur Kollecta"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <h2 className="info-section-title">Les fondamentaux d'une collecte réussie</h2>
        <p className="info-section-text">
          Réussir sa collecte de fonds sur Kollecta ne s'improvise pas. Voici les conseils essentiels 
          pour maximiser vos chances de succès et atteindre vos objectifs rapidement grâce aux promesses de dons.
        </p>
      </div>

      <div className="info-section">
        <h2 className="info-section-title tips-section-title">
          <span className="tips-icon">📝</span>
          Préparation de votre cagnotte
        </h2>
        
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">1</div>
              <h3 className="tip-card-title">Choisissez un titre accrocheur</h3>
            </div>
            <p className="tip-card-description">
              Votre titre doit être clair, concis et émotionnellement engageant. Évitez les 
              formulations vagues. Exemple : "Aidez Marie à combattre le cancer" est plus 
              impactant que "Collecte de fonds pour frais médicaux".
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">2</div>
              <h3 className="tip-card-title">Rédigez une histoire captivante</h3>
            </div>
            <p className="tip-card-description">
              Les gens font des promesses de dons pour des personnes et des histoires, pas pour des montants. 
              Structurez votre récit : présentez-vous, expliquez la situation, détaillez 
              comment les fonds seront utilisés, et terminez par un appel à l'action.
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">3</div>
              <h3 className="tip-card-title">Fixez le bon montant</h3>
            </div>
            <p className="tip-card-description">
              Soyez réaliste et transparent. Détaillez le budget : 5000 DT pour l'opération, 
              2000 DT pour les soins post-opératoires, etc. La transparence inspire confiance et encourage les promesses de dons.
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">4</div>
              <h3 className="tip-card-title">Utilisez des visuels de qualité</h3>
            </div>
            <p className="tip-card-description">
              Les cagnottes avec photos et vidéos reçoivent 40% plus de promesses de dons. Utilisez des 
              images authentiques, en haute résolution, qui racontent votre histoire.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title tips-section-title">
          <span className="tips-icon">📢</span>
          Stratégie de partage
        </h2>
        
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">1</div>
              <h3 className="tip-card-title">Partagez dès le lancement</h3>
            </div>
            <p className="tip-card-description">
              Les premières 48h sont cruciales. Partagez immédiatement sur tous vos réseaux 
              sociaux et contactez directement vos proches par message privé pour les inviter à faire une promesse de don.
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">2</div>
              <h3 className="tip-card-title">Créez un planning de partage</h3>
            </div>
            <p className="tip-card-description">
              Partagez régulièrement mais sans spam. Idéalement 3-4 fois par semaine avec 
              des messages différents : témoignages, mises à jour, remerciements, etc.
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">3</div>
              <h3 className="tip-card-title">Personnalisez vos messages</h3>
            </div>
            <p className="tip-card-description">
              Évitez les messages génériques. Adaptez votre communication selon la plateforme 
              et l'audience : Facebook pour la famille, LinkedIn pour les professionnels, etc.
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">4</div>
              <h3 className="tip-card-title">Utilisez les bons hashtags</h3>
            </div>
            <p className="tip-card-description">
              Sur les réseaux sociaux, utilisez des hashtags pertinents : #solidarité, 
              #entraide, #collectedefonds, #Kollecta, ainsi que des hashtags spécifiques à votre cause.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title tips-section-title">
          <span className="tips-icon">💬</span>
          Communication avec les contributeurs
        </h2>
        
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">1</div>
              <h3 className="tip-card-title">Remerciez rapidement</h3>
            </div>
            <p className="tip-card-description">
              Remerciez chaque contributeur qui a fait une promesse de don dans les 24h, de préférence personnellement. 
              Un simple message montre votre reconnaissance et renforce le lien.
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">2</div>
              <h3 className="tip-card-title">Donnez des nouvelles régulières</h3>
            </div>
            <p className="tip-card-description">
              Publiez des mises à jour au moins une fois par semaine. Partagez vos progrès, 
              vos défis, et l'impact des promesses de dons. La transparence fidélise vos soutiens.
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">3</div>
              <h3 className="tip-card-title">Célébrez les étapes</h3>
            </div>
            <p className="tip-card-description">
              Chaque palier franchi (25%, 50%, 75%) mérite d'être célébré. C'est l'occasion 
              de remercier et de relancer la dynamique pour encourager plus de promesses.
            </p>
          </div>

          <div className="tip-card">
            <div className="tip-card-header">
              <div className="tip-number">4</div>
              <h3 className="tip-card-title">Rappelez les promesses en attente</h3>
            </div>
            <p className="tip-card-description">
              Sur Kollecta, les contributeurs font des promesses de dons qu'ils peuvent honorer plus tard. 
              N'hésitez pas à les rappeler poliment quand la date limite approche.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title tips-section-title">
          <span className="tips-icon">🎯</span>
          Stratégies avancées
        </h2>
        
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-icon">👥</div>
            <h3 className="info-card-title">Effet d'amorçage</h3>
            <p className="info-card-description">
              Faites les premières promesses de dons vous-même et demandez à vos proches 
              de faire de même. Les gens font plus facilement des promesses quand d'autres 
              ont déjà contribué.
            </p>
          </div>

          <div className="info-card">
            <div className="info-card-icon">🎁</div>
            <h3 className="info-card-title">Matching gifts</h3>
            <p className="info-card-description">
              Trouvez un généreux contributeur qui accepte de doubler les promesses de dons jusqu'à 
              un certain montant (par exemple, jusqu'à 5000 DT). Cela incite fortement les gens à faire des promesses.
            </p>
          </div>

          <div className="info-card">
            <div className="info-card-icon">⏰</div>
            <h3 className="info-card-title">Urgence limitée</h3>
            <p className="info-card-description">
              Créez un sentiment d'urgence légitime : "Plus que 7 jours avant la 
              date limite" ou "Il nous manque 1000 DT pour atteindre l'objectif".
            </p>
          </div>

          <div className="info-card">
            <div className="info-card-icon">📊</div>
            <h3 className="info-card-title">Preuve sociale</h3>
            <p className="info-card-description">
              Partagez les témoignages de contributeurs, mentionnez le nombre de personnes 
              qui ont fait des promesses. La preuve sociale encourage les autres à contribuer.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title tips-section-title">
          <span className="tips-icon">⚠️</span>
          Erreurs à éviter
        </h2>
        
        <div className="tips-warnings">
          <div className="warning-card">
            <div className="warning-icon">❌</div>
            <div className="warning-content">
              <h3 className="warning-title">Ne pas partager assez</h3>
              <p className="warning-text">
                La discrétion n'est pas une vertu en collecte de fonds. Partagez régulièrement sans complexe 
                pour maximiser les promesses de dons.
              </p>
            </div>
          </div>

          <div className="warning-card">
            <div className="warning-icon">❌</div>
            <div className="warning-content">
              <h3 className="warning-title">Manquer de transparence</h3>
              <p className="warning-text">
                Expliquez précisément comment les fonds seront utilisés et donnez des nouvelles régulières. 
                La transparence est essentielle pour gagner la confiance des contributeurs.
              </p>
            </div>
          </div>

          <div className="warning-card">
            <div className="warning-icon">❌</div>
            <div className="warning-content">
              <h3 className="warning-title">Négliger les remerciements</h3>
              <p className="warning-text">
                Chaque promesse de don mérite une reconnaissance, même modeste. C'est la base du respect 
                et cela encourage d'autres contributions.
              </p>
            </div>
          </div>

          <div className="warning-card">
            <div className="warning-icon">❌</div>
            <div className="warning-content">
              <h3 className="warning-title">Fixer un objectif irréaliste</h3>
              <p className="warning-text">
                Un objectif trop élevé peut décourager. Mieux vaut l'augmenter progressivement 
                une fois que vous avez atteint votre premier objectif.
              </p>
            </div>
          </div>

          <div className="warning-card">
            <div className="warning-icon">❌</div>
            <div className="warning-content">
              <h3 className="warning-title">Abandonner trop vite</h3>
              <p className="warning-text">
                La plupart des collectes réussies ont connu des moments difficiles. Persévérez ! 
                Les promesses de dons peuvent prendre du temps à se concrétiser.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-cta">
        <h2 className="info-cta-title">Prêt à appliquer ces conseils ?</h2>
        <p className="info-cta-text">
          Créez votre cagnotte maintenant sur Kollecta et mettez en pratique ces stratégies gagnantes
        </p>
        <button 
          className="info-cta-button"
          onClick={() => navigate('/create/fundraiser?new=true')}
        >
          Démarrer ma collecte
        </button>
      </div>
    </InfoPageLayout>
  );
};

export default FundraisingTips;
