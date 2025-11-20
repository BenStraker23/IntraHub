import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

export default function Vacantes() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vacantes, setVacantes] = useState([]);
  const [highlightVacante, setHighlightVacante] = useState(null);

  // Efecto para actualizar el highlighting cuando cambian los parámetros
  useEffect(() => {
    const highlightFromState = location.state?.highlightVacante;
    const highlightFromURL = searchParams.get('vacanteId');
    const newHighlight = highlightFromState || (highlightFromURL ? parseInt(highlightFromURL) : null);
    
    if (newHighlight !== highlightVacante) {
      setHighlightVacante(newHighlight);
    }
  }, [location.state, searchParams]);

  // Helper functions for formatting
  const formatSalario = (min, max) => {
    if (min && max) {
      return `Q${min.toLocaleString()} - Q${max.toLocaleString()}`;
    }
    if (min) {
      return `Desde Q${min.toLocaleString()}`;
    }
    if (max) {
      return `Hasta Q${max.toLocaleString()}`;
    }
    return 'A convenir';
  };

  const formatTipoEmpleo = (tipo) => {
    const tipos = {
      'tiempo_completo': 'Tiempo Completo',
      'medio_tiempo': 'Medio Tiempo',
      'temporal': 'Temporal',
      'prácticas': 'Prácticas'
    };
    return tipos[tipo] || tipo || 'No especificado';
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const highlightFromURL = searchParams.get('vacanteId');
    
    fetch("http://127.0.0.1:8000/api/vacantes")
      .then((res) => res.json())
      .then((data) => {
        setVacantes(data);
      });
  }, []);

  // Efecto separado para manejar el highlighting cuando cambian los parámetros o se cargan las vacantes
  useEffect(() => {
    if (highlightVacante && vacantes.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`vacante-${highlightVacante}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Remover el resaltado después de 3 segundos
        setTimeout(() => {
          setHighlightVacante(null);
          // Limpiar parámetro URL si existe
          const highlightFromURL = searchParams.get('vacanteId');
          if (highlightFromURL) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('vacanteId');
            setSearchParams(newSearchParams);
          }
        }, 3000);
      }, 100);
    }
  }, [vacantes, highlightVacante]);

  return (
    <div className="home-wrapper">

      {/* HEADER CENTRADO */}
      <div className="home-header">
        <h1 className="home-title">Vacantes Internas</h1>
        <p className="home-subtitle">
          Oportunidades laborales internas disponibles para colaboradores.
        </p>
      </div>

      {/* CONTENEDOR CENTRADO - Para la vista */}
      <div className="vacantes-page-container">
        <div className="vacantes-list-full">

          {vacantes.map((v) => (
            <div 
              key={v.id} 
              id={`vacante-${v.id}`}
              className={`vacante-card vacante-large ${highlightVacante === v.id ? 'highlighted' : ''}`}
            >

              <h3>{v.titulo}</h3>
              <p>{v.descripcion}</p>

              <div className="vacante-info-details">
                <p><strong>Departamento:</strong> {v.departamento || 'No especificado'}</p>
                <p><strong>Tipo de Empleo:</strong> {formatTipoEmpleo(v.tipo_empleo)}</p>
                <p><strong>Modalidad:</strong> {v.modalidad || 'No especificado'}</p>
                <p><strong>Ubicación:</strong> {v.ubicacion || 'No especificado'}</p>
                <p><strong>Salario:</strong> {formatSalario(v.salario_min, v.salario_max)}</p>
                <p><strong>Estado:</strong> {v.estado === 'abierta' ? '🟢 Abierta' : '🔴 Cerrada'}</p>
                {v.fecha_limite && (
                  <p><strong>Fecha límite:</strong> {formatDate(v.fecha_limite)}</p>
                )}
              </div>

              <button className="vacante-btn">Postularse</button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
