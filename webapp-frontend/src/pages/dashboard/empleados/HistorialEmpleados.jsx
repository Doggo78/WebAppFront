import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const HistorialEmpleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState('');
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState('');
  const [loadingTareas, setLoadingTareas] = useState(false);

  // Obtener lista de empleados
  useEffect(() => {
    const fetchEmpleados = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/empleados/historial', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmpleados(response.data);
        setError('');
      } catch (error) {
        console.error('Error al obtener empleados:', error);
        setError('Error al obtener la lista de empleados.');
      }
    };

    fetchEmpleados();
  }, []);

  // Obtener tareas de un empleado específico
  const fetchTareas = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
      return;
    }

    setLoadingTareas(true); // Indicar que se están cargando las tareas

    try {
      const response = await axios.get(
        `http://localhost:5000/api/empleados/${selectedEmpleadoId}/tareas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTareas(response.data);
      setError('');
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      setError('Error al obtener las tareas del empleado.');
      setTareas([]);
    } finally {
      setLoadingTareas(false); // Finalizar carga de tareas
    }
  }, [selectedEmpleadoId]);

  // Actualizar las tareas cuando cambia el empleado seleccionado
  useEffect(() => {
    if (selectedEmpleadoId) {
      fetchTareas();
    } else {
      setTareas([]); // Limpiar tareas si no hay empleado seleccionado
    }
  }, [selectedEmpleadoId, fetchTareas]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-naranja">Historial de Empleados</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Selecciona un Empleado:</label>
        <select
          value={selectedEmpleadoId}
          onChange={(e) => setSelectedEmpleadoId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Seleccione un empleado</option>
          {empleados.map((empleado) => (
            <option key={empleado.id_empleado} value={empleado.id_empleado}>
              {empleado.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        {loadingTareas ? (
          <p className="text-blue-500">Cargando tareas...</p>
        ) : tareas.length > 0 ? (
          tareas.map((tarea) => (
            <div key={tarea.id_tarea} className="p-4 border border-gray-300 rounded mb-2">
              <h3 className="font-bold">{tarea.descripcion}</h3>
              <p>Estado: {tarea.estado}</p>
              <p>Fecha: {new Date(tarea.fecha_hora).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No se encontraron tareas para este empleado.</p>
        )}
      </div>
    </div>
  );
};

export default HistorialEmpleado;
