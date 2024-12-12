// api/users/empleados/register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const verifyRole = require('../../middlewares/verifyRole')

// Ruta para registrar un empleado
router.post('/', verifyRole('admin'), async (req, res) => {
  const { email, password, confirmPassword, rol, nombre, telefono } = req.body;

  // Validar que todos los campos están presentes
  if (!email || !password || !confirmPassword || !nombre || !telefono) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  // Validar que las contraseñas coinciden
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }

  try {
    // Verificar si el email ya está registrado
    const existingEmpleado = await prisma.empleado.findUnique({
      where: { email },
    });

    if (existingEmpleado) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoEmpleado = await prisma.empleado.create({
      data: {
        email,
        password: hashedPassword,
        rol:'empleado',
        nombre,
        telefono,
      },
    });

    res.status(201).json({ message: 'Empleado registrado exitosamente.', empleado: nuevoEmpleado });
  } catch (error) {
    console.error('Error al registrar empleado:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

module.exports = router;