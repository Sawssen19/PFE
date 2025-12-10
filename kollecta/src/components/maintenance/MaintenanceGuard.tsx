import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import axios from 'axios';
import MaintenancePage from './MaintenancePage';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  // Routes qui doivent être accessibles même en mode maintenance (pour que les admins puissent se connecter)
  const allowedRoutesInMaintenance = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ];

  const isAllowedRoute = allowedRoutesInMaintenance.some(route => 
    location.pathname.startsWith(route)
  );

  const checkMaintenanceMode = async () => {
    try {
      // Si l'utilisateur est admin, ne pas vérifier le mode maintenance
      if (user?.role === 'ADMIN') {
        console.log('🔐 Utilisateur admin détecté, mode maintenance ignoré');
        setIsMaintenanceMode(false);
        setIsLoading(false);
        return;
      }

      // Si on est sur une route autorisée, ne pas vérifier
      if (isAllowedRoute) {
        console.log('✅ Route autorisée en mode maintenance:', location.pathname);
        setIsMaintenanceMode(false);
        setIsLoading(false);
        return;
      }

      // Vérifier le mode maintenance via la route publique
      try {
        const response = await axios.get('http://localhost:5000/api/auth/check-maintenance', {
          timeout: 5000,
        });
        const maintenanceActive = response.data?.maintenanceMode === true;
        console.log('🔍 Mode maintenance vérifié:', maintenanceActive);
        setIsMaintenanceMode(maintenanceActive);
      } catch (error: any) {
        // Si on reçoit une erreur 503, c'est que le mode maintenance est activé
        if (error.response?.status === 503 && error.response?.data?.maintenanceMode) {
          console.log('⚠️ Mode maintenance activé (erreur 503)');
          setIsMaintenanceMode(true);
        } else {
          // En cas d'erreur réseau, considérer que le mode maintenance n'est pas activé
          console.log('❌ Erreur lors de la vérification du mode maintenance:', error.message);
          setIsMaintenanceMode(false);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du mode maintenance:', error);
      setIsMaintenanceMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkMaintenanceMode();

    // Écouter l'événement personnalisé déclenché par l'intercepteur axios
    const handleMaintenanceMode = () => {
      setIsMaintenanceMode(true);
    };

    window.addEventListener('maintenanceModeActivated', handleMaintenanceMode);

    // Vérifier périodiquement (toutes les 10 secondes)
    const interval = setInterval(checkMaintenanceMode, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('maintenanceModeActivated', handleMaintenanceMode);
    };
  }, [user?.role, isAllowedRoute, location.pathname]); // Ajouter location.pathname pour vérifier à chaque navigation

  // Vérifier aussi à chaque changement de route
  useEffect(() => {
    if (!isLoading) {
      checkMaintenanceMode();
    }
  }, [location.pathname]);

  if (isLoading) {
    return null; // Ou un loader
  }

  // Si le mode maintenance est activé et que l'utilisateur n'est pas admin et n'est pas sur une route autorisée, afficher la page de maintenance
  if (isMaintenanceMode && user?.role !== 'ADMIN' && !isAllowedRoute) {
    console.log('🚧 Affichage de la page de maintenance');
    console.log('   - Mode maintenance:', isMaintenanceMode);
    console.log('   - Rôle utilisateur:', user?.role);
    console.log('   - Route actuelle:', location.pathname);
    console.log('   - Route autorisée:', isAllowedRoute);
    return <MaintenancePage />;
  }

  return <>{children}</>;
};

export default MaintenanceGuard;

