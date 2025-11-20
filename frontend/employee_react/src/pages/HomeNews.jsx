import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const MOCK_NEWS = [
  {
    id: 1,
    title: "Bienvenido a IntraHub",
    content: "Portal centralizado para colaboradores, noticias y beneficios. Aquí podrás encontrar toda la información relevante sobre la empresa, novedades importantes y oportunidades de crecimiento profesional. Manténte al día con las últimas actualizaciones corporativas.",
    published_at: "2025-11-18",
    category: "Comunicado",
  },
  {
    id: 2,
    title: "Capacitación de Seguridad Informática",
    content: "Revisa las nuevas políticas y participa en los talleres virtuales. Es importante que todos los colaboradores estén al día con las mejores prácticas de seguridad para proteger nuestros activos digitales. Los talleres incluirán temas sobre phishing, contraseñas seguras y protección de datos.",
    published_at: "2025-11-17",
    category: "Seguridad",
  },
];

const MOCK_VACANTES = [
  {
    id: 1,
    titulo: "Desarrollador PHP Jr.",
    descripcion: "Mantenimiento de sistemas internos y soporte a módulos existentes.",
    area: "Tecnología",
  },
  {
    id: 2,
    titulo: "Analista de Soporte",
    descripcion: "Atención de tickets internos de nivel 1.",
    area: "TI / Infraestructura",
  },
];

export default function HomeNews() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [news, setNews] = useState([]);
  const [vacantes, setVacantes] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    // Si viene en formato ISO, extraemos solo la fecha
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    // Si ya está en formato correcto, la devolvemos tal cual
    return dateString;
  };

  // Función para truncar texto
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Función para abrir modal con noticia completa
  const openNewsModal = async (newsId) => {
    // Primero buscar en las noticias ya cargadas
    const newsItem = news.find(n => n.id === newsId || n.id == newsId);
    
    if (newsItem) {
      setSelectedNews(newsItem);
      setShowModal(true);
      return;
    }
    
    // Si no se encuentra localmente, intentar con la API
    try {
      const response = await api.get(`/news/${newsId}`);
      setSelectedNews(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error al cargar la noticia:', error);
      // Mostrar una notificación de error más suave
      alert('La noticia que buscas no está disponible en este momento');
    }
  };

  // Función para cerrar modal
  const closeNewsModal = () => {
    setShowModal(false);
    setSelectedNews(null);
    
    // Limpiar el parámetro newsId de la URL si existe
    const newsId = searchParams.get('newsId');
    if (newsId) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('newsId');
      setSearchParams(newSearchParams);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const resNews = await api.get("/news");
        setNews(resNews.data);
      } catch {
        setNews(MOCK_NEWS);
      }

      try {
        const resVac = await api.get("/vacantes");
        setVacantes(resVac.data);
      } catch {
        setVacantes(MOCK_VACANTES);
      }
      
      // Después de cargar las noticias, verificar si hay un newsId en la URL
      const newsId = searchParams.get('newsId');
      if (newsId) {
        const numericNewsId = parseInt(newsId);
        setTimeout(() => {
          openNewsModal(numericNewsId);
        }, 100); // Pequeño delay para asegurar que el estado se actualice
      }
    };

    loadData();
  }, []);

  // Efecto separado para manejar cambios en los parámetros de búsqueda
  useEffect(() => {
    const newsId = searchParams.get('newsId');
    
    if (newsId && news.length > 0 && !showModal) {
      const numericNewsId = parseInt(newsId);
      openNewsModal(numericNewsId);
    }
  }, [searchParams]);

  return (
    <div className="home-wrapper">

      <h1 className="home-title">IntraHub – Noticias & Vacantes</h1>
      <p className="home-subtitle">
        Bienvenido al portal interno de colaboradores.
      </p>

      {/* GRID PRINCIPAL */}
      <div className="home-grid">

        {/* NOTICIAS */}
        <section className="home-section">
          <h2 className="section-title">📰 Noticias corporativas</h2>

          <div className="news-list">
            {news.map((n) => (
              <article key={n.id} className="news-card">
                <div className="news-header">
                  <span className="news-category">{n.category || 'General'}</span>
                  <span className="news-date">{formatDate(n.published_at)}</span>
                </div>

                <h3>{n.title}</h3>
                <p>{truncateText(n.content || n.summary, 150)}</p>
                
                <button 
                  className="news-read-more-btn"
                  onClick={() => openNewsModal(n.id)}
                >
                  Leer más
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* VACANTES */}
        <section className="home-section">
          <h2 className="section-title">💼 Vacantes internas</h2>

          <div className="vacantes-list">
            {vacantes.map((v) => (
              <article key={v.id} className="vacante-card">
                <h3>{v.titulo}</h3>
                <p>{v.descripcion}</p>
                <p className="vacante-area">{v.area}</p>

                <button
                  className="vacante-btn"
                  onClick={() => navigate('/vacantes', { state: { highlightVacante: v.id } })}
                >
                  Ver Detalles
                </button>
              </article>
            ))}
          </div>
        </section>

      </div>

      {/* MODAL PARA NOTICIA COMPLETA */}
      {showModal && selectedNews && (
        <div className="news-modal-overlay" onClick={closeNewsModal}>
          <div className="news-modal" onClick={(e) => e.stopPropagation()}>
            <div className="news-modal-header">
              <h2>{selectedNews.title}</h2>
              <button 
                className="news-modal-close" 
                onClick={closeNewsModal}
              >
                ✕
              </button>
            </div>
            
            <div className="news-modal-meta">
              <span className="news-modal-date">
                Publicado: {formatDate(selectedNews.published_at)}
              </span>
              {selectedNews.author?.name && (
                <span className="news-modal-author">
                  Por: {selectedNews.author.name}
                </span>
              )}
            </div>
            
            <div className="news-modal-content">
              <p>{selectedNews.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
