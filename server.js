const express = require('express');
const app = express();
const PORT = 3000;

// Наш тестовый скрипт прямо в коде (чтобы не искать файлы)
const scriptContent = `print("Привет! Это защищенный скрипт с моего сервера!")`;

app.get('/script', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    console.log("Пришел запрос! User-Agent:", userAgent);

    // Проверяем, есть ли в запросе слово Solara, Synapse или Wave (или другое)
    // ВАЖНО: Вы можете добавить сюда название вашего инжектора
    const allowed = ['Solara', 'Synapse', 'Wave', 'Delta', 'roblox']; 
    
    const isExecutor = allowed.some(name => userAgent.toLowerCase().includes(name.toLowerCase()));

    if (isExecutor) {
        console.log("✅ Доступ разрешен!");
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.send(scriptContent);
    }

    console.log("❌ Доступ запрещен (браузер)");
    res.status(403).send('Forbidden');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Скрипт доступен по адресу: http://localhost:${PORT}/script`);
});