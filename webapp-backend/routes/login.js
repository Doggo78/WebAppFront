const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client'); // Importa PrismaClient
const prisma = new PrismaClient(); // Inicializa PrismaClient

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca el usuario por email
    const user = await prisma.Usuario.findUnique({ where: { email: username } }); // Cambia 'Usuario' al modelo correcto

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    // Compara la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Genera el token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'mi_secreto',
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

module.exports = router;
