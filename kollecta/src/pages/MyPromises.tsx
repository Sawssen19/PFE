import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { promisesService, Promise } from '../features/promises/promisesService';
import './MyPromises.css';

const MyPromises: React.FC = () => {
  const navigate = useNavigate();
  const [promises, setPromises] = useState<Promise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'PAID' | 'CANCELLED'>('all');
  const [updatingPromiseId, setUpdatingPromiseId] = useState<string | null>(null);
  const [editingPromise, setEditingPromise] = useState<Promise | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [editIsAnonymous, setEditIsAnonymous] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadPromises();
  }, [filter]);

  const loadPromises = async () => {
    try {
      setLoading(true);
      const response = await promisesService.getUserPromises({
        status: filter !== 'all' ? filter : undefined
      });
      const promisesData = response.promises || [];
      setPromises(promisesData);
    } catch (error) {
      console.error('Erreur lors du chargement des promesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (promiseId: string) => {
    if (!confirm('Êtes-vous sûr d\'avoir honoré votre engagement ? Cette action marquera votre promesse comme payée.')) {
      return;
    }

    setUpdatingPromiseId(promiseId);
    try {
      await promisesService.updatePromiseStatus(promiseId, 'PAID');
      await loadPromises(); // Recharger les promesses
      alert('✅ Votre promesse a été marquée comme honorée ! Merci pour votre générosité.');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      alert(error.message || 'Erreur lors de la mise à jour de la promesse');
    } finally {
      setUpdatingPromiseId(null);
    }
  };

  const handleCancelPromise = async (promiseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette promesse ?')) {
      return;
    }

    setUpdatingPromiseId(promiseId);
    try {
      await promisesService.updatePromiseStatus(promiseId, 'CANCELLED');
      await loadPromises();
      alert('La promesse a été annulée.');
    } catch (error: any) {
      console.error('Erreur lors de l\'annulation:', error);
      alert(error.message || 'Erreur lors de l\'annulation');
    } finally {
      setUpdatingPromiseId(null);
    }
  };

  const handleEditPromise = (promise: Promise) => {
    setEditingPromise(promise);
    setEditAmount(promise.amount.toString());
    setEditMessage(promise.message || '');
    setEditIsAnonymous(promise.isAnonymous || false);
  };

  const handleUpdatePromise = async () => {
    if (!editingPromise) return;

    if (!editAmount || parseFloat(editAmount) <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    setIsUpdating(true);
    try {
      await promisesService.updatePromise(editingPromise.id, {
        amount: parseFloat(editAmount),
        message: editMessage || undefined,
        isAnonymous: editIsAnonymous
      });
      await loadPromises();
      setEditingPromise(null);
      setEditAmount('');
      setEditMessage('');
      setEditIsAnonymous(false);
      alert('✅ Votre promesse a été modifiée avec succès !');
    } catch (error: any) {
      console.error('Erreur lors de la modification:', error);
      alert(error.message || 'Erreur lors de la modification de la promesse');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="status-badge status-paid">✅ Honorée</span>;
      case 'PENDING':
        return <span className="status-badge status-pending">⏳ En attente</span>;
      case 'CANCELLED':
        return <span className="status-badge status-cancelled">❌ Annulée</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="my-promises-container">
        <div className="loading">Chargement de vos promesses...</div>
      </div>
    );
  }

  return (
    <div className="my-promises-container">
        <div className="my-promises-header">
          <h1>Mes Promesses de Dons</h1>
          <p className="subtitle">Gérez vos engagements et honorez-les quand vous le souhaitez</p>
        </div>

        {/* Filtres */}
        <div className="promises-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({promises.length})
          </button>
          <button
            className={`filter-btn ${filter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setFilter('PENDING')}
          >
            En attente
          </button>
          <button
            className={`filter-btn ${filter === 'PAID' ? 'active' : ''}`}
            onClick={() => setFilter('PAID')}
          >
            Honorées
          </button>
          <button
            className={`filter-btn ${filter === 'CANCELLED' ? 'active' : ''}`}
            onClick={() => setFilter('CANCELLED')}
          >
            Annulées
          </button>
        </div>

        {/* Liste des promesses */}
        {promises.length === 0 ? (
          <div className="no-promises">
            <div className="no-promises-icon">🤝</div>
            <h2>Aucune promesse trouvée</h2>
            <p>
              {filter === 'all'
                ? "Vous n'avez pas encore fait de promesse de don. Commencez à soutenir des causes qui vous tiennent à cœur !"
                : `Aucune promesse ${filter === 'PENDING' ? 'en attente' : filter === 'PAID' ? 'honorée' : 'annulée'}.`}
            </p>
            {filter === 'all' && (
              <button className="explore-btn" onClick={() => navigate('/discover')}>
                Découvrir les cagnottes
              </button>
            )}
          </div>
        ) : (
          <div className="promises-list">
            {promises.map((promise) => (
              <div key={promise.id} className="promise-card">
                <div className="promise-card-header">
                  <div className="promise-cagnotte-info">
                    <h3>{promise.cagnotte?.title || 'Cagnotte'}</h3>
                    <p className="promise-date">
                      Promesse faite le {new Date(promise.promisedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="promise-amount">{promise.amount} TND</div>
                </div>

                <div className="promise-card-body">
                  {promise.cagnotte?.description && (
                    <p className="cagnotte-description">
                      {promise.cagnotte.description.length > 150
                        ? `${promise.cagnotte.description.substring(0, 150)}...`
                        : promise.cagnotte.description}
                    </p>
                  )}

                  <div className="promise-meta">
                    <div className="meta-item">
                      <span className="meta-label">Organisateur :</span>
                      <span className="meta-value">
                        {promise.cagnotte?.creator?.firstName} {promise.cagnotte?.creator?.lastName}
                      </span>
                    </div>
                    {promise.paidAt && (
                      <div className="meta-item">
                        <span className="meta-label">Honorée le :</span>
                        <span className="meta-value">
                          {new Date(promise.paidAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="promise-status-section">
                    {getStatusBadge(promise.status)}
                  </div>
                </div>

                <div className="promise-card-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => navigate(`/cagnottes/${promise.cagnotte?.id}`)}
                  >
                    Voir la cagnotte
                  </button>
                  {promise.status === 'PENDING' && (
                    <>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditPromise(promise)}
                        disabled={updatingPromiseId === promise.id}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        className="action-btn honor-btn"
                        onClick={() => handleMarkAsPaid(promise.id)}
                        disabled={updatingPromiseId === promise.id}
                      >
                        {updatingPromiseId === promise.id ? 'En cours...' : '✅ Honorer ma promesse'}
                      </button>
                      <button
                        className="action-btn cancel-btn"
                        onClick={() => handleCancelPromise(promise.id)}
                        disabled={updatingPromiseId === promise.id}
                      >
                        Annuler
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de modification */}
        {editingPromise && (
          <div className="delete-modal-overlay">
            <div className="delete-modal donation-modal">
              <h3>✏️ Modifier ma promesse</h3>
              <p className="promise-explanation">
                Modifiez les détails de votre promesse pour <strong>{editingPromise.cagnotte?.title}</strong>
              </p>
              
              <div className="donation-form">
                <div className="form-group">
                  <label htmlFor="edit-amount">Montant de votre promesse (TND)</label>
                  <input
                    id="edit-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="Entrez le montant"
                    className="donation-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-message">Message d'encouragement (optionnel)</label>
                  <textarea
                    id="edit-message"
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    placeholder="Laissez un message de soutien et d'encouragement..."
                    className="donation-textarea"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editIsAnonymous}
                      onChange={(e) => setEditIsAnonymous(e.target.checked)}
                      className="anonymous-checkbox"
                    />
                    <span className="checkbox-text">
                      Ne pas afficher mon nom publiquement sur la cagnotte
                    </span>
                    <span className="info-icon-small" title="En cochant cette case, vous apparaîtrez comme 'Anonyme' aux autres donateurs. Cependant, l'organisateur et le bénéficiaire pourront voir vos informations conformément à notre politique de confidentialité.">
                      ℹ️
                    </span>
                  </label>
                </div>
              </div>

              <div className="delete-modal-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => {
                    setEditingPromise(null);
                    setEditAmount('');
                    setEditMessage('');
                    setEditIsAnonymous(false);
                  }}
                  disabled={isUpdating}
                >
                  Annuler
                </button>
                <button 
                  className="confirm-delete-btn donate-btn-modal" 
                  onClick={handleUpdatePromise}
                  disabled={isUpdating || !editAmount || parseFloat(editAmount) <= 0}
                >
                  {isUpdating ? 'Enregistrement...' : '💚 Enregistrer les modifications'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default MyPromises;

