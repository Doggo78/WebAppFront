const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader); // Log del encabezado recibido

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Formato de encabezado Authorization incorrecto.');
    return res.status(401).json({ message: 'Formato de token no válido. Use "Bearer <token>".' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extraído:', token); // Log del token extraído

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    req.user = decoded;
    console.log('Token decodificado:', decoded); // Log de la información del token
    next();
  } catch (err) {
    console.error('Error al verificar token:', err.message);
    return res.status(403).json({ message: 'Token no válido.' });
  }
};

module.exports = verifyToken;
