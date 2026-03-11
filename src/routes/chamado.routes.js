const { Router } = require('express');
const chamadoController = require('../controllers/chamado.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// Protegendo as rotas (Obrigatório estar logado para abrir um chamado)
router.use(authMiddleware);

router.post('/', chamadoController.abrirChamado);
router.patch('/:id/status', chamadoController.atualizarStatus);

module.exports = router;
