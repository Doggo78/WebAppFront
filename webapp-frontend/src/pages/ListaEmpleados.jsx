// src/pages/dashboard/empleados/ListaEmpleados.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No estás autenticado.');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/users/empleados', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmpleados(response.data);
      } catch (err) {
        console.error('Error al obtener empleados:', err);
        setError('Error al obtener la lista de empleados.');
      }
    };

    fetchEmpleados();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Empleados</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {empleados.map((empleado) => (
        <div key={empleado.id_empleado} className="mb-6 border-b pb-4">
          <h3 className="text-xl font-bold">{empleado.nombre}</h3>
          <p>Email: {empleado.email}</p>
          <p>Teléfono: {empleado.telefono}</p>
          <p>Rol: {empleado.rol}</p>
          <h4 className="text-lg font-bold mt-2">Tareas Completadas:</h4>
          {empleado.tareas && empleado.tareas.length > 0 ? (
            <ul className="list-disc pl-5">
              {empleado.tareas
                .filter((tarea) => tarea.estado.toLowerCase() === 'completada')
                .map((tarea) => (
                  <li key={tarea.id_tarea}>
                    {tarea.descripcion} - Fecha: {new Date(tarea.fecha_hora).toLocaleDateString()}
                  </li>
                ))}
            </ul>
          ) : (
            <p>No tiene tareas completadas.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListaEmpleados;
