export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-charcoal/50">
      <div className="w-8 h-8 border-2 border-forest-300 border-t-forest-700 rounded-full animate-spin mb-3" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
