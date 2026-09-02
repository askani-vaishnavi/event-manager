import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { events, categories } from '../data';
import { EventCard } from '../components/EventCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EventCardSkeleton } from '../components/ui/Skeleton';
import type { EventCategory } from '../types';

export function ExplorePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'rating'>('date');
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    let result = events;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((e) => e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (selectedCategory) {
      result = result.filter((e) => e.category === selectedCategory);
    }
    result = [...result].sort((a, b) => {
      if (sortBy === 'price') return a.startingPrice - b.startingPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    return result;
  }, [query, selectedCategory, sortBy]);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Explore Events</h1>
        <p className="text-muted mb-6">Discover {events.length}+ events happening across India</p>

        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl surface">
            <Search className="w-4 h-4 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, city, category, or tag..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-muted hover:text-[rgb(var(--text))]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-3 rounded-xl surface text-sm font-medium outline-none cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${!selectedCategory ? 'bg-brand-600 text-white' : 'surface text-muted hover:text-[rgb(var(--text))]'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat.name ? 'bg-brand-600 text-white' : 'surface text-muted hover:text-[rgb(var(--text))]'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted">{filtered.length} events found</p>
          {(query || selectedCategory) && (
            <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setSelectedCategory(null); }}>
              Clear filters
            </Button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <EventCard event={event} onNavigate={(id) => navigate(`/event/${id}`)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <SlidersHorizontal className="w-10 h-10 text-muted mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">No events found</h3>
            <p className="text-muted text-sm">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}
