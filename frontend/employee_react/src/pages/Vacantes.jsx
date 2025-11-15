import React, { useEffect, useState } from "react";

export default function Vacantes() {
  const [vacantes, setVacantes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/vacantes")
      .then((res) => res.json())
      .then((data) => setVacantes(data));
  }, []);

  return (
    <div className="home-wrapper">

      {/* HEADER CENTRADO */}
      <div className="home-header">
        <h1 className="home-title">Vacantes Internas</h1>
        <p className="home-subtitle">
          Oportunidades laborales internas disponibles para colaboradores.
        </p>
      </div>

      {/* CONTENEDOR CENTRADO */}
      <div className="vacantes-page-container">
        <div className="vacantes-list-full">

          {vacantes.map((v) => (
            <div key={v.id} className="vacante-card vacante-large">

              <h3>{v.titulo}</h3>
              <p>{v.descripcion}</p>

              <div className="vacante-info-details">
                <p><strong>Área:</strong> {v.area}</p>
                <p><strong>Horario:</strong> {v.horario}</p>
                <p><strong>Modalidad:</strong> {v.modalidad}</p>
                <p><strong>Ubicación:</strong> {v.ubicacion}</p>
                <p><strong>Salario:</strong> {v.salario}</p>
                <p><strong>Contrato:</strong> {v.contrato}</p>
              </div>

              <button className="vacante-btn">Postularse</button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
