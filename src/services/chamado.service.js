const chamadoRepository = require('../repositories/chamado.repository');
const ChamadoFactory = require('../factories/chamado.factory');
const viaCepService = require('./viacep.service');
const db = require('../database');

class ChamadoService {
    async abrirChamado(id_usuario, payload) {
        const { id_categoria, descricao, cep, prioridade } = payload;

        if (!id_categoria || !descricao || !cep) {
            throw new Error('Categoria, descrição e CEP são obrigatórios.');
        }

        const dadosEndereco = await viaCepService.buscarCep(cep);
        const catResult = await db.query('SELECT nome FROM categorias WHERE id = ?', [id_categoria]);

        if (!catResult.rows || catResult.rows.length === 0) {
            throw new Error('Categoria inválida ou não encontrada.');
        }

        const tipoCategoria = catResult.rows[0].nome; // Ex: 'ENERGIA', 'AGUA'

        const dadosComuns = {
            id_usuario,
            id_categoria,
            descricao,
            cep,
            cidade: dadosEndereco.localidade,
            uf: dadosEndereco.uf,
            prioridade
        };
        const novoChamado = ChamadoFactory.criar(tipoCategoria, dadosComuns);
        const chamadoSalvo = await chamadoRepository.create(novoChamado);

        return chamadoSalvo;
    }
}

module.exports = new ChamadoService();
