import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Send, Hash, Users, LogOut, MessageSquare, Menu, Circle } from 'lucide-react';
import api, { SOCKET_URL } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Avatar = ({ name, color, size = 36 }) => (
  <span className="grid shrink-0 place-items-center rounded-full font-bold text-white"
    style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}>
    {name?.[0]?.toUpperCase()}
  </span>
);

const timeOf = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Chat() {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);
  const [typers, setTypers] = useState([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // Connect socket once.
  useEffect(() => {
    const socket = io(SOCKET_URL, { auth: { token: localStorage.getItem('token') } });
    socketRef.current = socket;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('message', (m) => setMessages((prev) => [...prev, m]));
    socket.on('presence', (users) => setOnline(users));
    socket.on('typing', ({ name, isTyping }) => {
      setTypers((prev) => (isTyping ? [...new Set([...prev, name])] : prev.filter((n) => n !== name)));
    });
    socket.on('system', (msg) => setMessages((prev) => [...prev, { system: true, text: msg, _id: Math.random() }]));
    return () => socket.disconnect();
  }, []);

  // Load rooms once.
  useEffect(() => { api.get('/api/rooms').then(({ data }) => setRooms(data)); }, []);

  // Switch room: fetch history + join socket room.
  useEffect(() => {
    if (!socketRef.current) return;
    setTypers([]);
    api.get(`/api/rooms/${room}/messages`).then(({ data }) => setMessages(data));
    socketRef.current.emit('join', room);
  }, [room, connected]);

  // Autoscroll.
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typers]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socketRef.current.emit('message', text);
    socketRef.current.emit('typing', false);
    setText('');
  };

  const onType = (e) => {
    setText(e.target.value);
    socketRef.current.emit('typing', true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socketRef.current.emit('typing', false), 1200);
  };

  const activeRoom = useMemo(() => rooms.find((r) => r.slug === room), [rooms, room]);

  const RoomList = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line p-4">
        <img src="/logo.png" alt="Ripple Chat" className="h-8 w-auto rounded-md bg-white/95 px-2 py-1" />
        <span className={`ml-auto flex items-center gap-1 text-[11px] ${connected ? 'text-emerald-400' : 'text-slate-500'}`}>
          <Circle size={8} className="fill-current" /> {connected ? 'online' : 'connecting'}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <p className="px-2 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Channels</p>
        {rooms.map((r) => (
          <button key={r.slug} onClick={() => { setRoom(r.slug); setDrawerOpen(false); }}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${room === r.slug ? 'bg-brand/20 text-white' : 'text-slate-400 hover:bg-panel2'}`}>
            <span>{r.emoji}</span> <Hash size={14} /> {r.name}
          </button>
        ))}
      </div>
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2">
          <Avatar name={user.name} color={user.color} size={32} />
          <span className="flex-1 truncate text-sm font-medium text-white">{user.name}</span>
          <button onClick={logout} className="text-slate-400 hover:text-white" aria-label="Log out"><LogOut size={16} /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-panel md:block"><RoomList /></aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="h-full w-64 bg-panel" onClick={(e) => e.stopPropagation()}><RoomList /></div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-panel px-4 py-3">
          <button className="md:hidden" onClick={() => setDrawerOpen(true)}><Menu size={20} /></button>
          <span className="text-xl">{activeRoom?.emoji}</span>
          <div className="min-w-0">
            <h2 className="truncate font-bold text-white"># {activeRoom?.name || room}</h2>
            <p className="truncate text-xs text-slate-500">{activeRoom?.description}</p>
          </div>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-panel2 px-3 py-1 text-xs text-slate-300">
            <Users size={13} /> {online.length} online
          </span>
        </header>

        {/* Messages */}
        <div className="flex-1 space-y-1 overflow-y-auto p-4">
          {messages.map((m) => m.system ? (
            <p key={m._id} className="py-1 text-center text-xs text-slate-500">{m.text}</p>
          ) : (
            <div key={m._id} className={`flex gap-3 py-1.5 ${m.user === user._id ? 'flex-row-reverse' : ''}`}>
              <Avatar name={m.name} color={m.color} />
              <div className={`max-w-[75%] ${m.user === user._id ? 'text-right' : ''}`}>
                <div className={`flex items-baseline gap-2 ${m.user === user._id ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-semibold" style={{ color: m.color }}>{m.name}</span>
                  <span className="text-[11px] text-slate-500">{timeOf(m.createdAt)}</span>
                </div>
                <div className={`mt-0.5 inline-block rounded-2xl px-3 py-2 text-sm ${m.user === user._id ? 'bg-brand text-white' : 'bg-panel2 text-slate-100'}`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {typers.length > 0 && (
            <p className="px-1 py-1 text-xs italic text-slate-500">
              {typers.join(', ')} {typers.length === 1 ? 'is' : 'are'} typing…
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <form onSubmit={send} className="flex items-center gap-2 border-t border-line bg-panel p-3">
          <input
            value={text}
            onChange={onType}
            placeholder={`Message #${activeRoom?.name || room}`}
            className="input flex-1"
          />
          <button type="submit" className="btn-primary aspect-square !px-0 w-11" aria-label="Send"><Send size={18} /></button>
        </form>
      </div>
    </div>
  );
}
