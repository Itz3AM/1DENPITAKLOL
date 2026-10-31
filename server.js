const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Render требует process.env.PORT

// Загружаем ваш файл main.lua
let scriptContent = '';
try {
    scriptContent = fs.readFileSync(path.join(__dirname, 'main.lua2'), 'utf8');
    console.log("✅ Файл main.lua успешно загружен!");
} catch (err) {
    console.error("❌ ОШИБКА: Не удалось найти main.lua", err);
    scriptContent = `print("Ошибка: файл main.lua не найден на сервере")`;
}

app.get('/script', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    
    // Выводим в логи, кто стучится (чтобы вы могли добавить имя своего инжектора)
    console.log("Пришел запрос! User-Agent:", userAgent);

    // Ваш список разрешенных инжекторов
    const allowed = ['Solara', 'Synapse', 'Wave', 'Delta', 'roblox']; 
    
    const isExecutor = allowed.some(name => userAgent.toLowerCase().includes(name.toLowerCase()));

    if (isExecutor) {
        console.log("✅ Доступ разрешен!");
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.send(scriptContent); // Отдаем ваш скрипт из main.lua
    }

    console.log("❌ Доступ запрещен (браузер)");
    res.status(403).send('Forbidden');
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
