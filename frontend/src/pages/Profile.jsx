import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Languages, MapPin, Phone, IdCard } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import { useAuth } from '../context/AuthContext';
import { getFarmerProfile } from '../services/api';

export default function Profile() {
  const [farmer, setFarmer] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { getFarmerProfile().then(setFarmer); }, []);

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 py-6">
        <h1 className="font-display text-2xl font-semibold mb-5">Your Profile</h1>
        {!farmer ? (
          <Card><LoadingState label="Loading profile…" /></Card>
        ) : (
          <Card>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center font-display text-2xl font-semibold text-forest-800">
                {farmer.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-lg">{farmer.name}</p>
                <p className="text-xs text-charcoal/50">{farmer.farmerId}</p>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Phone size={15} className="text-charcoal/40" /> {farmer.mobile}</div>
              <div className="flex items-center gap-2"><MapPin size={15} className="text-charcoal/40" /> {farmer.village}, {farmer.district}, {farmer.state}</div>
              <div className="flex items-center gap-2"><Languages size={15} className="text-charcoal/40" /> {farmer.language === 'hi' ? 'हिंदी' : 'English'}</div>
              <div className="flex items-center gap-2"><IdCard size={15} className="text-charcoal/40" /> Farmer ID: {farmer.farmerId}</div>
            </dl>
            <Button variant="outline" className="w-full mt-6 text-rust border-rust hover:bg-red-50" onClick={() => { logout(); navigate('/'); }}>
              <LogOut size={16} /> Log out
            </Button>
          </Card>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
