import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  setNotifications, 
  setUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification
} from '../store/slices/notificationsSlice';
import { notificationsService } from '../features/notifications/notificationsService';
import { 
  Bell, 
  Check, 
  X, 
  DollarSign, 
  AlertCircle, 
  MessageSquare, 
  Settings, 
  Flag,
  Clock,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Charger les notifications au montage du composant
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const response = await notificationsService.getNotifications(pageNum, 20);
      
      if (response.success) {
        if (append) {
          dispatch(setNotifications([...notifications, ...response.data.notifications]));
        } else {
          dispatch(setNotifications(response.data.notifications));
        }
        dispatch(setUnreadCount(response.data.unreadCount));
        setHasMore(response.data.notifications.length === 20);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      dispatch(markNotificationAsRead(notificationId));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      dispatch(markAllNotificationsAsRead());
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      dispatch(removeNotification(notificationId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    await handleMarkAsRead(notification.id);
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNotifications(nextPage, true);
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

  if (loading && notifications.length === 0) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          <Bell className="w-8 h-8 animate-spin" />
          <p>Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <div className="notifications-title">
            <Bell className="w-6 h-6" />
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          
          {unreadCount > 0 && (
            <button 
              className="mark-all-read-btn"
              onClick={handleMarkAllAsRead}
            >
              <Check className="w-4 h-4" />
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <Bell className="w-16 h-16 opacity-20" />
              <h3>Aucune notification</h3>
              <p>Vous n'avez pas encore de notifications.</p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
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

                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        className="mark-read-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        title="Marquer comme lu"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      className="delete-notification-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Bell className="w-4 h-4 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      'Charger plus de notifications'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

