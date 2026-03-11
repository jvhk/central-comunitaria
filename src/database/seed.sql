-- Inserindo categorias iniciais
INSERT OR IGNORE INTO categorias (nome, descricao) VALUES
('ENERGIA', 'Falta de energia, poste com defeito ou fios rompidos'),
('AGUA', 'Vazamentos, falta de água ou esgoto a céu aberto'),
('INFRAESTRUTURA', 'Buracos na via, calçadas danificadas ou quedas de árvores'),
('LIMPEZA', 'Acúmulo de lixo, entulhos ou descarte irregular');

-- Inserindo um usuário administrador padrão (Senha padrão '123456' hasheada para testes posteriores)
INSERT OR IGNORE INTO usuarios (nome, email, senha) VALUES
('Admin', 'admin@central.com', '$2b$10$wT8vM9gqP8L6z3l8.J4YV.2x3DXY8h2rQ/H7V8A5Z/zN3H8mC/YV2');
