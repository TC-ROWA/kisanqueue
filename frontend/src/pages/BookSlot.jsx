import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wheat, Sprout, Nut, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import { getCentres, getAvailableSlots, createBooking } from '../services/api';

const CROPS = [
  { id: 'wheat', label: 'Wheat', icon: Wheat },
  { id: 'mustard', label: 'Mustard', icon: Sprout },
  { id: 'gram', label: 'Gram', icon: Nut }
];

const STEP_LABELS = ['Crop', 'Quantity', 'Centre', 'Date & Slot', 'Confirm'];

export default function BookSlot() {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [centres, setCentres] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    crop: 'wheat',
    quantity: '',
    centreId: location.state?.centreId || '',
    date: '2026-08-24',
    slot: ''
  });

  useEffect(() => {
    (async () => {
      const [c, s] = await Promise.all([getCentres(), getAvailableSlots()]);
      setCentres(c);
      setSlots(s);
      if (!form.centreId) setForm((f) => ({ ...f, centreId: c[0]?.id }));
      setLoading(false);
    })();
  }, [form.centreId]);

  const next = () => setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canProceed = [
    !!form.crop,
    !!form.quantity && Number(form.quantity) > 0,
    !!form.centreId,
    !!form.slot,
    true
  ][step];

  const confirm = async () => {
    setSubmitting(true);
    const booking = await createBooking(form);
    setSubmitting(false);
    navigate('/token', { state: { booking } });
  };

  const selectedCentre = centres.find((c) => c.id === form.centreId);

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="font-display text-2xl font-semibold mb-1">Book a Procurement Slot</h1>
        <p className="text-sm text-charcoal/50 mb-6">Step {step + 1} of {STEP_LABELS.length}: {STEP_LABELS[step]}</p>

        <div className="flex gap-1.5 mb-6">
          {STEP_LABELS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-forest-600' : 'bg-cream-300'}`} />
          ))}
        </div>

        {loading ? (
          <Card><LoadingState label="Loading booking options…" /></Card>
        ) : (
          <Card>
            {step === 0 && (
              <div>
                <p className="font-semibold mb-3">Select crop</p>
                <div className="grid grid-cols-3 gap-3">
                  {CROPS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setForm((f) => ({ ...f, crop: c.label }))}
                      className={`flex flex-col items-center gap-2 py-5 rounded-xl border-2 ${
                        form.crop === c.label ? 'border-forest-600 bg-forest-50' : 'border-cream-300 hover:bg-cream-100'
                      }`}
                    >
                      <c.icon size={24} className="text-forest-700" />
                      <span className="text-sm font-medium">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <label htmlFor="qty" className="font-semibold mb-3 block">Enter quantity (in Quintals)</label>
                <input
                  id="qty"
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  placeholder="e.g. 42.5"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-forest-500 outline-none text-lg font-semibold"
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="font-semibold mb-3">Select procurement centre</p>
                <div className="space-y-2">
                  {centres.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setForm((f) => ({ ...f, centreId: c.id }))}
                      className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl border-2 ${
                        form.centreId === c.id ? 'border-forest-600 bg-forest-50' : 'border-cream-300 hover:bg-cream-100'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-charcoal/50">{c.village}, {c.district}</p>
                      </div>
                      <span className="text-xs font-semibold text-charcoal/60">{c.queueLength} waiting</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label htmlFor="date" className="font-semibold mb-2 block">Select date</label>
                <input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-forest-500 outline-none text-sm mb-5"
                />
                <p className="font-semibold mb-3">Select available time slot</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={s.remaining === 0}
                      onClick={() => setForm((f) => ({ ...f, slot: s.time }))}
                      className={`text-left px-3 py-3 rounded-xl border-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                        form.slot === s.time ? 'border-forest-600 bg-forest-50' : 'border-cream-300 hover:bg-cream-100'
                      }`}
                    >
                      <p className="font-medium">{s.time}</p>
                      <p className="text-xs text-charcoal/50">{s.remaining === 0 ? 'Full' : `${s.remaining} slots remaining`}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="flex items-center gap-2 text-forest-700 mb-4">
                  <CheckCircle2 size={20} />
                  <p className="font-semibold">Review your booking</p>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-charcoal/50">Crop</dt><dd className="font-semibold">{form.crop}</dd></div>
                  <div className="flex justify-between"><dt className="text-charcoal/50">Quantity</dt><dd className="font-semibold">{form.quantity} Quintals</dd></div>
                  <div className="flex justify-between"><dt className="text-charcoal/50">Centre</dt><dd className="font-semibold text-right">{selectedCentre?.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-charcoal/50">Date</dt><dd className="font-semibold">{form.date}</dd></div>
                  <div className="flex justify-between"><dt className="text-charcoal/50">Slot</dt><dd className="font-semibold">{form.slot}</dd></div>
                </dl>
              </div>
            )}

            <div className="flex gap-3 mt-7">
              {step > 0 && <Button variant="outline" onClick={back} className="flex-1">Back</Button>}
              {step < STEP_LABELS.length - 1 ? (
                <Button onClick={next} disabled={!canProceed} className="flex-1">Continue</Button>
              ) : (
                <Button onClick={confirm} disabled={submitting} className="flex-1">
                  {submitting ? 'Confirming…' : 'Confirm booking'}
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
