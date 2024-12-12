// api/clientes/clientes.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');

const prisma = new PrismaClient();

// Ruta para obtener la lista de clientes
router.get('/', verifyToken, async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error al obtener clientes.' });
  }
});

// Ruta para obtener detalles de un cliente
router.get('/:clienteId', verifyToken, verifyRole('admin'), async (req, res) => {
  const { clienteId } = req.params;

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente: parseInt(clienteId) },
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ message: 'Error al obtener el cliente.' });
  }
});

// Ruta para obtener vehículos del cliente
router.get('/:clienteId/vehiculos', verifyToken, verifyRole('admin'), async (req, res) => {
  const { clienteId } = req.params;

  try {
    const vehiculos = await prisma.vehiculo.findMany({
      where: { id_cliente: parseInt(clienteId) },
    });
    res.json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ message: 'Error al obtener vehículos del cliente.' });
  }
});

// Ruta para obtener tareas del cliente
router.get('/:clienteId/tareas', verifyToken, verifyRole('admin'), async (req, res) => {
  const { clienteId } = req.params;

  try {
    const tareas = await prisma.tarea.findMany({
      where: { id_cliente: parseInt(clienteId) },
    });
    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error al obtener tareas del cliente.' });
  }
});

module.exports = router;
