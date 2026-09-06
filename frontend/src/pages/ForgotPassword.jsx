import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Logo from '../components/Logo';

export default function ForgotPassword() {
  const [mobile, setMobile] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (mobile) setSent(true);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-8">
          <Logo size={48} withWordmark={false} />
          <h1 className="font-display text-2xl font-semibold mt-4">Reset your password</h1>
          <p className="text-sm text-charcoal/50 mt-1 text-center">We'll send a reset code by SMS to your registered mobile number.</p>
        </div>

        <Card>
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={40} className="text-forest-600 mx-auto mb-3" />
              <p className="font-semibold text-charcoal">Reset code sent</p>
              <p className="text-sm text-charcoal/50 mt-1">Check SMS on {mobile} for your reset code.</p>
              <Link to="/login"><Button className="mt-5 w-full">Back to login</Button></Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="mobile" className="text-sm font-medium text-charcoal mb-1.5 block">Mobile number</label>
                <input
                  id="mobile"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-forest-500 outline-none text-sm"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98765 43210"
                />
              </div>
              <Button type="submit" className="w-full">Send reset code</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
