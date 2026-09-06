import { Check } from 'lucide-react';

export default function ProgressTimeline({ steps, currentIndex, orientation = 'vertical' }) {
  if (orientation === 'horizontal') {
    return (
      <div className="flex items-start overflow-x-auto pb-2 gap-0 -mx-1">
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step.key || step.label} className="flex items-center min-w-[92px] px-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${done ? 'bg-forest-600 text-white' : active ? 'bg-harvest-500 text-white pulse-dot' : 'bg-cream-200 text-charcoal/40'}`}
                >
                  {done ? <Check size={14} /> : i + 1}
                </div>
                <span className={`mt-2 text-[11px] text-center leading-tight ${active ? 'font-semibold text-charcoal' : 'text-charcoal/60'}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 w-6 mt-3.5 ${done ? 'bg-forest-500' : 'bg-cream-300'}`} />}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <ol className="relative border-l-2 border-cream-300 ml-3">
      {steps.map((step, i) => {
        const done = step.done ?? i < currentIndex;
        const active = !done && (step.active ?? i === currentIndex);
        return (
          <li key={step.key || step.label} className="mb-6 ml-5 last:mb-0">
            <span
              className={`absolute -left-[11px] flex items-center justify-center w-5 h-5 rounded-full ring-4 ring-white
              ${done ? 'bg-forest-600' : active ? 'bg-harvest-500 pulse-dot' : 'bg-cream-300'}`}
            >
              {done && <Check size={12} className="text-white" />}
            </span>
            <p className={`text-sm font-semibold ${done || active ? 'text-charcoal' : 'text-charcoal/40'}`}>{step.label}</p>
            {step.time && <p className="text-xs text-charcoal/50 mt-0.5">{step.time}</p>}
          </li>
        );
      })}
    </ol>
  );
}
