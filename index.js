const express = require('express');
const path = require('path');
const { default: makeWASocket, useMultiFileAuthState, delay } = require("@whiskeysockets/baileys");
const pino = require("pino");

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.json({ error: "No number" });

    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const conn = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" }),
    });

    try {
        await delay(2000);
        const code = await conn.requestPairingCode(num);
        res.json({ code: code });
    } catch (err) {
        res.json({ error: "Err" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
