export default function Boletas() {
  return (
    <div className="home-wrapper">
      <div className="boletas-container">
        <h1 className="home-title">Boletas de Pago</h1>
        <p className="home-subtitle">
          Consulta tu historial de boletas y descárgalas en formato PDF.
        </p>

        <div className="boletas-list">
          {[
            { id: 1, periodo: "Octubre 2025", monto: "Q3,500.00" },
            { id: 2, periodo: "Septiembre 2025", monto: "Q3,400.00" }
          ].map((b) => (
            <div key={b.id} className="boleta-card">
              <div className="boleta-info">
                <h3>{b.periodo}</h3>
                <p>Monto recibido: {b.monto}</p>
              </div>
              <button className="vacante-btn">Descargar PDF</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
