const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));

// Security & CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Your Discord webhook from Vercel Environment Variables
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

if (!DISCORD_WEBHOOK) {
    console.warn('⚠️ DISCORD_WEBHOOK environment variable is not set!');
}

app.post('/api/collect', async (req, res) => {
    try {
        if (!DISCORD_WEBHOOK) {
            return res.status(500).json({ error: 'Webhook not configured' });
        }

        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            console.error('Discord API error:', response.status);
        }

        res.status(200).json({ status: 'sent' });
    } catch (error) {
        console.error('Discord forward error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve static files from public folder (Vercel handles this well)
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for SPA-style routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;   // Important for Vercel