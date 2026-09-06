import { useEffect, useState } from 'react';
import { PhoneCall, Pause, SkipForward, UserX, CheckCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import { LayoutDashboard, ListOrdered, Building2 } from 'lucide-react';
import { getOperatorQueue, operatorAction } from '../services/api';

const SIDEBAR_ITEMS = [
  { to: '/operator/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/operator/dashboard', label: 'Queue', icon: ListOrdered },
  { to: '/operator/dashboard', label: 'Centre Settings', icon: Building2 }
];

const STAGE_LABELS = {
  WAITING: 'Waiting', CALLED: 'Called', QUALITY_CHECK: 'Quality Check', WEIGHING: 'Weighing', PROCUREMENT: 'Procurement'
};
const STAGE_ORDER = ['CALLED', 'QUALITY_CHECK', 'WEIGHING', 'PROCUREMENT', 'COMPLETED'];

export default function OperatorDashboard() {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  const load = () => getOperatorQueue().then(setData);
  useEffect(() => { load(); }, []);

  const act = async (label, mutate) => {
    setBusy(true);
    await operatorAction(label);
    setBusy(false);
    setToast(label);
    setData((d) => (mutate ? mutate(d) : d));
    setTimeout(() => setToast(''), 2200);
  };

  const advanceStage = () =>
    act('Advanced to next stage', (d) => {
      const idx = STAGE_ORDER.indexOf(d.stage);
      const nextStage = STAGE_ORDER[Math.min(idx + 1, STAGE_ORDER.length - 1)];
      if (nextStage === 'COMPLETED') {
        const [nextToken, ...rest] = d.next;
        return { ...d, currentToken: nextToken || d.currentToken, stage: 'CALLED', next: [...rest, `KQ-${289 + rest.length}`] };
      }
      return { ...d, stage: nextStage };
    });

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <div className="flex">
        <Sidebar items={SIDEBAR_ITEMS} />
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-5xl">
          <h1 className="font-display text-2xl font-semibold mb-1">Operator Dashboard</h1>
          <p className="text-sm text-charcoal/50 mb-6">{data?.centre || 'Loading centre…'}</p>

          {!data ? (
            <Card><LoadingState label="Loading queue…" /></Card>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                  ['Bookings today', data.stats.bookingsToday],
                  ['Waiting', data.stats.waiting],
                  ['Completed', data.stats.completed],
                  ['No-show', data.stats.noShow],
                  ['Avg. processing', `${data.stats.avgProcessingMinutes}m`]
                ].map(([label, val]) => (
                  <Card key={label} className="text-center py-4">
                    <p className="text-xl font-bold text-forest-800">{val}</p>
                    <p className="text-[11px] text-charcoal/50 mt-0.5">{label}</p>
                  </Card>
                ))}
              </div>

              <Card className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-charcoal/50">Current token</p>
                    <p className="font-display text-3xl font-bold text-forest-800">{data.currentToken}</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-harvest-500/10 text-harvest-500 text-xs font-semibold">
                    {STAGE_LABELS[data.stage]}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <Button onClick={advanceStage} disabled={busy}><PhoneCall size={15} /> Call Next</Button>
                  <Button variant="secondary" onClick={() => act('Held')} disabled={busy}><Pause size={15} /> Hold</Button>
                  <Button variant="secondary" onClick={() => act('Skipped')} disabled={busy}><SkipForward size={15} /> Skip</Button>
                  <Button variant="outline" onClick={() => act('Marked no-show')} disabled={busy}><UserX size={15} /> No-show</Button>
                  <Button variant="outline" onClick={advanceStage} disabled={busy}><CheckCheck size={15} /> Complete</Button>
                </div>
                {toast && <p className="text-xs text-forest-700 mt-3">{toast} — recorded to the queue log.</p>}
              </Card>

              <Card>
                <p className="text-xs font-semibold tracking-wide text-charcoal/50 uppercase mb-3">Up next</p>
                <div className="flex flex-wrap gap-2">
                  {data.next.map((t, i) => (
                    <span key={t} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${i === 0 ? 'bg-forest-50 text-forest-800' : 'bg-cream-100 text-charcoal/70'}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
