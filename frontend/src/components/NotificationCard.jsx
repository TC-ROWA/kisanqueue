import { Bell, Truck, Wallet, Info } from 'lucide-react';

const ICONS = { Queue: Bell, Procurement: Truck, Payment: Wallet, System: Info };

export default function NotificationCard({ notification }) {
  const Icon = ICONS[notification.category] || Info;
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${notification.read ? 'border-cream-200 bg-white' : 'border-forest-200 bg-forest-50'}`}>
      <div className="w-9 h-9 rounded-full bg-white shrink-0 flex items-center justify-center border border-cream-200">
        <Icon size={16} className="text-forest-700" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-charcoal leading-snug">{notification.text}</p>
        <p className="text-xs text-charcoal/40 mt-1">{notification.category} · {notification.time}</p>
      </div>
    </div>
  );
}
