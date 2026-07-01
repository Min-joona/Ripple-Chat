const express = require('express');
const Room = require('../models/Room');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/rooms
router.get('/', async (_req, res) => {
  res.json(await Room.find().sort({ createdAt: 1 }));
});

// GET /api/rooms/:slug/messages — last 50, chronological
router.get('/:slug/messages', async (req, res) => {
  const messages = await Message.find({ room: req.params.slug }).sort({ createdAt: -1 }).limit(50).lean();
  res.json(messages.reverse());
});

module.exports = router;
