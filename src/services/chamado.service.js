const chamadoRepository = require('../repositories/chamado.repository');
const ChamadoFactory = require('../factories/chamado.factory');
const viaCepService = require('./viacep.service');
const db = require('../database');
const statusObserver = require('../observers/status.observer');

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

    async atualizarStatus(id_chamado, novo_status) {
        const chamado = await chamadoRepository.findById(id_chamado);
        if (!chamado) {
            throw new Error('Chamado não encontrado.');
        }

        const statusAnterior = chamado.status;

        //Validar e proibir o mesmo status atual
        if (statusAnterior === novo_status) {
            throw new Error(`O chamado já está com o status ${novo_status}.`);
        }

        //Fluxo Unidirecional ABERTO -> EM_ATENDIMENTO -> CONCLUIDO
        const transicoesPermitidas = {
            'ABERTO': ['EM_ATENDIMENTO', 'CONCLUIDO'],
            'EM_ATENDIMENTO': ['CONCLUIDO'],
            'CONCLUIDO': [] // Nada permitido depois de concluido
        };

        if (!transicoesPermitidas[statusAnterior] || !transicoesPermitidas[statusAnterior].includes(novo_status)) {
            throw new Error(`Transição de status inválida. De '${statusAnterior}' para '${novo_status}' não é permitido.`);
        }

        const chamadoAtualizado = await chamadoRepository.updateStatus(id_chamado, novo_status);

        // Notifica o Observer para preencher a tabela historico_status
        statusObserver.notify(id_chamado, statusAnterior, novo_status);

        return chamadoAtualizado;
    }
}

module.exports = new ChamadoService();
