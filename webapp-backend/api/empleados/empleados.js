const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Endpoint para obtener empleados
router.get('/', async (req, res) => {
  try {
    const empleados = await prisma.empleado.findMany();
    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ message: 'Error al obtener empleados.' });
  }
});
// Endpoint para obtener las tareas de un empleado
router.get('/:id_empleado/tareas', async (req, res) => {
  const { id_empleado } = req.params;

  try {
    const tareas = await prisma.tarea.findMany({
      where: { id_empleado: parseInt(id_empleado) },
      include: {
        cliente: true,
      },
    });
    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas del empleado.' });
  }
});

module.exports = router;
