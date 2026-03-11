const db = require('../database');

class UsuarioRepository {
    async findByEmail(email) {
        const result = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return result.rows[0];
    }

    async create(nome, email, senhaHash) {
        const result = await db.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senhaHash]
        );
        return { id: result.lastInsertRowid, nome, email };
    }
}

module.exports = new UsuarioRepository();
