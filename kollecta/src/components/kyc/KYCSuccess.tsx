import React from 'react';
import { useNavigate } from 'react-router-dom';
import './KYCPages.css';

export const KYCSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="kyc-success-page">
      <div className="kyc-success-container">
        <div className="kyc-success-icon">🎉</div>
        <h1>Vérification KYC initiée avec succès !</h1>
        
        <div className="kyc-success-message">
          <p>Vos documents d'identité ont été envoyés pour vérification.</p>
          <p>Ce processus peut prendre 24-48 heures.</p>
          <p>Vous recevrez une notification une fois la vérification terminée.</p>
        </div>

        <div className="kyc-success-steps">
          <h3>Prochaines étapes :</h3>
          <ul>
            <li>✅ Documents reçus et enregistrés</li>
            <li>⏳ Vérification en cours par nos équipes</li>
            <li>📧 Notification par email du résultat</li>
            <li>🚀 Accès aux fonctionnalités complètes</li>
          </ul>
        </div>

        <div className="kyc-success-actions">
          <button 
            onClick={() => navigate('/kyc/status')}
            className="btn-primary"
          >
            Vérifier le statut
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="btn-secondary"
          >
            Retour au profil
          </button>
        </div>

        <div className="kyc-success-info">
          <p>
            <strong>💡 Conseil :</strong> Gardez vos documents d'identité à jour pour éviter les interruptions de service.
          </p>
          <p>
            <strong>📞 Support :</strong> En cas de problème, contactez notre équipe support.
          </p>
        </div>
      </div>
    </div>
  );
}; 