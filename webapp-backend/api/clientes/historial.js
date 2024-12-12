const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Ruta para obtener el historial de un cliente específico
router.get('/:clienteId', async (req, res) => {
  const { clienteId } = req.params;

  try {
    const historial = await prisma.historial.findMany({
      where: { clienteId: parseInt(clienteId, 10) },
      include: {
        cliente: true, // Incluir los datos del cliente relacionado
      },
    });

    if (!historial) {
      return res.status(404).json({ message: 'No se encontró el historial para este cliente.' });
    }

    res.json(historial);
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    res.status(500).json({ message: 'Error al obtener el historial.' });
  }
});

// Ruta para registrar una interacción en el historial de un cliente
router.post('/:clienteId', async (req, res) => {
  const { clienteId } = req.params;
  const { descripcion, fecha } = req.body;

  if (!descripcion || !fecha) {
    return res.status(400).json({ message: 'La descripción y la fecha son obligatorias.' });
  }

  try {
    const nuevaInteraccion = await prisma.historial.create({
      data: {
        descripcion,
        fecha: new Date(fecha),
        clienteId: parseInt(clienteId, 10),
      },
    });

    res.status(201).json({ message: 'Interacción registrada exitosamente.', historial: nuevaInteraccion });
  } catch (error) {
    console.error('Error al registrar interacción:', error);
    res.status(500).json({ message: 'Error al registrar la interacción.' });
  }
});

// Ruta para eliminar una interacción del historial
router.delete('/:historialId', async (req, res) => {
  const { historialId } = req.params;

  try {
    await prisma.historial.delete({
      where: { id: parseInt(historialId, 10) },
    });

    res.status(200).json({ message: 'Interacción eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar interacción:', error);
    res.status(500).json({ message: 'Error al eliminar la interacción.' });
  }
});

module.exports = router;
