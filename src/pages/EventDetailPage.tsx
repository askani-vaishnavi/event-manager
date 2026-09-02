import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Calendar, Clock, MapPin, Users, Star, Check, Ticket as TicketIcon } from 'lucide-react';
import { events, avatars } from '../data';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AvatarGroup } from '../components/ui/Avatar';
import { useToast } from '../components/ui/Toast';
import { useState } from 'react';

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const event = events.find((e) => e.id === id);
  const [wished, setWished] = useState(false);

  if (!event) {
    return (
      <div className="pt-24 max-w-4xl mx-auto px-6 text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero image */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--bg))] via-black/40 to-black/30" />

        {/* Top actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button onClick={() => navigate(-1)} className="glass-strong rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </button>
          <div className="flex gap-2">
            <button onClick={() => setWished(!wished)} className="glass-strong w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Heart className={`w-4 h-4 ${wished ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button onClick={() => push('Event link copied to clipboard!')} className="glass-strong w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="default" className="mb-3">{event.category}</Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">{event.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-500" />
                  <span className="font-medium">{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  <span className="font-medium">{event.venue}, {event.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-500" />
                  <span className="font-medium">{event.attendees.toLocaleString()} attending</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <AvatarGroup avatars={avatars} size="sm" />
                <div className="flex items-center gap-1 ml-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-sm">{event.rating}</span>
                  <span className="text-xs text-muted">({event.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>
            </motion.div>

            <Card className="p-6">
              <h2 className="font-bold text-lg mb-3">About this event</h2>
              <p className="text-muted leading-relaxed">{event.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="neutral">{tag}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">Ticket options</h2>
              <div className="space-y-3">
                {event.tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-start justify-between p-4 rounded-xl surface-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{ticket.name}</span>
                        {ticket.badge && <Badge variant="accent">{ticket.badge}</Badge>}
                      </div>
                      <ul className="space-y-1 mt-2">
                        {ticket.perks.map((perk) => (
                          <li key={perk} className="text-xs text-muted flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-green-500" /> {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold gradient-text">₹{ticket.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold">
                  {event.organizerLogo}
                </div>
                <div>
                  <p className="text-xs text-muted">Organized by</p>
                  <p className="font-semibold">{event.organizer}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sticky booking panel */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted">Tickets from</span>
                  <TicketIcon className="w-4 h-4 text-brand-500" />
                </div>
                <p className="text-3xl font-extrabold gradient-text mb-4">₹{event.startingPrice.toLocaleString()}</p>

                <div className="space-y-2.5 mb-5">
                  {event.tickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between py-2 border-b border-[rgb(var(--border))] last:border-0">
                      <span className="text-sm font-medium">{ticket.name}</span>
                      <span className="text-sm font-bold">₹{ticket.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="w-full" onClick={() => navigate(`/book/${event.id}`)}>
                  Select Tickets
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Secure checkout · Instant confirmation
                </div>

                <div className="mt-4 pt-4 border-t border-[rgb(var(--border))] space-y-2 text-xs text-muted">
                  <div className="flex justify-between"><span>Attendees</span><span className="font-medium text-[rgb(var(--text))]">{event.attendees.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Rating</span><span className="font-medium text-[rgb(var(--text))]">{event.rating} / 5.0</span></div>
                  <div className="flex justify-between"><span>Reviews</span><span className="font-medium text-[rgb(var(--text))]">{event.reviews.toLocaleString()}</span></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
