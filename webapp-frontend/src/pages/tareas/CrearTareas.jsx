// src/pages/tareas/CrearTarea.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearTarea = () => {
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const [tareaData, setTareaData] = useState({
    fecha_hora: '',
    estado: 'En espera',
    descripcion: '',
    id_cliente: '',
    id_empleado: '',
    id_vehiculo: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const clientesRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/clientes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(clientesRes.data);

        const empleadosRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/empleados`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmpleados(empleadosRes.data);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError('Error al obtener clientes o empleados.');
      }
    };

    fetchData();
  }, []);

  const handleClienteChange = async (e) => {
    const { value } = e.target;
    setTareaData({ ...tareaData, id_cliente: value, id_vehiculo: '' });
    if (value) {
      const token = localStorage.getItem('token');
      try {
        const vehiculosRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/vehiculos/${value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehiculos(vehiculosRes.data);
      } catch (error) {
        console.error('Error al obtener vehículos:', error);
        setError('Error al obtener vehículos del cliente.');
      }
    } else {
      setVehiculos([]);
    }
  };

  const handleChange = (e) => {
    setTareaData({ ...tareaData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { descripcion, fecha_hora, estado, id_cliente, id_empleado, id_vehiculo } = tareaData;
    const token = localStorage.getItem('token');

    // Validar campos
    if (!descripcion || !fecha_hora || !estado || !id_cliente || !id_empleado || !id_vehiculo) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/tareas/crear`, tareaData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Tarea creada exitosamente.');
      setTareaData({
        fecha_hora: '',
        estado: 'En espera',
        descripcion: '',
        id_cliente: '',
        id_empleado: '',
        id_vehiculo: ''
      });
      setVehiculos([]);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      setError('Error al crear la tarea.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Crear Tarea</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Cliente */}
        <div className="mb-4">
          <label className="block text-gray-700">Cliente:</label>
          <select
            name="id_cliente"
            value={tareaData.id_cliente}
            onChange={handleClienteChange}
            className="w-full border p-2"
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((c) => (
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        {/* Vehículo */}
        <div className="mb-4">
          <label className="block text-gray-700">Vehículo:</label>
          <select
            name="id_vehiculo"
            value={tareaData.id_vehiculo}
            onChange={handleChange}
            className="w-full border p-2"
            required
            disabled={!tareaData.id_cliente}
          >
            <option value="">Seleccione un vehículo</option>
            {vehiculos.map((v) => (
              <option key={v.id_vehiculo} value={v.id_vehiculo}>
                {v.marca} {v.modelo} ({v.patente})
              </option>
            ))}
          </select>
        </div>
        {/* Empleado */}
        <div className="mb-4">
          <label className="block text-gray-700">Empleado:</label>
          <select
            name="id_empleado"
            value={tareaData.id_empleado}
            onChange={handleChange}
            className="w-full border p-2"
            required
          >
            <option value="">Seleccione un empleado</option>
            {empleados.map((e) => (
              <option key={e.id_empleado} value={e.id_empleado}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
        {/* Descripción */}
        <div className="mb-4">
          <label className="block text-gray-700">Descripción:</label>
          <textarea
            name="descripcion"
            value={tareaData.descripcion}
            onChange={handleChange}
            className="w-full border p-2"
            required
          ></textarea>
        </div>
        {/* Fecha y hora */}
        <div className="mb-4">
          <label className="block text-gray-700">Fecha y Hora:</label>
          <input
            type="datetime-local"
            name="fecha_hora"
            value={tareaData.fecha_hora}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        {/* Estado */}
        <div className="mb-4">
          <label className="block text-gray-700">Estado:</label>
          <select
            name="estado"
            value={tareaData.estado}
            onChange={handleChange}
            className="w-full border p-2"
            required
          >
            <option value="En espera">En espera</option>
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Crear Tarea
        </button>
      </form>
    </div>
  );
};

export default CrearTarea;
