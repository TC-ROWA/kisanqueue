import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { getComplaints, submitComplaint } from '../services/api';

const CATEGORIES = ['Payment issue', 'Quality issue', 'Weight issue', 'Token issue', 'Centre issue', 'Other'];

export default function Complaints() {
  const [complaints, setComplaints] = useState(null);
  const [form, setForm] = useState({ category: CATEGORIES[0], subject: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = () => getComplaints().then(setComplaints);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) return;
    setSubmitting(true);
    await submitComplaint(form);
    setSubmitting(false);
    setSubmitted(true);
    setForm({ category: CATEGORIES[0], subject: '', description: '' });
    load();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <h1 className="font-display text-2xl font-semibold mb-1">Complaints</h1>

        <Card>
          <p className="font-semibold mb-4">Submit a new complaint</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="category">Category</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="subject">Subject</label>
              <input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm"
                placeholder="Brief summary of the issue"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="description">Description</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm"
                placeholder="Tell us what happened"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Submitting…' : 'Submit complaint'}
            </Button>
            {submitted && <p className="text-sm text-forest-700 text-center">Complaint submitted — we'll follow up soon.</p>}
          </form>
        </Card>

        <Card>
          <p className="font-semibold mb-3">Your complaints</p>
          {!complaints ? (
            <LoadingState label="Loading…" />
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b border-cream-200 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{c.subject}</p>
                    <p className="text-xs text-charcoal/50">{c.category} · {c.date}</p>
                  </div>
                  <StatusBadge status={c.status === 'OPEN' ? 'OPEN_COMPLAINT' : c.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <MobileBottomNav />
    </div>
  );
}
