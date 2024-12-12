const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Ruta para obtener la lista de clientes
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
