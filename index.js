const crypto = require('crypto');
const express = require('express');
const app = express();
const PORT = 3000;

const BOT_TOKEN = '7809691512:AAHmFFAGkXu34oW3IujqoTcTmiwzs66Hwe0'; // Замените на ваш токен

function checkTelegramAuth(data) {
    const { hash, ...fields } = data;
    const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    const checkString = Object.keys(fields).sort().map(key => `${key}=${fields[key]}`).join('\n');
    const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
    return hmac === hash;
}

app.get('/telegram-login', (req, res) => {
    const data = req.query;

    if (checkTelegramAuth(data)) {
        const user = {
            id: data.id,
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            photo_url: data.photo_url,
        };
        res.send(`Добро пожаловать, ${user.first_name}!`);
    } else {
        res.status(403).send('Ошибка проверки данных.');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
