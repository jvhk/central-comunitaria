# Central Comunitária - API Backend

Bem-vindo ao projeto Backend da Central Comunitária! Esta é a Atividade Final Integradora onde os moradores podem abrir chamados (falta de energia, infraestrutura, água, etc), organizar atendimentos e os administradores podem visualizar indicadores para decisão rápida.

## Tecnologias Utilizadas

- **Node.js** com **Express**
- **SQLite** (Banco de dados leve e embutido)
- **JWT (JSON Web Token)** para autenticação e rotas privadas
- **Bcrypt.js** para criptografia de senhas
- **Axios** para consumo da API pública do ViaCEP
- Padrões de Arquitetura: **MVC / Camadas** (Controllers, Services, Repositories, Routes)
- Padrões de Projeto: **Singleton** (DB), **Factory** (Criação de Chamados), **Observer** (Histórico de Status)

## Instalação e Execução

Para rodar este projeto na sua máquina, siga os passos abaixo:

1. Modifique ou crie o arquivo `.env` na raiz do projeto conforme exigido:
```env
PORT=3000
DB_NAME=central_db
JWT_SECRET=supersecretjwt2026
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie a aplicação no modo de desenvolvimento:
```bash
npm run dev
```

*Nota: Ao rodar pela primeira vez, a aplicação criará automaticamente o arquivo do banco de dados `central_db.sqlite` e irá popular com algumas categorias iniciais e um usuário Admin (`admin@central.com` / Senha: `123456`). Tudo de forma automática.*

## Como Validar e Testar as Rotas

Para facilitar a sua vida e a correção, os arquivos para você importar no seu aplicativo de testes (Postman ou Insomnia) estão salvos na pasta raiz do projeto!
Basta importar o arquivo `Insomnia_Collection.json`.

**Autenticação Obrigatória** nas rotas privadas:
Sempre inicie fazendo `POST` em `/api/usuarios/login` para receber um token e anexe esse token no `Header -> Authorization: Bearer {TOKEN}` nas próximas chamadas.

## Requisitos e Onde Encontrá-los no Código

1. **Domínio e Regras (Validação de fluxo de status, Indicadores):** `status.observer.js` garante o histórico automático. A validação do fluxo `ABERTO -> EM_ATENDIMENTO -> CONCLUÍDO` e quebras estão em `chamado.service.js`. Indicadores e Médias de Tempo na rota de `chamado.controller.js` chamando a camada de Queries Específicas (`getIndicadores`).
2. **Banco de Dados (Relacional + Seed):** Fica isolado dentro de `src/database/schema.sql`. Utiliza SQLite. O `index.js` garante a comunicação SQL. Todos os Relatórios garantem o JOIN em 3 tabelas diferentes.
3. **Padrão de Construção / Camadas:** Singleton instanciado na pasta Database, Factory na `chamado.factory.js` que padroniza novos casos baseados no texto do usuário e Observer isolado na `status.observer.js`.
4. **Segurança:** Logs rodando globalmente na `logger.js`. BCrypt em `usuario.service.js`. JWT obrigatório em todo `/api/chamados` pela porta de entrada da `auth.middleware.js`.
5. **Integração Externa:** `viacep.service.js` contém encapsulada a integração com Axios recebendo a validação e formatação automática.