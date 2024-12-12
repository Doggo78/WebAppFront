const express = require('express');
const { createCliente } = require('../controllers/clienteController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, createCliente);

module.exports = router;
