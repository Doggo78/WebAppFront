import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistroCliente = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
  });
  const [vehiculoData, setVehiculoData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    patente: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (Object.keys(formData).includes(name)) {
      setFormData({ ...formData, [name]: value });
    } else {
      setVehiculoData({ ...vehiculoData, [name]: value });
    }
    setError('');
    setSuccess('');
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.nombre || !formData.telefono) {
      setError('Complete los campos obligatorios del cliente.');
      return;
    }
  
    if (!/^\d+$/.test(formData.telefono)) {
      setError('El teléfono debe contener solo números.');
      return;
    }
  
    if (formData.email && !isValidEmail(formData.email)) {
      setError('Ingrese un correo electrónico válido.');
      return;
    }
  
    if (!vehiculoData.marca || !vehiculoData.modelo || !vehiculoData.anio || !vehiculoData.patente) {
      setError('Complete los campos obligatorios del vehículo.');
      return;
    }
  
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
        return;
      }
  
      // Crear cliente
      const clienteResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/clientes/crear`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const { cliente } = clienteResponse.data;
  
      // Crear vehículo asociado al cliente
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/vehiculos/crear`,
        { ...vehiculoData, id_cliente: cliente.id_cliente },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setSuccess('Cliente y vehículo registrados exitosamente.');
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
      });
      setVehiculoData({
        marca: '',
        modelo: '',
        anio: '',
        patente: '',
      });
  
      setTimeout(() => navigate('/clientes/lista'), 2000);
    } catch (error) {
      console.error('Error al registrar cliente y vehículo:', error);
      setError(error.response?.data?.error || 'Error al registrar al cliente y vehículo.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-naranja">Registro de Cliente y Vehículo</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Datos del Cliente */}
        <div>
          <h3 className="text-lg font-bold mb-2">Datos del Cliente</h3>
          <div className="mb-4">
            <label className="block text-celeste font-bold mb-2">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-celeste font-bold mb-2">Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-celeste font-bold mb-2">Correo:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
            />
          </div>
          <div className="mb-4">
            <label className="block text-celeste font-bold mb-2">Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
            />
          </div>
        </div>

        {/* Datos del Vehículo */}
        <div>
          <h3 className="text-lg font-bold mb-2">Datos del Vehículo</h3>
          <div className="mb-4">
            <label className="block text-celeste font-bold mb-2">Marca:</label>
            <input
              type="text"
              name="marca"
              value={vehiculoData.marca}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-celeste font-bold mb-2">Modelo:</label>
            <input
              type="text"
              name="modelo"
              value={vehiculoData.modelo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-celeste font-bold mb-2">Año:</label>
            <input
              type="number"
              name="anio"
              value={vehiculoData.anio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-celeste font-bold mb-2">Patente:</label>
            <input
              type="text"
              name="patente"
              value={vehiculoData.patente}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
              required
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className={`w-full bg-naranja text-white p-2 rounded hover:bg-orange-600 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Cliente y Vehículo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroCliente;
