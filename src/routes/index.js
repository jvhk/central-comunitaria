const { Router } = require('express');
const usuarioRoutes = require('./usuario.routes');

const router = Router();

router.use('/usuarios', usuarioRoutes);

module.exports = router;
