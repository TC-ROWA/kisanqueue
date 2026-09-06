export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-6">
      {Icon && <Icon size={36} className="text-forest-300 mb-3" />}
      <p className="font-semibold text-charcoal">{title}</p>
      {description && <p className="text-sm text-charcoal/50 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}
