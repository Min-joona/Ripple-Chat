const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const initSocket = require('./socket');

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.use(async (_req, res, next) => {
  try { await connectDB(); next(); }
  catch (err) { res.status(500).json({ message: 'Database connection failed', error: err.message }); }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'realtime-chat' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));

// HTTP + Socket.io server (needs a persistent host — Render/Railway, not serverless).
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });
connectDB().catch(() => {});
initSocket(io);

const PORT = process.env.PORT || 5004;
server.listen(PORT, () => console.log(`🚀 Chat server + Socket.io on port ${PORT}`));

module.exports = app;
