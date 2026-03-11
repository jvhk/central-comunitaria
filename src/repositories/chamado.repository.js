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
}

module.exports = new ChamadoRepository();
