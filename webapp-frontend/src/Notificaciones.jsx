// src/components/Notificaciones.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/notificaciones', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotificaciones(response.data);
    };
    fetchNotificaciones();
  }, []);

  const marcarComoLeido = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/notificaciones/${id}`,
        { leido: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotificaciones((prevNotifs) => prevNotifs.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <button className="relative bg-naranja text-white p-2 rounded-full">
        Notificaciones
        {notificaciones.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
            {notificaciones.length}
          </span>
        )}
      </button>
      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg">
        {notificaciones.length === 0 ? (
          <p className="p-2 text-gray-500">No tienes notificaciones nuevas.</p>
        ) : (
          notificaciones.map((notif) => (
            <div key={notif.id} className="p-2 border-b border-gray-200">
              <p>{notif.mensaje}</p>
              <button
                onClick={() => marcarComoLeido(notif.id)}
                className="text-celeste text-sm mt-1"
              >
                Marcar como leído
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notificaciones;
