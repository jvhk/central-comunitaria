const usuarioRepository = require('../repositories/usuario.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuarioService {
    async register(nome, email, senha) {
        if (!nome || !email || !senha) {
            throw new Error('Nome, e-mail e senha são obrigatórios.');
        }

        const userExists = await usuarioRepository.findByEmail(email);
        if (userExists) {
            throw new Error('E-mail já cadastrado.');
        }

        const hash = await bcrypt.hash(senha, 10);
        const novoUsuario = await usuarioRepository.create(nome, email, hash);
        return novoUsuario;
    }

    async login(email, senha) {
        if (!email || !senha) {
            throw new Error('E-mail e senha são obrigatórios.');
        }

        const user = await usuarioRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciais inválidas.');
        }

        const isValidPassword = await bcrypt.compare(senha, user.senha);
        if (!isValidPassword) {
            throw new Error('Credenciais inválidas.');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'supersecretjwt2026',
            { expiresIn: '1d' }
        );

        return {
            usuario: {
                id: user.id,
                nome: user.nome,
                email: user.email
            },
            token
        };
    }
}

module.exports = new UsuarioService();
