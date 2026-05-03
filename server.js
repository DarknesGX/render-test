const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Your Discord webhook (only on server, never exposed)
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1500446845753884733/lle6dhwxxJo86FaN1QdluMVkI0gjnfeRAcJY4BIYWFiUzCj4zciO3ArpeTnmbhIf2LDy';

// API endpoint to receive data and forward to Discord
app.post('/api/collect', async (req, res) => {
    try {
        const payload = req.body;
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        res.status(200).json({ status: 'sent' });
    } catch (error) {
        console.error('Discord forward error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve the frontend for any unmatched GET (optional, but good for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});