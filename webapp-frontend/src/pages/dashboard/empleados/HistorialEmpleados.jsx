// src/pages/dashboard/empleados/HistorialEmpleado.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistorialEmpleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState('');
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmpleados = async () => {
      const token = localStorage.getItem('token');
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

  const fetchTareas = async () => {
    const token = localStorage.getItem('token');
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
    }
  };

  useEffect(() => {
    if (selectedEmpleadoId) {
      fetchTareas();
    }
  }, [selectedEmpleadoId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Historial de Empleados</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700">Selecciona un Empleado:</label>
        <select
          value={selectedEmpleadoId}
          onChange={(e) => setSelectedEmpleadoId(e.target.value)}
          className="w-full border p-2"
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
        {tareas.map((tarea) => (
          <div key={tarea.id_tarea} className="p-4 border border-gray-300 rounded mb-2">
            <h3 className="font-bold">{tarea.descripcion}</h3>
            <p>Estado: {tarea.estado}</p>
            <p>Fecha: {new Date(tarea.fecha_hora).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialEmpleado;
