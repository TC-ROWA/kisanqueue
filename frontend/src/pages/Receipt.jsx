import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Card from '../components/Card';
import Button from '../components/Button';
import Logo from '../components/Logo';
import LoadingState from '../components/LoadingState';
import { getReceipt } from '../services/api';

const Row = ({ label, value, strong }) => (
  <div className="flex justify-between py-2 border-b border-dashed border-cream-300 last:border-0">
    <span className="text-sm text-charcoal/60">{label}</span>
    <span className={`text-sm ${strong ? 'font-bold text-forest-800 text-base' : 'font-medium'}`}>{value}</span>
  </div>
);

export default function Receipt() {
  const [r, setR] = useState(null);
  useEffect(() => { getReceipt().then(setR); }, []);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 py-6">
        <h1 className="font-display text-2xl font-semibold mb-5">Digital Receipt</h1>
        {!r ? (
          <Card><LoadingState label="Preparing your receipt…" /></Card>
        ) : (
          <>
            <Card>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-cream-200">
                <Logo size={30} />
                <span className="text-xs text-charcoal/50">{r.date}</span>
              </div>
              <Row label="Farmer name" value={r.farmerName} />
              <Row label="Token" value={`#${r.token}`} />
              <Row label="Centre" value={r.centre} />
              <Row label="Crop" value={r.crop} />
              <Row label="Quantity" value={r.quantity} />
              <Row label="Quality grade" value={r.grade} />
              <Row label="Rate" value={`₹${r.rate}/Qtl`} />
              <Row label="Gross amount" value={`₹${r.gross.toLocaleString('en-IN')}`} />
              <Row label="Deductions" value={`− ₹${r.deductions.toLocaleString('en-IN')}`} />
              <Row label="Net amount" value={`₹${r.net.toLocaleString('en-IN')}`} strong />
              <p className="text-xs text-charcoal/40 mt-4">Payment reference: {r.reference}</p>
            </Card>
            <Button onClick={handlePrint} className="w-full mt-4"><Download size={16} /> Download Receipt</Button>
          </>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
