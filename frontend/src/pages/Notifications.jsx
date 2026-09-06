import { useEffect, useState } from 'react';
import { BellOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import NotificationCard from '../components/NotificationCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { getNotifications } from '../services/api';

export default function Notifications() {
  const [items, setItems] = useState(null);
  useEffect(() => { getNotifications().then(setItems); }, []);

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="font-display text-2xl font-semibold mb-5">Notifications</h1>
        {!items ? (
          <LoadingState label="Loading notifications…" />
        ) : items.length ? (
          <div className="space-y-3">
            {items.map((n) => <NotificationCard key={n.id} notification={n} />)}
          </div>
        ) : (
          <EmptyState icon={BellOff} title="No notifications yet" description="We'll let you know about your queue, procurement, and payments here." />
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
