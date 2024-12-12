// src/pages/dashboard/tareas/AsignarTareas.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AsignarTareas = () => {
  const [empleados, setEmpleados] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [formData, setFormData] = useState({
    descripcion: '',
    fecha_hora: '',
    estado: 'En espera',
    id_empleado: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmpleados();
    fetchTareas();
  }, []);

  const fetchEmpleados = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/empleados', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      setError('Error al obtener la lista de empleados.');
    }
  };

  const fetchTareas = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/tareas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTareas(response.data);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      setError('Error al obtener la lista de tareas.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar campos
    if (
      !formData.descripcion ||
      !formData.fecha_hora ||
      !formData.estado ||
      !formData.id_empleado
    ) {
      setError('Todos los campos son obligatorios.');
      return;
    }
  
    // Validar formato de fecha en el frontend (opcional)
    const fecha = new Date(formData.fecha_hora);
    if (isNaN(fecha.getTime())) {
      setError('El formato de fecha y hora es inválido.');
      return;
    }
  
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/tareas', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Tarea creada y asignada exitosamente.');
      setFormData({
        descripcion: '',
        fecha_hora: '',
        estado: 'En espera',
        id_empleado: '',
      });
      fetchTareas();
    } catch (error) {
      console.error('Error al crear tarea:', error.response.data.message);
      setError(error.response.data.message || 'Error al crear la tarea.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Asignar Tareas</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* Formulario para crear y asignar tareas */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Fecha y Hora:</label>
          <input
            type="datetime-local"
            name="fecha_hora"
            value={formData.fecha_hora}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Estado:</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="En espera">En espera</option>
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Asignar a Empleado:</label>
          <select
            name="id_empleado"
            value={formData.id_empleado}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleccione un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id_empleado} value={empleado.id_empleado}>
                {empleado.nombre}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Crear y Asignar Tarea
        </button>
      </form>

      {/* Lista de Tareas */}
      <h3 className="text-lg font-bold mb-2">Tareas Existentes</h3>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Descripción</th>
            <th className="py-2 px-4 border-b">Fecha y Hora</th>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Empleado Asignado</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.id_tarea}>
              <td className="py-2 px-4 border-b">{tarea.descripcion}</td>
              <td className="py-2 px-4 border-b">
                {new Date(tarea.fecha_hora).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b">{tarea.estado}</td>
              <td className="py-2 px-4 border-b">
                {tarea.empleado ? tarea.empleado.nombre : 'No asignado'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsignarTareas;
