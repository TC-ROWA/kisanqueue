import { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_FARMER } from '../services/mockData';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kisanqueue_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('kisanqueue_user', JSON.stringify(user));
    else localStorage.removeItem('kisanqueue_user');
  }, [user]);

  const login = async ({ role = 'farmer' } = {}) => {
    const profiles = {
      farmer: { role: 'farmer', name: DEMO_FARMER.name, id: DEMO_FARMER.id },
      operator: { role: 'operator', name: 'Suresh Yadav', id: 'op-001', centre: 'Shakti Agro Procurement Centre' },
      admin: { role: 'admin', name: 'Admin', id: 'ad-001' }
    };
    setUser(profiles[role]);
    return profiles[role];
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
