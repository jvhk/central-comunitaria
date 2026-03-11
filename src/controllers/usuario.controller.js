const usuarioService = require('../services/usuario.service');

class UsuarioController {
    async register(req, res) {
        try {
            const { nome, email, senha } = req.body;
            const usuario = await usuarioService.register(nome, email, senha);
            return res.status(201).json(usuario);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const data = await usuarioService.login(email, senha);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(401).json({ erro: error.message });
        }
    }
}

module.exports = new UsuarioController();
