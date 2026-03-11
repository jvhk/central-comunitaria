class ChamadoFactory {
    static criar(tipo, dadosComuns) {
        // Objeto padronizado
        const chamado = {
            id_usuario: dadosComuns.id_usuario,
            id_categoria: dadosComuns.id_categoria,
            descricao: dadosComuns.descricao,
            cep: dadosComuns.cep,
            cidade: dadosComuns.cidade,
            uf: dadosComuns.uf,
            status: 'ABERTO'
        };

        // Regras específicas de prioridade com base na Categoria e Palavras-chave
        const descMinuscula = chamado.descricao.toLowerCase();

        switch (tipo) {
            case 'ENERGIA':
                chamado.prioridade = (descMinuscula.includes('fogo') || descMinuscula.includes('fios rompidos')) ? 'ALTA' : 'MEDIA';
                break;
            case 'AGUA':
                chamado.prioridade = descMinuscula.includes('vazamento grande') ? 'ALTA' : 'MEDIA';
                break;
            case 'INFRAESTRUTURA':
                chamado.prioridade = descMinuscula.includes('queda de arvore') ? 'ALTA' : 'BAIXA';
                break;
            case 'LIMPEZA':
                chamado.prioridade = descMinuscula.includes('bicho morto') ? 'MEDIA' : 'BAIXA';
                break;
            default:
                chamado.prioridade = 'BAIXA';
                break;
        }

        // Caso o usuário tente enviar uma prioridade diferente no body, podemos respeitar a dele se enviada:
        if (dadosComuns.prioridade) {
            chamado.prioridade = dadosComuns.prioridade;
        }

        return chamado;
    }
}

module.exports = ChamadoFactory;
