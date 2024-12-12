// src/pages/layouts/LayoutEmpleado.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const LayoutEmpleado = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    navigate('/login'); // Redirige al login
  };

  return (
    <div className="flex h-screen">
      {/* Menú Lateral */}
      <nav className="w-1/4 bg-blue-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">Panel de Empleado</h1>
          <ul>
            <li className="mb-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-300 font-bold' : 'text-white'
                }
              >
                Inicio
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="clientes/historial"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-300 font-bold' : 'text-white'
                }
              >
                Historial de Clientes
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="clientes/registro"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-300 font-bold' : 'text-white'
                }
              >
                Registrar Cliente
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/dashboard/empleado/tareas/crear"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-300 font-bold' : 'text-white'
                }
              >
                Crear Tarea
              </NavLink>
            </li>
            {/* Agrega más enlaces según las funcionalidades disponibles para empleados */}
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Cerrar Sesión
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet /> {/* Renderiza el contenido de la ruta activa */}
      </main>
    </div>
  );
};

export default LayoutEmpleado;
