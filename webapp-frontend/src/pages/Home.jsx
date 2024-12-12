// src/pages/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-celeste text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">H.E.L.D Soluciones Automotrices</h1>
      <p className="text-xl mb-6">Gestiona tus tareas y asigna empleados de forma sencilla</p>
      <a href="/login" className="bg-naranja text-white py-2 px-4 rounded hover:bg-orange-600">
        Iniciar Sesión
      </a>
    </div>
  );
};

export default Home;
