const axios = require('axios');

class ViaCepService {
    async buscarCep(cep) {
        try {
            const cepLimpo = cep.replace(/\D/g, '');
            if (cepLimpo.length !== 8) {
                throw new Error('CEP inválido. Deve conter 8 dígitos.');
            }

            const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            
            if (response.data.erro) {
                throw new Error('CEP não encontrado.');
            }

            return {
                localidade: response.data.localidade,
                uf: response.data.uf,
            };
        } catch (error) {
            throw new Error(error.response ? 'Erro ao consultar API do ViaCEP' : error.message);
        }
    }
}

module.exports = new ViaCepService();
