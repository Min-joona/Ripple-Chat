const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');

// Track online users per room: { roomSlug: Map<userId, {name,color}> }
const presence = {};

function roomUsers(room) {
  return presence[room] ? Array.from(presence[room].values()) : [];
}

module.exports = function initSocket(io) {
  // Authenticate every socket via JWT.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('Unauthorized'));
      socket.user = { _id: user._id.toString(), name: user.name, color: user.color };
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    let currentRoom = null;

    socket.on('join', (room) => {
      if (currentRoom) leave();
      currentRoom = room;
      socket.join(room);
      presence[room] ||= new Map();
      presence[room].set(socket.user._id, { name: socket.user.name, color: socket.user.color });
      io.to(room).emit('presence', roomUsers(room));
      socket.to(room).emit('system', `${socket.user.name} joined`);
    });

    socket.on('message', async (text) => {
      if (!currentRoom || !text?.trim()) return;
      const msg = await Message.create({
        room: currentRoom,
        user: socket.user._id,
        name: socket.user.name,
        color: socket.user.color,
        text: text.trim().slice(0, 2000),
      });
      io.to(currentRoom).emit('message', {
        _id: msg._id, room: msg.room, user: msg.user, name: msg.name, color: msg.color,
        text: msg.text, createdAt: msg.createdAt,
      });
    });

    socket.on('typing', (isTyping) => {
      if (currentRoom) socket.to(currentRoom).emit('typing', { name: socket.user.name, isTyping });
    });

    function leave() {
      if (currentRoom && presence[currentRoom]) {
        presence[currentRoom].delete(socket.user._id);
        io.to(currentRoom).emit('presence', roomUsers(currentRoom));
        socket.to(currentRoom).emit('system', `${socket.user.name} left`);
      }
    }

    socket.on('disconnect', leave);
  });
};
