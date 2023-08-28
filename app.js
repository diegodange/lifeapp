const express = require('express');
const http = require('http');
const axios = require('axios');
const { format } = require('date-fns');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const port = 3000;

let cachedData = null;


async function fetchData() {
    try {
        const response = await axios.get('https://lifeappdevw.espm.br/wp-json/jwt-auth/v1/linkssistema?publico=aluno');
        const data = response.data;
        cachedData = data;
        console.log('Dados atualizados:', format(new Date(), "dd/MM/yyyy HH:mm:ss"));
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
}

const app = express();
const httpServer = http.createServer(app);

// Rota para retornar os dados em cache via HTTP
app.get('/api/linkssistema', (req, res) => {
    if (cachedData) {
        res.json(cachedData);
    } else {
        res.status(500).json({ error: 'Nenhum dado disponível.' });
    }
});

fetchData();
setInterval(fetchData, 10 * 60 * 1000);

httpServer.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
