import { Link } from 'react-router-dom';
import {
  ClipboardList, CalendarCheck, Radar, Wallet, MapPinned, Languages,
  UserPlus, Clock3, ScanLine, ArrowRight, Sprout, Building2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ProgressTimeline from '../components/ProgressTimeline';

const HOW_IT_WORKS = [
  { icon: UserPlus, title: 'Register', text: 'Add your name, village and preferred language once — takes under two minutes.' },
  { icon: CalendarCheck, title: 'Book Slot', text: 'Pick a crop, a nearby centre and an open time slot. Get a digital token instantly.' },
  { icon: Radar, title: 'Track Queue', text: 'Watch your position update live, and get told exactly when to leave home.' },
  { icon: Wallet, title: 'Get Paid', text: 'Follow quality check, weighing and payment — all the way to your bank account.' }
];

const WHY = [
  { icon: Clock3, title: 'Less waiting', text: 'Arrive when your token is close, not at sunrise.' },
  { icon: MapPinned, title: 'No unnecessary trips', text: 'Check centre status before you leave the house.' },
  { icon: Radar, title: 'Live queue tracking', text: 'Your position updates in real time, no refreshing.' },
  { icon: ClipboardList, title: 'Transparent procurement', text: 'Every quality check and weight is on record.' },
  { icon: Wallet, title: 'Payment visibility', text: 'Know exactly when your money is on its way.' },
  { icon: Languages, title: 'Multilingual-friendly', text: 'Built for English and Hindi, with more to come.' }
];

const TRACKING_STEPS = [
  { label: 'Registered' }, { label: 'Slot Booked' }, { label: 'Arrived' },
  { label: 'Quality Check' }, { label: 'Weighed' }, { label: 'Procured' }, { label: 'Paid' }
];

const STATS = [
  { value: '1,200+', label: 'Demo Farmers' },
  { value: '18', label: 'Demo Centres' },
  { value: '4,500+', label: 'Demo Transactions' },
  { value: '74 min', label: 'Avg. Demo Wait Time' }
];

export default function Landing() {
  return (
    <div className="bg-cream-100">
      <Navbar transparent />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <Logo size={32} />
          </div>
          <p className="uppercase tracking-[0.18em] text-xs font-semibold text-forest-600 mb-4">
            Agricultural procurement, reimagined
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-charcoal">
            Stop Waiting.
            <br />
            <span className="text-forest-700">Start Knowing.</span>
          </h1>
          <p className="mt-6 text-lg text-charcoal/70 max-w-md leading-relaxed">
            Smart agricultural procurement and queue management that helps farmers know when to arrive,
            track their produce, and monitor their payment — from the field to the bank account.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/book-slot">
              <Button size="lg" className="w-full sm:w-auto">
                Book a Procurement Slot <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/queue">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Check Queue Status
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-charcoal/50 italic">
            "Know when to leave home. Know where you stand. Know when you'll get paid."
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-forest-100 rounded-[32px] -rotate-2" aria-hidden="true" />
          <Card className="relative rounded-[24px] shadow-lift">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-charcoal/50">Your token</p>
                <p className="font-display text-2xl font-semibold text-forest-800">#KQ-284</p>
              </div>
              <StatusBadge status="OPEN" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cream-100 rounded-xl p-3">
                <p className="text-xs text-charcoal/50">Farmers ahead</p>
                <p className="text-xl font-bold text-charcoal">17</p>
              </div>
              <div className="bg-cream-100 rounded-xl p-3">
                <p className="text-xs text-charcoal/50">Est. waiting time</p>
                <p className="text-xl font-bold text-charcoal">1h 20m</p>
              </div>
            </div>
            <div className="mt-4 bg-forest-800 text-white rounded-xl p-4">
              <p className="text-xs text-forest-200">Should I leave now?</p>
              <p className="font-display text-lg font-semibold mt-1">Wait a little longer</p>
              <p className="text-xs text-forest-100 mt-1">We recommend leaving around 11:10 AM.</p>
            </div>
            <div className="mt-4">
              <p className="text-xs text-charcoal/50 mb-2">Procurement progress</p>
              <ProgressTimeline
                orientation="horizontal"
                currentIndex={2}
                steps={[{ label: 'Booked' }, { label: 'Arrived' }, { label: 'Waiting' }, { label: 'Quality' }, { label: 'Paid' }]}
              />
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-white border-y border-cream-300/70 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-center mb-2">How It Works</h2>
          <p className="text-center text-charcoal/60 mb-12">Four steps from your field to your bank account.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-forest-50 flex items-center justify-center mb-4">
                  <s.icon size={24} className="text-forest-700" />
                </div>
                <p className="text-xs font-semibold text-harvest-500 mb-1">STEP {i + 1}</p>
                <h3 className="font-semibold text-charcoal mb-1">{s.title}</h3>
                <p className="text-sm text-charcoal/60 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-center mb-2">Why KisanQueue?</h2>
          <p className="text-center text-charcoal/60 mb-12">Built around the questions every farmer actually has.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map((w) => (
              <Card key={w.title} className="flex gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-cream-200 flex items-center justify-center">
                  <w.icon size={20} className="text-forest-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">{w.title}</h3>
                  <p className="text-sm text-charcoal/60 mt-1">{w.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-[0.18em] text-xs font-semibold text-forest-300 mb-3">Signature feature</p>
            <h2 className="font-display text-3xl font-semibold mb-4">Know when to leave home.</h2>
            <p className="text-forest-100 leading-relaxed mb-6">
              KisanQueue watches your queue position, the centre's actual processing speed, and your
              travel time — then tells you plainly whether to leave now or wait a little longer. No more
              guessing, no more sitting at the centre for hours.
            </p>
            <Link to="/dashboard">
              <Button variant="secondary">See it on your dashboard</Button>
            </Link>
          </div>
          <div className="bg-forest-900/60 rounded-card p-6 border border-forest-700">
            <p className="text-xs text-forest-300 mb-4">Example timeline for token #KQ-284</p>
            <ol className="space-y-4 text-sm">
              <li className="flex justify-between"><span className="text-forest-200">10:45 AM</span><span>Queue moving normally — 32 farmers ahead</span></li>
              <li className="flex justify-between"><span className="text-forest-200">11:02 AM</span><span>Slowed down — 24 farmers ahead</span></li>
              <li className="flex justify-between text-harvest-400 font-semibold"><span>11:10 AM</span><span>Recommended: leave home now</span></li>
              <li className="flex justify-between"><span className="text-forest-200">11:38 AM</span><span>Arrive, token called shortly after</span></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y border-cream-300/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-center mb-2">Procurement Tracking</h2>
          <p className="text-center text-charcoal/60 mb-10">Every step of your crop's journey, on record.</p>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <ProgressTimeline orientation="horizontal" currentIndex={4} steps={TRACKING_STEPS} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <Card className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-forest-50 flex items-center justify-center">
                <Building2 size={20} className="text-forest-700" />
              </div>
              <div>
                <p className="font-semibold text-charcoal">Shakti Agro Procurement Centre</p>
                <p className="text-xs text-charcoal/50">Today's processing snapshot</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-cream-100 rounded-xl py-3"><p className="text-lg font-bold">210</p><p className="text-[11px] text-charcoal/50">bookings</p></div>
              <div className="bg-cream-100 rounded-xl py-3"><p className="text-lg font-bold">168</p><p className="text-[11px] text-charcoal/50">completed</p></div>
              <div className="bg-cream-100 rounded-xl py-3"><p className="text-lg font-bold">7.5m</p><p className="text-[11px] text-charcoal/50">avg. per farmer</p></div>
            </div>
          </Card>
          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl font-semibold mb-4">For Procurement Centres</h2>
            <ul className="space-y-3 text-charcoal/70">
              <li className="flex gap-2"><Sprout size={18} className="text-forest-600 shrink-0 mt-0.5" />Better crowd management, all day long</li>
              <li className="flex gap-2"><Sprout size={18} className="text-forest-600 shrink-0 mt-0.5" />A digital queue operators can call, hold or skip</li>
              <li className="flex gap-2"><Sprout size={18} className="text-forest-600 shrink-0 mt-0.5" />Live capacity monitoring against daily targets</li>
              <li className="flex gap-2"><Sprout size={18} className="text-forest-600 shrink-0 mt-0.5" />Faster processing with fewer disputes</li>
              <li className="flex gap-2"><Sprout size={18} className="text-forest-600 shrink-0 mt-0.5" />Clean digital records for every transaction</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-14 bg-cream-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl sm:text-4xl font-semibold text-forest-800">{s.value}</p>
                <p className="text-sm text-charcoal/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-charcoal/40 mt-6">
            Figures above are illustrative demo data for this prototype, not live platform statistics.
          </p>
        </div>
      </section>

      <footer className="bg-forest-900 text-forest-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <Logo size={32} wordmarkClass="text-white" />
            <p className="text-sm text-forest-300 mt-3 max-w-xs">Less waiting. Smarter procurement.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <p className="font-semibold text-white mb-2">Product</p>
              <ul className="space-y-1.5 text-forest-300">
                <li>About</li><li>How it works</li><li>Help</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Legal</p>
              <ul className="space-y-1.5 text-forest-300">
                <li>Privacy</li><li>Terms</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Contact</p>
              <ul className="space-y-1.5 text-forest-300">
                <li>support@kisanqueue</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-forest-400 mt-10">© 2026 KisanQueue. A demo agricultural-technology prototype.</p>
      </footer>
    </div>
  );
}
