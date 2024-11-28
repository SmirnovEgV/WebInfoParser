const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const PORT = 3000; // Порт, на котором будет работать сервер

app.use(cors())
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

// Запуск сервера в консоль node server.js
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
