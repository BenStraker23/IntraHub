import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminVacantes = () => {
  const { token } = useAuth();
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVacante, setEditingVacante] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    salario: '',
    tipo_contrato: '',
    fecha_limite: ''
  });

  useEffect(() => {
    fetchVacantes();
  }, []);

  const fetchVacantes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/vacantes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVacantes(data);
      }
    } catch (error) {
      console.error('Error fetching vacantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingVacante 
        ? `http://localhost:8000/api/vacantes/${editingVacante.id}`
        : 'http://localhost:8000/api/vacantes';
      
      const method = editingVacante ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchVacantes();
        setShowForm(false);
        setEditingVacante(null);
        setFormData({
          titulo: '',
          descripcion: '',
          ubicacion: '',
          salario: '',
          tipo_contrato: '',
          fecha_limite: ''
        });
      }
    } catch (error) {
      console.error('Error saving vacante:', error);
    }
  };

  const handleEdit = (vacante) => {
    setEditingVacante(vacante);
    setFormData({
      titulo: vacante.titulo,
      descripcion: vacante.descripcion,
      ubicacion: vacante.ubicacion,
      salario: vacante.salario,
      tipo_contrato: vacante.tipo_contrato,
      fecha_limite: vacante.fecha_limite
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta vacante?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/vacantes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchVacantes();
        }
      } catch (error) {
        console.error('Error deleting vacante:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando vacantes...</div>;
  }

  return (
    <div className="admin-vacantes">
      <div className="container">
        <h1>Administrar Vacantes</h1>
        
        <button 
          className="btn btn-primary mb-3"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nueva Vacante'}
        </button>

        {showForm && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>{editingVacante ? 'Editar' : 'Nueva'} Vacante</h5>
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
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    rows="4"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="ubicacion" className="form-label">Ubicación</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ubicacion"
                        value={formData.ubicacion}
                        onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="salario" className="form-label">Salario</label>
                      <input
                        type="text"
                        className="form-control"
                        id="salario"
                        value={formData.salario}
                        onChange={(e) => setFormData({...formData, salario: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="tipo_contrato" className="form-label">Tipo de Contrato</label>
                      <select
                        className="form-select"
                        id="tipo_contrato"
                        value={formData.tipo_contrato}
                        onChange={(e) => setFormData({...formData, tipo_contrato: e.target.value})}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="tiempo_completo">Tiempo Completo</option>
                        <option value="medio_tiempo">Medio Tiempo</option>
                        <option value="temporal">Temporal</option>
                        <option value="practicas">Prácticas</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="fecha_limite" className="form-label">Fecha Límite</label>
                      <input
                        type="date"
                        className="form-control"
                        id="fecha_limite"
                        value={formData.fecha_limite}
                        onChange={(e) => setFormData({...formData, fecha_limite: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">
                    {editingVacante ? 'Actualizar' : 'Crear'} Vacante
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingVacante(null);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="vacantes-list">
          {vacantes.length === 0 ? (
            <p>No hay vacantes disponibles.</p>
          ) : (
            <div className="row">
              {vacantes.map((vacante) => (
                <div key={vacante.id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{vacante.titulo}</h5>
                      <p className="card-text">{vacante.descripcion}</p>
                      <div className="vacancy-details">
                        <p><strong>Ubicación:</strong> {vacante.ubicacion}</p>
                        <p><strong>Salario:</strong> {vacante.salario || 'No especificado'}</p>
                        <p><strong>Tipo:</strong> {vacante.tipo_contrato}</p>
                        <p><strong>Fecha límite:</strong> {vacante.fecha_limite}</p>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(vacante)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(vacante.id)}
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

export default AdminVacantes;