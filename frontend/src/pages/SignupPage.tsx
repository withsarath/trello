import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await api.post('/auth/signup', {
        username,
        email,
        password,
      });

      const loginResponse = await api.post('/auth/login', {
        email,
        password,
      });

      login(loginResponse.data.token, loginResponse.data.user);
      navigate('/boards');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-ink/20 rounded-xl p-8 space-y-5 bg-white/60 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-ink/70 mt-1">Start boarding in a minute</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 text-sm">
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-ink/20 bg-paper focus:outline-none focus:border-ink"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-ink/20 bg-paper focus:outline-none focus:border-ink"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-ink/20 bg-paper focus:outline-none focus:border-ink"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-ink text-paper font-medium hover:opacity-90 transition cursor-pointer"
        >
          Sign up
        </button>

        <p className="text-sm text-center text-ink/70">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-ink underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}