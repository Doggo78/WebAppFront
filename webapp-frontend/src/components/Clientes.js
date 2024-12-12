import React, { useEffect, useState } from 'react';
import api from '../api';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    api.get('/clientes')
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar clientes:', error);
      });
  }, []);

  return (
    <div>
      <h1>Clientes</h1>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>{cliente.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;
