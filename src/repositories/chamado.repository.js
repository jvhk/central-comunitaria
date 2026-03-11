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
        
        // Return object structure
        return {
            id: result.lastInsertRowid,
            ...chamado
        };
    }
}

module.exports = new ChamadoRepository();
