import { useEffect, useState } from "react";
import api from "../services/api";

const MOCK_NEWS = [
  {
    id: 1,
    title: "Bienvenido a IntraHub",
    summary: "Portal centralizado para colaboradores, noticias y beneficios.",
    published_at: "Hoy",
    category: "Comunicado",
  },
  {
    id: 2,
    title: "Capacitación de Seguridad Informática",
    summary: "Revisa las nuevas políticas y participa en los talleres virtuales.",
    published_at: "Ayer",
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
  const [news, setNews] = useState([]);
  const [vacantes, setVacantes] = useState([]);

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
    };

    loadData();
  }, []);

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
                  <span className="news-category">{n.category}</span>
                  <span className="news-date">{n.published_at}</span>
                </div>

                <h3>{n.title}</h3>
                <p>{n.summary}</p>
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
                  onClick={() => alert(`Postulación enviada a la vacante #${v.id}`)}
                >
                  Postularse
                </button>
              </article>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
