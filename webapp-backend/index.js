const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.empleado.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: user.id_empleado, role: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.rol });
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Rutas para clientes
app.post('/api/clientes', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);

  const { nombre, telefono, email, direccion } = req.body;

  try {
    const clienteExistente = await prisma.cliente.findFirst({
      where: { OR: [{ telefono }, { email }] },
    });
    if (clienteExistente) {
      return res.status(400).json({ error: 'Teléfono o correo ya registrados' });
    }

    const nuevoCliente = await prisma.cliente.create({ data: { nombre, telefono, email, direccion } });
    res.json(nuevoCliente);
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
});

// Rutas para empleados
app.post('/api/empleados', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);

  const { nombre, rol, telefono, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoEmpleado = await prisma.empleado.create({
      data: { nombre, rol, telefono, email, password: hashedPassword },
    });
    res.json(nuevoEmpleado);
  } catch (error) {
    console.error('Error al registrar empleado:', error);
    res.status(500).json({ error: 'Error al registrar empleado' });
  }
});

// Rutas para tareas
app.post('/api/tareas', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);

  const { id_cliente, id_empleado, id_vehiculo, id_tipo_tarea, fecha_hora, descripcion } = req.body;

  try {
    const nuevaTarea = await prisma.tarea.create({
      data: {
        id_cliente,
        id_empleado,
        id_vehiculo,
        id_tipo_tarea,
        fecha_hora: new Date(fecha_hora),
        estado: 'pendiente',
        descripcion,
      },
    });
    res.json(nuevaTarea);
  } catch (error) {
    console.error('Error al registrar tarea:', error);
    res.status(500).json({ error: 'Error al registrar tarea' });
  }
});

// Rutas para historial de servicios
app.get('/api/historiales', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);

  try {
    const historiales = await prisma.historialServicio.findMany({
      include: { cliente: true, tarea: true },
    });
    res.json(historiales);
  } catch (error) {
    console.error('Error al obtener historiales:', error);
    res.status(500).json({ error: 'Error al obtener historiales' });
  }
});

// Rutas para vehículos
app.post('/api/vehiculos', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);

  const { id_cliente, marca, modelo, anio, patente, descripcion } = req.body;

  try {
    const nuevoVehiculo = await prisma.vehiculo.create({
      data: { id_cliente, marca, modelo, anio, patente, descripcion },
    });
    res.json(nuevoVehiculo);
  } catch (error) {
    console.error('Error al registrar vehículo:', error);
    res.status(500).json({ error: 'Error al registrar vehículo' });
  }
});

// Ruta para obtener productividad por empleado
app.get('/api/reportes/productividad', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);

  const { inicio, fin } = req.query;

  try {
    const productividad = await prisma.tarea.groupBy({
      by: ['id_empleado'],
      where: {
        estado: 'completada',
        updatedAt: { gte: new Date(inicio), lte: new Date(fin) },
      },
      _count: { id_tarea: true },
    });
    res.json(productividad);
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

// Arranque del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
