// middlewares/verifyRole.js
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    const userRol = req.user.rol;
    if (userRol !== requiredRole) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
    }
    next();
  };
};

module.exports = verifyRole;
