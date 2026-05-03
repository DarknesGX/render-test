const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));

// CORS + Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

app.post('/api/collect', async (req, res) => {
    try {
        console.log("Received payload, forwarding to Discord...");

        if (!DISCORD_WEBHOOK) {
            console.error("DISCORD_WEBHOOK not set!");
            return res.status(500).json({ error: "Webhook not configured" });
        }

        const discordRes = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        console.log("Discord responded with:", discordRes.status);

        // Always return success to the client
        res.status(200).json({ status: 'sent', message: 'Data received' });

    } catch (error) {
        console.error('Error in /api/collect:', error);
        res.status(200).json({ status: 'sent', message: 'Data received but Discord failed' }); // Return 200 anyway
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;