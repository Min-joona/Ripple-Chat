import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'amar@chat.io', password: 'demo123' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await login(form.email, form.password); toast.success('Connected!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white"><MessageSquare size={22} /></span>
          <div><h1 className="text-2xl font-bold text-white">Ripple</h1><p className="text-xs text-slate-400">Real-time chat</p></div>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-lg font-semibold text-white">Sign in</h2>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button disabled={busy} className="btn-primary w-full">{busy ? 'Connecting…' : 'Sign in'}</button>
          </form>
          <p className="mt-4 text-xs text-slate-400">Demo: amar@chat.io / demo123 (open a 2nd browser as selam@chat.io to chat live)</p>
        </div>
        <p className="mt-4 text-center text-sm text-slate-400">New here? <Link to="/register" className="font-semibold text-brand">Create account</Link></p>
      </div>
    </div>
  );
}
