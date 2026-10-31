const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Загружаем скрипт
let scriptContent = '';
try {
    scriptContent = fs.readFileSync(path.join(__dirname, 'main.lua'), 'utf8');
    console.log("✅ Файл main.lua успешно загружен!");
} catch (err) {
    console.error("❌ ОШИБКА: Не удалось найти main.lua", err);
    scriptContent = `print("Ошибка сервера: скрипт не найден")`;
}

app.get('/script', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    
    // Логируем запрос
    console.log(`[ЗАПРОС] UA: ${userAgent}`);

    // СТРОГАЯ ПРОВЕРКА
    if (userAgent === 'Roblox/WinInet') {
        console.log("✅ Доступ разрешен (Roblox/WinInet). Скрипт выдан.");
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.send(scriptContent);
    }

    // БАН И РЕДИРЕКТ (без куки)
    console.log(`❌ БАН: Неизвестный UA (${userAgent}). РЕДИРЕКТ.`);
    res.redirect('https://idinaxui.com');
});

// Главная страница
app.get('/', (req, res) => {
    console.log("❌ Кто-то зашел на главную. РЕДИРЕКТ.");
    res.redirect('https://idinaxui.com');
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
