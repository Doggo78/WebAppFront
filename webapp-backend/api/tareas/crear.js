const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../../middlewares/verifyToken');

const prisma = new PrismaClient();

// Endpoint para crear una nueva tarea
router.post('/', verifyToken, async (req, res) => {
  const { id_cliente, id_empleado, id_vehiculo, descripcion, fecha_hora, estado } = req.body;

  // Validar campos requeridos
  if (!id_cliente || !id_empleado || !id_vehiculo || !fecha_hora || !estado) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  // Validar formato de fecha
  const fecha = new Date(fecha_hora);
  if (isNaN(fecha.getTime())) {
    return res.status(400).json({ message: 'El formato de fecha y hora es inválido.' });
  }

  try {
    // Verificar si el cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente: parseInt(id_cliente) },
    });
    if (!cliente) {
      return res.status(404).json({ message: 'El cliente no existe.' });
    }

    // Verificar si el empleado existe
    const empleado = await prisma.empleado.findUnique({
      where: { id_empleado: parseInt(id_empleado) },
    });
    if (!empleado) {
      return res.status(404).json({ message: 'El empleado no existe.' });
    }

    // Verificar si el vehículo existe
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id_vehiculo: parseInt(id_vehiculo) },
    });
    if (!vehiculo) {
      return res.status(404).json({ message: 'El vehículo no existe.' });
    }

    // Crear la tarea
    const nuevaTarea = await prisma.tarea.create({
      data: {
        id_cliente: parseInt(id_cliente),
        id_empleado: parseInt(id_empleado),
        id_vehiculo: parseInt(id_vehiculo),
        descripcion: descripcion || null,
        fecha_hora: fecha,
        estado,
      },
    });

    res.json({ message: 'Tarea creada exitosamente.', tarea: nuevaTarea });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ message: 'Error al crear tarea.', error: error.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const empleados = await prisma.empleado.findMany();
    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener lista de empleados:', error);
    res.status(500).json({ message: 'Error al obtener lista de empleados' });
  }
});

module.exports = router;
