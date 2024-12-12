import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditarCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
  });
  const [vehiculoData, setVehiculoData] = useState({
    id_vehiculo: '', // Asegúrate de incluir este campo
    marca: '',
    modelo: '',
    anio: '',
    patente: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
        return;
      }

      try {
        const clientesResponse = await axios.get('http://localhost:5000/api/clientes/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(clientesResponse.data);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
        setError('Error al obtener la lista de clientes.');
      }
    };

    fetchClientes();
  }, []);

  const handleSelectChange = async (e) => {
    const clientId = e.target.value;
    setSelectedClientId(clientId);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
      return;
    }

    try {
      const selectedClient = clientes.find((cliente) => cliente.id_cliente === parseInt(clientId));
      if (selectedClient) {
        setFormData({
          nombre: selectedClient.nombre,
          telefono: selectedClient.telefono,
          email: selectedClient.email,
          direccion: selectedClient.direccion || '',
        });

        const vehiculoResponse = await axios.get(
          `http://localhost:5000/api/vehiculos/lista/${clientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const vehiculos = vehiculoResponse.data;
        if (vehiculos && vehiculos.length > 0) {
          const vehiculo = vehiculos[0];
          setVehiculoData({
            id_vehiculo: vehiculo.id_vehiculo, // Asegúrate de guardar el ID del vehículo
            marca: vehiculo.marca || '',
            modelo: vehiculo.modelo || '',
            anio: vehiculo.anio || '',
            patente: vehiculo.patente || '',
          });
        } else {
          setVehiculoData({
            id_vehiculo: '',
            marca: '',
            modelo: '',
            anio: '',
            patente: '',
          });
        }
      }
    } catch (error) {
      console.error('Error al obtener datos del cliente o vehículo:', error);
      setError('Error al obtener los datos del cliente o vehículo.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (Object.keys(formData).includes(name)) {
      setFormData({ ...formData, [name]: value });
    } else {
      setVehiculoData({ ...vehiculoData, [name]: value });
    }
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/clientes/editar/${selectedClientId}`,
        { ...formData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axios.put(
        `http://localhost:5000/api/vehiculos/editar/${vehiculoData.id_vehiculo}`,
        { ...vehiculoData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('Cliente y vehículo actualizados exitosamente.');
      setError('');
    } catch (error) {
      console.error('Error al actualizar cliente y vehículo:', error);
      setError('Error al actualizar el cliente y vehículo. Verifique los datos ingresados.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-naranja">Editar Cliente y Vehículo</h2>

      {/* Mensajes de éxito o error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Selección de cliente */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-bold mb-2">Selecciona un Cliente:</label>
          <select
            value={selectedClientId}
            onChange={handleSelectChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Datos del Cliente */}
        <div>
          <h3 className="text-lg font-bold mb-2">Datos del Cliente</h3>
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
            <label className="block text-gray-700 font-bold mb-2">Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Correo Electrónico:</label>
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
            <label className="block text-gray-700 font-bold mb-2">Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Datos del Vehículo */}
        <div>
          <h3 className="text-lg font-bold mb-2">Datos del Vehículo</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Marca:</label>
            <input
              type="text"
              name="marca"
              value={vehiculoData.marca}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Modelo:</label>
            <input
              type="text"
              name="modelo"
              value={vehiculoData.modelo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Año:</label>
            <input
              type="number"
              name="anio"
              value={vehiculoData.anio}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Patente:</label>
            <input
              type="text"
              name="patente"
              value={vehiculoData.patente}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
        <button
            type="submit"
            className={`w-full bg-naranja text-white p-2 rounded hover:bg-orange-600 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar Cliente y Vehículo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarCliente;
