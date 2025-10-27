import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  removeNotification 
} from '../../store/slices/notificationsSlice';
import { notificationsService } from '../../features/notifications/notificationsService';
import { debugNotification, validateActionUrl, logNavigationAttempt } from '../../utils/notificationDebug';
import { 
  Bell, 
  Check, 
  X, 
  DollarSign, 
  AlertCircle, 
  MessageSquare, 
  Settings, 
  Flag,
  Clock
} from 'lucide-react';
import './NotificationDropdown.css';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      dispatch(markAllNotificationsAsRead());
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
  };

  const handleNotificationClick = async (notificationId: string, actionUrl?: string) => {
    try {
      // Debug de la notification
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        debugNotification(notification);
      }
      
      await notificationsService.markAsRead(notificationId);
      dispatch(markNotificationAsRead(notificationId));
      
      if (actionUrl && validateActionUrl(actionUrl)) {
        logNavigationAttempt(actionUrl);
        navigate(actionUrl);
      } else {
        console.warn('⚠️ Navigation impossible - actionUrl invalide ou manquante:', actionUrl);
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Erreur lors du marquage de la notification:', error);
      // Même en cas d'erreur, on ferme le dropdown
      onClose();
    }
  };

  const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await notificationsService.deleteNotification(notificationId);
      dispatch(removeNotification(notificationId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'DONATION':
        return <DollarSign className="notification-icon donation" />;
      case 'CAGNOTTE':
        return <Bell className="notification-icon cagnotte" />;
      case 'COMMENT':
        return <MessageSquare className="notification-icon comment" />;
      case 'REPORT':
        return <Flag className="notification-icon report" />;
      case 'ADMIN':
        return <AlertCircle className="notification-icon admin" />;
      case 'SYSTEM':
      default:
        return <Settings className="notification-icon system" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-header">
        <div className="notification-title">
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            className="mark-all-read-btn"
            onClick={handleMarkAllAsRead}
            title="Tout marquer comme lu"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell className="w-12 h-12 opacity-20" />
            <p>Aucune notification</p>
          </div>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
            >
              <div className="notification-icon-container">
                {getNotificationIcon(notification.type)}
                {!notification.read && <span className="unread-dot"></span>}
              </div>
              
              <div className="notification-content">
                <div className="notification-title-text">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">
                  <Clock className="w-3 h-3" />
                  {getTimeAgo(notification.createdAt)}
                </div>
              </div>

              <button
                className="delete-notification-btn"
                onClick={(e) => handleDeleteNotification(notification.id, e)}
                title="Supprimer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-footer">
          <button 
            className="view-all-btn"
            onClick={() => {
              navigate('/notifications');
              onClose();
            }}
          >
            Voir toutes les notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;


