import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, Users, Mail, LogOut } from 'lucide-react';
import './AccountRequestConfirmation.css';

interface AccountRequestConfirmationProps {
  requestType: 'deletion' | 'deactivation';
  onClose: () => void;
}

const AccountRequestConfirmation: React.FC<AccountRequestConfirmationProps> = ({ 
  requestType, 
  onClose 
}) => {
  const [countdown, setCountdown] = useState(3);
  const requestTypeText = requestType === 'deletion' ? 'suppression définitive' : 'désactivation temporaire';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      onClose();
    }
  }, [countdown, onClose]);

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-header">
          <CheckCircle className="confirmation-icon success" />
          <h2>Demande Envoyée avec Succès !</h2>
          <p>Votre demande de {requestTypeText} a été reçue par l'équipe Kollecta</p>
          
          {/* 🎯 MESSAGE SPÉCIAL POUR LA DÉSACTIVATION */}
          {requestType === 'deactivation' && (
            <div className="deactivation-special-message">
              <p className="reactivation-info">
                🔄 <strong>Réactivation possible :</strong> Vous pouvez réactiver votre compte à tout moment en vous reconnectant !
              </p>
            </div>
          )}
        </div>

        <div className="confirmation-content">
          <div className="confirmation-steps">
            <div className="step-item completed">
              <div className="step-icon">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="step-content">
                <h4>Demande Soumise</h4>
                <p>Votre demande a été enregistrée et transmise à l'équipe</p>
              </div>
            </div>

            <div className="step-item active">
              <div className="step-icon">
                <Users className="w-5 h-5" />
              </div>
              <div className="step-content">
                <h4>Examen par l'Équipe</h4>
                <p>L'équipe Kollecta examine votre demande (24-48h)</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-icon">
                <Mail className="w-5 h-5" />
              </div>
              <div className="step-content">
                <h4>Notification de Décision</h4>
                <p>Vous recevrez un email avec la décision finale</p>
              </div>
            </div>
          </div>

          <div className="email-notifications">
            <h3>📧 Notifications Envoyées</h3>
            <div className="notification-item">
              <Mail className="w-4 h-4" />
              <span>Email de confirmation envoyé à votre adresse</span>
            </div>
            <div className="notification-item">
              <Users className="w-4 h-4" />
              <span>Notification envoyée à l'équipe Kollecta</span>
            </div>
          </div>

          <div className="countdown-section">
            <Clock className="w-5 h-5" />
            <p>Vous allez être déconnecté dans <strong>{countdown}</strong> seconde{countdown > 1 ? 's' : ''}</p>
            <p className="countdown-subtitle">Redirection automatique vers la page de connexion</p>
          </div>
        </div>

        <div className="confirmation-footer">
          <button 
            className="btn-immediate-logout"
            onClick={onClose}
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountRequestConfirmation; 