const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

// Discord webhook (set environment variable DISCORD_WEBHOOK)
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

// Upload endpoint – stores file and returns its public URL
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log(`File uploaded: ${fileUrl}`);
    res.json({ url: fileUrl });
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Endpoint for diagnostic data (forwards to Discord)
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
        res.status(200).json({ status: 'sent', message: 'Data received' });
    } catch (error) {
        console.error('Error in /api/collect:', error);
        res.status(200).json({ status: 'sent', message: 'Data received but Discord failed' });
    }
});

// Serve static frontend from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback: serve index.html for any unmatched route (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;