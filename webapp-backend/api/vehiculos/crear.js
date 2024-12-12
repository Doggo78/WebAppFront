const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../../middlewares/verifyToken');

const prisma = new PrismaClient();

// Endpoint para crear un vehículo asociado a un cliente
router.post('/', verifyToken, async (req, res) => {
  const { id_cliente, marca, modelo, anio, patente } = req.body;

  // Validar datos del vehículo
  if (!id_cliente || !marca || !modelo || !anio || !patente) {
    return res.status(400).json({ message: 'Los campos marca, modelo, año y patente son obligatorios.' });
  }

  try {
    // Verificar si el cliente existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id_cliente: parseInt(id_cliente) },
    });

    if (!clienteExistente) {
      return res.status(404).json({ message: 'El cliente asociado no existe.' });
    }

    // Crear el vehículo asociado al cliente
    const nuevoVehiculo = await prisma.vehiculo.create({
      data: {
        id_cliente: parseInt(id_cliente),
        marca,
        modelo,
        anio: parseInt(anio),
        patente,
      },
    });

    res.status(201).json({ message: 'Vehículo registrado exitosamente.', vehiculo: nuevoVehiculo });
  } catch (error) {
    console.error('Error al registrar vehículo:', error);
    // Manejar errores de unicidad (como patente duplicada)
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'La patente ya está registrada.' });
    }
    res.status(500).json({ message: 'Error al registrar vehículo.', error: error.message });
  }
});

module.exports = router;
