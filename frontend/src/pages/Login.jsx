import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, Tractor, ClipboardCheck, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { id: 'farmer', label: 'Farmer', icon: Tractor, home: '/dashboard' },
  { id: 'operator', label: 'Centre Operator', icon: ClipboardCheck, home: '/operator/dashboard' },
  { id: 'admin', label: 'Administrator', icon: ShieldCheck, home: '/admin/dashboard' }
];

export default function Login() {
  const [role, setRole] = useState('farmer');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!mobile || !password) {
      setError('Please enter your mobile number and password.');
      return;
    }
    setLoading(true);
    const user = await login({ role });
    setLoading(false);
    navigate(ROLES.find((r) => r.id === role).home);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-8">
          <Logo size={48} withWordmark={false} />
          <h1 className="font-display text-2xl font-semibold mt-4">Welcome back</h1>
          <p className="text-sm text-charcoal/50 mt-1">Log in to continue to KisanQueue</p>
        </div>

        <Card>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors ${
                  role === r.id ? 'border-forest-700 bg-forest-50 text-forest-800' : 'border-cream-300 text-charcoal/60 hover:bg-cream-100'
                }`}
              >
                <r.icon size={18} />
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="mobile" className="text-sm font-medium text-charcoal mb-1.5 block">Mobile number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-300 focus:border-forest-500 outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-charcoal mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-300 focus:border-forest-500 outline-none text-sm"
                />
              </div>
            </div>
            {error && <p className="text-sm text-rust">{error}</p>}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-medium text-forest-700 hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </Button>
          </form>
          <p className="text-xs text-charcoal/40 text-center mt-4">
            Demo mode — any mobile number and password will log you in as the selected role.
          </p>
        </Card>

        <p className="text-center text-sm text-charcoal/60 mt-6">
          New to KisanQueue? <Link to="/register" className="text-forest-700 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
