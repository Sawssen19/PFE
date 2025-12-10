import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { Box } from '@mui/material';
import {
  CheckCircle,
  Pending,
  Cancel,
  Block,
  Warning,
  HelpOutline,
  Description,
  Assessment,
  CalendarToday,
  Refresh,
  Security,
  VerifiedUser,
  Info,
} from '@mui/icons-material';
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
  const navigate = useNavigate();
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
        return '#00b289';
      case 'PENDING':
        return '#f59e0b';
      case 'REJECTED':
        return '#ef4444';
      case 'BLOCKED':
        return '#dc2626';
      case 'EXPIRED':
        return '#f97316';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    const iconStyle = { fontSize: '3rem', color: getStatusColor(status) };
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle sx={iconStyle} />;
      case 'PENDING':
        return <Pending sx={iconStyle} />;
      case 'REJECTED':
        return <Cancel sx={iconStyle} />;
      case 'BLOCKED':
        return <Block sx={iconStyle} />;
      case 'EXPIRED':
        return <Warning sx={iconStyle} />;
      default:
        return <HelpOutline sx={iconStyle} />;
    }
  };

  const getRiskLevel = (score: number) => {
    if (score <= 20) return { level: 'FAIBLE', color: '#00b289' };
    if (score <= 50) return { level: 'MOYEN', color: '#f59e0b' };
    if (score <= 80) return { level: 'ÉLEVÉ', color: '#f97316' };
    return { level: 'CRITIQUE', color: '#ef4444' };
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
        <Cancel sx={{ fontSize: '4rem', color: '#ef4444', mb: 2 }} />
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
        <Description sx={{ fontSize: '4rem', color: '#00b289', mb: 2 }} />
        <h3>Aucune vérification KYC</h3>
        <p>Vous n'avez pas encore effectué de vérification d'identité.</p>
        <p>La vérification KYC est obligatoire pour l'ouverture de cagnottes et les paiements.</p>
        <button onClick={() => navigate('/kyc/verify')} className="btn-verify">
          Commencer la vérification KYC
        </button>
      </div>
    );
  }

  const riskLevel = getRiskLevel(kycStatus.riskScore);

  return (
    <div className="kyc-status-container">
      <div className="kyc-status">
        <div className="status-header">
          <VerifiedUser sx={{ fontSize: '4rem', color: 'white', mb: 2 }} />
          <h1>Statut de votre vérification KYC</h1>
          <p className="header-subtitle">Consultez l'état de votre vérification d'identité</p>
        </div>

        <div className="status-cards">
          <div className="status-card main-status">
            <div className="status-icon">
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
            <div className="card-icon">
              <Description sx={{ fontSize: '2.5rem', color: '#00b289' }} />
            </div>
            <div className="card-info">
              <h4>Type de document</h4>
              <p>{getDocumentTypeLabel(kycStatus.documentType)}</p>
            </div>
          </div>

          <div className="status-card">
            <div className="card-icon">
              <Assessment sx={{ fontSize: '2.5rem', color: '#00b289' }} />
            </div>
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
              <div className="card-icon">
                <CalendarToday sx={{ fontSize: '2.5rem', color: '#00b289' }} />
              </div>
              <div className="card-info">
                <h4>Date d'expiration</h4>
                <p>{formatDate(kycStatus.expiryDate)}</p>
              </div>
            </div>
          )}
        </div>

        {kycStatus.rejectionReason && (
          <div className="rejection-info">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Cancel sx={{ color: '#ef4444', fontSize: '1.5rem' }} />
              <h4>Raison du rejet</h4>
            </Box>
            <p>{kycStatus.rejectionReason}</p>
            <button onClick={() => navigate('/kyc/verify')} className="btn-retry-verification">
              Réessayer la vérification
            </button>
          </div>
        )}

        {kycStatus.verificationStatus === 'VERIFIED' && (
          <div className="verification-success">
            <CheckCircle sx={{ fontSize: '4rem', color: '#00b289', mb: 2 }} />
            <h3>Vérification réussie !</h3>
            <p>Votre identité a été vérifiée avec succès. Vous pouvez maintenant :</p>
            <ul>
              <li>
                <CheckCircle sx={{ fontSize: '1.2rem', color: '#00b289', mr: 1, verticalAlign: 'middle' }} />
                Créer des cagnottes
              </li>
              <li>
                <CheckCircle sx={{ fontSize: '1.2rem', color: '#00b289', mr: 1, verticalAlign: 'middle' }} />
                Effectuer des paiements
              </li>
              <li>
                <CheckCircle sx={{ fontSize: '1.2rem', color: '#00b289', mr: 1, verticalAlign: 'middle' }} />
                Accéder à toutes les fonctionnalités
              </li>
            </ul>
          </div>
        )}

        {kycStatus.verificationStatus === 'PENDING' && (
          <div className="verification-pending">
            <Pending sx={{ fontSize: '4rem', color: '#f59e0b', mb: 2 }} />
            <h3>Vérification en cours</h3>
            <p>Vos documents sont en cours de vérification. Ce processus peut prendre 24-48 heures.</p>
            <p>Vous recevrez une notification une fois la vérification terminée.</p>
          </div>
        )}

        {kycStatus.verificationStatus === 'EXPIRED' && (
          <div className="verification-expired">
            <Warning sx={{ fontSize: '4rem', color: '#f97316', mb: 2 }} />
            <h3>Document expiré</h3>
            <p>Votre document d'identité a expiré. Vous devez fournir un document valide.</p>
            <button onClick={() => navigate('/kyc/verify')} className="btn-update-document">
              Mettre à jour le document
            </button>
          </div>
        )}

        <div className="status-actions">
          <button onClick={fetchKYCStatus} className="btn-refresh">
            <Refresh sx={{ fontSize: '1.2rem', mr: 1 }} />
            Actualiser le statut
          </button>
          {kycStatus.verificationStatus !== 'VERIFIED' && (
            <button onClick={() => navigate('/kyc/verify')} className="btn-verify-now">
              <Security sx={{ fontSize: '1.2rem', mr: 1 }} />
              Vérifier maintenant
            </button>
          )}
        </div>

        <div className="status-footer">
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
            <Info sx={{ color: '#00b289', fontSize: '1.5rem', mt: 0.5, flexShrink: 0 }} />
            <p>
              <strong>Conseil :</strong> Gardez vos documents d'identité à jour pour éviter les interruptions de service.
            </p>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Info sx={{ color: '#00b289', fontSize: '1.5rem', mt: 0.5, flexShrink: 0 }} />
            <p>
              <strong>Support :</strong> En cas de problème, contactez notre équipe support.
            </p>
          </Box>
        </div>
      </div>
    </div>
  );
}; 