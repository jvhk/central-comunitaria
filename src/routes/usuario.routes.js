const { Router } = require('express');
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.post('/register', usuarioController.register);
router.post('/login', usuarioController.login);

router.get('/me', authMiddleware, (req, res) => {
    res.json({ mensagem: 'Você está autenticado!', usuarioId: req.usuarioId });
});

module.exports = router;
