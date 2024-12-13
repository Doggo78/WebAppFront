// src/pages/login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validar si es un email válido
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar campos antes de realizar la solicitud
    if (!isValidEmail(username)) {
      setError('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    if (password.length < 3) {
      setError('La contraseña debe tener al menos 3 caracteres.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Hacer la solicitud al backend
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        username,
        password,
      });

      const { token, rol } = response.data;

      // Verificar que el token sea válido
      if (!token) {
        setError('Error en el servidor. Token no proporcionado.');
        return;
      }

      // Guardar el token y el rol en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);

      // Redirigir según el rol del usuario
      if (rol.toLowerCase() === 'admin') {
        navigate('/dashboard/admin');
      } else if (rol.toLowerCase() === 'empleado') {
        navigate('/dashboard/empleado');
      } else {
        setError('Rol desconocido. Comuníquese con el administrador.');
      }
    } catch (err) {
      // Manejo de errores
      if (err.response) {
        const { status } = err.response;
        if (status === 401) {
          setError('Usuario o contraseña incorrectos.');
        } else if (status === 403) {
          setError('Acceso denegado. Verifique sus credenciales.');
        } else if (status >= 500) {
          setError('Error en el servidor. Intente nuevamente más tarde.');
        }
      } else {
        setError('No se pudo conectar al servidor. Verifique su conexión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-bold mb-2">
              Correo electrónico:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
