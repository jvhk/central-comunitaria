const db = require('../database');

class StatusObserver {
    constructor() {
        this.listeners = [];
    }

    // Método para registrar um listener
    subscribe(listener) {
        this.listeners.push(listener);
    }

    // Método para notificar os listeners sobre a mudança
    notify(chamadoId, statusAnterior, novoStatus) {
        this.listeners.forEach(listener => listener(chamadoId, statusAnterior, novoStatus));
    }
}

const statusObserver = new StatusObserver();

//Assinando o processo automático de registro no histórico
statusObserver.subscribe(async (chamadoId, statusAnterior, novoStatus) => {
    try {
        await db.query(
            'INSERT INTO historico_status (id_chamado, status_anterior, novo_status) VALUES (?, ?, ?)',
            [chamadoId, statusAnterior, novoStatus]
        );
        console.log(`[Observer] Registro de histórico inserido => Chamado: ${chamadoId} | ${statusAnterior} -> ${novoStatus}`);
    } catch (error) {
        console.error(`[Observer Erro] Falha ao registrar histórico do chamado ${chamadoId}:`, error);
    }
});

module.exports = statusObserver;
