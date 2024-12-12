// api/empleados/historial.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');

const prisma = new PrismaClient();

// Endpoint para obtener las tareas de un empleado
router.get('/:id_empleado/tareas', verifyToken, verifyRole('admin'), async (req, res) => {
  const { id_empleado } = req.params;

  try {
    const tareas = await prisma.tarea.findMany({
      where: { id_empleado: parseInt(id_empleado) },
      include: {
        cliente: true, // Si deseas incluir información del cliente
      },
    });
    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas del empleado.' });
  }
});

module.exports = router;
