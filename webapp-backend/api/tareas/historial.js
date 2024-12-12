// api/tareas/historial.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');

const prisma = new PrismaClient();

// Obtener todas las tareas con información de empleado y cliente
router.get('/', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const tareas = await prisma.tarea.findMany({
      include: {
        empleado: true,
        cliente: true,
      },
    });
    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener historial de tareas:', error);
    res.status(500).json({ message: 'Error al obtener el historial de tareas.' });
  }
});

// Asignar un empleado a una tarea
router.post('/:id_tarea/asignar', verifyToken, verifyRole('admin'), async (req, res) => {
  const { id_tarea } = req.params;
  const { empleadoId } = req.body;

  if (!empleadoId) {
    return res.status(400).json({ message: 'Se requiere el id_empleado para asignar la tarea.' });
  }

  try {
    const empleado = await prisma.empleado.findUnique({
      where: { id_empleado: parseInt(empleadoId) },
    });

    if (!empleado) {
      return res.status(404).json({ message: 'El empleado no existe.' });
    }

    const tareaActualizada = await prisma.tarea.update({
      where: { id_tarea: parseInt(id_tarea) },
      data: { id_empleado: parseInt(empleadoId) },
      include: { empleado: true },
    });

    res.json({ message: 'Empleado asignado a la tarea exitosamente.', tarea: tareaActualizada });
  } catch (error) {
    console.error('Error al asignar empleado a la tarea:', error);
    res.status(500).json({ message: 'Error al asignar empleado a la tarea.' });
  }
});

module.exports = router;
