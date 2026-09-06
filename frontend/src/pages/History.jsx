import { useEffect, useState } from 'react';
import { PackageSearch } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { getHistory } from '../services/api';

const CROPS = ['All crops', 'Wheat', 'Mustard', 'Barley'];
const STATUSES = ['All statuses', 'PAID', 'PROCESSING'];

export default function History() {
  const [rows, setRows] = useState(null);
  const [crop, setCrop] = useState('All crops');
  const [statusFilter, setStatusFilter] = useState('All statuses');

  useEffect(() => { getHistory().then(setRows); }, []);

  const filtered = (rows || []).filter(
    (r) => (crop === 'All crops' || r.crop === crop) && (statusFilter === 'All statuses' || r.status === statusFilter)
  );

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'crop', label: 'Crop' },
    { key: 'centre', label: 'Centre' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount.toLocaleString('en-IN')}` },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> }
  ];

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="font-display text-2xl font-semibold mb-5">Procurement History</h1>

        <div className="flex flex-wrap gap-3 mb-5">
          <select value={crop} onChange={(e) => setCrop(e.target.value)} className="px-3 py-2 rounded-lg border border-cream-300 text-sm bg-white">
            {CROPS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-cream-300 text-sm bg-white">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <Card>
          {!rows ? (
            <LoadingState label="Loading your procurement history…" />
          ) : filtered.length ? (
            <DataTable columns={columns} rows={filtered} keyField="date" />
          ) : (
            <EmptyState icon={PackageSearch} title="No records match your filters" description="Try a different crop or status." />
          )}
        </Card>
      </div>
      <MobileBottomNav />
    </div>
  );
}
