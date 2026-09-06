import { NavLink } from 'react-router-dom';
import Logo from './Logo';

export default function Sidebar({ items }) {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-cream-300 bg-white min-h-[calc(100vh-64px)] p-4">
      <nav className="flex flex-col gap-1 mt-2">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                isActive ? 'bg-forest-50 text-forest-800' : 'text-charcoal/70 hover:bg-cream-100'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
