export default function Logo({ size = 40, withWordmark = true, wordmarkClass = '' }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/logo.png" alt="KisanQueue logo" width={size} height={size} className="rounded-xl" />
      {withWordmark && (
        <span className={`font-display font-semibold text-xl tracking-tight text-forest-800 ${wordmarkClass}`}>
          KisanQueue
        </span>
      )}
    </div>
  );
}
