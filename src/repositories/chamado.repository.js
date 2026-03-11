const db = require('../database');

class ChamadoRepository {
    async create(chamado) {
        const query = `
            INSERT INTO chamados (id_usuario, id_categoria, descricao, cep, cidade, uf, prioridade, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            chamado.id_usuario,
            chamado.id_categoria,
            chamado.descricao,
            chamado.cep,
            chamado.cidade,
            chamado.uf,
            chamado.prioridade,
            chamado.status
        ];

        const result = await db.query(query, params);

        return {
            id: result.lastInsertRowid,
            ...chamado
        };
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM chamados WHERE id = ?', [id]);
        return result.rows[0];
    }

    async updateStatus(id, newStatus) {
        const query = "UPDATE chamados SET status = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?";
        await db.query(query, [newStatus, id]);
        return this.findById(id);
    }

    async getIndicadores() {
        const queryTotalStatus = 'SELECT status, COUNT(*) as total FROM chamados GROUP BY status';
        const queryCategoriaReq = `
            SELECT c.nome, COUNT(ch.id) as total 
            FROM categorias c 
            JOIN chamados ch ON c.id = ch.id_categoria 
            GROUP BY c.id ORDER BY total DESC LIMIT 1
        `;
        // Tempo médio de conclusão (em horas) no SQLite:
        const queryTempoMedio = `
            SELECT AVG((julianday(atualizado_em) - julianday(criado_em)) * 24) as tempo_medio_horas
            FROM chamados WHERE status = 'CONCLUIDO'
        `;

        const [totaisStatus, catReq, tempoMedio] = await Promise.all([
            db.query(queryTotalStatus),
            db.query(queryCategoriaReq),
            db.query(queryTempoMedio)
        ]);

        return {
            totais_por_status: totaisStatus.rows,
            categoria_mais_recorrente: catReq.rows[0] || null,
            tempo_medio_conclusao_horas: tempoMedio.rows[0] ? tempoMedio.rows[0].tempo_medio_horas : null
        };
    }

    async getRelatorios(filtros) {
        let query = `
            SELECT ch.id, u.nome as solicitante, c.nome as categoria, ch.descricao, ch.status, ch.prioridade, ch.criado_em, ch.cidade, ch.uf
            FROM chamados ch
            JOIN usuarios u ON ch.id_usuario = u.id
            JOIN categorias c ON ch.id_categoria = c.id
            WHERE 1=1
        `;
        const params = [];

        if (filtros.status) {
            query += ' AND ch.status = ?';
            params.push(filtros.status.toUpperCase());
        }
        if (filtros.id_categoria) {
            query += ' AND ch.id_categoria = ?';
            params.push(filtros.id_categoria);
        }
        if (filtros.data_inicio && filtros.data_fim) {
            query += ' AND date(ch.criado_em) BETWEEN date(?) AND date(?)';
            params.push(filtros.data_inicio, filtros.data_fim);
        }

        query += ' ORDER BY ch.criado_em DESC';

        const result = await db.query(query, params);
        return result.rows;
    }

    async updateDescricao(id, novaDescricao) {
        const query = 'UPDATE chamados SET descricao = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?';
        await db.query(query, [novaDescricao, id]);
        return this.findById(id);
    }

    async delete(id) {
        const query = 'DELETE FROM chamados WHERE id = ?';
        return await db.query(query, [id]);
    }
}

module.exports = new ChamadoRepository();
