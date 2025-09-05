import React, { useState } from 'react';

interface CagnotteData {
  title: string;
  story: string;
}

interface Step4Props {
  data: CagnotteData;
  onUpdate: (updates: Partial<CagnotteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step4Story: React.FC<Step4Props> = ({ data, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const maxTitleLength = 60;
  const maxStoryLength = 5000;

  const handleTitleChange = (title: string) => {
    if (title.length <= maxTitleLength) {
      onUpdate({ title });
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const handleStoryChange = (story: string) => {
    if (story.length <= maxStoryLength) {
      onUpdate({ story });
      setErrors(prev => ({ ...prev, story: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!data.title.trim()) {
      newErrors.title = 'Veuillez saisir un titre';
    } else if (data.title.trim().length < 10) {
      newErrors.title = 'Le titre doit contenir au moins 10 caractères';
    }

    if (!data.story.trim()) {
      newErrors.story = 'Veuillez raconter votre histoire';
    } else if (data.story.trim().length < 50) {
      newErrors.story = 'L\'histoire doit contenir au moins 50 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Racontez votre histoire</h2>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="title">Donnez un titre à votre collecte de fonds</label>
          <div className="input-with-counter">
            <input
              type="text"
              id="title"
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Faites un don pour aider..."
              className={errors.title ? 'error' : ''}
            />
            <span className="character-counter">
              {data.title.length}/{maxTitleLength}
            </span>
          </div>
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="story">Racontez votre histoire</label>
          <div className="textarea-with-counter">
            <textarea
              id="story"
              value={data.story}
              onChange={(e) => handleStoryChange(e.target.value)}
              placeholder="Hi, my name is Jane and I'm fundraising for..."
              rows={8}
              className={errors.story ? 'error' : ''}
            />
            <span className="character-counter">
              {data.story.length}/{maxStoryLength}
            </span>
          </div>
          {errors.story && <span className="error-message">{errors.story}</span>}
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
          onClick={handleContinue}
          disabled={!data.title.trim() || !data.story.trim()}
        >
          Revoir
        </button>
      </div>
    </div>
  );
};

export default Step4Story; 