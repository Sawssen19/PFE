  import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cagnottesService } from '../cagnottesService';
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
  category: {
    name: string;
  };
}

const CagnotteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cagnotte, setCagnotte] = useState<Cagnotte | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadCagnotte();
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
    // TODO: Implémenter la fonctionnalité de don
    alert('Fonctionnalité de don à implémenter');
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
            <span className="donors-count">0 personnes viennent de faire un don</span>
          </div>

          {/* Derniers dons */}
          <div className="recent-donations">
            <h4>Derniers dons</h4>
            <div className="no-donations">
              <p>Soyez le premier à faire un don !</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="sidebar-navigation">
            <button className="nav-btn">Tout voir</button>
            <button className="nav-btn">Voir en haut</button>
          </div>
                 </div>
       </div>
       
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