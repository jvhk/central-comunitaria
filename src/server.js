require('dotenv').config();
const app = require('./app');
const db = require('./database/index');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    try {
        const dbInstance = await db.dbPromise;

        //Inicializar banco de dados SQLite com as tabelas
        const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf-8');
        await dbInstance.exec(schema);
        console.log('Banco de Dados SQLite sincronizado!');

        //Tenta inserir os dados do seed
        try {
            const seed = fs.readFileSync(path.join(__dirname, 'database', 'seed.sql'), 'utf-8');
            await dbInstance.exec(seed);
            console.log('Dados de seed verificados!');
        } catch (e) {
            console.log('Obs: Seed já aplicado ou erro ao inserir:', e.message);
        }

    } catch (err) {
        console.error('Erro na configuração do Banco de Dados SQLite:', err);
    }
});
