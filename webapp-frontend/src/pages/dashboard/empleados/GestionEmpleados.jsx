// src/pages/dashboard/empleados/GestionarEmpleado.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GestionarEmpleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editEmpleado, setEditEmpleado] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: '',
  });

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/empleados`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpleados(response.data);
      setError('');
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      setError('Error al obtener la lista de empleados.');
    }
  };

  const eliminarEmpleado = async (id_empleado) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/empleados/${id_empleado}/gestion`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Empleado eliminado exitosamente.');
      fetchEmpleados();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      setError('Error al eliminar el empleado.');
    }
  };

  const editarEmpleado = (empleado) => {
    setEditEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre,
      email: empleado.email,
      rol: empleado.rol,
    });
    setSuccess('');
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/empleados/${editEmpleado.id_empleado}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Empleado actualizado exitosamente.');
      fetchEmpleados();
      setEditEmpleado(null);
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      setError('Error al actualizar el empleado.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestionar Empleados</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* Tabla de empleados */}
      <table className="min-w-full bg-white mb-6">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Rol</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.id_empleado}>
              <td className="py-2 px-4 border-b">{empleado.nombre}</td>
              <td className="py-2 px-4 border-b">{empleado.email}</td>
              <td className="py-2 px-4 border-b">{empleado.rol}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => editarEmpleado(empleado)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarEmpleado(empleado.id_empleado)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario de edición */}
      {editEmpleado && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Editar Empleado</h3>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Rol:</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Seleccione un rol</option>
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Actualizar Empleado
            </button>
            <button
              onClick={() => setEditEmpleado(null)}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 ml-2"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GestionarEmpleado;
