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
import adminService from '../../features/admin/adminService';

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
  const [totalLogs, setTotalLogs] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [useDateFilter, setUseDateFilter] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [logDetailDialog, setLogDetailDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDebugLogs, setShowDebugLogs] = useState(false);
  const [importantLogs, setImportantLogs] = useState<Set<string>>(new Set());

  // 📋 Charger les logs depuis l'API
  const loadLogs = async () => {
    try {
      setLoading(true);
      console.log('📋 Chargement des logs...', {
        page: page + 1,
        limit: rowsPerPage,
        levelFilter,
        categoryFilter,
        dateRange
      });

      // Mapper CAMPAIGN vers CAGNOTTE pour le backend
      let backendCategory = categoryFilter;
      if (categoryFilter === 'CAMPAIGN') {
        backendCategory = 'CAGNOTTE';
      }

      const response = await adminService.getLogs({
        page: page + 1,
        limit: rowsPerPage,
        level: levelFilter !== 'ALL' ? levelFilter : undefined,
        category: backendCategory !== 'ALL' ? backendCategory : undefined,
        startDate: useDateFilter && dateRange.start ? dateRange.start : undefined,
        endDate: useDateFilter && dateRange.end ? dateRange.end : undefined,
      });

      console.log('📋 Réponse API complète:', JSON.stringify(response, null, 2));
      console.log('📋 Structure de la réponse:', {
        success: response.success,
        hasData: !!response.data,
        hasLogs: !!response.data?.logs,
        logsCount: response.data?.logs?.length || 0,
        hasPagination: !!response.data?.pagination,
        total: response.data?.pagination?.total || 0
      });

      if (response.success && response.data) {
        // Transformer les logs de l'API pour correspondre à l'interface LogEntry
        const transformedLogs: LogEntry[] = (response.data.logs || []).map((log: any) => {
          // Mapper CAGNOTTE vers CAMPAIGN pour correspondre à l'interface frontend
          let category = log.category;
          if (category === 'CAGNOTTE') {
            category = 'CAMPAIGN';
          }
          
          return {
            id: log.id,
            timestamp: log.timestamp,
            level: log.level,
            category: category as LogEntry['category'],
            action: log.action,
            description: log.description,
            userId: log.userId,
            userName: log.userName,
            userEmail: log.userEmail,
            ipAddress: log.ipAddress || 'N/A',
            userAgent: log.userAgent || 'N/A',
            sessionId: log.sessionId || 'N/A',
            severity: log.severity,
            metadata: log.metadata || {},
          };
        });

        console.log(`📋 ${transformedLogs.length} logs transformés sur ${response.data.pagination.total} total`);
        setLogs(transformedLogs);
        setFilteredLogs(transformedLogs);
        setTotalLogs(response.data.pagination.total || 0);
      } else {
        console.error('❌ Erreur lors du chargement des logs:', response);
        setLogs([]);
        setFilteredLogs([]);
        setTotalLogs(0);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des logs:', error);
      if (error instanceof Error) {
        console.error('❌ Détails de l\'erreur:', error.message);
        console.error('❌ Stack:', error.stack);
      }
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page, rowsPerPage, levelFilter, categoryFilter, dateRange, useDateFilter]);

  // 🔍 Filtrage des logs (côté client pour la recherche)
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

    // Filtre par sévérité (côté client uniquement)
    if (severityFilter !== 'ALL') {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    // Filtre les logs de debug si nécessaire
    if (!showDebugLogs) {
      filtered = filtered.filter(log => log.level !== 'DEBUG');
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, severityFilter, showDebugLogs]);

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
    // Ne pas réinitialiser selectedLog ici car il est utilisé par le dialog
  };

  const openLogDetail = () => {
    console.log('📋 Ouverture du dialog de détails pour le log:', selectedLog?.id);
    setLogDetailDialog(true);
    setAnchorEl(null); // Fermer le menu mais garder selectedLog
  };

  const closeLogDetail = () => {
    setLogDetailDialog(false);
    setSelectedLog(null);
  };

  const copyLogId = async () => {
    if (selectedLog) {
      const logId = selectedLog.id; // Sauvegarder l'ID avant de fermer
      try {
        await navigator.clipboard.writeText(logId);
        console.log('✅ ID copié dans le presse-papiers:', logId);
        // Optionnel: afficher une notification de succès
      } catch (error) {
        console.error('❌ Erreur lors de la copie:', error);
        // Fallback pour les navigateurs qui ne supportent pas clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = logId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setAnchorEl(null); // Fermer le menu
    }
  };

  const toggleImportant = () => {
    if (selectedLog) {
      const logId = selectedLog.id; // Sauvegarder l'ID avant de fermer
      setImportantLogs(prev => {
        const newSet = new Set(prev);
        if (newSet.has(logId)) {
          newSet.delete(logId);
          console.log('✅ Log retiré des importants');
        } else {
          newSet.add(logId);
          console.log('✅ Log marqué comme important');
        }
        return newSet;
      });
      setAnchorEl(null); // Fermer le menu
    }
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
            onClick={loadLogs}
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
            <FormControlLabel
              control={
                <Switch
                  checked={useDateFilter}
                  onChange={(e) => setUseDateFilter(e.target.checked)}
                  size="small"
                />
              }
              label="Filtrer par date"
            />
          </Grid>

          {useDateFilter && (
            <>
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
            </>
          )}
        </Grid>
      </Paper>

      {/* 📊 Statistiques des filtres */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredLogs.length} log(s) affiché(s) sur {totalLogs} total
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Chargement des logs...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Aucun log trouvé
                      </Typography>
                      <Typography variant="body2">
                        {searchTerm || levelFilter !== 'ALL' || categoryFilter !== 'ALL' || severityFilter !== 'ALL'
                          ? 'Aucun log ne correspond aux filtres sélectionnés. Essayez de modifier vos critères de recherche.'
                          : 'Il n\'y a actuellement aucun log dans la base de données. Les logs apparaîtront automatiquement lorsque des actions administratives seront effectuées.'}
                      </Typography>
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : (
                // Les logs sont déjà paginés côté serveur, pas besoin de slice
                filteredLogs.map((log) => (
                  <TableRow 
                    key={log.id} 
                    hover
                    sx={{
                      bgcolor: importantLogs.has(log.id) ? 'rgba(255, 193, 7, 0.1)' : 'inherit',
                      '&:hover': {
                        bgcolor: importantLogs.has(log.id) ? 'rgba(255, 193, 7, 0.15)' : undefined,
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {importantLogs.has(log.id) && (
                          <Tooltip title="Log important">
                            <WarningIcon sx={{ color: '#ff9800', fontSize: '1rem' }} />
                          </Tooltip>
                        )}
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {formatDate(log.timestamp)}
                        </Typography>
                      </Box>
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
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 📄 Pagination */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={searchTerm || severityFilter !== 'ALL' ? filteredLogs.length : totalLogs}
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
        <MenuItem onClick={copyLogId}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copier l'ID</ListItemText>
        </MenuItem>
        <MenuItem onClick={toggleImportant}>
          <ListItemIcon>
            <WarningIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {selectedLog && importantLogs.has(selectedLog.id) 
              ? 'Retirer des importants' 
              : 'Marquer important'}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* 📋 Dialog de détails du log */}
      <Dialog 
        open={logDetailDialog} 
        onClose={closeLogDetail} 
        maxWidth="md" 
        fullWidth
        disableEscapeKeyDown={false}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📋 Détails du Log #{selectedLog?.id}
            {selectedLog && importantLogs.has(selectedLog.id) && (
              <Chip 
                icon={<WarningIcon />} 
                label="Important" 
                color="warning" 
                size="small" 
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLog ? (
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
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Aucun log sélectionné
              </Typography>
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