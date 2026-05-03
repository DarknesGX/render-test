const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

// YOUR DISCORD WEBHOOK - stored only on server
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1500446845753884733/lle6dhwxxJo86FaN1QdluMVkI0gjnfeRAcJY4BIYWFiUzCj4zciO3ArpeTnmbhIf2LDy';

app.post('/collect', async (req, res) => {
    try {
        const payload = req.body;
        // Optional: add authentication token to prevent abuse
        // if (req.headers['x-auth'] !== 'your_secret') return res.status(403).send('No');
        
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        res.status(200).json({ status: 'sent' });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log('Server on :3000'));