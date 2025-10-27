import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { reportsService, CreateReportData } from '../../features/reports/reportsService';
import './ReportCagnotte.css';

const ReportCagnotte: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useSelector(selectUser);
  const [reason, setReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Champs pour les visiteurs non connectés
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterEmail, setReporterEmail] = useState<string>('');

  const reasons = [
    'Arnaque ou fraude',
    'Informations fausses',
    'Contenu offensant',
    'Autre'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!reason) {
      alert('Veuillez sélectionner un motif de signalement.');
      return;
    }
    
    if (reason === 'Autre' && !otherReason.trim()) {
      alert('Veuillez préciser le motif du signalement.');
      return;
    }
    
    if (!description.trim()) {
      alert('Veuillez fournir une description détaillée.');
      return;
    }

    if (description.trim().length < 10) {
      alert('La description doit contenir au moins 10 caractères.');
      return;
    }

    if (!id) {
      alert('ID de cagnotte manquant.');
      return;
    }

    // Validation pour les visiteurs non connectés
    if (!user) {
      if (!reporterName.trim()) {
        alert('Veuillez entrer votre nom.');
        return;
      }
      if (!reporterEmail.trim()) {
        alert('Veuillez entrer votre adresse email.');
        return;
      }
      // Validation basique de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(reporterEmail)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
             // Préparer les données du signalement
             const reportData: CreateReportData = {
               cagnotteId: id,
               reason: reason === 'Autre' ? otherReason : reason,
               description: description,
               reporterName: user ? `${user.firstName} ${user.lastName}` : reporterName,
               reporterEmail: user ? user.email : reporterEmail,
             };

      // Envoyer le signalement au backend
      const response = await reportsService.createReport(reportData);
      
      if (response.success) {
        alert('Votre signalement a été envoyé avec succès. Notre équipe va l\'examiner dans les plus brefs délais.');
        navigate(-1); // Retour à la page précédente
      } else {
        throw new Error(response.message || 'Erreur lors de l\'envoi du signalement');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du signalement:', error);
      alert(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-page">
      <div className="report-container">
        {/* Header */}
        <div className="report-header">
          <h1>Signaler une cagnotte</h1>
          <p className="report-subtitle">
            Aidez-nous à maintenir un environnement sûr en signalant les cagnottes qui violent nos conditions d'utilisation.
          </p>
        </div>

        <div className="report-content">
          <div className="main-content">
            <form onSubmit={handleSubmit} className="report-form">
              {/* Informations du signalant (pour les visiteurs non connectés) */}
              {!user && (
                <>
                  <div className="form-group">
                    <label className="form-label">
                      Votre nom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="form-input"
                      placeholder="Entrez votre nom complet"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Votre adresse email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      className="form-input"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                </>
              )}

              {/* Motif du signalement */}
              <div className="form-group">
                <label className="form-label">
                  Motif du signalement <span className="required">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="form-select"
                >
                  <option value="">Sélectionnez un motif</option>
                  {reasons.map((reasonOption) => (
                    <option key={reasonOption} value={reasonOption}>
                      {reasonOption}
                    </option>
                  ))}
                </select>
              </div>

              {/* Champ "Autre" si sélectionné */}
              {reason === 'Autre' && (
                <div className="form-group">
                  <label className="form-label">
                    Précisez le motif <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    className="form-input"
                    placeholder="Décrivez le motif de votre signalement"
                  />
                </div>
              )}

              {/* Description détaillée */}
              <div className="form-group">
                <label className="form-label">
                  Description détaillée <span className="required">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                  rows={6}
                  placeholder="Décrivez en détail pourquoi vous signalez cette cagnotte. Plus vous fournirez d'informations, plus nous pourrons traiter rapidement votre demande."
                />
                <div className={`character-count ${description.length < 10 ? 'character-count-warning' : ''}`}>
                  {description.length}/1000 caractères
                  {description.length < 10 && description.length > 0 && (
                    <span className="min-chars-warning"> (minimum 10 caractères requis)</span>
                  )}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCagnotte;