import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Verifica si hay un token en el almacenamiento local

  // Si no hay un token, redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, renderiza los hijos del componente
  return children;
};

export default PrivateRoute;
