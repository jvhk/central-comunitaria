const { Router } = require('express');
const usuarioRoutes = require('./usuario.routes');
const chamadoRoutes = require('./chamado.routes');

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/chamados', chamadoRoutes);

module.exports = router;
