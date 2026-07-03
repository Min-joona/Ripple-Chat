# Ripple Chat

A real-time group chat application powered by Socket.io over the MERN stack — channels, live messaging, online presence, and typing indicators, behind JWT-authenticated connections.

**Live demo:** [ripple-chat-app.vercel.app](https://ripple-chat-app.vercel.app)

## Overview

- **Real-time messaging** — messages broadcast instantly over WebSockets
- **Channels** — topic-based rooms with per-room message history (last 50, persisted in MongoDB)
- **Presence** — live roster of who is online in each room
- **Typing indicators** — see when other members are composing
- **Authenticated sockets** — every WebSocket connection is verified with a signed JWT before joining
- **System events** — join/leave notices and per-user avatar colors

## Architecture

```
realtime-chat/
├── backend/          Express + Socket.io server
│   ├── models/       User, Room, Message
│   ├── routes/       /api/auth · /api/rooms (REST history)
│   └── socket.js     Authenticated WebSocket gateway:
│                     join / message / typing / presence
└── frontend/         React client (Vite)
    └── src/
        └── pages/    Login, Register, Chat (socket lifecycle)
```

The backend requires a persistent host for WebSocket connections; the REST API and client are platform-agnostic.

## Tech Stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Frontend   | React 18, Vite, Tailwind CSS, socket.io-client   |
| Backend    | Node.js, Express, Socket.io, Mongoose            |
| Database   | MongoDB Atlas                                    |
| Security   | Helmet, rate limiting, input sanitization, JWT   |

## Getting Started

**Prerequisites:** Node.js 18+ and a MongoDB connection string.

```bash
# Server
cd backend
npm install
cp .env.example .env   # configure environment
npm run seed           # optional: create sample rooms and history
npm run dev

# Client
cd frontend
npm install
npm run dev
```

Environment variables are documented in [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example).

## Author

**Amar Hassen Mohammednur** — [github.com/Min-joona](https://github.com/Min-joona)

## License

MIT
