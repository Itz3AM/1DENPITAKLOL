const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Читаем файл main.lua, который лежит в том же репозитории
let scriptContent = '';
try {
    scriptContent = fs.readFileSync(path.join(__dirname, 'main.lua'), 'utf8');
    console.log("✅ Файл main.lua успешно загружен!");
} catch (err) {
    console.error("❌ ОШИБКА: Не удалось найти main.lua", err);
    scriptContent = `print("Ошибка: файл main.lua не найден на сервере")`;
}

// Отдаем скрипт всем без исключения
app.get('/script', (req, res) => {
    console.log("Пришел запрос на загрузку скрипта!");
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(scriptContent);
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
