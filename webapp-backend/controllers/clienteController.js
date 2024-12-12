const prisma = require('../prisma/prismaClient');

exports.createCliente = async (req, res) => {
  const { nombre, telefono, correo, direccion } = req.body;

  const clienteExistente = await prisma.cliente.findFirst({
    where: {
      OR: [{ telefono }, { correo }],
    },
  });

  if (clienteExistente) {
    return res.status(400).json({ error: 'Teléfono o correo ya registrados' });
  }

  const nuevoCliente = await prisma.cliente.create({
    data: { nombre, telefono, correo, direccion },
  });

  res.json(nuevoCliente);
};
