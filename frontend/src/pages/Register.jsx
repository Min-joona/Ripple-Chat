import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await register(form); toast.success('Welcome to Ripple!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <img src="/favicon.png" alt="" className="h-11 w-11 rounded-xl bg-white p-1" />
          <div><h1 className="text-2xl font-bold text-white">Ripple</h1><p className="text-xs text-slate-400">Real-time chat</p></div>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-lg font-semibold text-white">Create account</h2>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <input className="input" placeholder="Display name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" type="password" placeholder="Password (min 6)" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button disabled={busy} className="btn-primary w-full">{busy ? 'Creating…' : 'Sign up'}</button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-slate-400">Have an account? <Link to="/login" className="font-semibold text-brand">Sign in</Link></p>
      </div>
    </div>
  );
}
