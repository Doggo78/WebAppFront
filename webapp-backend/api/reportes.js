const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ruta para obtener el reporte de productividad
router.get('/productividad', async (req, res) => {
  const { inicio, fin } = req.query;

  try {
    // Consulta de productividad basada en las fechas de inicio y fin
    const reporte = await prisma.tarea.groupBy({
      by: ['empleadoId'],
      _count: { id: true },
      where: {
        completado: true, // Si tienes un campo que indique tareas completadas
        fecha: {
          gte: new Date(inicio),
          lte: new Date(fin),
        },
      },
      include: {
        empleado: {
          select: {
            nombre: true,
          },
        },
      },
    });

    res.json(reporte);
  } catch (error) {
    console.error('Error al generar el reporte de productividad:', error);
    res.status(500).json({ message: 'Error al generar el reporte de productividad' });
  }
});

module.exports = router;
