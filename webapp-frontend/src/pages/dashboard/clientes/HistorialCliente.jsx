// src/pages/dashboard/clientes/HistorialClientes.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistorialClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuario no autenticado. Inicie sesión nuevamente.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/clientes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(response.data);
        setError('');
      } catch (error) {
        setError('Error al obtener clientes. Por favor, intente nuevamente.');
        console.error('Error al obtener clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleClienteClick = async (clienteId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Usuario no autenticado. Inicie sesión nuevamente.');
      return;
    }

    try {
      const clienteResponse = await axios.get(`http://localhost:5000/api/clientes/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedCliente(clienteResponse.data);

      const vehiculosResponse = await axios.get(
        `http://localhost:5000/api/clientes/${clienteId}/vehiculos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVehiculos(vehiculosResponse.data);

      const tareasResponse = await axios.get(
        `http://localhost:5000/api/clientes/${clienteId}/tareas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTareas(tareasResponse.data);

      setError('');
    } catch (error) {
      setError('Error al obtener información del cliente. Por favor, intente nuevamente.');
      console.error('Error al obtener datos del cliente:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-naranja mb-4">Historial de Clientes</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lista de Clientes */}
        <div>
          <h3 className="text-lg font-bold text-naranja mb-2">Clientes</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Teléfono</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Servicios recibidos</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td className="py-2 px-4 border-b">{cliente.nombre}</td>
                  <td className="py-2 px-4 border-b">{cliente.telefono}</td>
                  <td className="py-2 px-4 border-b">{cliente.email}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleClienteClick(cliente.id_cliente)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detalles del Cliente */}
        {selectedCliente && (
          <div>
            <h3 className="text-lg font-bold text-naranja mb-2">
              Detalles de {selectedCliente.nombre}
            </h3>
            <div className="mb-4">
              <h4 className="font-bold">Vehículos:</h4>
              <ul>
                {vehiculos.map((vehiculo) => (
                  <li key={vehiculo.id_vehiculo}>
                    {vehiculo.marca} {vehiculo.modelo} - {vehiculo.patente}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold">Tareas:</h4>
              <ul>
                {tareas.map((tarea) => (
                  <li key={tarea.id_tarea}>
                    {tarea.descripcion} - Estado: {tarea.estado}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialClientes;
