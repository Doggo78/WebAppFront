const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Ruta para obtener la lista de clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener lista de clientes:', error);
    res.status(500).json({ message: 'Error al obtener lista de clientes' });
  }
});

module.exports = router;
