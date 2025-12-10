import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Web as WebIcon,
  Storage as DatabaseIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import adminService from '../../features/admin/adminService';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    timezone: string;
    language: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    twoFactorRequired: boolean;
    passwordMinLength: number;
    passwordComplexity: boolean;
    ipWhitelist: string[];
    sslRequired: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    adminEmail: string;
    adminPhone: string;
    notificationDelay: number;
  };
  performance: {
    cacheEnabled: boolean;
    cacheTimeout: number;
    maxFileSize: number;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    rateLimit: number;
  };
  database: {
    connectionPool: number;
    queryTimeout: number;
    backupEnabled: boolean;
    backupFrequency: number;
    backupRetention: number;
  };
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string>('');

  // 📋 Charger les paramètres depuis l'API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await adminService.getSystemSettings();
        
        if (response.success) {
          setSettings(response.data as SystemSettings);
        } else {
          console.error('Erreur lors du chargement des paramètres');
          // Utiliser les valeurs par défaut en cas d'erreur
          setSettings({
            general: {
              siteName: 'Kollecta',
              siteDescription: 'Plateforme de collecte de fonds collaborative',
            maintenanceMode: false,
            timezone: 'Africa/Tunis',
              language: 'fr',
            },
            security: {
              sessionTimeout: 30,
              maxLoginAttempts: 5,
              twoFactorRequired: false,
              passwordMinLength: 8,
              passwordComplexity: true,
              ipWhitelist: [],
              sslRequired: true,
            },
            notifications: {
              emailEnabled: true,
              smsEnabled: false,
              pushEnabled: true,
              adminEmail: 'admin@kollecta.com',
              adminPhone: '+33123456789',
              notificationDelay: 5,
            },
            performance: {
              cacheEnabled: true,
              cacheTimeout: 3600,
              maxFileSize: 10,
              compressionEnabled: true,
              cdnEnabled: false,
              rateLimit: 100,
            },
            database: {
              connectionPool: 20,
              queryTimeout: 30,
              backupEnabled: true,
              backupFrequency: 24,
              backupRetention: 30,
            },
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        // Utiliser les valeurs par défaut en cas d'erreur
        setSettings({
          general: {
            siteName: 'Kollecta',
            siteDescription: 'Plateforme de collecte de fonds collaborative',
            maintenanceMode: false,
            timezone: 'Europe/Paris',
            language: 'fr',
          },
          security: {
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            twoFactorRequired: false,
            passwordMinLength: 8,
            passwordComplexity: true,
            ipWhitelist: [],
            sslRequired: true,
          },
          notifications: {
            emailEnabled: true,
            smsEnabled: false,
            pushEnabled: true,
            adminEmail: 'admin@kollecta.com',
            adminPhone: '+33123456789',
            notificationDelay: 5,
          },
          performance: {
            cacheEnabled: true,
            cacheTimeout: 3600,
            maxFileSize: 10,
            compressionEnabled: true,
            cdnEnabled: false,
            rateLimit: 100,
          },
          database: {
            connectionPool: 20,
            queryTimeout: 30,
            backupEnabled: true,
            backupFrequency: 24,
            backupRetention: 30,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = (section: keyof SystemSettings, key: string, value: any) => {
    if (!settings) return;

    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await adminService.updateSystemSettings(settings);
      
      if (response.success) {
        setHasChanges(false);
        console.log('✅ Paramètres sauvegardés avec succès');
        // Optionnel: afficher une notification de succès
        alert('Paramètres sauvegardés avec succès');
      } else {
        console.error('Erreur lors de la sauvegarde:', response);
        alert('Erreur lors de la sauvegarde des paramètres');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfirmAction('reset');
    setConfirmDialog(true);
  };

  const handleMaintenanceToggle = () => {
    setConfirmAction('maintenance');
    setConfirmDialog(true);
  };

  const executeConfirmAction = () => {
    if (confirmAction === 'reset' && settings) {
      // Réinitialiser les paramètres
      window.location.reload();
    } else if (confirmAction === 'maintenance' && settings) {
      // Basculer le mode maintenance
      handleSettingChange('general', 'maintenanceMode', !settings.general.maintenanceMode);
    }
    setConfirmDialog(false);
    setConfirmAction('');
  };

  if (loading || !settings) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* 🎯 En-tête avec actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          ⚙️ Paramètres Système
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
          >
            Réinitialiser
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </Box>
      </Box>

      {/* 🚨 Alertes importantes */}
      {settings.general.maintenanceMode && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            🚧 Mode maintenance activé
          </Typography>
          <Typography variant="body2">
            Le site est actuellement en mode maintenance. Seuls les administrateurs peuvent y accéder.
          </Typography>
        </Alert>
      )}

      {hasChanges && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            ⚠️ Des modifications ont été apportées. N'oubliez pas de sauvegarder.
          </Typography>
        </Alert>
      )}

      {/* 📋 Paramètres par sections */}
      <Grid container spacing={3}>
        {/* 🏠 Paramètres Généraux */}
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Paramètres Généraux
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom du site"
                    value={settings.general.siteName}
                    onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description du site"
                    value={settings.general.siteDescription}
                    onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Fuseau horaire</InputLabel>
                    <Select
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                      label="Fuseau horaire"
                    >
                      <MenuItem value="Africa/Tunis">Africa/Tunis (Tunisie)</MenuItem>
                      <MenuItem value="Europe/Paris">Europe/Paris (France)</MenuItem>
                      <MenuItem value="Europe/London">Europe/London (Royaume-Uni)</MenuItem>
                      <MenuItem value="Europe/Berlin">Europe/Berlin (Allemagne)</MenuItem>
                      <MenuItem value="Europe/Madrid">Europe/Madrid (Espagne)</MenuItem>
                      <MenuItem value="Europe/Rome">Europe/Rome (Italie)</MenuItem>
                      <MenuItem value="America/New_York">America/New_York (États-Unis - Est)</MenuItem>
                      <MenuItem value="America/Los_Angeles">America/Los_Angeles (États-Unis - Ouest)</MenuItem>
                      <MenuItem value="America/Toronto">America/Toronto (Canada)</MenuItem>
                      <MenuItem value="Asia/Dubai">Asia/Dubai (Émirats arabes unis)</MenuItem>
                      <MenuItem value="Asia/Riyadh">Asia/Riyadh (Arabie saoudite)</MenuItem>
                      <MenuItem value="Asia/Tokyo">Asia/Tokyo (Japon)</MenuItem>
                      <MenuItem value="Asia/Shanghai">Asia/Shanghai (Chine)</MenuItem>
                      <MenuItem value="Australia/Sydney">Australia/Sydney (Australie)</MenuItem>
                      <MenuItem value="UTC">UTC (Temps universel)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Langue</InputLabel>
                    <Select
                      value={settings.general.language}
                      onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                      label="Langue"
                    >
                      <MenuItem value="fr">Français</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="ar">العربية</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.general.maintenanceMode}
                        onChange={handleMaintenanceToggle}
                        color="warning"
                      />
                    }
                    label="Mode maintenance"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Active le mode maintenance pour tous les utilisateurs non-admin
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* 🔐 Sécurité */}
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="error" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Sécurité
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Timeout de session (min)"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    variant="outlined"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">min</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tentatives de connexion max"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Longueur min du mot de passe"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.twoFactorRequired}
                        onChange={(e) => handleSettingChange('security', 'twoFactorRequired', e.target.checked)}
                        color="error"
                      />
                    }
                    label="2FA obligatoire pour les admins"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.passwordComplexity}
                        onChange={(e) => handleSettingChange('security', 'passwordComplexity', e.target.checked)}
                        color="error"
                      />
                    }
                    label="Complexité des mots de passe"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.sslRequired}
                        onChange={(e) => handleSettingChange('security', 'sslRequired', e.target.checked)}
                        color="error"
                      />
                    }
                    label="SSL obligatoire"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* 📧 Notifications */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon color="info" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email administrateur"
                    value={settings.notifications.adminEmail}
                    onChange={(e) => handleSettingChange('notifications', 'adminEmail', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Téléphone administrateur"
                    value={settings.notifications.adminPhone}
                    onChange={(e) => handleSettingChange('notifications', 'adminPhone', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.emailEnabled}
                        onChange={(e) => handleSettingChange('notifications', 'emailEnabled', e.target.checked)}
                        color="info"
                      />
                    }
                    label="Notifications par email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.smsEnabled}
                        onChange={(e) => handleSettingChange('notifications', 'smsEnabled', e.target.checked)}
                        color="info"
                      />
                    }
                    label="Notifications par SMS"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.pushEnabled}
                        onChange={(e) => handleSettingChange('notifications', 'pushEnabled', e.target.checked)}
                        color="info"
                      />
                    }
                    label="Notifications push"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Délai de notification: {settings.notifications.notificationDelay} secondes
                  </Typography>
                  <Slider
                    value={settings.notifications.notificationDelay}
                    onChange={(_, value) => handleSettingChange('notifications', 'notificationDelay', value)}
                    min={1}
                    max={60}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* 🚀 Performance */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Performance
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.performance.cacheEnabled}
                        onChange={(e) => handleSettingChange('performance', 'cacheEnabled', e.target.checked)}
                        color="success"
                      />
                    }
                    label="Cache activé"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Timeout du cache (sec)"
                    type="number"
                    value={settings.performance.cacheTimeout}
                    onChange={(e) => handleSettingChange('performance', 'cacheTimeout', parseInt(e.target.value))}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Taille max des fichiers (MB)"
                    type="number"
                    value={settings.performance.maxFileSize}
                    onChange={(e) => handleSettingChange('performance', 'maxFileSize', parseInt(e.target.value))}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.performance.compressionEnabled}
                        onChange={(e) => handleSettingChange('performance', 'compressionEnabled', e.target.checked)}
                        color="success"
                      />
                    }
                    label="Compression activée"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.performance.cdnEnabled}
                        onChange={(e) => handleSettingChange('performance', 'cdnEnabled', e.target.checked)}
                        color="success"
                      />
                    }
                    label="CDN activé"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Limite de taux: {settings.performance.rateLimit} requêtes/min
                  </Typography>
                  <Slider
                    value={settings.performance.rateLimit}
                    onChange={(_, value) => handleSettingChange('performance', 'rateLimit', value)}
                    min={10}
                    max={1000}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* 🗄️ Base de données */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DatabaseIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Base de données
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Pool de connexions"
                    type="number"
                    value={settings.database.connectionPool}
                    onChange={(e) => handleSettingChange('database', 'connectionPool', parseInt(e.target.value))}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Timeout des requêtes (sec)"
                    type="number"
                    value={settings.database.queryTimeout}
                    onChange={(e) => handleSettingChange('database', 'queryTimeout', parseInt(e.target.value))}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.database.backupEnabled}
                        onChange={(e) => handleSettingChange('database', 'backupEnabled', e.target.checked)}
                        color="secondary"
                      />
                    }
                    label="Sauvegardes automatiques"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Fréquence des sauvegardes (h)"
                    type="number"
                    value={settings.database.backupFrequency}
                    onChange={(e) => handleSettingChange('database', 'backupFrequency', parseInt(e.target.value))}
                    variant="outlined"
                    disabled={!settings.database.backupEnabled}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Rétention des sauvegardes (j)"
                    type="number"
                    value={settings.database.backupRetention}
                    onChange={(e) => handleSettingChange('database', 'backupRetention', parseInt(e.target.value))}
                    variant="outlined"
                    disabled={!settings.database.backupEnabled}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* 🚨 Dialog de confirmation */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>
          {confirmAction === 'reset' ? 'Réinitialiser les paramètres' : 'Mode maintenance'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {confirmAction === 'reset' 
              ? 'Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ? Cette action est irréversible.'
              : `Êtes-vous sûr de vouloir ${settings.general.maintenanceMode ? 'désactiver' : 'activer'} le mode maintenance ?`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Annuler</Button>
          <Button 
            onClick={executeConfirmAction} 
            color={confirmAction === 'reset' ? 'error' : 'warning'}
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettings; 