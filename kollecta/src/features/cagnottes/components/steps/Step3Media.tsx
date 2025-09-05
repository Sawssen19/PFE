import React, { useRef, useState } from 'react';

interface CagnotteData {
  mediaFile?: File;
  mediaUrl?: string;
}

interface Step3Props {
  data: CagnotteData;
  onUpdate: (updates: Partial<CagnotteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3Media: React.FC<Step3Props> = ({ data, onUpdate, onNext, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      onUpdate({ mediaFile: file });
      
      // Créer une URL temporaire pour l'aperçu
      const url = URL.createObjectURL(file);
      onUpdate({ mediaUrl: url });
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Ajouter une photo de couverture ou une vidéo</h2>
        <p>
          Les supports de couverture contribuent à raconter votre histoire. 
          Si vous trouvez une meilleure photo plus tard, vous pourrez toujours la modifier.
        </p>
      </div>

      <div className="media-upload-section">
        {data.mediaUrl ? (
          <div className="media-preview">
            {data.mediaFile?.type.startsWith('image/') ? (
              <img src={data.mediaUrl} alt="Aperçu" />
            ) : (
              <video src={data.mediaUrl} controls />
            )}
            <div className="media-actions">
              <button
                type="button"
                className="change-media-button"
                onClick={handleUploadClick}
              >
                Changer le média
              </button>
              <button
                type="button"
                className="remove-media-button"
                onClick={() => {
                  onUpdate({ mediaFile: undefined, mediaUrl: undefined });
                  if (data.mediaUrl) {
                    URL.revokeObjectURL(data.mediaUrl);
                  }
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`media-drop-zone ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleUploadClick}
          >
            <div className="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <p className="upload-text">Télécharger une photo ou une vidéo</p>
            <p className="upload-hint">ou glissez-déposez ici</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
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
        <div className="right-buttons">
          <button
            type="button"
            className="skip-button"
            onClick={handleSkip}
          >
            Passer pour l'instant
          </button>
          <button
            type="button"
            className="continue-button"
            onClick={onNext}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3Media; 