import { useLocation, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CalendarPlus, ListOrdered, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { CURRENT_BOOKING } from '../services/mockData';

export default function Token() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking || CURRENT_BOOKING;

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-semibold">Your Procurement Token</h1>
          <p className="text-sm text-charcoal/50 mt-1">Show this token (or its QR code) at the centre gate.</p>
        </div>

        <Card className="text-center">
          <p className="font-display text-4xl font-bold text-forest-800 tracking-tight">#{booking.token}</p>
          <div className="flex justify-center my-5">
            <div className="p-3 bg-white border border-cream-300 rounded-xl">
              <QRCodeSVG value={`KISANQUEUE:${booking.token}`} size={160} fgColor="#173D2A" />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm text-left">
            <div><dt className="text-charcoal/50 text-xs">Crop</dt><dd className="font-semibold">{booking.crop}</dd></div>
            <div><dt className="text-charcoal/50 text-xs">Quantity</dt><dd className="font-semibold">{booking.quantity}</dd></div>
            <div className="col-span-2"><dt className="text-charcoal/50 text-xs">Centre</dt><dd className="font-semibold">{booking.centreName}</dd></div>
            <div><dt className="text-charcoal/50 text-xs">Date</dt><dd className="font-semibold">{booking.date}</dd></div>
            <div><dt className="text-charcoal/50 text-xs">Slot</dt><dd className="font-semibold">{booking.slot}</dd></div>
          </dl>
          <div className="mt-4 flex justify-center">
            <StatusBadge status={booking.status} />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6">
            <Button variant="outline" size="sm"><CalendarPlus size={15} /> Calendar</Button>
            <Link to="/queue"><Button variant="secondary" size="sm" className="w-full"><ListOrdered size={15} /> Queue</Button></Link>
            <Button variant="ghost" size="sm" className="text-rust hover:bg-red-50" onClick={() => navigate('/dashboard')}>
              <XCircle size={15} /> Cancel
            </Button>
          </div>
        </Card>

        <Link to="/dashboard">
          <Button variant="ghost" className="w-full mt-4">Back to dashboard</Button>
        </Link>
      </div>
      <MobileBottomNav />
    </div>
  );
}
