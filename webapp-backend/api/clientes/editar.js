// api/clientes/editar.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');

const prisma = new PrismaClient();

// Endpoint para obtener la lista de clientes
router.get('/', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error al obtener clientes.' });
  }
});

// Endpoint para actualizar un cliente
router.put('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  const id_cliente = parseInt(req.params.id);
  const { nombre, telefono, email, direccion } = req.body;

  if (!nombre || !telefono || !email) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const clienteActualizado = await prisma.cliente.update({
      where: { id_cliente },
      data: { nombre, telefono, email, direccion },
    });
    res.json({ message: 'Cliente actualizado exitosamente.', cliente: clienteActualizado });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ message: 'Error al actualizar el cliente.' });
  }
});

module.exports = router;