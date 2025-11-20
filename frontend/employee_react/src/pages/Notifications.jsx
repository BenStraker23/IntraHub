// src/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';
import '../styles/notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read, historial
  const [settings, setSettings] = useState({
    news: true,
    vacancies: true,
    boletas: true,
    email_notifications: true
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadNotifications();
    loadSettings();
    
    // Auto-actualización cada 2 minutos si está habilitada
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadNotifications(true); // Force refresh
      }, 2 * 60 * 1000); // 2 minutos
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadNotifications = async (forceRefresh = false) => {
    try {
      if (!forceRefresh) setLoading(true);
      
      const response = forceRefresh 
        ? await notificationService.refreshNotifications()
        : await notificationService.getNotifications();
        
      setNotifications(response.data || response);
      setLastUpdated(new Date());
      if (error) setError(null); // Limpiar error si la carga es exitosa
    } catch (error) {
      setError('Error al cargar las notificaciones');
      console.error('Error:', error);
    } finally {
      if (!forceRefresh) setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await notificationService.getNotificationSettings();
      setSettings(response.data || response);
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
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
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      await notificationService.updateNotificationSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error actualizando configuraciones:', error);
    }
  };

  const handleRefresh = async () => {
    await loadNotifications(true);
  };

  const handleNotificationClick = async (notification) => {
    // Marcar como leída si no lo está
    if (!notification.read_at) {
      await handleMarkAsRead(notification.id);
    }

    // Navegar según el tipo de notificación
    switch (notification.type) {
      case 'news':
        // Para noticias, navegar al dashboard de noticias con el ID específico
        const newsId = notification.related_id || notification.reference_id;
        if (newsId) {
          navigate(`/?newsId=${newsId}`);
        } else {
          navigate('/');
        }
        break;
      case 'vacancy':
        // Para vacantes, navegar al dashboard de vacantes con el ID específico
        const vacanteId = notification.related_id || notification.reference_id;
        if (vacanteId) {
          navigate(`/vacantes?vacanteId=${vacanteId}`);
        } else {
          navigate('/vacantes');
        }
        break;
      case 'boleta':
        // Para boletas, navegar al dashboard de boletas
        navigate('/boletas');
        break;
      default:
        // Para otros tipos, ir al dashboard principal
        navigate('/');
        break;
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read_at);
      case 'read':
        return notifications.filter(n => n.read_at);
      case 'historial':
        return [...notifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return notifications;
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

  const getTypeLabel = (type) => {
    const labels = {
      'news': 'Noticia',
      'vacancy': 'Vacante',
      'boleta': 'Boleta',
      'custom': 'General'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read_at).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          <div className="loading-spinner"></div>
          <p>Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-left">
          <h1>Notificaciones</h1>
          {lastUpdated && (
            <small className="last-updated">
              Última actualización: {lastUpdated.toLocaleTimeString('es-ES')}
            </small>
          )}
        </div>
        <div className="notifications-stats">
          <span className="total-count">
            Total: {notifications.length}
          </span>
          {unreadCount > 0 && (
            <span className="unread-count">
              Sin leer: {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className="notifications-controls">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas ({notifications.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            No leídas ({unreadCount})
          </button>
          <button 
            className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Leídas ({notifications.length - unreadCount})
          </button>
          <button 
            className={`filter-tab ${filter === 'historial' ? 'active' : ''}`}
            onClick={() => setFilter('historial')}
          >
            Historial ({notifications.length})
          </button>
        </div>

        <div className="bulk-actions">
          <div className="refresh-controls">
            <button 
              className="action-btn secondary"
              onClick={handleRefresh}
            >
              🔄 Actualizar
            </button>
            <label className="auto-refresh-toggle">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>Auto-actualizar</span>
            </label>
          </div>
          {unreadCount > 0 && (
            <button 
              className="action-btn primary"
              onClick={handleMarkAllAsRead}
            >
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="notifications-error">
          <span>❌</span>
          <span>{error}</span>
          <button onClick={loadNotifications}>Reintentar</button>
        </div>
      )}

      <div className="notifications-content">
        {filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <div className="empty-icon">
              {filter === 'unread' ? '✅' : filter === 'historial' ? '📚' : '📬'}
            </div>
            <h3>
              {filter === 'unread' 
                ? '¡Todo al día!' 
                : filter === 'read'
                ? 'No hay notificaciones leídas'
                : filter === 'historial'
                ? 'No hay historial disponible'
                : 'No tienes notificaciones'
              }
            </h3>
            <p>
              {filter === 'unread' 
                ? 'No tienes notificaciones sin leer'
                : filter === 'read'
                ? 'Las notificaciones que marques como leídas aparecerán aquí'
                : filter === 'historial'
                ? 'El historial de todas tus notificaciones aparecerá aquí ordenado por fecha'
                : 'Las nuevas notificaciones aparecerán aquí'
              }
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {filter === 'historial' && (
              <div className="historial-header">
                <h3>📚 Historial Completo de Notificaciones</h3>
                <p>Todas tus notificaciones ordenadas por fecha más reciente</p>
              </div>
            )}
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`notification-card ${!notification.read_at ? 'unread' : ''} ${filter === 'historial' ? 'historial-item' : ''}`}
                onClick={() => handleNotificationClick(notification)}
                style={{ cursor: 'pointer' }}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-header">
                    <h3>{notification.title}</h3>
                    <div className="notification-type-badge">
                      <span className="notification-type">
                        {getTypeLabel(notification.type)}
                      </span>
                      <span className="click-indicator">→</span>
                    </div>
                  </div>
                  
                  <p className="notification-message">
                    {notification.message}
                  </p>
                  
                  <div className="notification-meta">
                    <span className="notification-date">
                      {formatDate(notification.created_at)}
                    </span>
                    {notification.read_at && (
                      <span className="read-indicator">
                        ✓ Leída el {formatDate(notification.read_at)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.read_at && (
                    <button
                      className="action-btn secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      Marcar como leída
                    </button>
                  )}
                  <button
                    className="action-btn danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configuraciones de notificaciones */}
      <div className="notification-settings">
        <h2>Configuraciones de Notificaciones</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.news}
                onChange={(e) => handleUpdateSettings({
                  ...settings,
                  news: e.target.checked
                })}
              />
              <span>Notificaciones de noticias</span>
            </label>
            <small>Recibir notificaciones cuando se publiquen nuevas noticias</small>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.vacancies}
                onChange={(e) => handleUpdateSettings({
                  ...settings,
                  vacancies: e.target.checked
                })}
              />
              <span>Notificaciones de vacantes</span>
            </label>
            <small>Recibir notificaciones sobre nuevas oportunidades laborales</small>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.boletas}
                onChange={(e) => handleUpdateSettings({
                  ...settings,
                  boletas: e.target.checked
                })}
              />
              <span>Notificaciones de boletas</span>
            </label>
            <small>Recibir notificaciones sobre nuevas boletas disponibles</small>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.email_notifications}
                onChange={(e) => handleUpdateSettings({
                  ...settings,
                  email_notifications: e.target.checked
                })}
              />
              <span>Notificaciones por email</span>
            </label>
            <small>También recibir una copia por correo electrónico</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;