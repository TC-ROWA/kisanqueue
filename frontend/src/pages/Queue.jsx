import { useEffect, useRef, useState } from 'react';
import { Radio } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Card from '../components/Card';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getQueue } from '../services/api';

// ---------------------------------------------------------------------------
// In production this page subscribes to a Supabase Realtime channel on the
// `queue_entries` table (see SETUP.md → "Realtime queue"). Here we simulate
// the same experience by advancing the current token every few seconds, so
// the UI and its "live" affordances are real and testable without a backend.
// ---------------------------------------------------------------------------

export default function Queue() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [currentNum, setCurrentNum] = useState(267);
  const yourNum = 284;
  const intervalRef = useRef(null);

  const load = async () => {
    setStatus('loading');
    try {
      const res = await getQueue();
      setData(res);
      setCurrentNum(267);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (status !== 'ready') return;
    intervalRef.current = setInterval(() => {
      setCurrentNum((n) => (n < yourNum ? n + 1 : n));
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [status]);

  const farmersAhead = Math.max(yourNum - currentNum - 1, 0);
  const estimatedMinutes = farmersAhead * 5;

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display text-2xl font-semibold">Live Queue</h1>
          {status === 'ready' && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-forest-700">
              <Radio size={13} className="pulse-dot" /> Live
            </span>
          )}
        </div>
        <p className="text-sm text-charcoal/50 mb-6">Shakti Agro Procurement Centre</p>

        {status === 'loading' && <Card><LoadingState label="Connecting to live queue…" /></Card>}
        {status === 'error' && <Card><ErrorState message="Couldn't connect to the live queue." onRetry={load} /></Card>}

        {status === 'ready' && (
          <>
            <Card className="text-center mb-5">
              <p className="text-xs text-charcoal/50 mb-1">Your token</p>
              <p className="font-display text-5xl font-bold text-forest-800">#KQ-{yourNum}</p>
              <div className="flex justify-center gap-8 mt-5">
                <div>
                  <p className="text-xs text-charcoal/50">Now serving</p>
                  <p className="text-xl font-bold">#KQ-{currentNum}</p>
                </div>
                <div>
                  <p className="text-xs text-charcoal/50">Farmers ahead</p>
                  <p className="text-xl font-bold">{farmersAhead}</p>
                </div>
                <div>
                  <p className="text-xs text-charcoal/50">Est. waiting</p>
                  <p className="text-xl font-bold">{estimatedMinutes} min</p>
                </div>
              </div>
              <div className="w-full h-2.5 bg-cream-200 rounded-full mt-6 overflow-hidden">
                <div
                  className="h-full bg-forest-600 transition-all duration-700"
                  style={{ width: `${Math.min(((currentNum - 267) / (yourNum - 267)) * 100, 100)}%` }}
                />
              </div>
            </Card>

            <Card>
              <p className="text-xs font-semibold tracking-wide text-charcoal/50 uppercase mb-3">Queue</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {data.tokens.map((t) => {
                  const num = Number(t.token.split('-')[1]);
                  const isYou = num === yourNum;
                  const done = num <= currentNum;
                  return (
                    <div
                      key={t.token}
                      className={`text-center py-2.5 rounded-lg text-xs font-semibold ${
                        isYou
                          ? 'bg-forest-700 text-white ring-2 ring-forest-300'
                          : done
                          ? 'bg-cream-200 text-charcoal/40 line-through'
                          : 'bg-cream-100 text-charcoal'
                      }`}
                    >
                      {t.token}
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
