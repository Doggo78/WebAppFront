// api/empleados/gestion.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');

const prisma = new PrismaClient();

// Endpoint para eliminar un empleado
router.delete('/:id_empleado', verifyToken, verifyRole('admin'), async (req, res) => {
  const { id_empleado } = req.params;
  try {
    await prisma.empleado.delete({
      where: { id_empleado: parseInt(id_empleado) },
    });
    res.json({ message: 'Empleado eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ message: 'Error al eliminar el empleado.' });
  }
});
// Ruta para actualizar un empleado
router.put('/:id_empleado', async (req, res) => {
  const { id_empleado } = req.params;
  const { nombre, email, rol } = req.body;

  try {
    const empleadoActualizado = await prisma.empleado.update({
      where: { id_empleado: parseInt(id_empleado) },
      data: { nombre, email, rol },
    });
    res.json({ message: 'Empleado actualizado exitosamente.', empleado: empleadoActualizado });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ message: 'Error al actualizar el empleado.' });
  }
});

module.exports = router;
