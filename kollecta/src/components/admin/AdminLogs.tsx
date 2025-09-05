import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Campaign as CampaignIcon,
  Report as ReportIcon,
} from '@mui/icons-material';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SECURITY' | 'DEBUG';
  category: 'AUTH' | 'USER' | 'CAMPAIGN' | 'REPORT' | 'SYSTEM' | 'ADMIN';
  action: string;
  description: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  metadata?: Record<string, any>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [logDetailDialog, setLogDetailDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDebugLogs, setShowDebugLogs] = useState(false);

  // 🎯 Données de démonstration (à remplacer par l'API)
  useEffect(() => {
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: '2024-01-20T15:30:00Z',
        level: 'SECURITY',
        category: 'AUTH',
        action: 'LOGIN_SUCCESS',
        description: 'Connexion réussie pour l\'utilisateur admin',
        userId: 'admin-1',
        userName: 'Sawssen Yazidi',
        userEmail: 'sawssen.yazidi@sesame.com.tn',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess_12345',
        severity: 'LOW',
        metadata: {
          loginMethod: 'password',
          twoFactorEnabled: false,
        },
      },
      {
        id: '2',
        timestamp: '2024-01-20T15:25:00Z',
        level: 'WARNING',
        category: 'CAMPAIGN',
        action: 'CAMPAIGN_REJECTED',
        description: 'Campagne rejetée pour violation des règles',
        userId: 'user-123',
        userName: 'Marie Dubois',
        userEmail: 'marie.dubois@email.com',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        sessionId: 'sess_12346',
        severity: 'MEDIUM',
        metadata: {
          campaignId: 'camp_456',
          rejectionReason: 'Contenu inapproprié',
          moderatorId: 'admin-1',
        },
      },
      {
        id: '3',
        timestamp: '2024-01-20T15:20:00Z',
        level: 'ERROR',
        category: 'SYSTEM',
        action: 'DATABASE_CONNECTION_FAILED',
        description: 'Échec de connexion à la base de données',
        ipAddress: '192.168.1.1',
        userAgent: 'System Service',
        sessionId: 'sess_system',
        severity: 'HIGH',
        metadata: {
          errorCode: 'DB_CONN_001',
          retryAttempts: 3,
          lastSuccessfulConnection: '2024-01-20T15:15:00Z',
        },
      },
      {
        id: '4',
        timestamp: '2024-01-20T15:15:00Z',
        level: 'INFO',
        category: 'USER',
        action: 'PROFILE_UPDATED',
        description: 'Profil utilisateur mis à jour',
        userId: 'user-456',
        userName: 'Pierre Martin',
        userEmail: 'pierre.martin@email.com',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        sessionId: 'sess_12347',
        severity: 'LOW',
        metadata: {
          updatedFields: ['firstName', 'lastName', 'phone'],
          previousValues: {
            firstName: 'Pierre',
            lastName: 'Martin',
            phone: '+33123456789',
          },
        },
      },
      {
        id: '5',
        timestamp: '2024-01-20T15:10:00Z',
        level: 'SECURITY',
        category: 'AUTH',
        action: 'LOGIN_FAILED',
        description: 'Tentative de connexion échouée',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Linux x86_64) AppleWebKit/537.36',
        sessionId: 'sess_failed',
        severity: 'MEDIUM',
        metadata: {
          attemptedEmail: 'admin@hacker.com',
          failureReason: 'Invalid credentials',
          failedAttempts: 5,
        },
      },
      {
        id: '6',
        timestamp: '2024-01-20T15:05:00Z',
        level: 'DEBUG',
        category: 'SYSTEM',
        action: 'CACHE_REFRESH',
        description: 'Mise à jour du cache système',
        ipAddress: '192.168.1.1',
        userAgent: 'System Service',
        sessionId: 'sess_system',
        severity: 'LOW',
        metadata: {
          cacheType: 'user_sessions',
          itemsRefreshed: 1250,
          duration: '45ms',
        },
      },
      {
        id: '7',
        timestamp: '2024-01-20T15:00:00Z',
        level: 'INFO',
        category: 'REPORT',
        action: 'REPORT_RESOLVED',
        description: 'Signalement résolu par l\'administrateur',
        userId: 'admin-1',
        userName: 'Sawssen Yazidi',
        userEmail: 'sawssen.yazidi@sesame.com.tn',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        sessionId: 'sess_12345',
        severity: 'LOW',
        metadata: {
          reportId: 'rep_789',
          resolution: 'Spam confirmé, campagne suspendue',
          resolutionTime: '2h 15m',
        },
      },
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    setLoading(false);
  }, []);

  // 🔍 Filtrage des logs
  useEffect(() => {
    let filtered = logs;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.userName && log.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.userEmail && log.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.ipAddress.includes(searchTerm)
      );
    }

    // Filtre par niveau
    if (levelFilter !== 'ALL') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    // Filtre par catégorie
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    // Filtre par sévérité
    if (severityFilter !== 'ALL') {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    // Filtre par date
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    // Filtre les logs de debug si nécessaire
    if (!showDebugLogs) {
      filtered = filtered.filter(log => log.level !== 'DEBUG');
    }

    setFilteredLogs(filtered);
    setPage(0);
  }, [logs, searchTerm, levelFilter, categoryFilter, severityFilter, dateRange, showDebugLogs]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleLevelFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLevelFilter(event.target.value);
  };

  const handleCategoryFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFilter(event.target.value);
  };

  const handleSeverityFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeverityFilter(event.target.value);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, log: LogEntry) => {
    setAnchorEl(event.currentTarget);
    setSelectedLog(log);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedLog(null);
  };

  const openLogDetail = () => {
    setLogDetailDialog(true);
    handleActionClose();
  };

  const closeLogDetail = () => {
    setLogDetailDialog(false);
    setSelectedLog(null);
  };

  const downloadLogs = () => {
    // 🎯 Ici, vous implémenterez l'export des logs
    console.log('Export des logs...');
    const csvContent = filteredLogs.map(log => 
      `${log.timestamp},${log.level},${log.category},${log.action},${log.description},${log.ipAddress}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'error';
      case 'WARNING': return 'warning';
      case 'SECURITY': return 'error';
      case 'INFO': return 'info';
      case 'DEBUG': return 'default';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AUTH': return <SecurityIcon />;
      case 'USER': return <PersonIcon />;
      case 'CAMPAIGN': return <CampaignIcon />;
      case 'REPORT': return <ReportIcon />;
      case 'SYSTEM': return <ScheduleIcon />;
      case 'ADMIN': return <SecurityIcon />;
      default: return <InfoIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getLevelCount = (level: string) => {
    return logs.filter(log => log.level === level).length;
  };

  const getSeverityCount = (severity: string) => {
    return logs.filter(log => log.severity === severity).length;
  };

  return (
    <Box>
      {/* 🎯 En-tête avec actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          📋 Logs Système
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            }
            label="Actualisation auto"
          />
          <FormControlLabel
            control={
              <Switch
                checked={showDebugLogs}
                onChange={(e) => setShowDebugLogs(e.target.checked)}
              />
            }
            label="Logs Debug"
          />
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadLogs}
          >
            Exporter
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {/* 📊 Statistiques rapides */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ef4444', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {getLevelCount('ERROR') + getLevelCount('SECURITY')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Erreurs & Sécurité
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f59e0b', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {getLevelCount('WARNING')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Avertissements
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#3b82f6', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {getLevelCount('INFO')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Informations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#10b981', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {logs.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total des logs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🔍 Filtres et recherche */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Rechercher dans les logs"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Niveau</InputLabel>
              <Select
                value={levelFilter}
                onChange={handleLevelFilterChange}
                label="Niveau"
              >
                <MenuItem value="ALL">Tous</MenuItem>
                <MenuItem value="ERROR">Erreur</MenuItem>
                <MenuItem value="WARNING">Avertissement</MenuItem>
                <MenuItem value="SECURITY">Sécurité</MenuItem>
                <MenuItem value="INFO">Information</MenuItem>
                <MenuItem value="DEBUG">Debug</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
                label="Catégorie"
              >
                <MenuItem value="ALL">Toutes</MenuItem>
                <MenuItem value="AUTH">Authentification</MenuItem>
                <MenuItem value="USER">Utilisateur</MenuItem>
                <MenuItem value="CAMPAIGN">Campagne</MenuItem>
                <MenuItem value="REPORT">Signalement</MenuItem>
                <MenuItem value="SYSTEM">Système</MenuItem>
                <MenuItem value="ADMIN">Administration</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sévérité</InputLabel>
              <Select
                value={severityFilter}
                onChange={handleSeverityFilterChange}
                label="Sévérité"
              >
                <MenuItem value="ALL">Toutes</MenuItem>
                <MenuItem value="CRITICAL">Critique</MenuItem>
                <MenuItem value="HIGH">Haute</MenuItem>
                <MenuItem value="MEDIUM">Moyenne</MenuItem>
                <MenuItem value="LOW">Basse</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Du"
              variant="outlined"
              size="small"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Au"
              variant="outlined"
              size="small"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 📊 Statistiques des filtres */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredLogs.length} log(s) trouvé(s) sur {logs.length} total
        </Typography>
      </Box>

      {/* 📋 Tableau des logs */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Niveau</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Catégorie</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>IP</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Sévérité</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {formatDate(log.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.level}
                        color={getLevelColor(log.level) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getCategoryIcon(log.category)}
                        <Typography variant="body2">
                          {log.category}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {log.action}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {log.description.length > 60 
                          ? `${log.description.substring(0, 60)}...` 
                          : log.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {log.userName ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                            {log.userName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                              {log.userName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {log.userEmail}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Système
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {log.ipAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.severity}
                        color={getSeverityColor(log.severity) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionClick(e, log)}
                        >
                          <MoreIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 📄 Pagination */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      </Paper>

      {/* 🎛️ Menu des actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={openLogDetail}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voir les détails</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => console.log('Copier dans le presse-papiers')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copier l'ID</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => console.log('Marquer comme important')}>
          <ListItemIcon>
            <WarningIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Marquer important</ListItemText>
        </MenuItem>
      </Menu>

      {/* 📋 Dialog de détails du log */}
      <Dialog open={logDetailDialog} onClose={closeLogDetail} maxWidth="md" fullWidth>
        <DialogTitle>
          📋 Détails du Log #{selectedLog?.id}
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Informations de base
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Timestamp
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {formatDate(selectedLog.timestamp)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Niveau
                    </Typography>
                    <Chip
                      label={selectedLog.level}
                      color={getLevelColor(selectedLog.level) as any}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Catégorie
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getCategoryIcon(selectedLog.category)}
                      <Typography variant="body1">{selectedLog.category}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Action
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {selectedLog.action}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Contexte
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sévérité
                    </Typography>
                    <Chip
                      label={selectedLog.severity}
                      color={getSeverityColor(selectedLog.severity) as any}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Adresse IP
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {selectedLog.ipAddress}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Session ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {selectedLog.sessionId}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      User Agent
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
                      {selectedLog.userAgent}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedLog.description}
              </Typography>

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Métadonnées
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <pre style={{ margin: 0, fontSize: '0.875rem', overflow: 'auto' }}>
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </Paper>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogDetail}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLogs; 