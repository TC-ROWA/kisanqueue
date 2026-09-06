import { NavLink } from 'react-router-dom';
import { Home, CalendarPlus, ListOrdered, History, User } from 'lucide-react';

const ITEMS = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/book-slot', label: 'Book', icon: CalendarPlus },
  { to: '/queue', label: 'Queue', icon: ListOrdered },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function MobileBottomNav() {
  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-cream-300 flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium ${
              isActive ? 'text-forest-700' : 'text-charcoal/45'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
