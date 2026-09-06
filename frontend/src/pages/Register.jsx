import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const FIELD_CLASS = 'w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-forest-500 outline-none text-sm';
const LABEL_CLASS = 'text-sm font-medium text-charcoal mb-1.5 block';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '', village: '', district: '', state: '',
    farmerId: '', language: 'en', password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!/^[0-9]{10}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number.';
    if (!form.village.trim()) e.village = 'Village is required.';
    if (!form.district.trim()) e.district = 'District is required.';
    if (!form.state.trim()) e.state = 'State is required.';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setLoading(true);
    await login({ role: 'farmer' });
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-8">
          <Logo size={48} withWordmark={false} />
          <h1 className="font-display text-2xl font-semibold mt-4">Create your farmer account</h1>
          <p className="text-sm text-charcoal/50 mt-1 text-center">Takes under two minutes — no smartphone experience needed.</p>
        </div>

        <Card>
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div>
              <label className={LABEL_CLASS} htmlFor="fullName">Full name</label>
              <input id="fullName" className={FIELD_CLASS} value={form.fullName} onChange={update('fullName')} placeholder="Rajesh Kumar" />
              {errors.fullName && <p className="text-xs text-rust mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS} htmlFor="mobile">Mobile number</label>
                <input id="mobile" className={FIELD_CLASS} value={form.mobile} onChange={update('mobile')} placeholder="9876543210" />
                {errors.mobile && <p className="text-xs text-rust mt-1">{errors.mobile}</p>}
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="email">Email (optional)</label>
                <input id="email" type="email" className={FIELD_CLASS} value={form.email} onChange={update('email')} placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="village">Village</label>
              <input id="village" className={FIELD_CLASS} value={form.village} onChange={update('village')} placeholder="Bichpuri" />
              {errors.village && <p className="text-xs text-rust mt-1">{errors.village}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS} htmlFor="district">District</label>
                <input id="district" className={FIELD_CLASS} value={form.district} onChange={update('district')} placeholder="Agra" />
                {errors.district && <p className="text-xs text-rust mt-1">{errors.district}</p>}
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="state">State</label>
                <input id="state" className={FIELD_CLASS} value={form.state} onChange={update('state')} placeholder="Uttar Pradesh" />
                {errors.state && <p className="text-xs text-rust mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS} htmlFor="farmerId">Farmer ID (optional)</label>
                <input id="farmerId" className={FIELD_CLASS} value={form.farmerId} onChange={update('farmerId')} placeholder="UP-AGR-00931" />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="language">Preferred language</label>
                <select id="language" className={FIELD_CLASS} value={form.language} onChange={update('language')}>
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="password">Password</label>
              <input id="password" type="password" className={FIELD_CLASS} value={form.password} onChange={update('password')} placeholder="••••••••" />
              {errors.password && <p className="text-xs text-rust mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-charcoal/60 mt-6">
          Already registered? <Link to="/login" className="text-forest-700 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
