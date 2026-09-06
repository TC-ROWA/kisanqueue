import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ transparent = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-40 ${transparent ? 'bg-cream-100/90' : 'bg-white'} backdrop-blur border-b border-cream-300/70`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" aria-label="KisanQueue home">
          <Logo size={36} />
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          {user ? (
            <>
              <Link to="/notifications" className="p-2 rounded-lg hover:bg-cream-100" aria-label="Notifications">
                <Bell size={20} className="text-charcoal" />
              </Link>
              <div className="hidden sm:flex items-center gap-2 pl-2 pr-1">
                <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center">
                  <User size={16} className="text-forest-700" />
                </div>
                <span className="text-sm font-medium text-charcoal">{user.name}</span>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="p-2 rounded-lg hover:bg-cream-100"
                aria-label="Log out"
              >
                <LogOut size={19} className="text-charcoal" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-forest-700 px-3 py-2 rounded-lg hover:bg-forest-50">
                Login
              </Link>
              <Link to="/register" className="text-sm font-semibold bg-forest-700 text-white px-4 py-2.5 rounded-xl hover:bg-forest-800">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
