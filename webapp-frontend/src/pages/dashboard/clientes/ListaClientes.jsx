// src/pages/dashboard/clientes/ListaClientes.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');

  // Fetch clientes desde la API
  useEffect(() => {
    const fetchClientes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuario no autenticado. Inicie sesión nuevamente.');
        return;
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/clientes/lista`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(response.data);
      } catch (error) {
        setError('Error al obtener clientes. Por favor, intente nuevamente.');
        console.error('Error al obtener clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-naranja mb-4">Lista de Clientes</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Teléfono</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Dirección</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td className="py-2 px-4 border-b">{cliente.nombre}</td>
              <td className="py-2 px-4 border-b">{cliente.telefono}</td>
              <td className="py-2 px-4 border-b">{cliente.email}</td>
              <td className="py-2 px-4 border-b">{cliente.direccion || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaClientes;
