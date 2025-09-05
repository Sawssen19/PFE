import React from 'react';

interface CagnotteData {
  beneficiaryType: 'self' | 'other';
}

interface Step2Props {
  data: CagnotteData;
  onUpdate: (updates: Partial<CagnotteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2Beneficiary: React.FC<Step2Props> = ({ data, onUpdate, onNext, onBack }) => {
  const handleBeneficiarySelect = (type: 'self' | 'other') => {
    onUpdate({ beneficiaryType: type });
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Pour qui collectez-vous des fonds?</h2>
      </div>

      <div className="beneficiary-options">
        <div
          className={`beneficiary-option ${data.beneficiaryType === 'self' ? 'selected' : ''}`}
          onClick={() => handleBeneficiarySelect('self')}
        >
          <div className="option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="option-content">
            <h3>Toi-même</h3>
            <p>Les fonds sont versés sur votre compte bancaire pour votre propre usage</p>
          </div>
        </div>

        <div
          className={`beneficiary-option ${data.beneficiaryType === 'other' ? 'selected' : ''}`}
          onClick={() => handleBeneficiarySelect('other')}
        >
          <div className="option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div className="option-content">
            <h3>Quelqu'un d'autre</h3>
            <p>Vous inviterez un bénéficiaire à recevoir des fonds ou à les distribuer vous-même</p>
          </div>
        </div>
      </div>

      <div className="step-navigation">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button
          type="button"
          className="continue-button"
          onClick={onNext}
          disabled={!data.beneficiaryType}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

export default Step2Beneficiary; 