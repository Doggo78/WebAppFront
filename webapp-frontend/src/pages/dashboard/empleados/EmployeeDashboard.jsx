// src/pages/dashboard/empleado/EmployeeDashboard.jsx
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import ListaClientes from '../clientes/ListaClientes';
import RegistroCliente from '../clientes/RegistroClientes';
import Tareas from '../../tareas/AsignarTareas';

const EmployeeDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Empleado</h1>
      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="clientes/lista" className="text-blue-500 hover:underline">
              Lista de Clientes
            </Link>
          </li>
          <li>
            <Link to="clientes/registro" className="text-blue-500 hover:underline">
              Registrar Cliente
            </Link>
          </li>
          <li>
            <Link to="tareas/crear" className="text-blue-500 hover:underline">
              Crear Tarea
            </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="clientes/lista" element={<ListaClientes />} />
        <Route path="clientes/registro" element={<RegistroCliente />} />
        <Route path="tareas/crear" element={<Tareas />} />
      </Routes>
    </div>
  );
};

export default EmployeeDashboard;
