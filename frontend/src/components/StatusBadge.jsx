const MAP = {
  OPEN: { label: 'Open', dot: 'bg-forest-500', text: 'text-forest-700', bg: 'bg-forest-50' },
  HIGH_RUSH: { label: 'High Rush', dot: 'bg-harvest-500', text: 'text-harvest-500', bg: 'bg-amber-50' },
  LIMITED_CAPACITY: { label: 'Limited Capacity', dot: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50' },
  PAUSED: { label: 'Procurement Paused', dot: 'bg-rust', text: 'text-rust', bg: 'bg-red-50' },
  CLOSED: { label: 'Closed', dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-100' },
  CONFIRMED: { label: 'Confirmed', dot: 'bg-forest-500', text: 'text-forest-700', bg: 'bg-forest-50' },
  PROCESSING: { label: 'Processing', dot: 'bg-harvest-500', text: 'text-harvest-500', bg: 'bg-amber-50' },
  PAID: { label: 'Paid', dot: 'bg-forest-500', text: 'text-forest-700', bg: 'bg-forest-50' },
  APPROVED: { label: 'Approved', dot: 'bg-forest-500', text: 'text-forest-700', bg: 'bg-forest-50' },
  REJECTED: { label: 'Rejected', dot: 'bg-rust', text: 'text-rust', bg: 'bg-red-50' },
  OPEN_COMPLAINT: { label: 'Open', dot: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50' },
  IN_REVIEW: { label: 'In Review', dot: 'bg-harvest-500', text: 'text-harvest-500', bg: 'bg-amber-50' },
  RESOLVED: { label: 'Resolved', dot: 'bg-forest-500', text: 'text-forest-700', bg: 'bg-forest-50' }
};

export default function StatusBadge({ status, label }) {
  const cfg = MAP[status] || { label: label || status, dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-100' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {label || cfg.label}
    </span>
  );
}
