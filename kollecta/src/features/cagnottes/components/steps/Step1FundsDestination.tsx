import React, { useState } from 'react';
import { CATEGORIES } from '../../../../constants/categories';

interface CagnotteData {
  country: string;
  postalCode: string;
  category: string;
}

interface Step1Props {
  data: CagnotteData;
  onUpdate: (updates: Partial<CagnotteData>) => void;
  onNext: () => void;
}

const Step1FundsDestination: React.FC<Step1Props> = ({ data, onUpdate, onNext }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Utiliser les catégories synchronisées avec la base de données
  const categories = CATEGORIES.map(cat => cat.name);

  const countries = [
    'Tunisie'
  ];

  const handleCategorySelect = (category: string) => {
    onUpdate({ category });
    setErrors(prev => ({ ...prev, category: '' }));
  };

  const handleCountryChange = (country: string) => {
    onUpdate({ country });
    setErrors(prev => ({ ...prev, country: '' }));
  };

  const handlePostalCodeChange = (postalCode: string) => {
    onUpdate({ postalCode });
    setErrors(prev => ({ ...prev, postalCode: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!data.country) {
      newErrors.country = 'Veuillez sélectionner un pays';
    }

    if (!data.postalCode) {
      newErrors.postalCode = 'Veuillez sélectionner un gouvernorat';
    }

    if (!data.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie';
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
        <h2>Où iront les fonds?</h2>
        <p>
          Choisissez le lieu où vous souhaitez retirer vos fonds.{' '}
          <a href="#" className="link">Pays dans lesquels nous soutenons les collectes de fonds.</a>
        </p>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country">Pays</label>
            <select
              id="country"
              value={data.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className={errors.country ? 'error' : ''}
            >
              <option value="">Sélectionnez un pays</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {errors.country && <span className="error-message">{errors.country}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Gouvernorat</label>
            <select
              id="postalCode"
              value={data.postalCode}
              onChange={(e) => handlePostalCodeChange(e.target.value)}
              className={errors.postalCode ? 'error' : ''}
            >
              <option value="">Sélectionnez un gouvernorat</option>
              <option value="Ariana">Ariana</option>
              <option value="Béja">Béja</option>
              <option value="Ben Arous">Ben Arous</option>
              <option value="Bizerte">Bizerte</option>
              <option value="Gabès">Gabès</option>
              <option value="Gafsa">Gafsa</option>
              <option value="Jendouba">Jendouba</option>
              <option value="Kairouan">Kairouan</option>
              <option value="Kasserine">Kasserine</option>
              <option value="Kébili">Kébili</option>
              <option value="Kef">Kef</option>
              <option value="Mahdia">Mahdia</option>
              <option value="Manouba">Manouba</option>
              <option value="Médenine">Médenine</option>
              <option value="Monastir">Monastir</option>
              <option value="Nabeul">Nabeul</option>
              <option value="Sfax">Sfax</option>
              <option value="Sidi Bouzid">Sidi Bouzid</option>
              <option value="Siliana">Siliana</option>
              <option value="Sousse">Sousse</option>
              <option value="Tataouine">Tataouine</option>
              <option value="Tozeur">Tozeur</option>
              <option value="Tunis">Tunis</option>
              <option value="Zaghouan">Zaghouan</option>
            </select>
            {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Qu'est-ce qui décrit le mieux la raison pour laquelle vous collectez des fonds?</h3>
        <div className="categories-grid">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              className={`category-button ${data.category === category ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      <div className="step-navigation">
        <button
          type="button"
          className="continue-button"
          onClick={handleContinue}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

export default Step1FundsDestination; 