import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressTimeline from '../components/ProgressTimeline';
import LoadingState from '../components/LoadingState';
import { getProcurementTimeline, getQualityCheck, getWeighment } from '../services/api';

export default function Procurement() {
  const [timeline, setTimeline] = useState(null);
  const [quality, setQuality] = useState(null);
  const [weighment, setWeighment] = useState(null);

  useEffect(() => {
    (async () => {
      const [t, q, w] = await Promise.all([getProcurementTimeline(), getQualityCheck(), getWeighment()]);
      setTimeline(t);
      setQuality(q);
      setWeighment(w);
    })();
  }, []);

  const currentIndex = timeline ? timeline.steps.findIndex((s) => !s.done) : 0;

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <h1 className="font-display text-2xl font-semibold mb-1">Procurement Tracking</h1>
        <p className="text-sm text-charcoal/50 mb-2">Token #KQ-284 · Shakti Agro Procurement Centre</p>

        {!timeline ? (
          <Card><LoadingState label="Loading procurement status…" /></Card>
        ) : (
          <>
            <Card>
              <ProgressTimeline steps={timeline.steps} currentIndex={currentIndex === -1 ? timeline.steps.length : currentIndex} />
            </Card>

            <Card>
              <p className="text-xs font-semibold tracking-wide text-forest-600 uppercase mb-3">Quality Check</p>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-charcoal/50 text-xs">Moisture</dt><dd className="font-semibold">{quality?.moisture ?? '—'}</dd></div>
                <div><dt className="text-charcoal/50 text-xs">Foreign matter</dt><dd className="font-semibold">{quality?.foreignMatter ?? '—'}</dd></div>
                <div><dt className="text-charcoal/50 text-xs">Grade</dt><dd className="font-semibold">{quality?.grade ?? '—'}</dd></div>
                <div><dt className="text-charcoal/50 text-xs">Status</dt><dd className="font-semibold">{quality?.status ?? 'Not started yet'}</dd></div>
              </dl>
              {quality?.status === 'REJECTED' && quality.remarks && (
                <p className="text-sm text-rust bg-red-50 rounded-lg p-3 mt-3">{quality.remarks}</p>
              )}
              {quality?.status === 'APPROVED' && (
                <p className="text-sm text-charcoal/60 mt-3">{quality.remarks}</p>
              )}
            </Card>

            <Card>
              <p className="text-xs font-semibold tracking-wide text-forest-600 uppercase mb-3">Weighing Record</p>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-charcoal/50 text-xs">Declared quantity</dt><dd className="font-semibold">{weighment?.declaredQuantity ?? '—'}</dd></div>
                <div><dt className="text-charcoal/50 text-xs">Actual weight</dt><dd className="font-semibold">{weighment?.actualWeight ?? 'Pending'}</dd></div>
                <div><dt className="text-charcoal/50 text-xs">Difference</dt><dd className="font-semibold">{weighment?.difference ?? '—'}</dd></div>
                <div><dt className="text-charcoal/50 text-xs">Rate</dt><dd className="font-semibold">{weighment ? `₹${weighment.rate}/Qtl` : '—'}</dd></div>
              </dl>
              <div className="mt-3 pt-3 border-t border-cream-200 flex justify-between items-baseline">
                <span className="text-sm text-charcoal/50">Gross amount</span>
                <span className="font-display text-xl font-bold text-forest-800">{weighment ? `₹${weighment.grossAmount.toLocaleString('en-IN')}` : '—'}</span>
              </div>
            </Card>

            <Link to="/payments"><Button className="w-full">View Payment Status</Button></Link>
          </>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
