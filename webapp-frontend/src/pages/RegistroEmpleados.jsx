// src/pages/RegistroEmpleados.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistroEmpleados = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (
      !formData.nombre ||
      !formData.telefono ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Ingrese un correo electrónico válido.');
      return;
    }

    if (formData.password.length < 3) {
      setError('La contraseña debe tener al menos 3 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
        return;
      }

      // Enviar datos al backend
      await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Empleado registrado exitosamente.');
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Redirigir a la lista de empleados o a otra página si es necesario
      // setTimeout(() => navigate('/empleados/lista'), 2000);
    } catch (error) {
      console.error('Error al registrar empleado:', error);
      setError(error.response?.data?.message || 'Error al registrar el empleado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-naranja">Registro de Empleado</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
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
        {/* Teléfono */}
        <div className="mb-4">
          <label className="block text-celeste font-bold mb-2">Telefono:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
            required
          />
        </div>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-celeste font-bold mb-2">Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
            required
          />
        </div>
        {/* Contraseña */}
        <div className="mb-4">
          <label className="block text-celeste font-bold mb-2">Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
            required
          />
        </div>
        {/* Confirmar Contraseña */}
        <div className="mb-4">
          <label className="block text-celeste font-bold mb-2">Confirmar Contraseña:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-celeste"
            required
          />
        </div>
        {/* Botón de Registro */}
        <button
          type="submit"
          className={`w-full bg-naranja text-white p-2 rounded hover:bg-orange-600 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar Empleado'}
        </button>
      </form>
    </div>
  );
};

export default RegistroEmpleados;
