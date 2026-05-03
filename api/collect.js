// This is a serverless function – no app.listen()
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Your Discord webhook (stored here, not exposed to frontend)
    const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1500446845753884733/lle6dhwxxJo86FaN1QdluMVkI0gjnfeRAcJY4BIYWFiUzCj4zciO3ArpeTnmbhIf2LDy';

    try {
        const payload = req.body;
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        res.status(200).json({ status: 'sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}