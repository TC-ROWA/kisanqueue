export default function Card({ children, className = '', padded = true }) {
  return (
    <div className={`bg-white rounded-card shadow-soft border border-cream-300/60 ${padded ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}
