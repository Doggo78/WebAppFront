import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const EmpleadoItem = ({ empleado }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EMPLEADO',
    item: { id: empleado.id_empleado },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="p-2 m-2 bg-celeste text-white rounded cursor-pointer"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {empleado.nombre}
    </div>
  );
};

const TareaItem = ({ tarea, asignarEmpleado }) => {
  const [, drop] = useDrop(() => ({
    accept: 'EMPLEADO',
    drop: (item) => asignarEmpleado(tarea.id_tarea, item.id),
  }));

  return (
    <div
      ref={drop}
      className="p-4 m-2 border border-gray-300 rounded bg-white hover:bg-gray-100"
    >
      <h3 className="text-lg font-bold text-naranja">{tarea.descripcion}</h3>
      <p className="text-sm text-gray-500">Estado: {tarea.estado}</p>
      {tarea.empleado && (
        <p className="text-sm text-gray-700">Asignado a: {tarea.empleado.nombre}</p>
      )}
    </div>
  );
};

const HistorialTareas = () => {
  const [empleados, setEmpleados] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const empleadosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/empleados/historial`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tareasResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tareas/historial`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEmpleados(empleadosResponse.data);
        setTareas(tareasResponse.data);
        setError('');
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar empleados o tareas.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const asignarEmpleado = async (tareaId, empleadoId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró un token de autenticación. Inicia sesión nuevamente.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/tareas/historial/${tareaId}/asignar`,
        { empleadoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar el estado con la tarea asignada
      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.id_tarea === tareaId ? { ...tarea, empleado: response.data.tarea.empleado } : tarea
        )
      );
      setError('');
    } catch (err) {
      console.error('Error al asignar tarea:', err);
      setError('Error al asignar la tarea. Intente nuevamente.');
    }
  };

  if (loading) {
    return <p className="text-center text-blue-500">Cargando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col md:flex-row mt-10">
        <div className="md:w-1/4 p-4 bg-white shadow">
          <h2 className="text-xl font-bold text-center text-naranja mb-4">Empleados</h2>
          {empleados.map((empleado) => (
            <EmpleadoItem key={empleado.id_empleado} empleado={empleado} />
          ))}
        </div>
        <div className="md:w-3/4 p-4">
          <h2 className="text-xl font-bold text-center text-naranja mb-4">Historial de Tareas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tareas.map((tarea) => (
              <TareaItem key={tarea.id_tarea} tarea={tarea} asignarEmpleado={asignarEmpleado} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default HistorialTareas;
