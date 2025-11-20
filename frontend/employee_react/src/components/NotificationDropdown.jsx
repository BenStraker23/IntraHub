// src/components/NotificationDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import notificationService from '../services/notificationService';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cargar notificaciones y conteo al montar el componente
  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error('Error cargando conteo de notificaciones:', error);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Forzar refresh para obtener las notificaciones más recientes
      const response = await notificationService.refreshNotifications();
      setNotifications(response.data || response);
    } catch (error) {
      setError('Error al cargar notificaciones');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          read_at: notification.read_at || new Date().toISOString()
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
      // Recalcular conteo
      loadUnreadCount();
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'news': '📰',
      'vacancy': '💼',
      'boleta': '📄',
      'custom': '📢'
    };
    return icons[type] || '🔔';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateMessage = (message, maxLength = 80) => {
    return message.length > maxLength 
      ? message.substring(0, maxLength) + '...'
      : message;
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button 
        className="notification-bell"
        onClick={handleToggleDropdown}
        aria-label="Notificaciones"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            {notifications.length > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="notification-content">
            {loading && (
              <div className="notification-loading">
                <div className="loading-spinner"></div>
                <span>Cargando notificaciones...</span>
              </div>
            )}

            {error && (
              <div className="notification-error">
                <span>❌</span>
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="notification-empty">
                <span className="empty-icon">📬</span>
                <p>No tienes notificaciones</p>
                <small>Las nuevas notificaciones aparecerán aquí</small>
              </div>
            )}

            {!loading && !error && notifications.length > 0 && (
              <div className="notification-list">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${!notification.read_at ? 'unread' : ''}`}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="notification-content-area">
                      <div className="notification-title">
                        {notification.title}
                      </div>
                      <div className="notification-message">
                        {truncateMessage(notification.message)}
                      </div>
                      <div className="notification-date">
                        {formatDate(notification.created_at)}
                      </div>
                    </div>

                    <div className="notification-actions">
                      {!notification.read_at && (
                        <button
                          className="mark-read-btn"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Marcar como leída"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteNotification(notification.id)}
                        title="Eliminar"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="notification-footer">
            <a href="/notifications" className="view-all-link">
              Ver todas las notificaciones
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;