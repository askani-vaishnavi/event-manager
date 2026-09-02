import { type EventItem } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { AvatarGroup } from './ui/Avatar';
import { Star, MapPin, Heart, ArrowRight, Users } from 'lucide-react';
import { avatars } from '../data';
import { useState } from 'react';

interface EventCardProps {
  event: EventItem;
  onNavigate: (id: string) => void;
  variant?: 'standard' | 'minimal';
}

export function EventCard({ event, onNavigate, variant = 'standard' }: EventCardProps) {
  const [wished, setWished] = useState(false);

  if (variant === 'minimal') {
    return (
      <Card hover className="flex gap-3 p-3 cursor-pointer" onClick={() => onNavigate(event.id)}>
        <img src={event.image} alt={event.title} className="w-20 h-20 rounded-xl object-cover" loading="lazy" />
        <div className="flex-1 min-w-0">
          <Badge variant="default" className="mb-1">{event.category}</Badge>
          <h4 className="font-semibold text-sm truncate">{event.title}</h4>
          <p className="text-xs text-muted flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{event.city}</p>
          <p className="text-sm font-bold mt-1">₹{event.startingPrice.toLocaleString()}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card hover className="overflow-hidden cursor-pointer group flex flex-col" onClick={() => onNavigate(event.id)}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="default" className="glass text-white border-0">{event.category}</Badge>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center transition-transform hover:scale-110"
        >
          <Heart className={`w-4 h-4 transition-colors ${wished ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
        <div className="absolute bottom-3 left-3">
          <Badge variant="neutral" className="glass text-white border-0">
            {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
          </Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="glass-strong text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2">
            View Event <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <h3 className="font-bold text-base leading-snug line-clamp-1">{event.title}</h3>
        <p className="text-xs text-muted flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> {event.venue}, {event.city}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold">{event.rating}</span>
            <span className="text-xs text-muted">({event.reviews.toLocaleString()})</span>
          </div>
          <span className="text-muted text-xs">•</span>
          <div className="flex items-center gap-1 text-xs text-muted">
            <Users className="w-3.5 h-3.5" /> {event.attendees.toLocaleString()}
          </div>
        </div>
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <span className="text-xs text-muted">From </span>
            <span className="text-lg font-bold gradient-text">₹{event.startingPrice.toLocaleString()}</span>
          </div>
          <AvatarGroup avatars={avatars.slice(0, 3)} size="xs" />
        </div>
      </div>
    </Card>
  );
}

export function FeaturedEventCard({ event, onNavigate }: { event: EventItem; onNavigate: (id: string) => void }) {
  return (
    <Card hover className="overflow-hidden cursor-pointer group relative h-64 sm:h-72" onClick={() => onNavigate(event.id)}>
      <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-6">
        <Badge variant="default" className="glass text-white border-0 self-start mb-3">{event.category}</Badge>
        <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
        <p className="text-white/80 text-sm flex items-center gap-1.5 mb-3">
          <MapPin className="w-4 h-4" /> {event.venue}, {event.city}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarGroup avatars={avatars.slice(0, 4)} />
            <span className="text-white/80 text-xs">{event.attendees.toLocaleString()} attending</span>
          </div>
          <div className="text-right">
            <span className="text-white/60 text-xs block">From</span>
            <span className="text-xl font-bold text-white">₹{event.startingPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
