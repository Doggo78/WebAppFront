// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


// Variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Permitir solicitudes desde cualquier origen
app.use(express.json()); // Middleware para analizar solicitudes JSON


// Middleware para registrar solicitudes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// REGITRAR EMPLEADOS VALIDAR LOGIN 
const authRoutes = require('./api/auth/login');
const registerEmpleadosRoutes = require('./api/auth/register');
// CLIENTES 
const editarClienteRoutes = require('./api/clientes/editar');
const crearClientesRoutes = require('./api/clientes/crear');
const historialClientesRoutes = require('./api/clientes/historial');
const clientesListaRoutes = require('./api/clientes/lista');
const clientesRoutes = require('./api/clientes/clientes');
// EMPLEADOS 
const empleadosRoutes = require('./api/empleados/gestion');
const historialEmpleadosRoutes = require('./api/empleados/historial');
const empleadosqRoutes = require('./api/empleados/empleados');
// TAREAS 
const tareasCrearRoutes = require('./api/tareas/crear');
const tareasAsignarRoutes = require('./api/tareas/asignar');
const historialTareasRoutes = require('./api/tareas/historial');
const reportesRoutes = require('./api/reportes');
//VEHICULOS
const crearVehiculoRoutes = require('./api/vehiculos/crear')
const editarVehiculosRoutes = require('./api/vehiculos/editar')
const listaVehiculosRoutes = require('./api/vehiculos/lista')
const verifyToken = require('./middlewares/verifyToken');

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta protegida de ejemplo
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: `Bienvenido, ${req.user.rol}` });
});
// Rutas de la aplicación (protegidas con verifyToken)
app.use('/api/auth/register', verifyToken, registerEmpleadosRoutes);
// CLIENTES
app.use('/api/clientes/editar', verifyToken, editarClienteRoutes);
app.use('/api/clientes/crear', verifyToken, crearClientesRoutes);
app.use('/api/clientes/historial', verifyToken, historialClientesRoutes);
app.use('/api/clientes/lista', verifyToken, clientesListaRoutes);
app.use('/api/clientes', verifyToken, clientesRoutes);
// EMPLEADOS
app.use('/api/empleados/gestion', verifyToken, empleadosRoutes);
app.use('/api/empleados/historial', verifyToken, historialEmpleadosRoutes);
app.use('/api/empleados', verifyToken, empleadosqRoutes);
//TAREAS
app.use('/api/tareas/crear', verifyToken, tareasCrearRoutes);
app.use('/api/tareas/asignar', verifyToken, tareasAsignarRoutes);
app.use('/api/reportes', verifyToken, reportesRoutes);
app.use('/api/tareas/historial', verifyToken, historialTareasRoutes);
//VEHICULOS
app.use('/api/vehiculos/crear', verifyToken, crearVehiculoRoutes);
app.use('/api/vehiculos/editar', verifyToken, editarVehiculosRoutes);
app.use('/api/vehiculos/lista', verifyToken, listaVehiculosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor corriendo correctamente');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
