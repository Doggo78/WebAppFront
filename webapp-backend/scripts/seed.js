const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const hashedPassword = await bcrypt.hash('123', 10);

    // Crear o actualizar el administrador
    const admin = await prisma.empleado.upsert({
      where: { email: 'admin@example.com' },
      update: {}, // No se realiza ninguna actualización si ya existe
      create: {
        nombre: 'Administrador',
        email: 'admin@example.com',
        telefono: '123456789',
        rol: 'admin',
        password: hashedPassword,
      },
    });

    console.log('Empleado administrador creado o existente:', admin);
  } catch (error) {
    console.error('Error al crear el administrador:', error);
  } finally {
    await prisma.$disconnect(); // Asegura que Prisma se desconecte correctamente
  }
}

seed();
