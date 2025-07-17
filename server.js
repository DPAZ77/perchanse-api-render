// server.js

// Importa a biblioteca 'express' para criar o servidor web
const express = require('express');
// Importa a biblioteca 'axios' para fazer requisições HTTP (para o Perchance)
const axios = require('axios');
// Cria uma instância do aplicativo express
const app = express();
// Define a porta em que o servidor vai rodar (usa a porta do ambiente se disponível, senão 3000)
const port = process.env.PORT || 3000;

// Middleware para permitir requisições de diferentes origens (CORS)
// Isso é importante para que o seu site ou outro aplicativo possa acessar sua API
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permite acesso de qualquer origem
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Define a rota principal da sua API
// Quando alguém acessar /api, esta função será executada
app.get('/api', async (req, res) => {
    // Pega os parâmetros 'generator' e 'list' da URL
    // Ex: /api?generator=meu-gerador&list=minha-lista
    const generatorName = req.query.generator;
    const listName = req.query.list;

    // Verifica se os parâmetros obrigatórios foram fornecidos
    if (!generatorName || !listName) {
        return res.status(400).json({ error: 'Os parâmetros "generator" e "list" são obrigatórios.' });
    }

    try {
        // Constrói a URL para acessar o gerador Perchance
        // O `&output=json` é crucial para pegar a saída formatada para leitura
        const perchanceUrl = `https://perchance.org/${generatorName}.json?output=${listName}`;

        // Faz a requisição para o gerador Perchance
        const response = await axios.get(perchanceUrl);
        const data = response.data; // Pega os dados da resposta do Perchance

        // Retorna a saída gerada pelo Perchance como JSON
        res.json({ output: data.result });

    } catch (error) {
        console.error('Erro ao buscar do Perchance:', error.message);
        // Em caso de erro, retorna uma mensagem de erro
        res.status(500).json({ error: 'Erro ao gerar do Perchance. Verifique o nome do gerador e da lista.', details: error.message });
    }
});

// Inicia o servidor e o faz "escutar" por requisições na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`API acessível em http://localhost:${port}/api?generator=SEU-GERADOR&list=SUA-LISTA`);
});
