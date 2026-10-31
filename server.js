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
    
    // Логируем запрос, чтобы ты видел, кто стучится
    console.log(`[ЗАПРОС] UA: ${userAgent}`);

    // СТРОГАЯ ПРОВЕРКА: User-Agent должен быть ровно "Roblox/WinInet"
    if (userAgent === 'Roblox/WinInet') {
        console.log("✅ Доступ разрешен (Roblox/WinInet). Скрипт выдан.");
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.send(scriptContent);
    }

    // Если это кто-то другой (браузер, бот, WinInet2) — БАН И РЕДИРЕКТ
    console.log(`❌ БАН: Неизвестный User-Agent (${userAgent}). Кидаем на idinaxui.com`);
    
    // Ставим куки (чтобы запомнить Васяна, если он зайдет снова)
    res.cookie('banned_user', 'true', { maxAge: 31536000000, httpOnly: true });
    
    // Перенаправляем
    res.redirect('https://idinaxui.com');
});

// Если кто-то зашел просто на главную страницу — тоже кидаем на сайт
app.get('/', (req, res) => {
    res.cookie('banned_user', 'true', { maxAge: 31536000000, httpOnly: true });
    res.redirect('https://idinaxui.com');
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
