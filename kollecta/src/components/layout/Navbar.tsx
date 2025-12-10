import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Container,
  Divider,
} from '@mui/material';
import { selectUser, logout } from '../../store/slices/authSlice';
import Logo from '../common/Logo';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  const isAdmin = user?.role === 'ADMIN';
  const isHomePage = location.pathname === '/';

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo et titre */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
              <Logo size={40} />
            </Box>
          </Box>

          {/* Barre de recherche (à implémenter plus tard) */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Button color="inherit" onClick={() => navigate('/search')}>
              Rechercher
            </Button>
          </Box>

          {/* Menu principal */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                <Button color="inherit" onClick={() => navigate('/create/fundraiser?new=true')}>
                  Démarrer une cagnotte
                </Button>
                <IconButton
                  onClick={handleMenu}
                  sx={{ 
                    ml: 2,
                    width: 40,
                    height: 40,
                    bgcolor: '#00A651',
                    color: 'white',
                    '&:hover': { bgcolor: '#008C44' }
                  }}
                >
                  <Typography variant="subtitle2">
                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                  </Typography>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: { width: 220, mt: 1 }
                  }}
                >
                  <MenuItem onClick={() => handleNavigation('/profile')}>
                    Profil
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/my-cagnottes')}>
                    Mes cagnottes
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/promises')}>
                    Mes promesses
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/settings')}>
                    Paramètres
                  </MenuItem>
                  <Divider />
                  {isAdmin && (
                    <MenuItem onClick={() => handleNavigation('/admin/dashboard')}>
                      Tableau de bord Admin
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    Se déconnecter
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Se connecter
                </Button>
                <Button
                  variant="contained"
                  sx={{ 
                    ml: 2,
                    bgcolor: '#00A651',
                    '&:hover': { bgcolor: '#008C44' }
                  }}
                  onClick={() => navigate('/register')}
                >
                  S'inscrire
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;