export type EventCategory =
  | 'Concerts'
  | 'Tech'
  | 'Workshops'
  | 'Sports'
  | 'Weddings'
  | 'College'
  | 'Business'
  | 'Cultural'
  | 'Festivals';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  perks: string[];
  badge?: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  image: string;
  date: string;
  time: string;
  endDate: string;
  venue: string;
  city: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  attendees: number;
  organizer: string;
  organizerLogo: string;
  description: string;
  tags: string[];
  tickets: TicketTier[];
  featured?: boolean;
  lat: number;
  lng: number;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  venue: string;
  ticketType: string;
  quantity: number;
  total: number;
  status: 'confirmed' | 'upcoming' | 'attended' | 'cancelled';
  bookingDate: string;
}

export interface CategoryInfo {
  name: EventCategory;
  icon: string;
  gradient: string;
  count: number;
}

export interface NotificationItem {
  id: string;
  type: 'reminder' | 'booking' | 'payment' | 'social' | 'update';
  title: string;
  message: string;
  time: string;
  read: boolean;
}
