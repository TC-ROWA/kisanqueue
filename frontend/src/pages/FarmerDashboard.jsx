import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation2, ListOrdered, Wheat, MapPin, Wifi, WifiOff, TriangleAlert, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useAuth } from '../context/AuthContext';
import { getCurrentBooking, getCentre } from '../services/api';
import { shouldLeaveNow } from '../services/waitEstimate';

function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [centre, setCentre] = useState(null);
  const [status, setStatus] = useState('loading');
  const [lastUpdated, setLastUpdated] = useState(null);
  const online = useOnlineStatus();

  const load = async () => {
    setStatus('loading');
    try {
      const b = await getCurrentBooking();
      const c = await getCentre(b.centreId);
      setBooking(b);
      setCentre(c);
      setLastUpdated(new Date());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => { load(); }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const leave = booking && centre
    ? shouldLeaveNow({
        farmersAhead: booking.farmersAhead,
        avgProcessingMinutesPerFarmer: 60 / centre.avgProcessingPerHour,
        travelMinutes: 25,
        bufferMinutes: 15
      })
    : null;

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">{greeting}, {user?.name?.split(' ')[0] || 'Farmer'} 👋</h1>
            <p className="text-sm text-charcoal/50 flex items-center gap-1.5 mt-1">
              {online ? <Wifi size={14} className="text-forest-600" /> : <WifiOff size={14} className="text-rust" />}
              {online ? 'Live' : "You're offline — showing the latest available queue information."}
              {lastUpdated && <span>· Last updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
            </p>
          </div>
        </div>

        {status === 'loading' && <Card><LoadingState label="Loading your dashboard…" /></Card>}
        {status === 'error' && <Card><ErrorState message="Couldn't load your latest booking." onRetry={load} /></Card>}

        {status === 'ready' && booking && centre && (
          <>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold tracking-wide text-forest-600 uppercase">Your Next Procurement</p>
                <StatusBadge status={booking.status} />
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center shrink-0">
                  <Wheat size={22} className="text-forest-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xl font-semibold text-charcoal">{booking.crop}</p>
                  <p className="text-sm text-charcoal/60 flex items-center gap-1"><MapPin size={13} />{booking.centreName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-charcoal/50">Token</p>
                  <p className="font-display text-lg font-bold text-forest-800">{booking.token}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-cream-100 rounded-xl p-3">
                  <p className="text-xs text-charcoal/50">Farmers ahead</p>
                  <p className="text-xl font-bold text-charcoal">{booking.farmersAhead}</p>
                </div>
                <div className="bg-cream-100 rounded-xl p-3">
                  <p className="text-xs text-charcoal/50">Estimated waiting time</p>
                  <p className="text-xl font-bold text-charcoal">{Math.floor(booking.estimatedWaitMinutes / 60)}h {booking.estimatedWaitMinutes % 60}m</p>
                </div>
              </div>
              <div className="bg-cream-100 rounded-xl p-3 mt-3">
                <p className="text-xs text-charcoal/50">Recommended arrival</p>
                <p className="text-sm font-semibold text-charcoal">{booking.recommendedArrival}</p>
              </div>

              <div className="flex gap-3 mt-5">
                <Link to="/queue" className="flex-1"><Button className="w-full"><ListOrdered size={16} /> View Live Queue</Button></Link>
                <Link to="/find-centres" className="flex-1"><Button variant="outline" className="w-full"><Navigation2 size={16} /> Get Directions</Button></Link>
              </div>
            </Card>

            {leave && (
              <Card className={`border-2 ${leave.canLeaveNow ? 'border-forest-500' : 'border-harvest-500'}`}>
                <p className="text-xs font-semibold tracking-wide text-charcoal/50 uppercase mb-3">🚜 Should I leave now?</p>
                <div className={`rounded-xl p-4 mb-4 flex items-start gap-3 ${leave.canLeaveNow ? 'bg-forest-50' : 'bg-amber-50'}`}>
                  {leave.canLeaveNow ? (
                    <CheckCircle2 size={26} className="text-forest-600 shrink-0" />
                  ) : (
                    <TriangleAlert size={26} className="text-harvest-500 shrink-0" />
                  )}
                  <div>
                    <p className={`font-display text-lg font-semibold ${leave.canLeaveNow ? 'text-forest-800' : 'text-harvest-500'}`}>
                      {leave.canLeaveNow ? 'Yes, you can leave now' : 'Wait a little longer'}
                    </p>
                    <p className="text-sm text-charcoal/70 mt-1">
                      {leave.canLeaveNow
                        ? `Your token should be called in about ${leave.estimatedMinutesUntilCalled} minutes — that's enough time for your ${leave.minutesNeededToArriveInTime}-minute trip.`
                        : `Current queue is moving slower than your travel time needs. We recommend leaving in about ${leave.leaveInMinutes} minutes.`}
                    </p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div><dt className="text-charcoal/50 text-xs">Slot time</dt><dd className="font-semibold">{booking.slot}</dd></div>
                  <div><dt className="text-charcoal/50 text-xs">Current queue</dt><dd className="font-semibold">{booking.farmersAhead} farmers</dd></div>
                  <div><dt className="text-charcoal/50 text-xs">Processing speed</dt><dd className="font-semibold">{centre.avgProcessingPerHour}/hour</dd></div>
                  <div><dt className="text-charcoal/50 text-xs">Travel + buffer</dt><dd className="font-semibold">25 + 15 min</dd></div>
                </dl>
              </Card>
            )}

            <Card>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold tracking-wide text-forest-600 uppercase">Procurement Centre Status</p>
                <StatusBadge status={centre.status} />
              </div>
              <p className="font-semibold text-charcoal">{centre.name}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
                <div><p className="text-charcoal/50 text-xs">Current queue</p><p className="font-semibold">{centre.queueLength} waiting</p></div>
                <div><p className="text-charcoal/50 text-xs">Current token</p><p className="font-semibold">{centre.currentToken}</p></div>
                <div><p className="text-charcoal/50 text-xs">Today's capacity</p><p className="font-semibold">{Math.round((centre.processedToday / centre.dailyCapacity) * 100)}%</p></div>
                <div><p className="text-charcoal/50 text-xs">Remaining slots</p><p className="font-semibold">{centre.dailyCapacity - centre.processedToday}</p></div>
              </div>
            </Card>
          </>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
