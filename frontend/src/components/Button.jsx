export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-2 text-sm', md: 'px-5 py-3 text-sm', lg: 'px-6 py-4 text-base' };
  const variants = {
    primary: 'bg-forest-700 text-white hover:bg-forest-800 shadow-soft',
    secondary: 'bg-cream-200 text-forest-800 hover:bg-cream-300',
    outline: 'border-2 border-forest-700 text-forest-700 hover:bg-forest-50',
    ghost: 'text-forest-700 hover:bg-forest-50',
    danger: 'bg-rust text-white hover:bg-rust/90'
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
