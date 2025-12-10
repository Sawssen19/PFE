import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/slices/authSlice';
import { cagnottesService } from '../cagnottesService';
import { promisesService } from '../../promises/promisesService';
import './CagnotteDetail.css';

interface Cagnotte {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'COMPLETED' | 'PENDING' | 'REJECTED' | 'SUSPENDED';
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
  beneficiary?: {
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

const CagnotteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [cagnotte, setCagnotte] = useState<Cagnotte | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [promises, setPromises] = useState<any[]>([]);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [showDonorsModal, setShowDonorsModal] = useState(false);
  const [donorsModalTab, setDonorsModalTab] = useState<'highest' | 'latest'>('highest');
  const [showAnonymousTooltip, setShowAnonymousTooltip] = useState(false);

  const goalAmountValue = cagnotte?.goalAmount ?? 0;

  const topThreshold = useMemo(() => {
    if (!goalAmountValue || Number.isNaN(goalAmountValue)) {
      return 100;
    }
    const computed = goalAmountValue * 0.05;
    const rounded = Math.round(computed / 10) * 10;
    return Math.max(100, rounded || 100);
  }, [goalAmountValue]);

  const topPromises = useMemo(() => {
    return promises.filter((promise) => {
      if (!promise || promise.status === 'CANCELLED') {
        return false;
      }
      return promise.amount >= topThreshold;
    });
  }, [promises, topThreshold]);

  const topPromisesByAmount = useMemo(() => {
    return [...topPromises].sort((a, b) => b.amount - a.amount);
  }, [topPromises]);

  const topPromisesByLatest = useMemo(() => {
    return [...topPromises].sort((a, b) => {
      const dateA = new Date(a.promisedAt).getTime();
      const dateB = new Date(b.promisedAt).getTime();
      return dateB - dateA;
    });
  }, [topPromises]);

  const latestPromises = useMemo(() => {
    // Filtrer les promesses annulées - elles ne doivent jamais être affichées publiquement
    return [...promises]
      .filter((promise) => promise.status !== 'CANCELLED')
      .sort((a, b) => {
        const dateA = new Date(a.promisedAt).getTime();
        const dateB = new Date(b.promisedAt).getTime();
        return dateB - dateA;
      });
  }, [promises]);

  // Calculer le nombre de donateurs uniques (par contributorId)
  const uniqueDonorsCount = useMemo(() => {
    const uniqueContributorIds = new Set(
      promises
        .filter((promise) => promise.status !== 'CANCELLED')
        .map((promise) => promise.contributor?.id)
        .filter((id) => id) // Filtrer les undefined
    );
    return uniqueContributorIds.size;
  }, [promises]);

  const displayedTopPromises = useMemo(() => {
    return donorsModalTab === 'highest' ? topPromisesByAmount : topPromisesByLatest;
  }, [donorsModalTab, topPromisesByAmount, topPromisesByLatest]);

  const topPromisesTotal = useMemo(() => {
    if (topPromises.length === 0) {
      return 0;
    }
    return topPromises.reduce((acc, promise) => acc + (promise.amount || 0), 0);
  }, [topPromises]);

  const latestPromisesTotal = useMemo(() => {
    if (latestPromises.length === 0) {
      return 0;
    }
    return latestPromises.reduce((acc, promise) => {
      if (promise.status === 'CANCELLED') {
        return acc;
      }
      return acc + (promise.amount || 0);
    }, 0);
  }, [latestPromises]);

  const donorsModalList = useMemo(() => {
    // Filtrer les promesses annulées - elles ne doivent jamais être affichées publiquement
    const filterCancelled = (promises: any[]) => promises.filter((p) => p.status !== 'CANCELLED');
    
    if (donorsModalTab === 'highest') {
      return filterCancelled(displayedTopPromises);
    }
    return filterCancelled(latestPromises);
  }, [displayedTopPromises, donorsModalTab, latestPromises]);

  const donorsModalTotal = donorsModalTab === 'highest' ? topPromisesTotal : latestPromisesTotal;

  const roundToNearestTen = (value: number) => {
    if (!value || Number.isNaN(value)) return 10;
    return Math.max(10, Math.round(value / 10) * 10);
  };

  const anonymousInfoButtonRef = useRef<HTMLButtonElement | null>(null);
  const anonymousTooltipRef = useRef<HTMLDivElement | null>(null);

  const quickAmounts = useMemo(() => {
    const baseThreshold = topThreshold || 100;
    const dynamicValues = [
      baseThreshold * 0.4,
      baseThreshold * 0.6,
      baseThreshold,
      baseThreshold * 1.25,
      baseThreshold * 1.5,
      baseThreshold * 2,
    ].map(roundToNearestTen);

    const fallbackValues = [50, 100, 200, 300, 500];
    const combined = [...fallbackValues, ...dynamicValues];

    const uniqueSorted = Array.from(new Set(combined)).sort((a, b) => a - b);
    const thresholdValue = roundToNearestTen(baseThreshold);

    if (!uniqueSorted.includes(thresholdValue)) {
      uniqueSorted.push(thresholdValue);
      uniqueSorted.sort((a, b) => a - b);
    }

    if (uniqueSorted.length <= 5) {
      return uniqueSorted;
    }

    const thresholdIndex = uniqueSorted.findIndex((value) => value >= thresholdValue);
    let startIndex = Math.max(0, thresholdIndex - 2);
    if (startIndex + 5 > uniqueSorted.length) {
      startIndex = Math.max(0, uniqueSorted.length - 5);
    }

    return uniqueSorted.slice(startIndex, startIndex + 5);
  }, [topThreshold]);

  const suggestedAmount = useMemo(() => {
    if (quickAmounts.length === 0) {
      return roundToNearestTen(topThreshold);
    }

    const greaterOrEqual = quickAmounts.filter((amount) => amount >= topThreshold);
    if (greaterOrEqual.length > 0) {
      return greaterOrEqual[0];
    }

    return quickAmounts[quickAmounts.length - 1];
  }, [quickAmounts, topThreshold]);

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatCompactAmount = (value: number) => {
    if (!value) {
      return '0 TND';
    }

    const formatter = new Intl.NumberFormat('fr-FR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    });

    return `${formatter.format(value)} TND`;
  };

  const donorsModalLead = useMemo(() => {
    const title = cagnotte?.title ?? 'cette cagnotte';
    if (donorsModalTab === 'highest') {
      return `Soyez un donateur de premier plan pour ${title} avec un don de ${formatAmount(topThreshold)} ou plus.`;
    }
    return `Découvrez les engagements les plus récents qui soutiennent ${title}.`;
  }, [cagnotte?.title, donorsModalTab, topThreshold]);

  const formatRelativeTime = (dateString: string) => {
    if (!dateString) {
      return '';
    }

    const now = new Date().getTime();
    const date = new Date(dateString).getTime();
    if (Number.isNaN(date)) {
      return '';
    }
    const diffMs = now - date;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) {
      return 'quelques minutes';
    }

    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'heure' : 'heures'}`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'jour' : 'jours'}`;
    }

    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} ${diffMonths === 1 ? 'mois' : 'mois'}`;
  };

  /**
   * Détermine si l'utilisateur actuel peut voir les informations réelles d'un donateur anonyme
   * Logique : Seuls le créateur, le bénéficiaire, les admins et le donateur lui-même peuvent voir les infos réelles
   */
  const shouldShowRealInfo = (promise: any): boolean => {
    // Si la promesse n'est pas anonyme, on peut toujours voir les infos
    if (!promise.isAnonymous) {
      return true;
    }

    // Si l'utilisateur n'est pas connecté, on ne peut pas voir les infos réelles
    if (!user || !cagnotte) {
      return false;
    }

    // Le donateur lui-même peut toujours voir ses propres infos
    if (promise.contributor?.id === user.id) {
      return true;
    }

    // Le créateur de la cagnotte peut voir les infos réelles
    if (cagnotte.creator?.id === user.id) {
      return true;
    }

    // Le bénéficiaire de la cagnotte peut voir les infos réelles (si défini)
    if (cagnotte.beneficiary && cagnotte.beneficiary.id === user.id) {
      return true;
    }

    // Les administrateurs peuvent voir les infos réelles
    if (user.role === 'ADMIN') {
      return true;
    }

    // Sinon, on affiche "Anonyme"
    return false;
  };

  const getContributorDisplayName = (promise: any) => {
    // Si on peut voir les infos réelles, afficher le nom réel
    if (shouldShowRealInfo(promise)) {
      const firstName = promise?.contributor?.firstName || '';
      const lastName = promise?.contributor?.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (!fullName) {
        return 'Contributeur';
      }
      return fullName;
    }

    // Sinon, afficher "Anonyme"
    return 'Anonyme';
  };

  const getContributorInitials = (name: string) => {
    if (!name) {
      return '?';
    }
    const words = name.split(' ').filter(Boolean);
    if (words.length === 0) {
      return '?';
    }
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  };

  const renderContributorAvatar = (promise: any) => {
    // Si on peut voir les infos réelles, afficher l'avatar réel
    if (shouldShowRealInfo(promise)) {
      const picture = promise?.contributor?.profilePicture;
      const name = getContributorDisplayName(promise);

      if (picture) {
        return (
          <div className="donation-avatar">
            <img src={picture} alt={name} />
          </div>
        );
      }

      const initials = getContributorInitials(name);
      return (
        <div className="donation-avatar placeholder">
          {initials}
        </div>
      );
    }

    // Sinon, afficher l'icône anonyme
    return <div className="donation-avatar anonymous">🤍</div>;
  };

  const getPromiseStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return '✅ Engagement honoré';
      case 'PENDING':
        return '⏳ Promesse en attente';
      case 'CANCELLED':
        return '❌ Annulée';
      default:
        return status;
    }
  };

  useEffect(() => {
    if (id) {
      loadCagnotte();
      loadPromises();
    }
  }, [id]);

  const loadCagnotte = async () => {
    try {
      setLoading(true);
      const response = await cagnottesService.getCagnotteById(id!);
      console.log('🔍 Cagnotte chargée:', response);
      
      // Le backend retourne { success: true, data: cagnotte }
      const cagnotteData = (response as any)?.data || response;
      setCagnotte(cagnotteData);
      
      // Vérifier si l'utilisateur actuel est le créateur
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      setIsCreator(currentUser.id === cagnotteData.creator.id);
    } catch (err) {
      console.error('Erreur lors du chargement de la cagnotte:', err);
      setError('Erreur lors du chargement de la cagnotte');
    } finally {
      setLoading(false);
    }
  };

  const loadPromises = async () => {
    if (!id) return;
    try {
      const response = await promisesService.getCagnottePromises(id);
      const promisesData = (response as any)?.promises || response.promises || [];
      setPromises(promisesData);
    } catch (err) {
      console.error('Erreur lors du chargement des promesses:', err);
      // Ne pas afficher d'erreur si les promesses ne se chargent pas
    }
  };

  const handleOpenDonorsModal = (initialTab: 'highest' | 'latest') => {
    setDonorsModalTab(initialTab);
    setShowDonorsModal(true);
  };

  const handleOpenDonationFromTop = () => {
    const defaultAmount = suggestedAmount || roundToNearestTen(topThreshold);
    setDonationAmount(defaultAmount.toString());
    setShowDonorsModal(false);
    setShowAnonymousTooltip(false);
    handleDonate();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showAnonymousTooltip) {
        return;
      }

      const target = event.target as Node;
      if (
        anonymousTooltipRef.current &&
        anonymousTooltipRef.current.contains(target)
      ) {
        return;
      }

      if (
        anonymousInfoButtonRef.current &&
        anonymousInfoButtonRef.current.contains(target)
      ) {
        return;
      }

      setShowAnonymousTooltip(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showAnonymousTooltip]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'il y a 1 jour';
    if (diffDays < 7) return `il y a ${diffDays} jours`;
    if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaines`;
    return `il y a ${Math.floor(diffDays / 30)} mois`;
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const handleDonate = () => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
      // Rediriger vers la page de connexion avec un message
      navigate('/login?message=connectez-vous pour faire un don');
      return;
    }
    
    // Vérifier que la cagnotte est active
    if (cagnotte?.status !== 'ACTIVE') {
      alert('Cette cagnotte n\'est pas active. Vous ne pouvez pas faire de don.');
      return;
    }

    // Ouvrir le modal de donation
    setShowDonationModal(true);
  };

  const handleDonationSubmit = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    if (!cagnotte) return;

    setIsDonating(true);

    try {
        // Vérifier que l'utilisateur est connecté
        if (!user) {
          alert('Vous devez être connecté pour faire une promesse de don. Veuillez vous connecter ou créer un compte.');
          setShowDonationModal(false);
          setShowAnonymousTooltip(false);
          navigate('/login');
          return;
        }

        // Créer la promesse de don
        await promisesService.createPromise({
          cagnotteId: cagnotte.id,
          amount: parseFloat(donationAmount),
          message: donationMessage || undefined,
          isAnonymous: isAnonymous
        });

        // Réinitialiser le formulaire
        setDonationAmount('');
        setDonationMessage('');
        setIsAnonymous(false);
        setShowDonationModal(false);
        setShowAnonymousTooltip(false);
        setDonationSuccess(true);

        // Recharger les données de la cagnotte et les promesses
        await loadCagnotte();
        await loadPromises();

        // Masquer le message de succès après 4 secondes
        setTimeout(() => {
          setDonationSuccess(false);
        }, 4000);

    } catch (error: any) {
      console.error('❌ Erreur lors de la création de la promesse:', error);
      
      // Si la session a expiré, rediriger vers la page de connexion
      if (error.message?.includes('session a expiré') || error.message?.toLowerCase().includes('token')) {
        setShowDonationModal(false);
        setShowAnonymousTooltip(false);
        navigate('/login?message=Votre session a expiré. Veuillez vous reconnecter.');
        return;
      }
      
      alert(error.message || 'Erreur lors de la création de votre promesse de don');
    } finally {
      setIsDonating(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: cagnotte?.title,
        text: cagnotte?.description,
        url: window.location.href,
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const handleEdit = () => {
    navigate(`/edit/cagnotte/${cagnotte?.id}`);
  };

  const handleDelete = async () => {
    if (!cagnotte) return;
    
    try {
      await cagnottesService.deleteCagnotte(cagnotte.id);
      alert('Cagnotte supprimée avec succès');
      navigate('/my-cagnottes');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la cagnotte');
    }
  };

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="cagnotte-detail-container">
        <div className="loading">Chargement de la cagnotte...</div>
      </div>
    );
  }

  if (error || !cagnotte) {
    return (
      <div className="cagnotte-detail-container">
        <div className="error">
          {error || 'Cagnotte non trouvée'}
        </div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage(cagnotte.currentAmount, cagnotte.goalAmount);
  const daysSinceCreation = Math.ceil((new Date().getTime() - new Date(cagnotte.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="cagnotte-detail-container">
      <div className="cagnotte-detail-content">
        {/* Colonne principale */}
        <div className="main-column">
          {/* En-tête avec titre */}
          <div className="cagnotte-header">
            <h1 className="cagnotte-title">{cagnotte.title}</h1>
          </div>

          {/* Image principale */}
          <div className="main-image-container">
            {cagnotte.coverImage ? (
              <img 
                src={cagnotte.coverImage} 
                alt={cagnotte.title}
                className="main-image"
              />
            ) : (
              <div className="placeholder-main-image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Organisateur */}
          <div className="organizer-section">
            <div className="organizer-info">
              <div className="organizer-avatar">
                {cagnotte.creator.profilePicture ? (
                  <img src={cagnotte.creator.profilePicture} alt="Organisateur" />
                ) : (
                  <div className="avatar-placeholder">
                    {cagnotte.creator.firstName.charAt(0)}{cagnotte.creator.lastName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="organizer-details">
                <p className="organizer-text">
                  <strong>{cagnotte.creator.firstName} {cagnotte.creator.lastName}</strong> organise cette collecte de fonds.
                </p>
              </div>
            </div>
          </div>

                     {/* Résumé */}
           <div className="brief-section">
             <div className="brief-header">
               <svg className="brief-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                 <polyline points="14,2 14,8 20,8"/>
                 <line x1="16" y1="13" x2="8" y2="13"/>
                 <line x1="16" y1="17" x2="8" y2="17"/>
                 <polyline points="10,9 9,9 8,9"/>
               </svg>
               <h3>En bref</h3>
             </div>
             <div 
               className="brief-text"
               dangerouslySetInnerHTML={{ 
                 __html: cagnotte.description.length > 200 
                   ? `${cagnotte.description.substring(0, 200)}...` 
                   : cagnotte.description 
               }}
             />
           </div>

           {/* Histoire */}
           <div className="story-section">
             <h3>Histoire</h3>
             <div 
               className="story-content"
               dangerouslySetInnerHTML={{ __html: cagnotte.description }}
             />
           </div>

          {/* Boutons d'action */}
           <div className="action-buttons">
             <button className="donate-btn" onClick={handleDonate}>
               Faire un don
             </button>
             <button className="share-btn" onClick={handleShare}>
               Partager
             </button>
             
             {/* Boutons du créateur - Design icônes uniquement */}
             {isCreator && (
               <div className="creator-actions">
                 <button 
                   className="icon-action-btn edit-icon-btn" 
                   onClick={handleEdit}
                   title="Modifier la cagnotte"
                   aria-label="Modifier la cagnotte"
                 >
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                   </svg>
                 </button>
                 <button 
                   className="icon-action-btn delete-icon-btn" 
                   onClick={confirmDelete}
                   title="Supprimer la cagnotte"
                   aria-label="Supprimer la cagnotte"
                 >
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <polyline points="3,6 5,6 21,6"/>
                     <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                     <line x1="10" y1="11" x2="10" y2="17"/>
                     <line x1="14" y1="11" x2="14" y2="17"/>
                   </svg>
                 </button>
               </div>
             )}
           </div>

          {/* Organisateur et bénéficiaire */}
          <div className="organizer-beneficiary-section">
            <h3>Organisateur et bénéficiaire</h3>
            <div className="organizer-beneficiary-content">
              <div className="organizer-card">
                <div className="organizer-avatar-large">
                  {cagnotte.creator.profilePicture ? (
                    <img src={cagnotte.creator.profilePicture} alt="Organisateur" />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {cagnotte.creator.firstName.charAt(0)}{cagnotte.creator.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="organizer-info-large">
                  <h4>{cagnotte.creator.firstName} {cagnotte.creator.lastName}</h4>
                  <p className="organizer-role">Organisateur</p>
                  <button className="contact-btn">Contact</button>
                </div>
              </div>
              <div className="beneficiary-card">
                <div className="organizer-avatar-large">
                  {cagnotte.creator.profilePicture ? (
                    <img src={cagnotte.creator.profilePicture} alt="Bénéficiaire" />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {cagnotte.creator.firstName.charAt(0)}{cagnotte.creator.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="organizer-info-large">
                  <h4>{cagnotte.creator.firstName} {cagnotte.creator.lastName}</h4>
                  <p className="organizer-role">Bénéficiaire</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="additional-info">
            <p>Créé {formatDate(cagnotte.createdAt)} - Organisateur</p>
            {/* Afficher le bouton de signalement seulement si l'utilisateur n'est pas le créateur et que la cagnotte est active */}
            {!isCreator && cagnotte.status === 'ACTIVE' && (
              <button 
                className="report-btn"
                onClick={() => navigate(`/report/cagnotte/${cagnotte.id}`)}
              >
                Signaler une collecte de fonds
              </button>
            )}
          </div>
        </div>

        {/* Barre latérale */}
        <div className="sidebar">
          {/* Montant collecté */}
          <div className="donation-stats">
            <div className="amount-collected">
              <span className="amount">{cagnotte.currentAmount.toLocaleString()}</span>
              <span className="currency"> TND collectés</span>
            </div>
            
            {/* Barre de progression */}
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="progress-percentage">{progressPercentage.toFixed(0)}%</div>
            </div>

            {/* Objectif */}
            <div className="goal-amount">
              Objectif de {cagnotte.goalAmount.toLocaleString()} TND
            </div>

            {/* Jours restants */}
            <div className={`days-remaining ${
              Math.ceil((new Date(cagnotte.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 0 
                ? 'expired' 
                : Math.ceil((new Date(cagnotte.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 3 
                ? 'urgent' 
                : ''
            }`}>
              <div className="days-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="days-text">
                <span className="days-count">
                  {Math.ceil((new Date(cagnotte.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 0 
                    ? '0' 
                    : Math.ceil((new Date(cagnotte.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  }
                </span>
                <span className="days-label">
                  {Math.ceil((new Date(cagnotte.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 0 
                    ? 'Cagnotte expirée' 
                    : Math.ceil((new Date(cagnotte.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) === 1 
                    ? 'jour restant' 
                    : 'jours restants'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="sidebar-actions">
            <button className="share-btn-sidebar" onClick={handleShare}>
              Partager
            </button>
            <button className="donate-btn-sidebar" onClick={handleDonate}>
              Faites un don maintenant
            </button>
          </div>

          {/* Nombre de donateurs */}
          <div className="donors-info">
            <div className="donors-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span className="donors-count">
              {uniqueDonorsCount} {uniqueDonorsCount <= 1 ? 'personne vient' : 'personnes viennent'} de faire un don
            </span>
          </div>

          {/* Derniers dons */}
          <div className="recent-donations">
            <h4>Derniers dons</h4>
            {promises.length === 0 ? (
              <div className="no-donations">
                <p>Soyez le premier à faire un don !</p>
              </div>
            ) : (
              <div className="donations-list">
                {latestPromises.slice(0, 3).map((promise) => (
                  <div key={promise.id} className="donation-item">
                    <div className="donation-header">
                      <span className="donor-name">
                        {getContributorDisplayName(promise)}
                      </span>
                      <span className="donation-amount">{promise.amount} TND</span>
                    </div>
                    {promise.message && (
                      <div className="donation-message">"{promise.message}"</div>
                    )}
                    <div className="donation-date">
                      {new Date(promise.promisedAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="sidebar-navigation">
            <button
              type="button"
              className="nav-btn"
              onClick={() => handleOpenDonorsModal('latest')}
            >
              Tout voir
            </button>
            <button
              type="button"
              className="nav-btn"
              onClick={() => handleOpenDonorsModal('highest')}
            >
              Voir en haut
            </button>
          </div>
                 </div>
       </div>
       
      {/* Modal dons / promesses */}
      {showDonorsModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal donation-modal top-donors-modal">
            <button className="modal-close-btn" onClick={() => setShowDonorsModal(false)} aria-label="Fermer">
              ×
            </button>

            <div className="top-donors-header">
              <div className="top-donors-title">
                <h3>Dons</h3>
                <span className="top-donors-total">{formatCompactAmount(donorsModalTotal)}</span>
              </div>
              <div className="top-donors-tabs">
                <button
                  type="button"
                  className={`top-donors-tab ${donorsModalTab === 'highest' ? 'active' : ''} ${topPromises.length === 0 ? 'disabled' : ''}`}
                  onClick={() => setDonorsModalTab('highest')}
                  aria-disabled={topPromises.length === 0}
                >
                  Haut
                </button>
                <button
                  type="button"
                  className={`top-donors-tab ${donorsModalTab === 'latest' ? 'active' : ''} ${promises.length === 0 ? 'disabled' : ''}`}
                  onClick={() => setDonorsModalTab('latest')}
                  aria-disabled={promises.length === 0}
                >
                  Nouveautés
                </button>
              </div>
            </div>

            <p className="top-donors-lead">
              {donorsModalLead}
            </p>

            {donorsModalList.length === 0 ? (
              <div className="no-donations top">
                {donorsModalTab === 'highest' ? (
                  <>
                    <p>Aucun donateur à la une pour le moment.</p>
                    <p>Faites un don de {formatAmount(topThreshold)} pour apparaître ici.</p>
                  </>
                ) : (
                  <p>Aucune promesse enregistrée pour le moment.</p>
                )}
              </div>
            ) : (
              <div className="donations-list full modal">
                {donorsModalList.map((promise) => (
                  <div key={promise.id} className="donation-item modal-item">
                    {renderContributorAvatar(promise)}
                    <div className="donation-content">
                      <div className="donation-header">
                        <span className="donor-name">{getContributorDisplayName(promise)}</span>
                        <span className="donation-amount">{formatAmount(promise.amount)}</span>
                      </div>
                      <div className="donation-meta">
                        <span className="donation-time">{formatRelativeTime(promise.promisedAt)}</span>
                      </div>
                      {promise.message && (
                        <div className="donation-message">"{promise.message}"</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="top-donors-footer">
              <div className="top-donors-cta-text">
                {donorsModalTab === 'highest' ? (
                  <>Inscrivez-vous à cette liste. <button type="button" className="link-btn" onClick={handleOpenDonationFromTop}>Faites un don maintenant.</button></>
                ) : (
                  <>Renforcez cette collecte. <button type="button" className="link-btn" onClick={handleOpenDonationFromTop}>Faites un don maintenant.</button></>
                )}
              </div>
              <button
                type="button"
                className="top-donors-action-btn"
                onClick={handleOpenDonationFromTop}
              >
                Faites un don maintenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de donation */}
       {showDonationModal && (
         <div className="delete-modal-overlay">
           <div className="delete-modal donation-modal">
             <h3>🤝 Faire une promesse de don</h3>
             <p className="promise-explanation">
               En faisant une promesse, vous vous engagez moralement à soutenir <strong>{cagnotte?.creator.firstName} {cagnotte?.creator.lastName}</strong>. 
               Votre promesse sera visible et comptera dans le montant collecté. Vous pourrez l'honorer le jour J !
             </p>
             
             <div className="donation-form">
               {/* Message si utilisateur non connecté */}
               {!user && (
                 <div className="login-required-box">
                   <div className="info-icon">🔒</div>
                   <div className="info-text">
                     <strong>Connexion requise</strong>
                     <p>Vous devez être connecté pour faire une promesse de don. <a href="/login" onClick={(e) => { e.preventDefault(); setShowDonationModal(false); setShowAnonymousTooltip(false); navigate('/login'); }}>Connectez-vous</a> ou <a href="/register" onClick={(e) => { e.preventDefault(); setShowDonationModal(false); setShowAnonymousTooltip(false); navigate('/register'); }}>créez un compte</a>.</p>
                   </div>
                 </div>
               )}

               {user && (
                 <>
                  <div className="top-donor-banner">
                    <span className="banner-icon">🏅</span>
                    <div className="banner-text">
                      <strong>Envie de figurer parmi les donateurs à la une ?</strong>
                      <p>Un don de <strong>{formatAmount(topThreshold)}</strong> ou plus vous permet de rejoindre la liste "Voir en haut".</p>
                    </div>
                  </div>

                  <div className="quick-amounts">
                    {quickAmounts.map((amount) => {
                      const isSelected = donationAmount && parseFloat(donationAmount) === amount;
                      const isSuggested = amount === suggestedAmount;
                      return (
                        <button
                          type="button"
                          key={amount}
                          className={`quick-amount-btn ${isSelected ? 'selected' : ''} ${isSuggested ? 'suggested' : ''}`}
                          onClick={() => setDonationAmount(amount.toString())}
                        >
                          <span className="quick-amount-value">{amount.toLocaleString('fr-FR')} TND</span>
                          {isSuggested && <span className="quick-amount-tag">💚 Suggéré</span>}
                        </button>
                      );
                    })}
                  </div>

                   <div className="form-group">
                     <label htmlFor="donation-amount">Montant de votre promesse (TND)</label>
                 <input
                   id="donation-amount"
                   type="number"
                   min="1"
                   step="0.01"
                   value={donationAmount}
                   onChange={(e) => setDonationAmount(e.target.value)}
                   placeholder="Entrez le montant"
                   className="donation-input"
                 />
               </div>
               
                   <div className="form-group">
                     <label htmlFor="donation-message">Message d'encouragement (optionnel)</label>
                     <textarea
                       id="donation-message"
                       value={donationMessage}
                       onChange={(e) => setDonationMessage(e.target.value)}
                       placeholder="Laissez un message de soutien et d'encouragement..."
                       className="donation-textarea"
                       rows={3}
                     />
                   </div>

                  <div className="form-group anonymous-group">
                    <div className="anonymous-option">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="anonymous-checkbox"
                        />
                        <span className="checkbox-text">
                          Ne pas publier mon nom sur la page de la cagnotte
                        </span>
                      </label>
                      <button
                        type="button"
                        ref={anonymousInfoButtonRef}
                        className="anonymous-info-btn"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setShowAnonymousTooltip((prev) => !prev);
                        }}
                        aria-label="En savoir plus sur l'option anonyme"
                        aria-expanded={showAnonymousTooltip}
                      >
                        i
                      </button>
                      {showAnonymousTooltip && (
                        <div className="anonymous-tooltip" ref={anonymousTooltipRef}>
                          <button
                            type="button"
                            className="anonymous-tooltip-close"
                            onClick={() => setShowAnonymousTooltip(false)}
                            aria-label="Fermer l'information"
                          >
                            ×
                          </button>
                          <p>
                            En cochant cette case, vous serez visible comme « Anonyme » pour les autres donateurs Kollecta. Cependant, les organisateurs, les bénéficiaires, l'organisme sans but lucratif destinataire ou d'autres personnes pourront recevoir des informations vous concernant.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                   <div className="promise-info-box">
                     <div className="info-icon">💡</div>
                     <div className="info-text">
                       <strong>Comment ça marche ?</strong>
                       <p>Votre promesse sera enregistrée et visible publiquement. Elle comptera dans le montant collecté pour encourager la cagnotte. Vous pourrez la marquer comme "honorée" depuis votre espace personnel quand vous aurez effectué votre don.</p>
                     </div>
                   </div>
                 </>
               )}
             </div>

             <div className="delete-modal-actions">
                   <button 
                 className="cancel-btn" 
                  onClick={() => {
                    setShowDonationModal(false);
                    setDonationAmount('');
                    setDonationMessage('');
                    setIsAnonymous(false);
                    setShowAnonymousTooltip(false);
                  }}
                 disabled={isDonating}
               >
                 Annuler
               </button>
               <button 
                 className="confirm-delete-btn donate-btn-modal" 
                 onClick={handleDonationSubmit}
                 disabled={isDonating || !user || !donationAmount || parseFloat(donationAmount) <= 0}
               >
                 {isDonating ? 'Enregistrement...' : '💚 Confirmer ma promesse'}
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Message de succès */}
       {donationSuccess && (
         <div className="success-message-overlay">
           <div className="success-message">
             <span className="success-icon">🤝</span>
             <p className="success-title">Promesse enregistrée !</p>
             <p className="success-subtitle">Merci pour votre engagement. N'oubliez pas d'honorer votre promesse le jour J !</p>
           </div>
         </div>
       )}

       {/* Modal de confirmation de suppression */}
       {showDeleteModal && (
         <div className="delete-modal-overlay">
           <div className="delete-modal">
             <h3>Confirmer la suppression</h3>
             <p>Êtes-vous sûr de vouloir supprimer cette cagnotte ? Cette action est irréversible.</p>
             <div className="delete-modal-actions">
               <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                 Annuler
               </button>
               <button className="confirm-delete-btn" onClick={handleDelete}>
                 Supprimer définitivement
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default CagnotteDetail; 