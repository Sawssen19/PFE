import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './KYCStatus.css';

interface KYCStatusData {
  verificationStatus: string;
  riskScore: number;
  verificationDate?: string;
  documentType: string;
  rejectionReason?: string;
  expiryDate?: string;
}

export const KYCStatus: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [kycStatus, setKycStatus] = useState<KYCStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchKYCStatus();
    }
  }, [user]);

  const fetchKYCStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/kyc/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setKycStatus(null);
          return;
        }
        throw new Error('Erreur lors de la récupération du statut KYC');
      }

      const data = await response.json();
      setKycStatus(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return '#27ae60';
      case 'PENDING':
        return '#f39c12';
      case 'REJECTED':
        return '#e74c3c';
      case 'BLOCKED':
        return '#c0392b';
      case 'EXPIRED':
        return '#e67e22';
      default:
        return '#7f8c8d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return '✅';
      case 'PENDING':
        return '⏳';
      case 'REJECTED':
        return '❌';
      case 'BLOCKED':
        return '🚫';
      case 'EXPIRED':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score <= 20) return { level: 'FAIBLE', color: '#27ae60' };
    if (score <= 50) return { level: 'MOYEN', color: '#f39c12' };
    if (score <= 80) return { level: 'ÉLEVÉ', color: '#e67e22' };
    return { level: 'CRITIQUE', color: '#e74c3c' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-TN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'CARTE_IDENTITE':
        return 'Carte d\'identité nationale';
      case 'PASSEPORT':
        return 'Passeport';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="kyc-status-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du statut KYC...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kyc-status-error">
        <div className="error-icon">❌</div>
        <h3>Erreur</h3>
        <p>{error}</p>
        <button onClick={fetchKYCStatus} className="btn-retry">
          Réessayer
        </button>
      </div>
    );
  }

  if (!kycStatus) {
    return (
      <div className="kyc-status-empty">
        <div className="empty-icon">📋</div>
        <h3>Aucune vérification KYC</h3>
        <p>Vous n'avez pas encore effectué de vérification d'identité.</p>
        <p>La vérification KYC est obligatoire pour l'ouverture de cagnottes et les paiements.</p>
        <a href="/kyc/verify" className="btn-verify">
          Commencer la vérification KYC
        </a>
      </div>
    );
  }

  const riskLevel = getRiskLevel(kycStatus.riskScore);

  return (
    <div className="kyc-status-container">
      <div className="kyc-status">
        <div className="status-header">
          <h2>🔐 Statut de votre vérification KYC</h2>
        </div>

        <div className="status-cards">
          <div className="status-card main-status">
            <div className="status-icon" style={{ color: getStatusColor(kycStatus.verificationStatus) }}>
              {getStatusIcon(kycStatus.verificationStatus)}
            </div>
            <div className="status-info">
              <h3>Statut de vérification</h3>
              <p className="status-value">{kycStatus.verificationStatus}</p>
              {kycStatus.verificationDate && (
                <p className="status-date">
                  Vérifié le : {formatDate(kycStatus.verificationDate)}
                </p>
              )}
            </div>
          </div>

          <div className="status-card">
            <div className="card-icon">📄</div>
            <div className="card-info">
              <h4>Type de document</h4>
              <p>{getDocumentTypeLabel(kycStatus.documentType)}</p>
            </div>
          </div>

          <div className="status-card">
            <div className="card-icon">🎯</div>
            <div className="card-info">
              <h4>Score de risque</h4>
              <p className="risk-score" style={{ color: riskLevel.color }}>
                {kycStatus.riskScore}/100
              </p>
              <span className="risk-level" style={{ backgroundColor: riskLevel.color }}>
                {riskLevel.level}
              </span>
            </div>
          </div>

          {kycStatus.expiryDate && (
            <div className="status-card">
              <div className="card-icon">📅</div>
              <div className="card-info">
                <h4>Date d'expiration</h4>
                <p>{formatDate(kycStatus.expiryDate)}</p>
              </div>
            </div>
          )}
        </div>

        {kycStatus.rejectionReason && (
          <div className="rejection-info">
            <h4>❌ Raison du rejet</h4>
            <p>{kycStatus.rejectionReason}</p>
            <a href="/kyc/verify" className="btn-retry-verification">
              Réessayer la vérification
            </a>
          </div>
        )}

        {kycStatus.verificationStatus === 'VERIFIED' && (
          <div className="verification-success">
            <div className="success-icon">🎉</div>
            <h3>Vérification réussie !</h3>
            <p>Votre identité a été vérifiée avec succès. Vous pouvez maintenant :</p>
            <ul>
              <li>✅ Créer des cagnottes</li>
              <li>✅ Effectuer des paiements</li>
              <li>✅ Accéder à toutes les fonctionnalités</li>
            </ul>
          </div>
        )}

        {kycStatus.verificationStatus === 'PENDING' && (
          <div className="verification-pending">
            <div className="pending-icon">⏳</div>
            <h3>Vérification en cours</h3>
            <p>Vos documents sont en cours de vérification. Ce processus peut prendre 24-48 heures.</p>
            <p>Vous recevrez une notification une fois la vérification terminée.</p>
          </div>
        )}

        {kycStatus.verificationStatus === 'EXPIRED' && (
          <div className="verification-expired">
            <div className="expired-icon">⚠️</div>
            <h3>Document expiré</h3>
            <p>Votre document d'identité a expiré. Vous devez fournir un document valide.</p>
            <a href="/kyc/verify" className="btn-update-document">
              Mettre à jour le document
            </a>
          </div>
        )}

        <div className="status-actions">
          <button onClick={fetchKYCStatus} className="btn-refresh">
            🔄 Actualiser le statut
          </button>
          {kycStatus.verificationStatus !== 'VERIFIED' && (
            <a href="/kyc/verify" className="btn-verify-now">
              🔐 Vérifier maintenant
            </a>
          )}
        </div>

        <div className="status-footer">
          <p>
            <strong>💡 Conseil :</strong> Gardez vos documents d'identité à jour pour éviter les interruptions de service.
          </p>
          <p>
            <strong>📞 Support :</strong> En cas de problème, contactez notre équipe support.
          </p>
        </div>
      </div>
    </div>
  );
}; 