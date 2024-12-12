// api/clientes/crear.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../../middlewares/verifyToken')

const prisma = new PrismaClient();

// Ruta para crear un cliente
router.post('/', verifyToken, async (req, res) => {
  const { nombre, telefono, email, direccion } = req.body;

  // Validar los datos de entrada
  if (!nombre  || !telefono) {
    return res.status(400).json({ error: 'Nombre y Telefono son requeridos.' });
  }
//VALIDAR MAIL
  try {
    if(email) {
    const existingCliente = await prisma.cliente.findUnique({
      where: { email },
    });

    if (existingCliente) {
      return res.status(400).json({ message: 'El correo electronico ya esta registrado.'});
    }
  }
  const existingCliente = await prisma.cliente.findFirst({
    where: {
      OR: [
        { telefono: telefono },
        email ? { email: email } : undefined, // Validar solo si el email está presente
      ],
    },
  });
//VALIDAR TELEFONO
  if (existingCliente) {
    const duplicado = existingCliente.telefono === telefono ? 'teléfono' : 'correo electrónico';
    return res.status(400).json({ error: `El ${duplicado} ya está registrado.` });
  }
    // Crear cliente en la base de datos
    const nuevoCliente = await prisma.cliente.create({
      data: {
        nombre,
        telefono,
        email,
        direccion
      },
    });

    res.status(201).json({ message: 'Cliente creado exitosamente.', cliente: nuevoCliente });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    // Manejar errores de unicidad
    if (error.code === 'P2002') {
      const campoDuplicado = error.meta.target.includes('telefono') ? 'teléfono' : 'correo';
      return res.status(400).json({ error: `El ${campoDuplicado} ya está registrado.` });
    }
    res.status(500).json({ error: 'Error al crear el cliente. Intente nuevamente.' });
  }
});

module.exports = router;
