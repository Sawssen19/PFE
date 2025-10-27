// Utilitaire pour déboguer les notifications
export const debugNotification = (notification: any) => {
  console.log('🔔 Debug Notification:', {
    id: notification.id,
    title: notification.title,
    actionUrl: notification.actionUrl,
    type: notification.type,
    metadata: notification.metadata
  });
};

export const validateActionUrl = (actionUrl?: string): boolean => {
  if (!actionUrl) {
    console.warn('⚠️ Aucune actionUrl définie');
    return false;
  }
  
  // Vérifier si l'URL commence par /
  if (!actionUrl.startsWith('/')) {
    console.warn('⚠️ actionUrl doit commencer par /:', actionUrl);
    return false;
  }
  
  console.log('✅ actionUrl valide:', actionUrl);
  return true;
};

export const logNavigationAttempt = (actionUrl: string) => {
  console.log('🧭 Tentative de navigation vers:', actionUrl);
};
