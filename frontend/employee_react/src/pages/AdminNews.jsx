import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminNews = () => {
  const { token } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    fecha_publicacion: ''
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/news', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingNews 
        ? `http://localhost:8000/api/news/${editingNews.id}`
        : 'http://localhost:8000/api/news';
      
      const method = editingNews ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchNews();
        setShowForm(false);
        setEditingNews(null);
        setFormData({
          titulo: '',
          contenido: '',
          fecha_publicacion: ''
        });
      }
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      titulo: newsItem.titulo,
      contenido: newsItem.contenido,
      fecha_publicacion: newsItem.fecha_publicacion
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta noticia?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/news/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchNews();
        }
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Cargando noticias...</div>;
  }

  return (
    <div className="admin-news">
      <div className="container">
        <h1>Administrar Noticias</h1>
        
        <button 
          className="btn btn-primary mb-3"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nueva Noticia'}
        </button>

        {showForm && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>{editingNews ? 'Editar' : 'Nueva'} Noticia</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="titulo" className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="contenido" className="form-label">Contenido</label>
                  <textarea
                    className="form-control"
                    id="contenido"
                    rows="6"
                    value={formData.contenido}
                    onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="fecha_publicacion" className="form-label">Fecha de Publicación</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha_publicacion"
                    value={formData.fecha_publicacion}
                    onChange={(e) => setFormData({...formData, fecha_publicacion: e.target.value})}
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">
                    {editingNews ? 'Actualizar' : 'Crear'} Noticia
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingNews(null);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="news-list">
          {news.length === 0 ? (
            <p>No hay noticias disponibles.</p>
          ) : (
            <div className="row">
              {news.map((newsItem) => (
                <div key={newsItem.id} className="col-md-12 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{newsItem.titulo}</h5>
                      <p className="card-text">{newsItem.contenido}</p>
                      <div className="news-details">
                        <p className="text-muted">
                          <strong>Publicado:</strong> {formatDate(newsItem.fecha_publicacion)}
                        </p>
                        {newsItem.created_at && (
                          <p className="text-muted">
                            <strong>Creado:</strong> {formatDate(newsItem.created_at)}
                          </p>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(newsItem)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(newsItem.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNews;