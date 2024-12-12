// src/pages/GestionTiposTarea.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GestionTiposTarea = () => {
  const [tipos, setTipos] = useState([]);
  const [nuevoTipo, setNuevoTipo] = useState('');

  useEffect(() => {
    const fetchTipos = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tipos-tarea', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTipos(response.data);
    };
    fetchTipos();
  }, []);

  const agregarTipo = async () => {
    if (nuevoTipo.trim() === '') return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/tipos-tarea',
        { nombre: nuevoTipo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTipos([...tipos, response.data]);
      setNuevoTipo('');
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarTipo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/tipos-tarea/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTipos(tipos.filter((tipo) => tipo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-naranja mb-4">Gestión de Tipos de Tarea</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={nuevoTipo}
          onChange={(e) => setNuevoTipo(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-2"
          placeholder="Nuevo tipo de tarea"
        />
        <button
          onClick={agregarTipo}
          className="bg-naranja text-white p-2 rounded hover:bg-orange-600 transition-colors"
        >
          Agregar
        </button>
      </div>
      <ul>
        {tipos.map((tipo) => (
          <li key={tipo.id} className="flex justify-between items-center p-2 border-b border-gray-200">
            {tipo.nombre}
            <button
              onClick={() => eliminarTipo(tipo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionTiposTarea;
