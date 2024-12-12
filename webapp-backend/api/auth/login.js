// api/auth/login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validar que ambos campos están presentes
  if (!username || !password) {
    return res.status(400).json({ message: 'Se requieren todos los campos.' });
  }

  try {
    // Buscar el usuario por email
    const empleado = await prisma.empleado.findUnique({
      where: { email: username },
    });

    // Validar si el usuario existe
    if (!empleado) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, empleado.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    // Normalizar el rol a minúsculas
    const userRol = empleado.rol.toLowerCase();

    // Generar token JWT con rol
    const token = jwt.sign(
      { id: empleado.id, rol: userRol },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '1h' }
    );

    // Responder con el token y el rol del usuario
    res.json({ token, rol: userRol });
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

module.exports = router;
