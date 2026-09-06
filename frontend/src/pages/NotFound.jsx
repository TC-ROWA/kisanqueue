import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center text-center px-6">
      <Logo size={48} withWordmark={false} />
      <h1 className="font-display text-3xl font-semibold mt-6">Page not found</h1>
      <p className="text-charcoal/50 mt-2 max-w-xs">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/"><Button className="mt-6">Back to home</Button></Link>
    </div>
  );
}
