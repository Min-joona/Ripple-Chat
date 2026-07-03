/** Core seed logic, reused by the CLI (seed.js) and the guarded /api/seed route. */
const connectDB = require('./config/db');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

const rooms = [
  { name: 'General', slug: 'general', emoji: '💬', description: 'Talk about anything.' },
  { name: 'Tech Talk', slug: 'tech', emoji: '💻', description: 'Programming, gadgets, and the web.' },
  { name: 'Random', slug: 'random', emoji: '🎲', description: 'Off-topic and fun.' },
  { name: 'Introductions', slug: 'intros', emoji: '👋', description: 'Say hello and introduce yourself.' },
];

const users = [
  { name: 'Amar Hassen', email: 'amar@chat.io', password: 'demo123', color: '#3b82f6' },
  { name: 'Selam T.', email: 'selam@chat.io', password: 'demo123', color: '#ec4899' },
  { name: 'Dawit M.', email: 'dawit@chat.io', password: 'demo123', color: '#10b981' },
];

async function runSeed() {
  await connectDB();
  await Promise.all([User.deleteMany(), Room.deleteMany(), Message.deleteMany()]);

  const created = [];
  for (const u of users) created.push(await User.create(u));
  await Room.insertMany(rooms);

  const seedMsgs = [
    { room: 'general', u: 1, text: 'Hey everyone! Welcome to the chat 👋' },
    { room: 'general', u: 0, text: 'Thanks Selam! This is built with Socket.io.' },
    { room: 'general', u: 2, text: 'Real-time and everything — nice work Amar!' },
    { room: 'tech', u: 0, text: 'Anyone here into the MERN stack?' },
    { room: 'tech', u: 2, text: 'Always. React + Express + Mongo is my go-to.' },
    { room: 'intros', u: 1, text: "Hi, I'm Selam, learning full-stack dev." },
  ];
  for (const m of seedMsgs) {
    const author = created[m.u];
    await Message.create({ room: m.room, user: author._id, name: author.name, color: author.color, text: m.text });
  }

  return { users: users.length, rooms: rooms.length, messages: seedMsgs.length };
}

module.exports = runSeed;
