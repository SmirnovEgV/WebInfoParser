const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Настраиваем CORS
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Прокси для получения содержимого сайтов
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.target;
    if (!targetUrl) {
        return res.status(400).send('No target URL specified');
    }

    try {
        const response = await axios.get(targetUrl);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching URL:', error.message);
        res.status(500).send('Failed to fetch the URL');
    }
});

// // Прокси для перевода текста
// app.post('/translate', async (req, res) => {
//     const { text, target } = req.body;

//     if (!text || !target) {
//         console.error('Missing parameters:', { text, target });
//         return res.status(400).send('Missing text or target language');
//     }

//     try {
//         const response = await axios.post('https://libretranslate.de/translate', {
//             q: text,
//             source: 'auto',
//             target: target,
//             format: 'text',
//         }, {
//             headers: { 'Content-Type': 'application/json' },
//             timeout: 10000, // Таймаут 10 секунд
//         });

//         res.json(response.data);
//     } catch (error) {
//         console.error('Translation error:', error.message);
//         console.error('Error details:', error.response?.data || 'No additional details');
//         res.status(500).send('Failed to translate text');
//     }
// });

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
