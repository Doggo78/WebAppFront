import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReporteProductividad = () => {
  const [empleados, setEmpleados] = useState([]);
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');

  const fetchReporte = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reportes', {
        params: { inicio, fin },
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al obtener el reporte de productividad:', error);
    }
  };

  useEffect(() => {
    if (inicio && fin) {
      fetchReporte();
    }
  }, [inicio, fin]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-naranja mb-4">Historial servicios por empleado</h2>
      <div className="flex mb-4">
        <input
          type="date"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="date"
          value={fin}
          onChange={(e) => setFin(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Empleado</th>
            <th className="py-2 px-4 border-b">Tareas Completadas</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.empleadoId}>
              <td className="py-2 px-4 border-b">{empleado.empleado.nombre}</td>
              <td className="py-2 px-4 border-b">{empleado._count.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteProductividad;