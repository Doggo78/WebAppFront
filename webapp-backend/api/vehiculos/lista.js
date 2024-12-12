// api/vehiculos/lista.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ruta para obtener los vehículos asociados a un cliente
router.get('/:clienteId', async (req, res) => {
  const { clienteId } = req.params;
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      where: {
        id_cliente: parseInt(clienteId),
      },
    });

    if (!vehiculos || vehiculos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron vehículos para este cliente.' });
    }

    res.json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ message: 'Error al obtener los vehículos.' });
  }
});

module.exports = router;
