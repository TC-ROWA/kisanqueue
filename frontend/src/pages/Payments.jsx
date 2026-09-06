import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { getPayment } from '../services/api';

export default function Payments() {
  const [payment, setPayment] = useState(null);

  useEffect(() => { getPayment().then(setPayment); }, []);

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <h1 className="font-display text-2xl font-semibold mb-1">Payment Tracking</h1>

        {!payment ? (
          <Card><LoadingState label="Loading payment status…" /></Card>
        ) : (
          <>
            <Card className="text-center">
              <p className="text-xs text-charcoal/50">Expected payment</p>
              <p className="font-display text-4xl font-bold text-forest-800 mt-1">₹{payment.expectedAmount.toLocaleString('en-IN')}</p>
              <div className="flex justify-center mt-3"><StatusBadge status={payment.status} /></div>
              <p className="text-xs text-charcoal/50 mt-4">Reference: {payment.reference}</p>
              <p className="text-xs text-charcoal/50">Method: {payment.method}</p>
            </Card>

            <Card>
              <p className="text-xs font-semibold tracking-wide text-forest-600 uppercase mb-4">Payment Timeline</p>
              <ol className="space-y-4">
                {payment.timeline.map((step, i) => (
                  <li key={step.label} className="flex items-center gap-3">
                    {step.done ? (
                      <CheckCircle2 size={20} className={step.current ? 'text-harvest-500' : 'text-forest-600'} />
                    ) : (
                      <Circle size={20} className="text-cream-300" />
                    )}
                    <span className={`text-sm ${step.done ? 'font-semibold text-charcoal' : 'text-charcoal/40'}`}>{step.label}</span>
                  </li>
                ))}
              </ol>
            </Card>

            <Link to="/receipt"><Button variant="outline" className="w-full">View Digital Receipt</Button></Link>
          </>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
