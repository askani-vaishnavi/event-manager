import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Tag, ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react';
import { EventCard, FeaturedEventCard } from '../components/EventCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { categories, events, avatars } from '../data';
import { AvatarGroup } from '../components/ui/Avatar';
import * as Icons from 'lucide-react';
import { useState } from 'react';

export function LandingPage() {
  const navigate = useNavigate();
  const featured = events.filter((e) => e.featured);
  const liveEvents = events.slice(0, 6);
  const recommended = events.slice(2, 6);

  return (
    <div className="pt-16">
      <Hero onNavigate={(id) => navigate(`/event/${id}`)} onExplore={() => navigate('/explore')} />
      <CategorySection onNavigate={() => navigate('/explore')} />
      <LiveDiscovery events={liveEvents} onNavigate={(id) => navigate(`/event/${id}`)} />
      <FeaturedSection events={featured} onNavigate={(id) => navigate(`/event/${id}`)} />
      <MapSection onNavigate={(id) => navigate(`/event/${id}`)} />
      <Recommendations events={recommended} onNavigate={(id) => navigate(`/event/${id}`)} />
      <CTASection onExplore={() => navigate('/explore')} onDashboard={() => navigate('/dashboard')} />
    </div>
  );
}

function Hero({ onNavigate, onExplore }: { onNavigate: (id: string) => void; onExplore: () => void }) {
  const floatingCards = [
    { icon: '🎵', title: 'Live Concert', subtitle: '2.4K people attending', delay: 0, className: 'top-20 left-[8%] hidden lg:flex', img: events[1].image },
    { icon: '🎤', title: 'Tech Conference', subtitle: 'Starts in 2 days', delay: 1.5, className: 'top-32 right-[6%] hidden lg:flex', img: events[0].image },
    { icon: '❤️', title: 'Wedding Expo', subtitle: '₹799 onwards', delay: 0.8, className: 'bottom-32 left-[5%] hidden lg:flex', img: events[2].image },
    { icon: '🏆', title: 'Cricket Finals', subtitle: '98K attending', delay: 2, className: 'bottom-20 right-[8%] hidden lg:flex', img: events[3].image },
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-500/20 dark:bg-brand-500/10 blur-[120px]" />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-accent-500/20 dark:bg-accent-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/10 blur-[120px]" />
      </div>

      {/* Floating event cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + card.delay * 0.3, duration: 0.6 }}
          className={`absolute z-10 ${card.className}`}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: card.delay, ease: 'easeInOut' }}
            className="glass rounded-2xl p-3.5 w-56 shadow-glass cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onNavigate(events[i % events.length].id)}
          >
            <div className="flex items-center gap-3">
              <img src={card.img} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-semibold">{card.icon} {card.title}</p>
                <p className="text-xs text-muted">{card.subtitle}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}

      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="default" className="mb-6 px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 10,000+ events across India
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]"
        >
          Where Moments
          <br />
          Become <span className="gradient-text">Experiences.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed"
        >
          Discover unforgettable events. Book your experience. Plan and manage every detail in one powerful platform.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 glass-strong rounded-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2 max-w-2xl mx-auto shadow-glass"
        >
          <div className="flex items-center gap-2 px-3 py-2.5 flex-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <MapPin className="w-4 h-4 text-muted shrink-0" />
            <input type="text" placeholder="Location" className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted" />
          </div>
          <div className="hidden sm:block w-px bg-[rgb(var(--border))]" />
          <div className="flex items-center gap-2 px-3 py-2.5 flex-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <Calendar className="w-4 h-4 text-muted shrink-0" />
            <input type="date" className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted text-muted" />
          </div>
          <div className="hidden sm:block w-px bg-[rgb(var(--border))]" />
          <div className="flex items-center gap-2 px-3 py-2.5 flex-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <Tag className="w-4 h-4 text-muted shrink-0" />
            <select className="bg-transparent text-sm outline-none flex-1 text-muted">
              <option>All Events</option>
              <option>Concerts</option>
              <option>Tech</option>
              <option>Sports</option>
              <option>Workshops</option>
            </select>
          </div>
          <Button size="md" onClick={onExplore} className="sm:px-6">
            <Search className="w-4 h-4" /> Explore
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-4"
        >
          <AvatarGroup avatars={avatars} size="sm" count={12400} />
        </motion.div>
      </div>
    </section>
  );
}

function CategorySection({ onNavigate }: { onNavigate: () => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Browse by category</h2>
          <p className="text-muted mt-2">Find exactly what you're looking for</p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {categories.map((cat, i) => {
          const Icon = (Icons as unknown as Record<string, typeof Icons.Music>)[cat.icon] ?? Icons.Sparkles;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={onNavigate}
              className="group cursor-pointer"
            >
              <Card className="p-4 flex flex-col items-center gap-2 hover:shadow-card-hover transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-center">{cat.name}</span>
                <span className="text-[10px] text-muted">{cat.count} events</span>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function LiveDiscovery({ events, onNavigate }: { events: typeof import('../data').events; onNavigate: (id: string) => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Live</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">What's happening near you?</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <EventCard event={event} onNavigate={onNavigate} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FeaturedSection({ events, onNavigate }: { events: typeof import('../data').events; onNavigate: (id: string) => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <Badge variant="accent" className="mb-2"><TrendingUp className="w-3 h-3" /> Trending</Badge>
          <h2 className="text-3xl font-bold tracking-tight">Featured experiences</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <FeaturedEventCard event={event} onNavigate={onNavigate} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function MapSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const mapEvents = events.slice(0, 6);

  // approximate positions on the stylized map
  const positions = [
    { x: 25, y: 35 }, { x: 60, y: 25 }, { x: 45, y: 55 },
    { x: 75, y: 45 }, { x: 30, y: 70 }, { x: 65, y: 65 },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Find experiences around you.</h2>
        <p className="text-muted mt-2">Explore events on the map and discover what's nearby.</p>
      </div>
      <Card className="relative h-[500px] overflow-hidden">
        {/* Stylized map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-cyan-50 to-accent-50 dark:from-ink-800 dark:via-ink-900 dark:to-ink-950">
          <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,30 Q25,20 50,30 T100,25" stroke="currentColor" fill="none" strokeWidth="0.3" className="text-brand-400" />
            <path d="M0,50 Q30,45 60,55 T100,50" stroke="currentColor" fill="none" strokeWidth="0.3" className="text-brand-400" />
            <path d="M0,70 Q20,65 40,75 T100,70" stroke="currentColor" fill="none" strokeWidth="0.3" className="text-brand-400" />
            <path d="M20,0 Q25,30 30,50 T35,100" stroke="currentColor" fill="none" strokeWidth="0.3" className="text-brand-400" />
            <path d="M55,0 Q50,25 60,50 T55,100" stroke="currentColor" fill="none" strokeWidth="0.3" className="text-brand-400" />
            <path d="M80,0 Q75,30 85,60 T80,100" stroke="currentColor" fill="none" strokeWidth="0.3" className="text-brand-400" />
          </svg>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
        </div>

        {/* Event markers */}
        {mapEvents.map((event, i) => (
          <button
            key={event.id}
            onClick={() => setSelected(selected === i ? null : i)}
            className="absolute z-10 group"
            style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%`, transform: 'translate(-50%, -100%)' }}
          >
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all whitespace-nowrap ${selected === i ? 'bg-brand-600 text-white scale-110' : 'glass-strong text-[rgb(var(--text))] group-hover:scale-105'}`}>
              ₹{event.startingPrice.toLocaleString()}
            </div>
            <div className={`w-3 h-3 rounded-full mx-auto -mt-0.5 ${selected === i ? 'bg-brand-600' : 'bg-brand-500'} ring-4 ring-brand-500/20`} />
            {selected === i && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 z-20"
              >
                <Card glass className="p-3 shadow-2xl" onClick={() => onNavigate(event.id)}>
                  <img src={event.image} alt="" className="w-full h-24 rounded-lg object-cover mb-2" />
                  <Badge variant="default" className="mb-1">{event.category}</Badge>
                  <p className="font-semibold text-sm">{event.title}</p>
                  <p className="text-xs text-muted">{event.city}</p>
                </Card>
              </motion.div>
            )}
          </button>
        ))}

        <div className="absolute bottom-4 right-4 glass-strong rounded-xl px-3 py-2 text-xs text-muted flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" /> Map integration ready for Google Maps / Mapbox
        </div>
      </Card>
    </section>
  );
}

function Recommendations({ events, onNavigate }: { events: typeof import('../data').events; onNavigate: (id: string) => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-6">
        <Badge variant="default" className="mb-2"><Star className="w-3 h-3" /> For You</Badge>
        <h2 className="text-3xl font-bold tracking-tight">Recommended for you</h2>
        <p className="text-muted mt-2">Because you attended Tech Events and saved Concerts</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <EventCard event={event} onNavigate={onNavigate} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTASection({ onExplore, onDashboard }: { onExplore: () => void; onDashboard: () => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }} />
        <div className="relative p-10 sm:p-16 text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Ready to create your next experience?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of event organizers and attendees. Discover, book, and manage events effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onExplore} className="bg-white text-brand-700 font-semibold px-7 py-3.5 rounded-2xl hover:scale-105 transition-transform inline-flex items-center gap-2">
              Explore Events <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={onDashboard} className="glass text-white font-semibold px-7 py-3.5 rounded-2xl hover:scale-105 transition-transform border border-white/30">
              View Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
