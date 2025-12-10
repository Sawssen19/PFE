import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cagnottesService } from '../cagnottesService';
import './EditCagnotte.css';

interface Cagnotte {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'COMPLETED' | 'PENDING' | 'REJECTED';
  coverImage?: string;
  coverVideo?: string;
  mediaType?: string;
  mediaFilename?: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  category: {
    name: string;
  };
}

interface EditFormData {
  title: string;
  story: string;
  goalAmount: number;
  currency: string;
  category: string;
  country: string;
  postalCode: string;
  beneficiaryType: 'self' | 'other';
  mediaFile?: File;
  endDate: string;
}

const EditCagnotte: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cagnotte, setCagnotte] = useState<Cagnotte | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreator, setIsCreator] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<EditFormData>({
    title: '',
    story: '',
    goalAmount: 0,
    currency: 'TND',
    category: '',
    country: 'Tunisie',
    postalCode: '',
    beneficiaryType: 'self',
    endDate: '',
  });

  // Catégories synchronisées avec la base
  const [categoriesFromAPI, setCategoriesFromAPI] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        if (res.ok) {
          const result = await res.json();
          const names: string[] = (result.data || []).map((c: any) => c.name);
          setCategoriesFromAPI(names);
        }
      } catch (e) {
        console.error('Erreur chargement catégories:', e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id && !dataLoaded) {
      loadCagnotte();
    }
  }, [id, dataLoaded]);

  const loadCagnotte = async () => {
    try {
      setLoading(true);
      const response = await cagnottesService.getCagnotteById(id!);
      const cagnotteData = (response as any)?.data || response;
      setCagnotte(cagnotteData);

      // Vérifier si l'utilisateur actuel est le créateur
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const isUserCreator = currentUser.id === cagnotteData.creator.id;
      setIsCreator(isUserCreator);

      if (!isUserCreator) {
        setError('Vous n\'êtes pas autorisé à modifier cette cagnotte');
        return;
      }

      // Pré-remplir le formulaire avec les données existantes seulement si pas déjà fait
      if (!dataLoaded) {
        setFormData({
          title: cagnotteData.title || '',
          story: cagnotteData.description || '',
          goalAmount: cagnotteData.goalAmount || 0,
          currency: 'TND',
          category: cagnotteData.category?.name || '',
          country: 'Tunisie',
          postalCode: '',
          beneficiaryType: 'self',
          endDate: cagnotteData.endDate ? new Date(cagnotteData.endDate).toISOString().split('T')[0] : '',
        });
        setDataLoaded(true);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de la cagnotte:', err);
      setError('Erreur lors du chargement de la cagnotte');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof EditFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        mediaFile: file
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await cagnottesService.updateCagnotte(id!, formData);
      alert('Cagnotte modifiée avec succès !');
      // Rediriger vers la page de détail de la cagnotte
      navigate(`/cagnottes/${id}`);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError('Erreur lors de la modification de la cagnotte');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = categoriesFromAPI.length > 0 ? categoriesFromAPI : [
    'Animaux', 'Culture', 'Éducation', 'Environnement', 'Santé', 'Solidarité', 'Sport', 'Sportif', 'Technologie', 'Urgences'
  ];

  const governorates = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
    'Kairouan', 'Kasserine', 'Kébili', 'Kef', 'Mahdia', 'Manouba', 'Médenine',
    'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine',
    'Tozeur', 'Tunis', 'Zaghouan'
  ];

  if (loading) {
    return (
      <div className="edit-cagnotte-container">
        <div className="loading">Chargement de la cagnotte...</div>
      </div>
    );
  }

  if (error || !cagnotte) {
    return (
      <div className="edit-cagnotte-container">
        <div className="error">
          {error || 'Cagnotte non trouvée'}
        </div>
      </div>
    );
  }

  if (!isCreator) {
    return (
      <div className="edit-cagnotte-container">
        <div className="error">
          Vous n'êtes pas autorisé à modifier cette cagnotte
        </div>
      </div>
    );
  }

  return (
    <div className="edit-cagnotte-container">
      <div className="edit-cagnotte-content">
        {/* En-tête */}
        <div className="edit-header">
          <h1>Modifier votre cagnotte</h1>
          <p>Étape {currentStep} sur 5</p>
        </div>

        {/* Barre de progression */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
          <div className="progress-steps">
            {[1, 2, 3, 4, 5].map(step => (
              <div 
                key={step} 
                className={`step ${step <= currentStep ? 'active' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Contenu des étapes */}
        <div className="step-content">
          {currentStep === 1 && (
            <div className="step">
              <h2>Informations de base</h2>
              <div className="form-group">
                <label htmlFor="title">Titre de votre cagnotte *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Aide médicale pour Sarah"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="story">Histoire de votre cagnotte *</label>
                <textarea
                  id="story"
                  value={formData.story}
                  onChange={(e) => handleInputChange('story', e.target.value)}
                  placeholder="Racontez votre histoire..."
                  rows={6}
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step">
              <h2>Objectif financier</h2>
              <div className="form-group">
                <label htmlFor="goalAmount">Montant objectif (TND) *</label>
                <input
                  type="number"
                  id="goalAmount"
                  value={formData.goalAmount}
                  onChange={(e) => handleInputChange('goalAmount', parseFloat(e.target.value))}
                  placeholder="1000"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="currency">Devise</label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                >
                  <option value="TND">TND (Dinar tunisien)</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step">
              <h2>Catégorie et localisation</h2>
              <div className="form-group">
                <label htmlFor="category">Catégorie *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="country">Pays</label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                >
                  <option value="Tunisie">Tunisie</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Gouvernorat *</label>
                <select
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un gouvernorat</option>
                  {governorates.map(gov => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step">
              <h2>Bénéficiaire</h2>
              <div className="form-group">
                <label>Qui bénéficiera de cette collecte ? *</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="beneficiaryType"
                      value="self"
                      checked={formData.beneficiaryType === 'self'}
                      onChange={(e) => handleInputChange('beneficiaryType', e.target.value)}
                    />
                    <span>Moi-même</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="beneficiaryType"
                      value="other"
                      checked={formData.beneficiaryType === 'other'}
                      onChange={(e) => handleInputChange('beneficiaryType', e.target.value)}
                    />
                    <span>Une autre personne</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="step">
              <h2>Finalisation</h2>
              
              {/* Date de fin */}
              <div className="form-group">
                <label htmlFor="endDate">Date de fin de la cagnotte *</label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <p className="help-text">
                  Choisissez la date limite pour votre cagnotte
                </p>
              </div>

              {/* Média */}
              <div className="form-group">
                <label htmlFor="media">Média (optionnel)</label>
                <input
                  type="file"
                  id="media"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
                <p className="help-text">
                  Formats acceptés : JPG, PNG, MP4. Taille max : 10MB
                </p>
              </div>
              
              {/* Aperçu de la cagnotte */}
              <div className="preview-section">
                <h3>Aperçu de votre cagnotte</h3>
                <div className="preview-card">
                  <h4>{formData.title || 'Titre de la cagnotte'}</h4>
                  <p className="preview-story">
                    {formData.story ? 
                      (formData.story.length > 100 ? 
                        `${formData.story.substring(0, 100)}...` : 
                        formData.story
                      ) : 
                      'Histoire de la cagnotte'
                    }
                  </p>
                  <div className="preview-details">
                    <span className="preview-amount">
                      {formData.goalAmount.toLocaleString()} {formData.currency}
                    </span>
                    <span className="preview-category">{formData.category || 'Catégorie'}</span>
                    {formData.endDate && (
                      <div className="preview-end-date">
                        <span className="end-date-label">Date de fin :</span>
                        <span className="end-date-value">
                          {new Date(formData.endDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Boutons de navigation */}
        <div className="step-navigation">
          {currentStep > 1 && (
            <button className="btn-secondary" onClick={prevStep}>
              Précédent
            </button>
          )}
                     {currentStep < 5 ? (
             <button 
               className="btn-primary" 
               onClick={nextStep}
               disabled={
                 (currentStep === 1 && (!formData.title || !formData.story)) ||
                 (currentStep === 2 && (!formData.title || !formData.story || !formData.goalAmount)) ||
                 (currentStep === 3 && (!formData.title || !formData.story || !formData.goalAmount || !formData.category || !formData.postalCode)) ||
                 (currentStep === 4 && (!formData.title || !formData.story || !formData.goalAmount || !formData.category || !formData.postalCode))
               }
             >
               Suivant
             </button>
                       ) : (
              <button 
                className="btn-primary" 
                onClick={handleSubmit}
                disabled={!formData.title || !formData.story || !formData.goalAmount || !formData.category || !formData.postalCode || isSubmitting}
              >
                {isSubmitting ? 'Modification en cours...' : 'Modifier la cagnotte'}
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default EditCagnotte; 