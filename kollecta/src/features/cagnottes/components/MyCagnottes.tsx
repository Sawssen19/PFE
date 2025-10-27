import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cagnottesService } from '../cagnottesService';
import './MyCagnottes.css';

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

const MyCagnottes: React.FC = () => {
  const navigate = useNavigate();
  const [cagnottes, setCagnottes] = useState<Cagnotte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({
    draft: false,
    active: false,
    pending: false,
    rejected: false,
    completed: false,
    suspended: false
  });
  const [loadingMore, setLoadingMore] = useState<{ [key: string]: boolean }>({
    draft: false,
    active: false,
    pending: false,
    rejected: false,
    completed: false,
    suspended: false
  });

  useEffect(() => {
    loadCagnottes();
  }, []);

  const loadCagnottes = async () => {
    try {
      setLoading(true);
      const response = await cagnottesService.getUserCagnottes();
      console.log('🔍 Réponse du backend:', response);
      
      // Le backend retourne { success: true, data: { cagnottes: [], pagination: {} } }
      const cagnottesData = (response as any)?.data?.cagnottes || (response as any)?.cagnottes || response || [];
      console.log('🔍 Cagnottes extraites:', cagnottesData);
      setCagnottes(cagnottesData);
    } catch (err) {
      console.error('Erreur lors du chargement des cagnottes:', err);
      setError('Erreur lors du chargement de vos cagnottes');
    } finally {
      setLoading(false);
    }
  };

  const getDraftCagnottes = () => {
    return cagnottes.filter(cagnotte => cagnotte.status === 'DRAFT');
  };

  const getActiveCagnottes = () => {
    return cagnottes.filter(cagnotte => cagnotte.status === 'ACTIVE');
  };

  const getPendingCagnottes = () => {
    return cagnottes.filter(cagnotte => cagnotte.status === 'PENDING');
  };

  const getRejectedCagnottes = () => {
    return cagnottes.filter(cagnotte => cagnotte.status === 'REJECTED');
  };

  const getCompletedCagnottes = () => {
    return cagnottes.filter(cagnotte => cagnotte.status === 'COMPLETED' || cagnotte.status === 'CLOSED');
  };

  const getSuspendedCagnottes = () => {
    return cagnottes.filter(cagnotte => cagnotte.status === 'SUSPENDED');
  };

  // Fonctions pour gérer l'affichage limité - 3 par ligne
  const getDisplayedCagnottes = (cagnottesList: Cagnotte[], type: string) => {
    if (showAll[type]) {
      return cagnottesList;
    }
    return cagnottesList.slice(0, 3);
  };

  const handleSeeMore = (type: string) => {
    setLoadingMore(prev => ({ ...prev, [type]: true }));
    
    // Simuler un délai de chargement
    setTimeout(() => {
      setShowAll(prev => ({ ...prev, [type]: true }));
      setLoadingMore(prev => ({ ...prev, [type]: false }));
    }, 500);
  };

  const handleSeeLess = (type: string) => {
    setShowAll(prev => ({ ...prev, [type]: false }));
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

  const handleFinishDraft = (cagnotteId: string) => {
    // Rediriger vers la page de création avec l'ID du brouillon
    navigate(`/create/fundraiser?draftId=${cagnotteId}`);
  };

  const handleViewCagnotte = (cagnotteId: string) => {
    navigate(`/cagnottes/${cagnotteId}`);
  };

  const handleCreateNew = () => {
    navigate('/create/fundraiser');
  };

  if (loading) {
    return (
      <div className="my-cagnottes-container">
        <div className="loading">Chargement de vos cagnottes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-cagnottes-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const draftCagnottes = getDraftCagnottes();
  const activeCagnottes = getActiveCagnottes();
  const pendingCagnottes = getPendingCagnottes();
  const rejectedCagnottes = getRejectedCagnottes();
  const completedCagnottes = getCompletedCagnottes();
  const suspendedCagnottes = getSuspendedCagnottes();

  // Cagnottes affichées avec limitation
  const displayedDraftCagnottes = getDisplayedCagnottes(draftCagnottes, 'draft');
  const displayedActiveCagnottes = getDisplayedCagnottes(activeCagnottes, 'active');
  const displayedPendingCagnottes = getDisplayedCagnottes(pendingCagnottes, 'pending');
  const displayedRejectedCagnottes = getDisplayedCagnottes(rejectedCagnottes, 'rejected');
  const displayedCompletedCagnottes = getDisplayedCagnottes(completedCagnottes, 'completed');
  const displayedSuspendedCagnottes = getDisplayedCagnottes(suspendedCagnottes, 'suspended');

  return (
    <div className="my-cagnottes-page my-cagnottes-container">
      <div className="my-cagnottes-header">
        <h1>Vos collectes de fonds</h1>
        <p style={{ margin: '0 0 25px 0', fontSize: '1.1rem', opacity: 0.9 }}>
          Gérez et suivez toutes vos campagnes de collecte de fonds
        </p>
        <button className="create-campaign-btn" onClick={handleCreateNew}>
          <svg style={{ width: '20px', height: '20px', marginRight: '8px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Lancez une campagne Kollecta
        </button>
      </div>

      {/* Statistiques rapides */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginTop: '40px',
        marginBottom: '40px' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>
            {activeCagnottes.length}
          </div>
          <div style={{ color: '#718096', fontSize: '0.9rem' }}>Cagnottes actives</div>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f6ad55' }}>
            {draftCagnottes.length}
          </div>
          <div style={{ color: '#718096', fontSize: '0.9rem' }}>Brouillons</div>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ed8936' }}>
            {pendingCagnottes.length}
          </div>
          <div style={{ color: '#718096', fontSize: '0.9rem' }}>En attente</div>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4299e1' }}>
            {completedCagnottes.length}
          </div>
          <div style={{ color: '#718096', fontSize: '0.9rem' }}>Terminées</div>
        </div>
      </div>

      {/* Brouillons */}
      {draftCagnottes.length > 0 && (
        <div className="cagnottes-section">
          <h2>Brouillons</h2>
          <div className={`cagnottes-grid ${!showAll.draft ? 'limited' : ''}`}>
            {displayedDraftCagnottes.map((cagnotte) => (
              <div key={cagnotte.id} className="cagnotte-card draft">
                <div className="cagnotte-image">
                  {cagnotte.coverImage ? (
                    <img src={cagnotte.coverImage} alt={cagnotte.title} />
                  ) : (
                    <div className="placeholder-image">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                  )}
                  <div className="status-badge draft">
                    Brouillon
                  </div>
                </div>
                <div className="cagnotte-content">
                  <h3>{cagnotte.title || 'Sans titre'}</h3>
                  <p className="cagnotte-category">{cagnotte.category?.name || 'Catégorie non définie'}</p>
                  <p className="cagnotte-date">
                    Créée {formatDate(cagnotte.createdAt)}
                  </p>
                  <button 
                    className="finish-draft-btn"
                    onClick={() => handleFinishDraft(cagnotte.id)}
                  >
                    <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                    Terminer le brouillon
                  </button>
                </div>
              </div>
            ))}
          </div>
          {draftCagnottes.length > 3 && (
            <div className={loadingMore.draft ? 'loading-more' : ''}>
              <button 
                className="see-more-btn"
                onClick={() => showAll.draft ? handleSeeLess('draft') : handleSeeMore('draft')}
                disabled={loadingMore.draft}
              >
                {loadingMore.draft ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                    </svg>
                    Chargement...
                  </>
                ) : showAll.draft ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                    Réduire
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                    Afficher plus
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

             {/* Cagnottes actives */}
       {activeCagnottes.length > 0 && (
         <div className="cagnottes-section">
           <h2>Cagnottes actives</h2>
           <div className={`cagnottes-grid ${!showAll.active ? 'limited' : ''}`}>
             {displayedActiveCagnottes.map((cagnotte) => (
               <div key={cagnotte.id} className="cagnotte-card active" onClick={() => handleViewCagnotte(cagnotte.id)}>
                 <div className="cagnotte-image">
                   {cagnotte.coverImage ? (
                     <img src={cagnotte.coverImage} alt={cagnotte.title} />
                   ) : (
                     <div className="placeholder-image">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                       </svg>
                     </div>
                   )}
                 </div>
                 <div className="cagnotte-content">
                   <h3>{cagnotte.title}</h3>
                   <p className="cagnotte-category">{cagnotte.category?.name}</p>
                   <div className="cagnotte-progress">
                     <div className="progress-bar">
                       <div 
                         className="progress-fill" 
                         style={{ width: `${getProgressPercentage(cagnotte.currentAmount, cagnotte.goalAmount)}%` }}
                       ></div>
                     </div>
                     <div className="progress-stats">
                       <span className="current-amount">{cagnotte.currentAmount.toLocaleString()} TND</span>
                       <span className="goal-amount">sur {cagnotte.goalAmount.toLocaleString()} TND</span>
                     </div>
                   </div>
                   <p className="cagnotte-date">
                     Créée {formatDate(cagnotte.createdAt)}
                   </p>
                 </div>
               </div>
             ))}
           </div>
           {activeCagnottes.length > 3 && (
             <div className={loadingMore.active ? 'loading-more' : ''}>
               <button 
                 className="see-more-btn"
                 onClick={() => showAll.active ? handleSeeLess('active') : handleSeeMore('active')}
                 disabled={loadingMore.active}
               >
                 {loadingMore.active ? (
                   <>
                     <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                       <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                     </svg>
                     Chargement...
                   </>
                 ) : showAll.active ? (
                   <>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M18 15l-6-6-6 6"/>
                     </svg>
                     Réduire
                   </>
                 ) : (
                   <>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M6 9l6 6 6-6"/>
                     </svg>
                     Afficher plus
                   </>
                 )}
               </button>
             </div>
           )}
         </div>
       )}

       {/* Cagnottes en attente */}
       {pendingCagnottes.length > 0 && (
         <div className="cagnottes-section">
           <h2>Cagnottes en attente</h2>
           <div className={`cagnottes-grid ${!showAll.pending ? 'limited' : ''}`}>
             {displayedPendingCagnottes.map((cagnotte) => (
               <div key={cagnotte.id} className="cagnotte-card pending" onClick={() => handleViewCagnotte(cagnotte.id)}>
                 <div className="cagnotte-image">
                   {cagnotte.coverImage ? (
                     <img src={cagnotte.coverImage} alt={cagnotte.title} />
                   ) : (
                     <div className="placeholder-image">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                       </svg>
                     </div>
                   )}
                   <div className="status-badge pending">
                     En attente
                   </div>
                 </div>
                 <div className="cagnotte-content">
                   <h3>{cagnotte.title}</h3>
                   <p className="cagnotte-category">{cagnotte.category?.name}</p>
                   <div className="cagnotte-progress">
                     <div className="progress-bar">
                       <div 
                         className="progress-fill" 
                         style={{ width: `${getProgressPercentage(cagnotte.currentAmount, cagnotte.goalAmount)}%` }}
                       ></div>
                     </div>
                     <div className="progress-stats">
                       <span className="current-amount">{cagnotte.currentAmount.toLocaleString()} TND</span>
                       <span className="goal-amount">sur {cagnotte.goalAmount.toLocaleString()} TND</span>
                     </div>
                   </div>
                   <p className="cagnotte-date">
                     Créée {formatDate(cagnotte.createdAt)}
                   </p>
                 </div>
               </div>
             ))}
           </div>
           {pendingCagnottes.length > 3 && (
             <div className={loadingMore.pending ? 'loading-more' : ''}>
               <button 
                 className="see-more-btn"
                 onClick={() => showAll.pending ? handleSeeLess('pending') : handleSeeMore('pending')}
                 disabled={loadingMore.pending}
               >
                 {loadingMore.pending ? (
                   <>
                     <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                       <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                     </svg>
                     Chargement...
                   </>
                 ) : showAll.pending ? (
                   <>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M18 15l-6-6-6 6"/>
                     </svg>
                     Réduire
                   </>
                 ) : (
                   <>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M6 9l6 6 6-6"/>
                     </svg>
                     Afficher plus
                   </>
                 )}
               </button>
             </div>
           )}
         </div>
       )}

       {/* Cagnottes rejetées */}
       {rejectedCagnottes.length > 0 && (
         <div className="cagnottes-section">
           <h2>Cagnottes rejetées</h2>
           <div className={`cagnottes-grid ${!showAll.rejected ? 'limited' : ''}`}>
             {displayedRejectedCagnottes.map((cagnotte) => (
               <div key={cagnotte.id} className="cagnotte-card rejected" onClick={() => handleViewCagnotte(cagnotte.id)}>
                 <div className="cagnotte-image">
                   {cagnotte.coverImage ? (
                     <img src={cagnotte.coverImage} alt={cagnotte.title} />
                   ) : (
                     <div className="placeholder-image">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                       </svg>
                     </div>
                   )}
                   <div className="status-badge rejected">
                     Rejetée
                   </div>
                 </div>
                 <div className="cagnotte-content">
                   <h3>{cagnotte.title}</h3>
                   <p className="cagnotte-category">{cagnotte.category?.name}</p>
                   <div className="cagnotte-progress">
                     <div className="progress-bar">
                       <div 
                         className="progress-fill" 
                         style={{ width: `${getProgressPercentage(cagnotte.currentAmount, cagnotte.goalAmount)}%` }}
                       ></div>
                     </div>
                     <div className="progress-stats">
                       <span className="current-amount">{cagnotte.currentAmount.toLocaleString()} TND</span>
                       <span className="goal-amount">sur {cagnotte.goalAmount.toLocaleString()} TND</span>
                     </div>
                   </div>
                   <p className="cagnotte-date">
                     Créée {formatDate(cagnotte.createdAt)}
                   </p>
                 </div>
               </div>
             ))}
           </div>
           {rejectedCagnottes.length > 3 && (
             <div className={loadingMore.rejected ? 'loading-more' : ''}>
               <button 
                 className="see-more-btn"
                 onClick={() => showAll.rejected ? handleSeeLess('rejected') : handleSeeMore('rejected')}
                 disabled={loadingMore.rejected}
               >
                 {loadingMore.rejected ? (
                   <>
                     <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                       <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                     </svg>
                     Chargement...
                   </>
                 ) : showAll.rejected ? (
                   <>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M18 15l-6-6-6 6"/>
                     </svg>
                     Réduire
                   </>
                 ) : (
                   <>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M6 9l6 6 6-6"/>
                     </svg>
                     Afficher plus
                   </>
                 )}
               </button>
             </div>
           )}
         </div>
       )}

      {/* Cagnottes terminées */}
      {completedCagnottes.length > 0 && (
        <div className="cagnottes-section">
          <h2>Cagnottes terminées</h2>
          <div className={`cagnottes-grid ${!showAll.completed ? 'limited' : ''}`}>
            {displayedCompletedCagnottes.map((cagnotte) => (
              <div key={cagnotte.id} className="cagnotte-card completed" onClick={() => handleViewCagnotte(cagnotte.id)}>
                <div className="cagnotte-image">
                  {cagnotte.coverImage ? (
                    <img src={cagnotte.coverImage} alt={cagnotte.title} />
                  ) : (
                    <div className="placeholder-image">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  )}
                  <div className="status-badge completed">
                    {cagnotte.status === 'COMPLETED' ? 'Terminée' : 'Fermée'}
                  </div>
                </div>
                <div className="cagnotte-content">
                  <h3>{cagnotte.title}</h3>
                  <p className="cagnotte-category">{cagnotte.category?.name}</p>
                  <div className="final-stats">
                    <span className="final-amount">{cagnotte.currentAmount.toLocaleString()} TND</span>
                    <span className="final-goal">sur {cagnotte.goalAmount.toLocaleString()} TND</span>
                  </div>
                  <p className="cagnotte-date">
                    Terminée {formatDate(cagnotte.updatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {completedCagnottes.length > 3 && (
            <div className={loadingMore.completed ? 'loading-more' : ''}>
              <button 
                className="see-more-btn"
                onClick={() => showAll.completed ? handleSeeLess('completed') : handleSeeMore('completed')}
                disabled={loadingMore.completed}
              >
                {loadingMore.completed ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                    </svg>
                    Chargement...
                  </>
                 ) : showAll.completed ? (
                   <>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M18 15l-6-6-6 6"/>
                     </svg>
                     Réduire
                   </>
                 ) : (
                   <>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M6 9l6 6 6-6"/>
                     </svg>
                     Afficher plus
                   </>
                 )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cagnottes suspendues */}
      {suspendedCagnottes.length > 0 && (
        <div className="cagnottes-section">
          <h2>Cagnottes suspendues</h2>
          <div className={`cagnottes-grid ${!showAll.suspended ? 'limited' : ''}`}>
            {displayedSuspendedCagnottes.map((cagnotte) => (
              <div key={cagnotte.id} className="cagnotte-card suspended" onClick={() => handleViewCagnotte(cagnotte.id)}>
                <div className="cagnotte-image">
                  {cagnotte.coverImage ? (
                    <img src={cagnotte.coverImage} alt={cagnotte.title} />
                  ) : (
                    <div className="placeholder-image">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  )}
                  <div className="status-badge suspended">
                    Suspendue
                  </div>
                </div>
                <div className="cagnotte-content">
                  <h3>{cagnotte.title}</h3>
                  <p className="cagnotte-category">{cagnotte.category?.name}</p>
                  <div className="cagnotte-stats">
                    <span className="current-amount">{cagnotte.currentAmount.toLocaleString()} TND</span>
                    <span className="goal-amount">sur {cagnotte.goalAmount.toLocaleString()} TND</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${Math.min((cagnotte.currentAmount / cagnotte.goalAmount) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <p className="cagnotte-date">Créée {formatDate(cagnotte.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
          {suspendedCagnottes.length > 3 && (
            <div className="show-more-container">
              <button 
                className="show-more-btn"
                onClick={() => showAll.suspended ? handleSeeLess('suspended') : handleSeeMore('suspended')}
                disabled={loadingMore.suspended}
              >
                {loadingMore.suspended ? (
                  <>
                    <svg className="loading-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Chargement...
                  </>
                ) : showAll.suspended ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                    Afficher moins
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                    Afficher plus
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* État vide */}
      {cagnottes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <h3>Vous n'avez pas encore de cagnottes</h3>
          <p>Commencez par créer votre première collecte de fonds et faites une différence dans la vie des autres</p>
          <button className="create-first-btn" onClick={handleCreateNew}>
            <svg style={{ width: '20px', height: '20px', marginRight: '8px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Créer ma première cagnotte
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCagnottes; 