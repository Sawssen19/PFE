import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { setProfileData } from '../../store/slices/profileSlice';
import { profileService } from '../../services/profile/profileService';
import { accountService } from '../../../services/account/accountService';
import { Info, Eye, EyeOff, Calendar, Globe, Phone, Mail, User, Lock, AlertCircle, CheckCircle, XCircle, Loader2, Shield, Trash2, PowerOff, Users, Bell, Clock, CheckCircle2 } from 'lucide-react';
import AccountRequestConfirmation from './AccountRequestConfirmation';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const profileData = useSelector((state: RootState) => state.profile.data);
  const authToken = useSelector((state: RootState) => state.auth.token);
  
  const [activeTab, setActiveTab] = useState('compte');
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: profileData?.phone || '',
    birthday: profileData?.birthday || '',
    visibility: profileData?.profileVisibility || 'public',
    language: profileData?.language || 'fr',
    profileDescription: profileData?.profileDescription || '',
    profileUrl: profileData?.profileUrl || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [emailChangeData, setEmailChangeData] = useState({
    newEmail: '',
    password: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    donationUpdates: true,
  });
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [showDeactivatePassword, setShowDeactivatePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // États pour les notifications et le suivi
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [requestStatus, setRequestStatus] = useState<{
    type: 'deactivate' | 'delete' | null;
    status: 'pending' | 'reviewing' | 'approved' | 'rejected' | null;
    requestId: string | null;
    submittedAt: Date | null;
  }>({
    type: null,
    status: null,
    requestId: null,
    submittedAt: null
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState<'deletion' | 'deactivation'>('deletion');

  // Options de langue
  const languageOptions = [
    { value: 'fr', label: 'Français (FR)' },
    { value: 'en', label: 'English (EN)' },
    { value: 'ar', label: 'العربية (AR)' }
  ];

  // Charger les données de profil
  useEffect(() => {
    const loadProfileData = async () => {
      if (user?.id && !profileData) {
        try {
          const data = await profileService.getProfile(user.id);
          dispatch(setProfileData(data));
          setFormData(prev => ({
            ...prev,
            visibility: data.profileVisibility || 'public',
            phone: data.phone || '',
            birthday: data.birthday || '',
            language: data.language || 'fr',
            profileDescription: data.profileDescription || '',
            profileUrl: data.profileUrl || ''
          }));
        } catch (error) {
          console.error('Erreur lors du chargement des données de profil:', error);
        }
      }
    };

    loadProfileData();
  }, [user?.id, profileData, dispatch]);

  const handleEdit = (field: string) => {
    setEditMode(field);
    // Réinitialiser les données de formulaire pour ce champ
    if (field === 'email') {
      setEmailChangeData({ newEmail: user?.email || '', password: '' });
    }
  };

  const handleCancel = () => {
    setEditMode(null);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: profileData?.phone || '',
      birthday: profileData?.birthday || '',
      visibility: profileData?.profileVisibility || 'public',
      language: profileData?.language || 'fr',
      profileDescription: profileData?.profileDescription || '',
      profileUrl: profileData?.profileUrl || ''
    });
    setEmailChangeData({ newEmail: '', password: '' });
  };

  const handleSave = async (field: string) => {
    setLoading(true);
    try {
      if (user?.id) {
        let updateData: any = {};
        
        switch (field) {
          case 'name':
            updateData = {
              firstName: formData.firstName,
              lastName: formData.lastName
            };
            break;
          case 'phone':
            updateData = { phone: formData.phone };
            break;
          case 'birthday':
            updateData = { birthday: formData.birthday };
            break;
          case 'language':
            updateData = { language: formData.language };
            break;
          case 'description':
            updateData = { profileDescription: formData.profileDescription };
            break;
          case 'url':
            updateData = { profileUrl: formData.profileUrl };
            break;
          case 'visibility':
            updateData = { profileVisibility: formData.visibility };
            break;
        }

        const updatedProfile = await profileService.updateProfile(user.id, updateData);
        dispatch(setProfileData(updatedProfile));
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
        setEditMode(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!emailChangeData.newEmail || !emailChangeData.password) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      return;
    }

    if (emailChangeData.newEmail === user?.email) {
      setMessage({ type: 'error', text: 'Le nouvel email doit être différent de l\'actuel' });
      return;
    }

    setLoading(true);
    try {
      // Ici vous devrez implémenter la logique de changement d'email avec vérification
      // Pour l'instant, on simule
      setMessage({ type: 'success', text: 'Email modifié avec succès. Vérifiez votre nouvelle adresse email.' });
      setEditMode(null);
      setEmailChangeData({ newEmail: '', password: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du changement d\'email' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setLoading(true);
    try {
      // Ici vous devrez implémenter la logique de changement de mot de passe
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = () => {
    setOpenDeactivateDialog(true);
  };

  const handleDeleteAccount = () => {
    setOpenDeleteDialog(true);
  };

  // Fonction pour ajouter une notification
  const addNotification = (type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => {
    const newNotification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Fonction pour marquer une notification comme lue
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Fonction pour simuler le suivi de la demande
  const simulateRequestTracking = (type: 'deactivate' | 'delete') => {
    const requestId = `REQ-${Date.now()}`;
    const submittedAt = new Date();
    
    setRequestStatus({
      type,
      status: 'pending',
      requestId,
      submittedAt
    });

    // Notification immédiate
    addNotification('success', 'Demande envoyée', `Votre demande de ${type === 'deactivate' ? 'désactivation' : 'suppression'} a été envoyée avec succès.`);

    // Simulation du processus de suivi
    setTimeout(() => {
      setRequestStatus(prev => ({ ...prev, status: 'reviewing' }));
      addNotification('info', 'Demande en cours d\'examen', 'L\'équipe Kollecta examine votre demande.');
    }, 3000);

    setTimeout(() => {
      setRequestStatus(prev => ({ ...prev, status: 'approved' }));
      addNotification('success', 'Demande approuvée', `Votre demande de ${type === 'deactivate' ? 'désactivation' : 'suppression'} a été approuvée.`);
    }, 8000);
  };

  const confirmDeactivateAccount = async () => {
    if (!deactivatePassword) {
      setMessage({ type: 'error', text: 'Veuillez entrer votre mot de passe pour confirmer la désactivation' });
      return;
    }

    setLoading(true);
    try {
      // Créer la demande de désactivation
      const request = await accountService.submitAccountRequest({
        userId: user?.id || '',
        email: user?.email || '',
        requestType: 'deactivation',
        reason: 'Demande de désactivation temporaire du compte'
      }, authToken || undefined);

      console.log('✅ Demande de désactivation créée:', request);
      
      // Fermer la modal de désactivation
      setOpenDeactivateDialog(false);
      setDeactivatePassword('');
      
      // 🎯 DÉSACTIVATION : Afficher le popup de confirmation (comme pour la suppression)
      setConfirmationType('deactivation');
      setShowConfirmation(true);

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la demande de désactivation:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erreur lors de l\'envoi de la demande de désactivation. Veuillez réessayer.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteAccount = async () => {
    console.log('🔍 Début de confirmDeleteAccount');
    console.log('📝 deleteConfirmation:', deleteConfirmation);
    console.log('🔑 deletePassword:', deletePassword ? 'Saisi' : 'Vide');
    console.log('⏳ loading:', loading);
    console.log('👤 User:', user);
    console.log('🔐 Token dans localStorage:', localStorage.getItem('token'));
    console.log('🔐 Token dans Redux:', authToken);

    if (deleteConfirmation !== 'SUPPRIMER') {
      console.log('❌ Confirmation textuelle incorrecte');
      setMessage({ type: 'error', text: 'Veuillez taper SUPPRIMER pour confirmer la suppression' });
      return;
    }

    if (!deletePassword) {
      console.log('❌ Mot de passe manquant');
      setMessage({ type: 'error', text: 'Veuillez entrer votre mot de passe pour confirmer la suppression' });
      return;
    }

    console.log('✅ Validation réussie, début de la suppression...');
    setLoading(true);
    
    try {
      // Créer la demande de suppression
      const request = await accountService.submitAccountRequest({
        userId: user?.id || '',
        email: user?.email || '',
        requestType: 'deletion',
        reason: 'Demande de suppression définitive du compte'
      }, authToken || undefined);

      console.log('✅ Demande de suppression créée:', request);
      
      // Fermer la modal de suppression
      setOpenDeleteDialog(false);
      setDeleteConfirmation('');
      setDeletePassword('');
      
      // Afficher la confirmation
      setConfirmationType('deletion');
      setShowConfirmation(true);

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la demande de suppression:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erreur lors de l\'envoi de la demande de suppression. Veuillez réessayer.' 
      });
    } finally {
      console.log('🏁 Fin de la fonction confirmDeleteAccount');
      setLoading(false);
    }
  };

  // Fonction pour gérer la fermeture de la confirmation et la déconnexion
  const handleConfirmationClose = async () => {
    setShowConfirmation(false);
    
    try {
      // Déconnecter l'utilisateur
      await accountService.logoutAfterRequest();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Forcer la redirection
      navigate('/login');
    }
  };

  const getLanguageLabel = (value: string) => {
    return languageOptions.find(option => option.value === value)?.label || 'Français (FR)';
  };

  const clearMessage = () => {
    setMessage(null);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(clearMessage, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="main-container" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      paddingTop: '96px'
    }}>
      <div className="settings-container">
        {/* Header avec notifications */}
        <div className="settings-header">
          <div className="header-content">
            <h1 className="settings-title">Paramètres</h1>
            <p className="settings-subtitle">
              Gérez vos informations personnelles, préférences et paramètres de sécurité
            </p>
          </div>
          
          {/* Bouton notifications */}
          <div className="notifications-button-container">
            <button 
              className="notifications-button"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Voir les notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {/* Dropdown des notifications */}
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button 
                    className="close-notifications"
                    onClick={() => setShowNotifications(false)}
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <Bell className="w-8 h-8 text-gray-400" />
                    <p>Aucune notification</p>
                  </div>
                ) : (
                  <div className="notifications-list">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="notification-icon">
                          {notification.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                          {notification.type === 'info' && <Info className="w-4 h-4" />}
                          {notification.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                          {notification.type === 'error' && <XCircle className="w-4 h-4" />}
                        </div>
                        <div className="notification-content">
                          <h4 className="notification-title">{notification.title}</h4>
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">
                            {notification.timestamp.toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        {!notification.read && <div className="unread-indicator" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Message d'alerte */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? (
              <CheckCircle className="message-icon" />
            ) : (
              <XCircle className="message-icon" />
            )}
            {message.text}
          </div>
        )}

        {/* Statut de la demande en cours */}
        {requestStatus.type && requestStatus.status && (
          <div className="request-status-card">
            <div className="status-header">
              <div className="status-icon">
                {requestStatus.status === 'pending' && <Clock className="w-5 h-5" />}
                {requestStatus.status === 'reviewing' && <Users className="w-5 h-5" />}
                {requestStatus.status === 'approved' && <CheckCircle2 className="w-5 h-5" />}
                {requestStatus.status === 'rejected' && <XCircle className="w-5 h-5" />}
              </div>
              <div className="status-info">
                <h3 className="status-title">
                  Demande de {requestStatus.type === 'deactivate' ? 'désactivation' : 'suppression'}
                </h3>
                <p className="status-description">
                  {requestStatus.status === 'pending' && 'Votre demande a été envoyée et est en attente de traitement'}
                  {requestStatus.status === 'reviewing' && 'L\'équipe Kollecta examine votre demande'}
                  {requestStatus.status === 'approved' && 'Votre demande a été approuvée'}
                  {requestStatus.status === 'rejected' && 'Votre demande a été rejetée'}
                </p>
                <div className="status-details">
                  <span className="request-id">ID: {requestStatus.requestId}</span>
                  <span className="submitted-at">
                    Envoyée le {requestStatus.submittedAt?.toLocaleDateString('fr-FR')} à {requestStatus.submittedAt?.toLocaleTimeString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="status-progress">
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${requestStatus.status}`}
                  style={{
                    width: requestStatus.status === 'pending' ? '25%' :
                           requestStatus.status === 'reviewing' ? '75%' :
                           requestStatus.status === 'approved' ? '100%' : '100%'
                  }}
                />
              </div>
              <div className="progress-steps">
                <span className={`step ${requestStatus.status === 'pending' || requestStatus.status === 'reviewing' || requestStatus.status === 'approved' ? 'completed' : ''}`}>
                  Envoyée
                </span>
                <span className={`step ${requestStatus.status === 'reviewing' || requestStatus.status === 'approved' ? 'completed' : ''}`}>
                  En cours d'examen
                </span>
                <span className={`step ${requestStatus.status === 'approved' ? 'completed' : ''}`}>
                  Traitée
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tabs-container">
          <div className="tabs-list">
            <button
              onClick={() => setActiveTab('compte')}
              className={`tab-button ${activeTab === 'compte' ? 'active' : ''}`}
            >
              Compte
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('securite')}
              className={`tab-button ${activeTab === 'securite' ? 'active' : ''}`}
            >
              Sécurité
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-card">
          {activeTab === 'compte' && (
            <div className="content-padding">
              <div className="settings-sections">
                {/* Profile Photo Section */}
                <div className="profile-photo-section">
                  <h3 className="section-title">Photo de profil</h3>
                  <div className="profile-photo-content">
                    <div className="profile-photo">
                      <img 
                        src={profileData?.profilePicture || undefined} 
                        alt="Profile" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-medium hidden">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    </div>
                    <div className="photo-buttons">
                      <button className="btn-secondary">
                        Changer
                      </button>
                      <button className="btn-danger">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Name Section */}
                <div className={`setting-item ${editMode === 'name' ? 'editing' : ''}`}>
                  <div className="setting-content">
                    <div className="setting-info">
                      <div className="setting-label">
                        <div className="icon-wrapper" title="Informations personnelles de base">
                          <User className="w-4 h-4" />
                        </div>
                        Nom complet
                      </div>
                      <div className="setting-value">
                        {editMode === 'name' ? (
                          <div className="form-row">
                            <div className="form-group">
                              <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                placeholder="Prénom"
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                placeholder="Nom"
                              />
                            </div>
                          </div>
                        ) : (
                          `${user?.firstName || 'Non défini'} ${user?.lastName || 'Non défini'}`
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="setting-actions">
                    {editMode === 'name' ? (
                      <div className="button-group">
                        <button 
                          className="btn-primary"
                          onClick={() => handleSave('name')}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sauvegarder'}
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={handleCancel}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn-secondary"
                        onClick={() => handleEdit('name')}
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                </div>

                {/* Email Section */}
                <div className={`setting-item ${editMode === 'email' ? 'editing' : ''}`}>
                  <div className="setting-content">
                    <div className="setting-info">
                      <div className="setting-label">
                        <div className="icon-wrapper" title="Adresse email de votre compte">
                          <Mail className="w-4 h-4" />
                        </div>
                        Adresse e-mail
                      </div>
                      <div className="setting-value">
                        {editMode === 'email' ? (
                          <div className="space-y-3">
                            <div className="form-group">
                              <input
                                type="email"
                                value={emailChangeData.newEmail}
                                onChange={(e) => setEmailChangeData(prev => ({ ...prev, newEmail: e.target.value }))}
                                placeholder="Nouvel email"
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="password"
                                value={emailChangeData.password}
                                onChange={(e) => setEmailChangeData(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Mot de passe actuel"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span>{user?.email}</span>
                            {user?.isVerified ? (
                              <span className="status-badge verified">✓ Vérifié</span>
                            ) : (
                              <span className="status-badge unverified">⚠ Non vérifié</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Info className="info-icon" />
                  </div>
                  <div className="setting-actions">
                    {editMode === 'email' ? (
                      <div className="button-group">
                        <button 
                          className="btn-primary"
                          onClick={handleEmailChange}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sauvegarder'}
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={handleCancel}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn-secondary"
                        onClick={() => handleEdit('email')}
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                </div>

                {/* Phone Section */}
                <div className={`setting-item ${editMode === 'phone' ? 'editing' : ''}`}>
                  <div className="setting-content">
                    <div className="setting-info">
                      <div className="setting-label">
                        <div className="icon-wrapper" title="Numéro de téléphone de contact">
                          <Phone className="w-4 h-4" />
                        </div>
                        Numéro de téléphone
                      </div>
                      <div className="setting-value">
                        {editMode === 'phone' ? (
                          <div className="form-group">
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="Numéro de téléphone"
                            />
                          </div>
                        ) : (
                          formData.phone || 'Non défini'
                        )}
                      </div>
                    </div>
                    <Info className="info-icon" />
                  </div>
                  <div className="setting-actions">
                    {editMode === 'phone' ? (
                      <div className="button-group">
                        <button 
                          className="btn-primary"
                          onClick={() => handleSave('phone')}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sauvegarder'}
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={handleCancel}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn-secondary"
                        onClick={() => handleEdit('phone')}
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                </div>

                {/* Birthday Section */}
                <div className={`setting-item ${editMode === 'birthday' ? 'editing' : ''}`}>
                  <div className="setting-content">
                    <div className="setting-info">
                      <div className="setting-label">
                        <div className="icon-wrapper" title="Date de naissance pour personnalisation">
                          <Calendar className="w-4 h-4" />
                        </div>
                        Date de naissance
                      </div>
                      <div className="setting-value">
                        {editMode === 'birthday' ? (
                          <div className="form-group">
                            <input
                              type="date"
                              value={formData.birthday}
                              onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
                            />
                          </div>
                        ) : (
                          formData.birthday ? new Date(formData.birthday).toLocaleDateString('fr-FR') : 'Non défini'
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="setting-actions">
                    {editMode === 'birthday' ? (
                      <div className="button-group">
                        <button 
                          className="btn-primary"
                          onClick={() => handleSave('birthday')}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sauvegarder'}
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={handleCancel}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn-secondary"
                        onClick={() => handleEdit('birthday')}
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                </div>

                {/* Language Section */}
                <div className={`setting-item ${editMode === 'language' ? 'editing' : ''}`}>
                  <div className="setting-content">
                    <div className="setting-info">
                      <div className="setting-label">
                        <div className="icon-wrapper" title="Langue d'affichage de l'interface">
                          <Globe className="w-4 h-4" />
                        </div>
                        Langue de communication
                      </div>
                      <div className="setting-value">
                        {editMode === 'language' ? (
                          <div className="form-group">
                            <select
                              value={formData.language}
                              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                            >
                              {languageOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          getLanguageLabel(formData.language)
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="setting-actions">
                    {editMode === 'language' ? (
                      <div className="button-group">
                        <button 
                          className="btn-primary"
                          onClick={() => handleSave('language')}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sauvegarder'}
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={handleCancel}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn-secondary"
                        onClick={() => handleEdit('language')}
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Description Section */}
                <div className={`setting-item ${editMode === 'description' ? 'editing' : ''}`}>
                  <div className="setting-content">
                    <div className="setting-info">
                      <div className="setting-label">
                        <div className="icon-wrapper" title="Visibilité de votre profil public">
                          <User className="w-4 h-4" />
                        </div>
                        Description du profil
                      </div>
                      <div className="setting-value">
                        {editMode === 'description' ? (
                          <div className="form-group">
                            <textarea
                              value={formData.profileDescription}
                              onChange={(e) => setFormData(prev => ({ ...prev, profileDescription: e.target.value }))}
                              placeholder="Décrivez-vous en quelques mots..."
                              rows={3}
                            />
                          </div>
                        ) : (
                          formData.profileDescription || 'Aucune description'
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="setting-actions">
                    {editMode === 'description' ? (
                      <div className="button-group">
                        <button 
                          className="btn-primary"
                          onClick={() => handleSave('description')}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sauvegarder'}
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={handleCancel}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn-secondary"
                        onClick={() => handleEdit('description')}
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile URL Section */}
                <div className={`setting-item ${editMode === 'url' ? 'editing' : ''}`}>
                  <div className="setting-content">
                    <div className="setting-info">
                      <div className="setting-label">
                        <div className="icon-wrapper" title="URL personnalisée de votre profil">
                          <Globe className="w-4 h-4" />
                        </div>
                        URL du profil
                      </div>
                      <div className="setting-value">
                        {editMode === 'url' ? (
                          <div className="form-group">
                            <input
                              type="url"
                              value={formData.profileUrl}
                              onChange={(e) => setFormData(prev => ({ ...prev, profileUrl: e.target.value }))}
                              placeholder="https://votre-site.com"
                            />
                          </div>
                        ) : (
                          formData.profileUrl || 'Non défini'
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="setting-actions">
                    {editMode === 'url' ? (
                      <div className="button-group">
                        <button 
                          className="btn-primary"
                          onClick={() => handleSave('url')}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sauvegarder'}
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={handleCancel}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn-secondary"
                        onClick={() => handleEdit('url')}
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                </div>

                {/* Account Actions Section */}
                <div className="account-actions-section">
                  <h3 className="account-actions-title">Actions sur le compte</h3>
                  
                  {/* Désactivation de compte */}
                  <div className="account-action-card">
                    <div className="account-action-header">
                      <div className="account-action-icon deactivate">
                        <PowerOff className="w-5 h-5" />
                      </div>
                      <h4 className="account-action-title">Désactiver le compte</h4>
                    </div>
                    <p className="account-action-description">
                      Désactivez temporairement votre compte. Vous pourrez le réactiver plus tard en contactant notre équipe. 
                      Vos données et cagnottes seront préservées.
                    </p>
                    <button 
                      className="account-action-button deactivate"
                      onClick={handleDeactivateAccount}
                      disabled={loading}
                    >
                      <PowerOff className="w-4 h-4" />
                      Désactiver le compte
                    </button>
                  </div>

                  {/* Suppression définitive */}
                  <div className="account-action-card">
                    <div className="account-action-header">
                      <div className="account-action-icon delete">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <h4 className="account-action-title">Supprimer définitivement le compte</h4>
                    </div>
                    <p className="account-action-description">
                      <strong>⚠️ Attention :</strong> Cette action est irréversible. Toutes vos données, cagnottes et activités 
                      seront définitivement supprimées de la plateforme.
                    </p>
                    <button 
                      className="account-action-button delete"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer définitivement
                    </button>
                  </div>

                  {/* Message d'équipe Kollecta */}
                  <div className="kollecta-team-message">
                    <h5>👥 Équipe Kollecta</h5>
                    <p>
                      Notre équipe examine chaque demande avec attention pour assurer la sécurité de tous nos utilisateurs. 
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications-content">
              <h3 className="notifications-title">Paramètres de notifications</h3>
              <p className="notifications-description">
                Configurez vos préférences de notifications pour rester informé de vos activités.
              </p>
              
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="notification-item">
                    <div className="notification-info">
                      <h4>
                        {key === 'emailNotifications' && 'Notifications par email'}
                        {key === 'pushNotifications' && 'Notifications push'}
                        {key === 'marketingEmails' && 'Emails marketing'}
                        {key === 'donationUpdates' && 'Mises à jour des dons'}
                      </h4>
                      <p>
                        {key === 'emailNotifications' && 'Recevoir des notifications par email'}
                        {key === 'pushNotifications' && 'Recevoir des notifications sur votre appareil'}
                        {key === 'marketingEmails' && 'Recevoir des offres et promotions'}
                        {key === 'donationUpdates' && 'Être informé des nouvelles donations'}
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'securite' && (
            <div className="security-content">
              <h3 className="security-title">Sécurité</h3>
              
              {/* Changement de mot de passe */}
              <div className="password-form">
                <h4 className="setting-label mb-3">
                  <div className="icon-wrapper" title="Sécurité et authentification">
                    <Lock className="w-4 h-4" />
                  </div>
                  Changer le mot de passe
                </h4>
                <div className="space-y-3">
                  <div className="form-group">
                    <label>Mot de passe actuel</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mot de passe actuel"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Nouveau mot de passe</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nouveau mot de passe"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Confirmer le nouveau mot de passe</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirmer le nouveau mot de passe"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  
                  <button
                    className="btn-primary w-full"
                    onClick={handlePasswordChange}
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Changer le mot de passe'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog de désactivation de compte */}
      {openDeactivateDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <div className="modal-header-icon">
                <PowerOff className="w-6 h-6" />
              </div>
              <h3>Désactiver le compte</h3>
              <p>Votre compte sera temporairement désactivé et récupérable</p>
            </div>

            {/* Contenu */}
            <div className="modal-body">
              <div className="modal-section">
                <h4>
                  <AlertCircle className="modal-section-icon" />
                  Désactivation temporaire
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  En désactivant votre compte, vous ne pourrez plus vous connecter temporairement. 
                  Vos données et cagnottes seront préservées. Vous pourrez réactiver votre compte 
                  en contactant notre équipe support.
                </p>
              </div>

              {/* Mot de passe */}
              <div className="modal-section">
                <h4>
                  <Lock className="modal-section-icon" />
                  Confirmation par mot de passe
                </h4>
                <div className="relative">
                  <input
                    type={showDeactivatePassword ? 'text' : 'password'}
                    value={deactivatePassword}
                    onChange={(e) => setDeactivatePassword(e.target.value)}
                    className="modal-input"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowDeactivatePassword(!showDeactivatePassword)}
                    title={showDeactivatePassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showDeactivatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Message d'équipe */}
              <div className="kollecta-team-message">
                <h5>👥 Équipe Kollecta</h5>
                <p>
                  Notre équipe va examiner votre demande de désactivation et vous accompagner dans ce processus.
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="modal-footer">
              <button 
                className="modal-btn modal-btn-secondary"
                onClick={() => {
                  setOpenDeactivateDialog(false);
                  setDeactivatePassword('');
                }}
              >
                Annuler
              </button>
              <button 
                className="modal-btn modal-btn-primary"
                onClick={confirmDeactivateAccount}
                disabled={loading || !deactivatePassword}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Désactivation...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <PowerOff className="w-4 h-4 mr-2" />
                    Désactiver
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmation de suppression */}
      {openDeleteDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <div className="modal-header-icon">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3>Supprimer définitivement le compte</h3>
              <p>Cette action est irréversible et nécessite votre mot de passe</p>
            </div>

            {/* Contenu */}
            <div className="modal-body">
              <div className="modal-section">
                <h4>
                  <AlertCircle className="modal-section-icon" />
                  Suppression définitive
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  <strong>⚠️ Attention :</strong> En supprimant définitivement votre compte, vous perdrez 
                  définitivement l'accès à toutes vos données, cagnottes et activités. 
                  Cette action ne peut pas être annulée.
                </p>
              </div>

              {/* Confirmation textuelle */}
              <div className="modal-section">
                <h4>
                  <Shield className="modal-section-icon" />
                  Confirmation textuelle
                </h4>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <span className="text-red-600">*</span> Tapez <strong className="bg-red-50 text-red-700 px-2 py-1 rounded">SUPPRIMER</strong> pour confirmer :
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className={`modal-input ${deleteConfirmation === 'SUPPRIMER' ? 'border-green-500 bg-green-50' : 'border-red-300 bg-red-50'}`}
                  placeholder="SUPPRIMER"
                />
                <div className={`validation-message ${deleteConfirmation === 'SUPPRIMER' ? 'success' : 'error'}`}>
                  {deleteConfirmation === 'SUPPRIMER' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Confirmation textuelle validée
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Tapez exactement "SUPPRIMER"
                    </>
                  )}
                </div>
              </div>

              {/* Mot de passe */}
              <div className="modal-section">
                <h4>
                  <Lock className="modal-section-icon" />
                  Confirmation par mot de passe
                </h4>
                <div className="relative">
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className={`modal-input ${deletePassword ? 'border-green-500 bg-green-50' : 'border-red-300 bg-red-50'}`}
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    title={showDeletePassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className={`validation-message ${deletePassword ? 'success' : 'error'}`}>
                  {deletePassword ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Mot de passe saisi
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Mot de passe requis
                    </>
                  )}
                </div>
              </div>

              {/* Message d'équipe */}
              <div className="kollecta-team-message">
                <h5>👥 Équipe Kollecta</h5>
                <p>
                  Notre équipe va examiner votre demande de suppression définitive et vous accompagner dans ce processus.
                </p>
              </div>

              {/* Indicateur d'état de validation */}
              <div className="validation-status">
                <h4>État de validation :</h4>
                <div className="space-y-2">
                  <div className="validation-row">
                    <span className="validation-label">Confirmation textuelle :</span>
                    <span className={`validation-status-badge ${
                      deleteConfirmation === 'SUPPRIMER' ? 'success' : 'error'
                    }`}>
                      {deleteConfirmation === 'SUPPRIMER' ? 'Validé' : 'En attente'}
                    </span>
                  </div>
                  <div className="validation-row">
                    <span className="validation-label">Mot de passe :</span>
                    <span className={`validation-status-badge ${
                      deletePassword ? 'success' : 'error'
                    }`}>
                      {deletePassword ? 'Saisi' : 'Requis'}
                    </span>
                  </div>
                  <div className="validation-row">
                    <span className="validation-label">État de chargement :</span>
                    <span className={`validation-status-badge ${
                      !loading ? 'ready' : 'warning'
                    }`}>
                      {loading ? 'En cours...' : 'Prêt'}
                    </span>
                  </div>
                  <div className="validation-row">
                    <span className="validation-label font-semibold">Bouton de suppression :</span>
                    <span className={`validation-status-badge ${
                      (deleteConfirmation === 'SUPPRIMER' && deletePassword && !loading)
                        ? 'success' : 'error'
                    }`}>
                      {(deleteConfirmation === 'SUPPRIMER' && deletePassword && !loading) ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="modal-footer">
              <button 
                className="modal-btn modal-btn-secondary"
                onClick={() => {
                  setOpenDeleteDialog(false);
                  setDeleteConfirmation('');
                  setDeletePassword('');
                }}
              >
                Annuler
              </button>
              <button 
                className="modal-btn modal-btn-primary"
                onClick={confirmDeleteAccount}
                disabled={loading || deleteConfirmation !== 'SUPPRIMER' || !deletePassword}
                title={`Debug: loading=${loading}, confirmation="${deleteConfirmation}", password=${deletePassword ? 'filled' : 'empty'}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Suppression...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer définitivement
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Composant de confirmation - Pour la suppression ET la désactivation */}
      {showConfirmation && (
        <AccountRequestConfirmation
          requestType={confirmationType}
          onClose={handleConfirmationClose}
        />
      )}
    </div>
  );
};

export default Settings; 