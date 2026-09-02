import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Heart, PartyPopper, Wallet, ArrowRight, Calendar, MapPin, Clock, Download, Compass } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { EventCard } from '../components/EventCard';
import { bookings, events, stats } from '../data';
import { useCountUp, useCountdown } from '../hooks';
import { useState } from 'react';

export function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'wishlist'>('upcoming');

  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');
  const pastBookings = bookings.filter((b) => b.status === 'attended');
  const nextEvent = upcomingBookings[0];
  const wishlistEvents = events.slice(4, 8);

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : activeTab === 'past' ? pastBookings : [];

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Avatar src="https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=100&w=100" alt="Vaishnavi" size="lg" fallback="V" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Good evening, Vaishnavi</h1>
              <p className="text-muted">Ready for your next experience?</p>
            </div>
          </div>
        </motion.div>

        {/* Next event + countdown */}
        {nextEvent && <NextEventCard booking={nextEvent} onNavigate={() => navigate(`/event/${nextEvent.eventId}`)} />}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard icon={Ticket} label="Total Bookings" value={stats.totalBookings} color="from-brand-500 to-brand-600" />
          <StatCard icon={Heart} label="Saved Events" value={stats.savedEvents} color="from-accent-500 to-pink-500" />
          <StatCard icon={PartyPopper} label="Events Attended" value={stats.eventsAttended} color="from-cyan-500 to-blue-500" />
          <StatCard icon={Wallet} label="Total Spent" value={stats.totalSpent} color="from-amber-500 to-orange-500" prefix="₹" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-10 mb-6">
          {(['upcoming', 'past', 'wishlist'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-brand-600 text-white' : 'surface text-muted hover:text-[rgb(var(--text))]'}`}
            >
              {tab} {tab === 'upcoming' && `(${upcomingBookings.length})`}
              {tab === 'past' && `(${pastBookings.length})`}
              {tab === 'wishlist' && `(${wishlistEvents.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'wishlist' ? (
          wishlistEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {wishlistEvents.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <EventCard event={event} onNavigate={(id) => navigate(`/event/${id}`)} />
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Heart} title="Save events you're excited about" message="Tap the heart icon on any event to add it here." action="Explore Events" onAction={() => navigate('/explore')} />
          )
        ) : displayBookings.length > 0 ? (
          <div className="space-y-4">
            {displayBookings.map((booking, i) => (
              <BookingCard key={booking.id} booking={booking} onNavigate={() => navigate(`/event/${booking.eventId}`)} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Ticket} title="Your next adventure is waiting." message="You have no upcoming bookings yet." action="Explore Events" onAction={() => navigate('/explore')} />
        )}

        {/* Recommended */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recommended for you</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {events.slice(0, 4).map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <EventCard event={event} onNavigate={(id) => navigate(`/event/${id}`)} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NextEventCard({ booking, onNavigate }: { booking: typeof bookings[0]; onNavigate: () => void }) {
  const countdown = useCountdown(booking.eventDate);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="overflow-hidden cursor-pointer" onClick={onNavigate}>
        <div className="grid sm:grid-cols-[1fr_auto] gap-0">
          <div className="relative h-48 sm:h-auto">
            <img src={booking.eventImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge variant="default" className="glass text-white border-0 mb-2">Next Event</Badge>
              <h3 className="text-xl font-bold text-white">{booking.eventTitle}</h3>
              <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5" />{booking.venue}</p>
            </div>
          </div>
          <div className="p-6 flex flex-col justify-center items-center gap-4 sm:w-64">
            <p className="text-xs text-muted uppercase tracking-wider font-bold">Countdown</p>
            <div className="flex gap-3">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Min', value: countdown.minutes },
                { label: 'Sec', value: countdown.seconds },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="w-14 h-14 rounded-2xl surface-2 flex items-center justify-center">
                    <span className="text-2xl font-extrabold gradient-text tabular-nums">{String(unit.value).padStart(2, '0')}</span>
                  </div>
                  <p className="text-[10px] text-muted mt-1 uppercase">{unit.label}</p>
                </div>
              ))}
            </div>
            <Button size="sm" variant="secondary" className="w-full">
              <Download className="w-3.5 h-3.5" /> View Ticket
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color, prefix }: { icon: typeof Ticket; label: string; value: number; color: string; prefix?: string }) {
  const count = useCountUp(value);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-5 hover:shadow-card-hover transition-all">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-extrabold tabular-nums">{prefix}{count.toLocaleString()}</p>
        <p className="text-xs text-muted mt-0.5">{label}</p>
      </Card>
    </motion.div>
  );
}

function BookingCard({ booking, onNavigate }: { booking: typeof bookings[0]; onNavigate: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <Card hover className="p-4 cursor-pointer flex items-center gap-4" onClick={onNavigate}>
        <img src={booking.eventImage} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={booking.status === 'upcoming' ? 'success' : 'neutral'}>
              {booking.status === 'upcoming' ? 'Upcoming' : 'Attended'}
            </Badge>
            <span className="text-xs text-muted">#{booking.id}</span>
          </div>
          <h3 className="font-semibold truncate">{booking.eventTitle}</h3>
          <div className="flex flex-wrap gap-3 text-xs text-muted mt-1">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(booking.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.venue.split(',')[0]}</span>
            <span className="flex items-center gap-1"><Ticket className="w-3 h-3" />{booking.ticketType} ×{booking.quantity}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold">₹{booking.total.toLocaleString()}</p>
          {booking.status === 'upcoming' && (
            <Button size="sm" variant="ghost" className="mt-1">
              <Download className="w-3 h-3" /> Ticket
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, title, message, action, onAction }: { icon: typeof Ticket; title: string; message: string; action: string; onAction: () => void }) {
  return (
    <Card className="p-12 text-center">
      <div className="w-16 h-16 rounded-2xl surface-2 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-muted" />
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-muted text-sm mb-4">{message}</p>
      <Button onClick={onAction}>
        <Compass className="w-4 h-4" /> {action}
      </Button>
    </Card>
  );
}
