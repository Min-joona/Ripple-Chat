# Ripple — Real-Time Chat 💬

[![MERN](https://img.shields.io/badge/Stack-MERN-brightgreen)](#)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-black)](#)

A real-time group chat app: multiple channels, live messages, **online presence**, and
**typing indicators** — powered by Socket.io over the MERN stack.

> Built by **Amar Hassen Mohammednur**.

## ✨ Features

- **Real-time messaging** with Socket.io (no refresh)
- **Channels/rooms** — General, Tech Talk, Random, Introductions
- **Online presence** — see who's in a room, live
- **Typing indicators** — "X is typing…"
- **JWT-authenticated** sockets (only logged-in users connect)
- **Message history** persisted in MongoDB (last 50 per room)
- Per-user avatar colors, join/leave system messages
- Dark, **mobile-responsive** UI with a slide-out channel drawer

## 🧱 Tech Stack

React 18 · Vite · Tailwind CSS · socket.io-client · Node.js · Express · Socket.io · Mongoose · MongoDB · JWT

## 🚀 Getting Started

### Backend
```bash
cd backend && npm install
cp .env.example .env      # set MONGODB_URI + JWT_SECRET
npm run seed              # 3 users, 4 rooms, sample messages
npm run dev               # http://localhost:5004
```

### Frontend
```bash
cd frontend && npm install
npm run dev               # http://localhost:5173
```

**Try it live:** log in as `amar@chat.io` / `demo123` in one browser and
`selam@chat.io` / `demo123` in another — watch messages and typing sync instantly.

## ☁️ Deployment

> ⚠️ **Websockets need a persistent server** — Vercel's serverless functions can't hold
> a socket connection open. Deploy the **backend to Render or Railway** (free tiers work),
> and the **frontend to Vercel**.

1. **Backend** → Render/Railway web service. Env: `MONGODB_URI`, `JWT_SECRET`,
   `ALLOWED_ORIGINS` (your frontend URL). Run `npm run seed` once.
2. **Frontend** → Vercel. Env: `VITE_API_URL` and `VITE_SOCKET_URL` = your backend URL.

## 📄 License
MIT
