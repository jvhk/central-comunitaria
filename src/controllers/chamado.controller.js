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

    async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ erro: 'O campo status é obrigatório.' });
            }

            const chamadoAtualizado = await chamadoService.atualizarStatus(id, status);
            return res.status(200).json(chamadoAtualizado);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async getIndicadores(req, res) {
        try {
            const indicadores = await chamadoService.getIndicadores();
            return res.status(200).json(indicadores);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async getRelatorios(req, res) {
        try {
            const filtros = {
                status: req.query.status,
                id_categoria: req.query.id_categoria,
                data_inicio: req.query.data_inicio,
                data_fim: req.query.data_fim
            };
            const relatorios = await chamadoService.getRelatorios(filtros);
            return res.status(200).json(relatorios);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new ChamadoController();
