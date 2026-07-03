const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const initSocket = require('./socket');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));

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
app.use(mongoSanitize());

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));
app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts, please try again later.' },
  })
);

app.use(async (_req, res, next) => {
  try { await connectDB(); next(); }
  catch (err) { res.status(500).json({ message: 'Database connection failed', error: err.message }); }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'realtime-chat' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));

app.post('/api/seed', async (req, res) => {
  if (!process.env.SEED_TOKEN || req.headers['x-seed-token'] !== process.env.SEED_TOKEN) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const result = await require('./seedRunner')();
    res.json({ message: 'Seed complete', ...result });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

// HTTP + Socket.io server (needs a persistent host — Render/Railway, not serverless).
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });
connectDB().catch(() => {});
initSocket(io);

const PORT = process.env.PORT || 5004;
server.listen(PORT, () => console.log(`🚀 Chat server + Socket.io on port ${PORT}`));

module.exports = app;
