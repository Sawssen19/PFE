import React from 'react';
import { useNavigate } from 'react-router-dom';
import './KYCPages.css';

export const KYCError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="kyc-error-page">
      <div className="kyc-error-container">
        <div className="kyc-error-icon">❌</div>
        <h1>Erreur lors de la vérification KYC</h1>
        
        <div className="kyc-error-message">
          <p>Une erreur s'est produite lors de l'envoi de vos documents.</p>
          <p>Veuillez réessayer ou contacter notre support si le problème persiste.</p>
        </div>

        <div className="kyc-error-actions">
          <button 
            onClick={() => navigate('/kyc/verify')}
            className="btn-primary"
          >
            Réessayer la vérification
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="btn-secondary"
          >
            Retour au profil
          </button>
        </div>

        <div className="kyc-error-help">
          <h3>Solutions possibles :</h3>
          <ul>
            <li>🔍 Vérifiez que vos fichiers sont au format JPEG, PNG ou WebP</li>
            <li>📏 Assurez-vous que chaque fichier fait moins de 5MB</li>
            <li>📱 Essayez de prendre de nouvelles photos plus claires</li>
            <li>🌐 Vérifiez votre connexion internet</li>
          </ul>
        </div>

        <div className="kyc-error-info">
          <p>
            <strong>📞 Support :</strong> Si le problème persiste, contactez notre équipe support.
          </p>
          <p>
            <strong>📧 Email :</strong> support@kollecta.tn
          </p>
        </div>
      </div>
    </div>
  );
}; 