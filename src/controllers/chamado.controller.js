const chamadoService = require('../services/chamado.service');

class ChamadoController {
    async abrirChamado(req, res) {
        try {
            const id_usuario = req.usuarioId; // Extraído do Auth Middleware JWT
            
            const payload = {
                id_categoria: req.body.id_categoria,
                descricao: req.body.descricao,
                cep: req.body.cep,
                prioridade: req.body.prioridade
            };

            const chamado = await chamadoService.abrirChamado(id_usuario, payload);
            
            return res.status(201).json(chamado);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new ChamadoController();
