import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Snackbar, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import Step1FundsDestination from './steps/Step1FundsDestination';
import Step2Beneficiary from './steps/Step2Beneficiary';
import Step3Media from './steps/Step3Media';
import Step4Story from './steps/Step4Story';
import Step5Review from './steps/Step5Review';
import { cagnottesService } from '../cagnottesService';
import './CreateCagnotteWizard.css';

interface CagnotteData {
  // Step 1
  country: string;
  postalCode: string;
  category: string;
  
  // Step 2
  beneficiaryType: 'self' | 'other';
  
  // Step 3
  mediaFile?: File;
  mediaUrl?: string;
  
  // Step 4
  title: string;
  story: string;
  
  // Step 5
  goalAmount: number;
  currency: string;
  endDate: string; // Date de fin de la cagnotte
}

const CreateCagnotteWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNewCagnotte = searchParams.get('new') === 'true';
  const draftIdFromUrl = searchParams.get('draftId');
  const [currentStep, setCurrentStep] = useState(1);
  const [cagnotteData, setCagnotteData] = useState<CagnotteData>({
    country: 'Tunisie',
    postalCode: '',
    category: '',
    beneficiaryType: 'self',
    title: '',
    story: '',
    goalAmount: 0,
    currency: 'TND',
    endDate: ''
  });
  
  // États pour la gestion des erreurs et succès
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // États pour la gestion des brouillons
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 5;
  const DRAFT_STORAGE_KEY = 'cagnotte_draft_data';
  const STEP_STORAGE_KEY = 'cagnotte_current_step';
  const DRAFT_ID_KEY = 'cagnotte_draft_id';

  // Charger les données sauvegardées au montage du composant
  useEffect(() => {
    // Si c'est une nouvelle cagnotte, ne pas charger le brouillon
    if (isNewCagnotte) {
      // Réinitialiser tout pour une nouvelle cagnotte
      setCurrentStep(1);
      setDraftId(null);
      setCagnotteData({
        country: 'Tunisie',
        postalCode: '',
        category: '',
        beneficiaryType: 'self',
        title: '',
        story: '',
        goalAmount: 0,
        currency: 'TND',
        endDate: ''
      });
      // Nettoyer le localStorage pour cette nouvelle cagnotte
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(STEP_STORAGE_KEY);
      localStorage.removeItem(DRAFT_ID_KEY);
      console.log('🆕 Nouvelle cagnotte - démarrage à l\'étape 1');
      return;
    }
    
    // Si un draftId est spécifié dans l'URL, charger ce brouillon spécifique
    if (draftIdFromUrl) {
      loadSpecificDraft(draftIdFromUrl);
      return;
    }
    
    // Sinon, charger le brouillon existant (comportement par défaut)
    loadExistingDraft();
  }, [isNewCagnotte, draftIdFromUrl]);

  // Charger un brouillon spécifique par ID
  const loadSpecificDraft = async (draftIdToLoad: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cagnottes/${draftIdToLoad}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const draft = result.data;
        
        if (draft && draft.status === 'DRAFT') {
          setDraftId(draft.id);
          localStorage.setItem(DRAFT_ID_KEY, draft.id);
          const savedStep = draft.currentStep || 1;
          setCurrentStep(savedStep);
          
          setCagnotteData({
            country: draft.country || 'Tunisie',
            postalCode: draft.postalCode || '',
            category: draft.category?.name || '',
            beneficiaryType: draft.beneficiaryType || 'self',
            title: draft.title || '',
            story: draft.description || '',
            goalAmount: draft.goalAmount || 0,
            currency: draft.currency || 'TND',
            endDate: draft.endDate ? new Date(draft.endDate).toISOString().split('T')[0] : ''
          });
          
          console.log('✅ Brouillon spécifique chargé:', draft);
          console.log('✅ Reprise à l\'étape:', savedStep);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du brouillon spécifique:', error);
      // En cas d'erreur, charger le brouillon existant normalement
      loadExistingDraft();
    }
  };

  const loadExistingDraft = async () => {
    const savedDraftId = localStorage.getItem(DRAFT_ID_KEY);
    
    // ✅ PRIORITÉ 1: Charger depuis la base de données si on a un ID
    if (savedDraftId) {
      try {
        const response = await fetch(`http://localhost:5000/api/cagnottes/${savedDraftId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          const draft = result.data;
          
          if (draft && draft.status === 'DRAFT') {
            setDraftId(draft.id);
            // ✅ IMPORTANT: Reprendre à l'étape sauvegardée
            const savedStep = draft.currentStep || 1;
            setCurrentStep(savedStep);
            
            // Charger les données du brouillon
            setCagnotteData({
              country: draft.country || 'Tunisie',
              postalCode: draft.postalCode || '',
              category: draft.category?.name || '',
              beneficiaryType: draft.beneficiaryType || 'self',
              title: draft.title || '',
              story: draft.description || '',
              goalAmount: draft.goalAmount || 0,
              currency: draft.currency || 'TND',
              endDate: draft.endDate ? new Date(draft.endDate).toISOString().split('T')[0] : ''
            });
            
            console.log('✅ Brouillon chargé depuis la base de données:', draft);
            console.log('✅ Reprise à l\'étape:', savedStep);
            return;
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du brouillon:', error);
      }
    }
    
    // ✅ PRIORITÉ 2: Chercher un brouillon dans la base de données même sans ID dans localStorage
    try {
      const response = await fetch('http://localhost:5000/api/cagnottes/user/my-cagnottes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const cagnottes = result.data?.cagnottes || [];
        const draft = cagnottes.find((c: any) => c.status === 'DRAFT');
        
        if (draft) {
          setDraftId(draft.id);
          localStorage.setItem(DRAFT_ID_KEY, draft.id);
          // ✅ IMPORTANT: Reprendre à l'étape sauvegardée
          const savedStep = draft.currentStep || 1;
          setCurrentStep(savedStep);
          
          setCagnotteData({
            country: draft.country || 'Tunisie',
            postalCode: draft.postalCode || '',
            category: draft.category?.name || '',
            beneficiaryType: draft.beneficiaryType || 'self',
            title: draft.title || '',
            story: draft.description || '',
            goalAmount: draft.goalAmount || 0,
            currency: draft.currency || 'TND',
            endDate: draft.endDate ? new Date(draft.endDate).toISOString().split('T')[0] : ''
          });
          
          console.log('✅ Brouillon trouvé dans la base de données:', draft);
          console.log('✅ Reprise à l\'étape:', savedStep);
          return;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de brouillon:', error);
    }
    
    // ✅ PRIORITÉ 3: Fallback - charger depuis localStorage
    const savedData = localStorage.getItem(DRAFT_STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCagnotteData(parsedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error);
      }
    }
    
    if (savedStep) {
      try {
        const step = parseInt(savedStep);
        if (step >= 1 && step <= totalSteps) {
          setCurrentStep(step);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'étape sauvegardée:', error);
      }
    }
  };

  // Sauvegarder automatiquement les données à chaque modification
  useEffect(() => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(cagnotteData));
  }, [cagnotteData]);

  // Sauvegarder l'étape actuelle
  useEffect(() => {
    localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
  }, [currentStep]);

  // Sauvegarder automatiquement dans la base de données
  const saveDraftToDatabase = async () => {
    console.log('🚀 saveDraftToDatabase appelée');
    console.log('🚀 isSaving:', isSaving);
    console.log('🚀 draftId:', draftId);
    
    if (isSaving) {
      console.log('❌ Sauvegarde déjà en cours, abandon');
      return; // Éviter les sauvegardes multiples simultanées
    }
    
    try {
      setIsSaving(true);
      console.log('✅ Début de la sauvegarde...');
      
      const draftData = {
        title: cagnotteData.title || 'Brouillon sans titre',
        story: cagnotteData.story,
        goalAmount: cagnotteData.goalAmount,
        category: cagnotteData.category,
        currentStep: currentStep,
        mediaFile: cagnotteData.mediaFile,
        beneficiaryType: cagnotteData.beneficiaryType,
        country: cagnotteData.country,
        postalCode: cagnotteData.postalCode,
        currency: cagnotteData.currency
      };

      let result;
      if (draftId) {
        // Mettre à jour un brouillon existant
        result = await cagnottesService.updateDraft(draftId, draftData);
      } else {
        // Créer un nouveau brouillon
        result = await cagnottesService.saveDraft(draftData);
        if (result.data?.id) {
          setDraftId(result.data.id);
          localStorage.setItem(DRAFT_ID_KEY, result.data.id);
        }
      }
      
      console.log('✅ Brouillon sauvegardé:', result);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du brouillon:', error);
      // Réinitialiser isSaving même en cas d'erreur
      setIsSaving(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder automatiquement après un délai
  useEffect(() => {
    console.log('🔍 useEffect déclenché - cagnotteData:', cagnotteData);
    console.log('🔍 useEffect déclenché - currentStep:', currentStep);
    
    const timeoutId = setTimeout(() => {
      // Sauvegarder si on a au moins une donnée saisie ET valide
      const hasData = (cagnotteData.title && cagnotteData.title.trim() !== '') || 
                     (cagnotteData.story && cagnotteData.story.trim() !== '') || 
                     (cagnotteData.category && cagnotteData.category.trim() !== '') || 
                     cagnotteData.goalAmount > 0 ||
                     (cagnotteData.beneficiaryType && cagnotteData.beneficiaryType.trim() !== '') ||
                     (cagnotteData.country && cagnotteData.country.trim() !== '');
      
      console.log('🔍 Vérification hasData:', hasData);
      console.log('🔍 Détail des données:', {
        title: cagnotteData.title,
        story: cagnotteData.story,
        category: cagnotteData.category,
        goalAmount: cagnotteData.goalAmount,
        beneficiaryType: cagnotteData.beneficiaryType,
        country: cagnotteData.country
      });
      
      if (hasData) {
        console.log('🔄 Sauvegarde automatique déclenchée...', cagnotteData);
        saveDraftToDatabase();
      } else {
        console.log('❌ Pas de données à sauvegarder');
      }
    }, 1000); // Sauvegarder 1 seconde après la dernière modification

    return () => clearTimeout(timeoutId);
  }, [cagnotteData, currentStep]);

  const updateCagnotteData = (updates: Partial<CagnotteData>) => {
    setCagnotteData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Sauvegarder avant de passer à l'étape suivante
      saveDraftToDatabase();
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction pour effacer les données sauvegardées
  const clearDraftData = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);
    localStorage.removeItem(DRAFT_ID_KEY);
    setDraftId(null);
  };

  // Fonction pour sauvegarder comme brouillon et quitter
  const handleSaveDraft = () => {
    // Les données sont déjà sauvegardées automatiquement
    // On peut juste naviguer vers le dashboard
    navigate('/dashboard');
  };

  const handleSubmit = async () => {
    try {
      // ✅ TOUJOURS vérifier s'il y a un brouillon existant même si draftId n'est pas défini
      if (!draftId) {
        // Chercher un brouillon existant dans la base de données
        try {
          const response = await fetch('http://localhost:5000/api/cagnottes/user/my-cagnottes', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            const cagnottes = result.data?.cagnottes || [];
            const existingDraft = cagnottes.find((c: any) => c.status === 'DRAFT');
            
            if (existingDraft) {
              console.log('✅ Brouillon existant trouvé:', existingDraft.id);
              setDraftId(existingDraft.id);
              localStorage.setItem(DRAFT_ID_KEY, existingDraft.id);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la recherche de brouillon:', error);
        }
      }

      if (draftId) {
        // ✅ Finaliser le brouillon existant (DRAFT → PENDING) - METTRE À JOUR, PAS CRÉER
        console.log('🔄 Finalisation du brouillon existant:', draftId);
        console.log('📋 Données à envoyer:', {
          ...cagnotteData,
          currentStep: currentStep,
          status: 'PENDING'
        });
        
        await cagnottesService.updateDraft(draftId, {
          ...cagnotteData,
          currentStep: currentStep,
          status: 'PENDING'
        });
        
        // Effacer les données de brouillon après finalisation réussie
        clearDraftData();
        
        // Afficher le message de succès spécifique
        setSuccessMessage('Votre cagnotte a été finalisée avec succès et est en attente de vérification par notre équipe Kollecta.');
        setShowSuccessDialog(true);
        
        // Naviguer vers le dashboard après un délai
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        // ✅ Créer une nouvelle cagnotte seulement s'il n'y a vraiment aucun brouillon
        console.log('🆕 Création d\'une nouvelle cagnotte (aucun brouillon trouvé)');
        const cagnotteDataToSend = {
          title: cagnotteData.title,
          story: cagnotteData.story,
          goalAmount: cagnotteData.goalAmount,
          currency: cagnotteData.currency,
          category: cagnotteData.category,
          country: cagnotteData.country,
          postalCode: cagnotteData.postalCode,
          beneficiaryType: cagnotteData.beneficiaryType,
          mediaFile: cagnotteData.mediaFile,
          endDate: cagnotteData.endDate,
          status: 'PENDING' as const // Créer directement en statut PENDING pour approbation
        };

        await cagnottesService.createCagnotte(cagnotteDataToSend);
        
        // Effacer les données de brouillon après création réussie
        clearDraftData();
        
        // Afficher le message de succès spécifique
        setSuccessMessage('Votre cagnotte a été créée avec succès et est en attente de vérification par notre équipe Kollecta.');
        setShowSuccessDialog(true);
        
        // Naviguer vers le dashboard après un délai
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Erreur lors de la finalisation/création:', error);
      
      // Gérer spécifiquement l'erreur de validation du compte
      if (error.code === 'ACCOUNT_NOT_VALIDATED') {
        setErrorMessage(error.message);
        setErrorDetails(error.details);
        setShowErrorDialog(true);
      } else {
        setErrorMessage(error.message || 'Une erreur est survenue lors de la finalisation de la cagnotte');
        setShowErrorDialog(true);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1FundsDestination
            data={cagnotteData}
            onUpdate={updateCagnotteData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2Beneficiary
            data={cagnotteData}
            onUpdate={updateCagnotteData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <Step3Media
            data={cagnotteData}
            onUpdate={updateCagnotteData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <Step4Story
            data={cagnotteData}
            onUpdate={updateCagnotteData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <Step5Review
            data={cagnotteData}
            onUpdate={updateCagnotteData}
            onSubmit={handleSubmit}
            onBack={prevStep}
            onSaveDraft={handleSaveDraft}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-cagnotte-wizard">
      <div className="wizard-container">
        <div className="wizard-sidebar">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div className="step-indicator">
            {currentStep} sur {totalSteps}
          </div>
          <div className="step-title">
            {currentStep === 1 && "Commençons votre parcours de collecte de fonds"}
            {currentStep === 2 && "Dites-nous pour qui vous collectez des fonds"}
            {currentStep === 3 && "Ajouter un média"}
            {currentStep === 4 && "Expliquez aux donateurs pourquoi vous collectez des fonds"}
            {currentStep === 5 && "Vérifiez et lancez votre cagnotte"}
          </div>
          <div className="step-description">
            {currentStep === 1 && "Nous sommes là pour vous guider à chaque étape du processus."}
            {currentStep === 2 && "Ces informations nous aident à mieux vous connaître et à connaître vos besoins en matière de collecte de fonds."}
            {currentStep === 3 && "L'utilisation d'une photo claire et lumineuse permet aux gens de se connecter immédiatement à votre collecte de fonds."}
            {currentStep === 4 && "Voici quelques questions pour vous aider à rédiger. Vous pourrez toujours le modifier ultérieurement:"}
            {currentStep === 5 && "Vérifiez toutes les informations avant de lancer votre cagnotte."}
          </div>
          {currentStep === 4 && (
            <div className="guidance-questions">
              <ul>
                <li>Qui êtes-vous et pour quoi collectez-vous des fonds ?</li>
                <li>Pourquoi cette cause est-elle importante pour vous ?</li>
                <li>Comment les fonds seront-ils utilisés?</li>
                <li>Comment le bénéficiaire recevra-t-il les fonds?</li>
              </ul>
            </div>
          )}
        </div>
        <div className="wizard-content">
          {renderStep()}
        </div>
      </div>
      
      {/* Dialogue de succès */}
      <Dialog 
        open={showSuccessDialog} 
        onClose={() => setShowSuccessDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.5em' }}>✅</span>
          Cagnotte créée avec succès
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {successMessage}
          </Typography>
          
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Votre cagnotte sera examinée par notre équipe et vous recevrez une notification une fois approuvée.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setShowSuccessDialog(false);
              navigate('/dashboard');
            }}
            variant="contained"
            color="primary"
          >
            Retour au tableau de bord
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue d'erreur pour la validation du compte */}
      <Dialog 
        open={showErrorDialog} 
        onClose={() => setShowErrorDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.5em' }}>⚠️</span>
          Compte non validé
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
          
          {errorDetails && (
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Détails de la validation :
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Statut du compte :</strong> {errorDetails.status || 'Non défini'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Vérification KYC :</strong> {errorDetails.kycStatus || 'Non défini'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email vérifié :</strong> {errorDetails.emailVerified ? 'Oui' : 'Non'}
              </Typography>
              {errorDetails.riskLevel && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Niveau de risque :</strong> {errorDetails.riskLevel}
                </Typography>
              )}
            </Box>
          )}
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Pour créer une cagnotte, vous devez :
            </Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Avoir un compte actif</li>
              <li>Compléter votre vérification d'identité (KYC)</li>
              <li>Vérifier votre adresse email</li>
            </ul>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrorDialog(false)}>
            Fermer
          </Button>
          <Button 
            onClick={() => {
              setShowErrorDialog(false);
              navigate('/kyc/verify');
            }}
            variant="contained"
            color="primary"
          >
            Compléter la vérification KYC
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateCagnotteWizard; 