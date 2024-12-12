// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importar componentes y páginas
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
//INTERFAZ ADMIN/EMPLEADO
import EmployeeDashboard from './pages/dashboard/empleados/EmployeeDashboard';
import EmpleadoLayout from './pages/layouts/EmpleadoLayout';
import AdminLayout from './pages/layouts/AdminLayout';
//LOGIN
import Login from './pages/login';
//EMPLEADOS
import RegistroEmpleados from './pages/RegistroEmpleados';
import GestionEmpleados from './pages/dashboard/empleados/GestionEmpleados';
import HistorialEmpleados from './pages/dashboard/empleados/HistorialEmpleados';
//CLIENTES
import RegistroClientes from './pages/dashboard/clientes/RegistroClientes';
import HistorialCliente from './pages/dashboard/clientes/HistorialCliente';
import EditarCliente from './pages/dashboard/clientes/EditarCliente';
import ListaClientes from './pages/dashboard/clientes/ListaClientes';
//TAREAS
import CrearTarea from './pages/tareas/CrearTareas';
import AsignarTareas from './pages/tareas/AsignarTareas';
import ReporteProductividad from './pages/ReporteProductividad';
import HistorialTareas from './pages/dashboard/admin/HistorialTareas';
//VEHICULOS




const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />

        {/* Rutas del Administrador protegidas */}
        <Route
          path="/dashboard/admin/*"
          element={
            <PrivateRoute role="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >      
          <Route path="empleados/registro" element={<RegistroEmpleados />} />
          <Route path="empleados/gestion" element={<GestionEmpleados />} />
          <Route path="empleados/historial" element={<HistorialEmpleados />} />
          <Route path="tareas/crear" element={<CrearTarea />} />
          <Route path="tareas/asignar" element={<AsignarTareas />} />
          <Route path="tareas/historial" element={<HistorialTareas />} />
          <Route path="clientes/registro" element={<RegistroClientes />} />
          <Route path="clientes/historial" element={<HistorialCliente />} />
          <Route path="clientes/editar" element={<EditarCliente />} />
          <Route path="clientes/lista" element={<ListaClientes />} />
          <Route path="reportes/productividad" element={<ReporteProductividad />} />
        </Route>

        {/* Rutas del Empleado protegidas */}
        <Route
          path="/dashboard/empleado/*"
          element={
            <PrivateRoute role="empleado">
              <EmpleadoLayout />
            </PrivateRoute>
          }
        >
          {/* Puedes agregar más rutas específicas para empleados aquí */}
          <Route path="empleados/registro" element={<RegistroEmpleados />} />
          <Route path="empleados/gestion" element={<GestionEmpleados />} />
          <Route path="empleados/historial" element={<HistorialEmpleados />} />
          <Route path="tareas/crear" element={<CrearTarea />} />
          <Route path="tareas/asignar" element={<AsignarTareas />} />
          <Route path="tareas/historial" element={<HistorialTareas />} />
          <Route path="clientes/registro" element={<RegistroClientes />} />
          <Route path="clientes/historial" element={<HistorialCliente />} />
          <Route path="clientes/editar" element={<EditarCliente />} />
          <Route path="clientes/lista" element={<ListaClientes />} />
          <Route path="reportes/productividad" element={<ReporteProductividad />} />
        </Route>

        {/* Redirección en caso de rutas no encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
