import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Users, Building2, BarChart3, MessageSquareWarning
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { getAdminStats, getAdminAnalytics } from '../services/api';
import { COMPLAINTS, CENTRES } from '../services/mockData';

const SIDEBAR_ITEMS = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/dashboard', label: 'Farmers', icon: Users },
  { to: '/admin/dashboard', label: 'Centres', icon: Building2 },
  { to: '/admin/dashboard', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/dashboard', label: 'Complaints', icon: MessageSquareWarning }
];

const PIE_COLORS = ['#37704A', '#E3B341', '#82AE8F', '#C15B3C'];
const RANGES = ['Today', '7 days', '30 days', 'Custom'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [range, setRange] = useState('7 days');

  useEffect(() => {
    getAdminStats().then(setStats);
    getAdminAnalytics().then(setAnalytics);
  }, []);

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <div className="flex">
        <Sidebar items={SIDEBAR_ITEMS} />
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-charcoal/50">Platform-wide statistics</p>
            </div>
            <div className="flex gap-1.5">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${range === r ? 'bg-forest-700 text-white' : 'bg-white border border-cream-300 text-charcoal/60'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {!stats ? (
            <Card><LoadingState label="Loading platform statistics…" /></Card>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  ['Total farmers', stats.totalFarmers],
                  ["Today's bookings", stats.bookingsToday],
                  ['Active centres', stats.activeCentres],
                  ['Current waiting', stats.currentWaiting],
                  ['Completed procurements', stats.completedProcurements],
                  ['Pending payments', stats.pendingPayments],
                  ['Avg. waiting time', `${stats.avgWaitMinutes}m`],
                  ['Avg. processing time', `${stats.avgProcessingMinutes}m`]
                ].map(([label, val]) => (
                  <Card key={label} className="py-4">
                    <p className="text-2xl font-bold text-forest-800">{val}</p>
                    <p className="text-xs text-charcoal/50 mt-0.5">{label}</p>
                  </Card>
                ))}
              </div>

              {!analytics ? (
                <Card><LoadingState label="Loading analytics…" /></Card>
              ) : (
                <div className="grid lg:grid-cols-2 gap-5 mb-6">
                  <Card>
                    <p className="text-xs font-semibold tracking-wide text-charcoal/50 uppercase mb-4">Daily Bookings vs Processed</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={analytics.dailyBookings}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EDE1C4" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="bookings" stroke="#28583A" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="processed" stroke="#E3B341" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card>
                    <p className="text-xs font-semibold tracking-wide text-charcoal/50 uppercase mb-4">Crop-wise Procurement</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={analytics.cropSplit} dataKey="value" nameKey="crop" innerRadius={55} outerRadius={85}>
                          {analytics.cropSplit.map((entry, i) => (
                            <Cell key={entry.crop} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="lg:col-span-2">
                    <p className="text-xs font-semibold tracking-wide text-charcoal/50 uppercase mb-4">Centre Performance (processed / avg. wait)</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={analytics.centrePerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EDE1C4" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="processed" fill="#37704A" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="waitMinutes" fill="#E3B341" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-5">
                <Card>
                  <p className="text-xs font-semibold tracking-wide text-charcoal/50 uppercase mb-3">Procurement Centres</p>
                  <div className="space-y-3">
                    {CENTRES.map((c) => (
                      <div key={c.id} className="flex items-center justify-between border-b border-cream-200 pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-charcoal/50">{c.processedToday}/{c.dailyCapacity} processed today</p>
                        </div>
                        <StatusBadge status={c.status} />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <p className="text-xs font-semibold tracking-wide text-charcoal/50 uppercase mb-3">Recent Complaints</p>
                  <div className="space-y-3">
                    {COMPLAINTS.map((c) => (
                      <div key={c.id} className="flex items-center justify-between border-b border-cream-200 pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium">{c.subject}</p>
                          <p className="text-xs text-charcoal/50">{c.category} · {c.date}</p>
                        </div>
                        <StatusBadge status={c.status === 'OPEN' ? 'OPEN_COMPLAINT' : c.status} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
