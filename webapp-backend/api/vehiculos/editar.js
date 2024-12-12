const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');

const prisma = new PrismaClient();

router.put('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  const id_vehiculo = parseInt(req.params.id, 10);
  const { marca, modelo, anio, patente } = req.body;

  if (!id_vehiculo || !marca || !modelo || !anio || !patente) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const vehiculoExistente = await prisma.vehiculo.findUnique({
      where: { id_vehiculo },
    });

    if (!vehiculoExistente) {
      return res.status(404).json({ message: 'El vehículo no existe.' });
    }

    const vehiculoActualizado = await prisma.vehiculo.update({
      where: { id_vehiculo },
      data: { marca, modelo, anio: parseInt(anio, 10), patente },
    });

    res.json({ message: 'Vehículo actualizado exitosamente.', vehiculo: vehiculoActualizado });
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    res.status(500).json({ message: 'Error al actualizar el vehículo.' });
  }
});

module.exports = router;
