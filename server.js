const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- ЗАГРУЗКА СКРИПТА ---
// Читаем ваш файл main.lua
let scriptContent = '';
try {
    scriptContent = fs.readFileSync(path.join(__dirname, 'main.lua'), 'utf8');
    console.log("✅ Скрипт main.lua успешно загружен в память сервера!");
} catch (err) {
    console.error("❌ ОШИБКА: Не удалось найти main.lua. Проверьте, что файл лежит в той же папке.", err);
}

// --- НАСТРОЙКИ ЗАЩИТЫ ---
// Список слов, которые должны быть в User-Agent инжектора.
// Если ваш инжектор не работает, посмотрите его название и добавьте сюда.
const ALLOWED_EXECUTORS = [
    'Solara', 
    'Synapse', 
    'Wave', 
    'Delta', 
    'AWP', 
    'Fluxus', 
    'Codex',
    'roblox' // Иногда клиенты Roblox передают это слово
];

// Секретный заголовок (если хотите защитить максимально жестко)
// Если ваш инжектор поддерживает кастомные заголовки (например, через syn.request), 
// вы можете использовать это. Если нет — просто не обращайте внимания.
const SECRET_KEY_NAME = 'x-api-key';
const SECRET_KEY_VALUE = 'super_secret_12345'; // Можете поменять на любой пароль

// --- ОСНОВНОЙ МАРШРУТ ---
app.get('/script', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const apiKey = req.headers[SECRET_KEY_NAME] || '';

    // Логируем каждый запрос, чтобы вы видели, кто стучится
    console.log(`[ЗАПРОС] IP: ${req.ip} | User-Agent: ${userAgent}`);

    // Проверка 1: Секретный ключ (самый надежный способ)
    if (apiKey === SECRET_KEY_VALUE) {
        console.log("✅ Доступ разрешен по секретному ключу.");
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.send(scriptContent);
    }

    // Проверка 2: Поиск названия инжектора в User-Agent
    const isExecutor = ALLOWED_EXECUTORS.some(name => 
        userAgent.toLowerCase().includes(name.toLowerCase())
    );

    if (isExecutor) {
        console.log(`✅ Доступ разрешен! Найден инжектор в User-Agent.`);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.send(scriptContent);
    }

    // Если ни одна проверка не пройдена — блокируем
    console.log("❌ Доступ запрещен. Это браузер или неизвестный клиент.");
    res.status(403).send('Forbidden: Access Denied');
});

// Маршрут для проверки, что сервер жив
app.get('/', (req, res) => {
    res.send('Сервер работает. Скрипт доступен по адресу /script');
});

// --- ЗАПУСК ---
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🔗 Ссылка для инжектора: http://localhost:${PORT}/script (или ваш Render URL)`);
});
