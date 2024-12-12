const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../../middlewares/verifyToken');

const prisma = new PrismaClient();

// Ejemplo de endpoint
router.post('/', verifyToken, async (req, res) => {
  const { tareaId, empleadoId } = req.body;
  try {
    const tareaAsignada = await prisma.tarea.update({
      where: { id_tarea: tareaId },
      data: { id_empleado: empleadoId },
    });
    res.json({ message: 'Tarea asignada exitosamente.', tarea: tareaAsignada });
  } catch (error) {
    console.error('Error al asignar tarea:', error);
    res.status(500).json({ message: 'Error al asignar tarea.' });
  }
});

module.exports = router;
