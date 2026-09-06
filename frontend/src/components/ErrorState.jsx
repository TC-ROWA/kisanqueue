import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-6">
      <AlertTriangle size={32} className="text-rust mb-3" />
      <p className="font-semibold text-charcoal">Unable to load this page</p>
      <p className="text-sm text-charcoal/50 mt-1 mb-4 max-w-xs">{message}</p>
      {onRetry && <Button size="sm" onClick={onRetry}>Retry</Button>}
    </div>
  );
}
