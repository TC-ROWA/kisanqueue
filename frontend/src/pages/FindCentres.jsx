import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import CentreCard from '../components/CentreCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { MapPinOff } from 'lucide-react';
import { getCentres } from '../services/api';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function FindCentres() {
  const [centres, setCentres] = useState([]);
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  const load = async () => {
    setStatus('loading');
    try {
      const data = await getCentres();
      setCentres(data);
      setStatus(data.length ? 'ready' : 'empty');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => { load(); }, []);

  const recommendedId = centres.length
    ? [...centres].sort((a, b) => a.queueLength / a.avgProcessingPerHour - b.queueLength / b.avgProcessingPerHour)[0].id
    : null;

  const goBook = (centre) => navigate('/book-slot', { state: { centreId: centre.id } });

  return (
    <div className="min-h-screen bg-cream-100 pb-24 sm:pb-10">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="font-display text-2xl font-semibold mb-1">Find a Procurement Centre</h1>
        <p className="text-sm text-charcoal/50 mb-5">Centres near Agra, Uttar Pradesh, sorted by shortest estimated wait.</p>

        {status === 'loading' && <LoadingState label="Finding centres near you…" />}
        {status === 'error' && <ErrorState message="Unable to load nearby procurement centres." onRetry={load} />}
        {status === 'empty' && <EmptyState icon={MapPinOff} title="No procurement centres found nearby" description="Try expanding your search radius or check back later." />}

        {status === 'ready' && (
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
            <div className="rounded-card overflow-hidden shadow-soft border border-cream-300 h-72 lg:h-full min-h-[320px]">
              <MapContainer center={[27.16, 78.0]} zoom={10} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {centres.map((c) => (
                  <Marker key={c.id} position={[c.lat, c.lng]} icon={markerIcon}>
                    <Popup>
                      <strong>{c.name}</strong>
                      <br />
                      {c.queueLength} waiting · {c.status.replace('_', ' ')}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="space-y-4 max-h-full overflow-y-auto">
              {centres.map((c) => (
                <CentreCard key={c.id} centre={c} onSelect={goBook} recommended={c.id === recommendedId} />
              ))}
            </div>
          </div>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
