import { MapPin, Clock, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Card from './Card';

export default function CentreCard({ centre, onSelect, recommended }) {
  const waitMinutes = Math.round((centre.queueLength / centre.avgProcessingPerHour) * 60);
  const hours = waitMinutes >= 60 ? `${Math.floor(waitMinutes / 60)}h ${waitMinutes % 60}m` : `${waitMinutes} min`;
  return (
    <Card className="relative">
      {recommended && (
        <span className="absolute -top-2 left-4 bg-harvest-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-soft">
          Recommended Centre
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-charcoal truncate">{centre.name}</h3>
          <p className="text-xs text-charcoal/50 flex items-center gap-1 mt-1">
            <MapPin size={12} /> {centre.village}, {centre.district}
          </p>
        </div>
        <StatusBadge status={centre.status} />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="bg-cream-100 rounded-lg py-2">
          <p className="text-sm font-bold text-charcoal flex items-center justify-center gap-1"><Users size={13} />{centre.queueLength}</p>
          <p className="text-[11px] text-charcoal/50">waiting</p>
        </div>
        <div className="bg-cream-100 rounded-lg py-2">
          <p className="text-sm font-bold text-charcoal flex items-center justify-center gap-1"><Clock size={13} />{hours}</p>
          <p className="text-[11px] text-charcoal/50">est. wait</p>
        </div>
        <div className="bg-cream-100 rounded-lg py-2">
          <p className="text-sm font-bold text-charcoal">{centre.dailyCapacity - centre.processedToday}</p>
          <p className="text-[11px] text-charcoal/50">slots left</p>
        </div>
      </div>
      <button
        onClick={() => onSelect?.(centre)}
        className="mt-4 w-full text-center text-sm font-semibold text-forest-700 hover:text-forest-800 py-2 rounded-lg hover:bg-forest-50"
      >
        Select this centre →
      </button>
    </Card>
  );
}
