import React, { useState } from 'react';

interface CagnotteData {
  country: string;
  postalCode: string;
  category: string;
  beneficiaryType: 'self' | 'other';
  mediaUrl?: string;
  title: string;
  story: string;
  goalAmount: number;
  currency: string;
  endDate: string;
}

interface Step5Props {
  data: CagnotteData;
  onUpdate: (updates: Partial<CagnotteData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
}

const Step5Review: React.FC<Step5Props> = ({ data, onUpdate, onSubmit, onBack, onSaveDraft }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoalAmountChange = (amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount >= 0) {
      onUpdate({ goalAmount: numAmount });
      setErrors(prev => ({ ...prev, goalAmount: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!data.goalAmount || data.goalAmount <= 0) {
      newErrors.goalAmount = 'Veuillez saisir un montant objectif valide';
    }

    if (!data.endDate) {
      newErrors.endDate = 'Veuillez sélectionner une date de fin';
    } else {
      const endDate = new Date(data.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (endDate <= today) {
        newErrors.endDate = 'La date de fin doit être dans le futur';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit();
      } catch (error) {
        console.error('Erreur lors de la création:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getBeneficiaryText = () => {
    return data.beneficiaryType === 'self' ? 'Vous-même' : 'Quelqu\'un d\'autre';
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Vérifiez et lancez votre cagnotte</h2>
        <p>Vérifiez toutes les informations avant de lancer votre cagnotte</p>
      </div>

      <div className="review-section">
        <div className="review-card">
          <h3>Informations de base</h3>
          <div className="review-item">
            <span className="label">Pays:</span>
            <span className="value">{data.country}</span>
          </div>
          <div className="review-item">
            <span className="label">Code postal:</span>
            <span className="value">{data.postalCode}</span>
          </div>
          <div className="review-item">
            <span className="label">Catégorie:</span>
            <span className="value">{data.category}</span>
          </div>
          <div className="review-item">
            <span className="label">Bénéficiaire:</span>
            <span className="value">{getBeneficiaryText()}</span>
          </div>
        </div>

        <div className="review-card">
          <h3>Contenu</h3>
          <div className="review-item">
            <span className="label">Titre:</span>
            <span className="value">{data.title}</span>
          </div>
          <div className="review-item">
            <span className="label">Histoire:</span>
            <span className="value story-preview">
              {data.story.length > 100 ? `${data.story.substring(0, 100)}...` : data.story}
            </span>
          </div>
          {data.mediaUrl && (
            <div className="review-item">
              <span className="label">Média:</span>
              <div className="media-preview-small">
                {data.mediaUrl.includes('image') ? (
                  <img src={data.mediaUrl} alt="Aperçu" />
                ) : (
                  <video src={data.mediaUrl} />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="review-card">
          <h3>Objectif financier</h3>
          <div className="form-group">
            <label htmlFor="goalAmount">Montant objectif ({data.currency})</label>
            <input
              type="number"
              id="goalAmount"
              value={data.goalAmount || ''}
              onChange={(e) => handleGoalAmountChange(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className={errors.goalAmount ? 'error' : ''}
            />
            {errors.goalAmount && <span className="error-message">{errors.goalAmount}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">Date de fin de la cagnotte</label>
            <input
              type="date"
              id="endDate"
              value={data.endDate}
              onChange={(e) => {
                onUpdate({ endDate: e.target.value });
                setErrors(prev => ({ ...prev, endDate: '' }));
              }}
              min={new Date().toISOString().split('T')[0]}
              className={errors.endDate ? 'error' : ''}
            />
            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
          </div>
        </div>
      </div>

      <div className="step-navigation">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <div className="action-buttons">
          <button
            type="button"
            className="save-draft-button"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            title="Sauvegarder comme brouillon et quitter (vous pourrez reprendre plus tard)"
          >
            Sauvegarder et quitter
          </button>
          
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting || !data.goalAmount || data.goalAmount <= 0 || !data.endDate}
            title="Finaliser la cagnotte et la soumettre pour approbation"
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                <span>Finalisation en cours...</span>
              </>
            ) : (
              'Finaliser et soumettre'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5Review; 