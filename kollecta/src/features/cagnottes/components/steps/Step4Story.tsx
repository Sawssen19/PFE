import React, { useState } from 'react';

interface CagnotteData {
  title: string;
  story: string;
  category?: string;
}

interface Step4Props {
  data: CagnotteData;
  onUpdate: (updates: Partial<CagnotteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step4Story: React.FC<Step4Props> = ({ data, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string>('');
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

  // 🤖 Génération d'histoire avec l'IA Gemini
  const handleGenerateStory = async () => {
    if (!data.title.trim()) {
      setAiError('Veuillez d\'abord saisir un titre');
      return;
    }

    if (data.title.trim().length < 5) {
      setAiError('Le titre doit contenir au moins 5 caractères');
      return;
    }

    setIsGenerating(true);
    setAiError('');

    try {
      const response = await fetch('http://localhost:5000/api/ai/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title.trim(),
          category: data.category,
        }),
      });

      const result = await response.json();

      if (result.success && result.data?.story) {
        onUpdate({ story: result.data.story });
        setErrors(prev => ({ ...prev, story: '' }));
      } else {
        setAiError(result.message || 'Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Erreur IA:', error);
      setAiError('Impossible de se connecter au service IA');
    } finally {
      setIsGenerating(false);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label htmlFor="story">Racontez votre histoire</label>
            <button
              type="button"
              className="ai-generate-button"
              onClick={handleGenerateStory}
              disabled={isGenerating || !data.title.trim()}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isGenerating || !data.title.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
                opacity: isGenerating || !data.title.trim() ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isGenerating && data.title.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isGenerating ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="50" strokeLinecap="round" opacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  <span>Génération...</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '16px' }}>✨</span>
                  <span>Générer avec l'IA</span>
                </>
              )}
            </button>
          </div>
          {aiError && (
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '6px',
              padding: '10px 12px',
              marginBottom: '10px',
              fontSize: '13px',
              color: '#856404',
            }}>
              ⚠️ {aiError}
            </div>
          )}
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