import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sun, Moon, Search, Bell, Menu, X, Ticket, Home, Compass, Heart, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { notifications as defaultNotifications } from '../data';
import { Avatar } from './ui/Avatar';

export function Navbar() {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const unreadCount = defaultNotifications.filter((n) => !n.read).length;

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Bookings', path: '/dashboard', icon: Ticket },
    { label: 'Wishlist', path: '/dashboard', icon: Heart },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-lg' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">Eventra</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${active ? 'text-brand-600 dark:text-brand-400' : 'text-muted hover:text-[rgb(var(--text))]'}`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-brand-50 dark:bg-brand-500/15 rounded-lg -z-10"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg surface text-muted text-sm hover:text-[rgb(var(--text))] transition-colors min-w-[140px]"
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">⌘K</kbd>
            </button>

            <button onClick={toggle} className="w-9 h-9 rounded-lg surface flex items-center justify-center hover:surface-2 transition-colors">
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <Moon className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Sun className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="w-9 h-9 rounded-lg surface flex items-center justify-center hover:surface-2 transition-colors relative">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 z-50 w-80 glass-strong rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-[rgb(var(--border))] flex items-center justify-between">
                        <span className="font-semibold text-sm">Notifications</span>
                        <span className="text-xs text-brand-600 dark:text-brand-400 font-medium cursor-pointer">Mark all read</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto scrollbar-hide">
                        {defaultNotifications.map((n) => (
                          <div key={n.id} className={`p-3.5 border-b border-[rgb(var(--border))] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-brand-50/50 dark:bg-brand-500/5' : ''}`}>
                            <div className="flex items-start gap-2.5">
                              {!n.read && <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />}
                              <div className={n.read ? 'pl-4' : ''}>
                                <p className="text-sm font-medium">{n.title}</p>
                                <p className="text-xs text-muted mt-0.5">{n.message}</p>
                                <p className="text-[10px] text-muted mt-1">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link to="/dashboard" className="hidden sm:block">
              <Avatar src="https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=100&w=100" alt="Vaishnavi" size="sm" fallback="V" />
            </Link>

            <button onClick={() => setMobileOpen(true)} className="md:hidden w-9 h-9 rounded-lg surface flex items-center justify-center">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 glass-strong p-6 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="w-9 h-9 rounded-lg surface flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <link.icon className="w-4 h-4 text-muted" />
                  {link.label}
                </Link>
              ))}
              <div className="mt-auto">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl surface">
                  <Avatar src="https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=100&w=100" alt="Vaishnavi" size="sm" fallback="V" />
                  <div>
                    <p className="text-sm font-semibold">Vaishnavi</p>
                    <p className="text-xs text-muted">View dashboard</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={(p) => { setCmdOpen(false); navigate(p); }} />
    </>
  );
}

import { events } from '../data';
import { Calendar, MapPin, Tag } from 'lucide-react';

function CommandPalette({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState('');

  const filtered = query
    ? events.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()) || e.category.toLowerCase().includes(query.toLowerCase()) || e.city.toLowerCase().includes(query.toLowerCase()))
    : events.slice(0, 5);

  const pages = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore Events', path: '/explore', icon: Compass },
    { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -10 }}
            className="relative glass-strong rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 border-b border-[rgb(var(--border))]">
              <Search className="w-4 h-4 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, pages, bookings..."
                className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-muted"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-hide p-2">
              {!query && (
                <div className="px-2 py-1.5">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider px-2 py-1">Pages</p>
                  {pages.map((p) => (
                    <button key={p.path} onClick={() => onNavigate(p.path)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left">
                      <p.icon className="w-4 h-4 text-muted" />
                      <span className="text-sm font-medium">{p.label}</span>
                    </button>
                  ))}
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider px-2 py-1 mt-2">Events</p>
                </div>
              )}
              {filtered.map((e) => (
                <button key={e.id} onClick={() => onNavigate(`/event/${e.id}`)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left">
                  <img src={e.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{e.title}</p>
                    <p className="text-xs text-muted flex items-center gap-1"><MapPin className="w-3 h-3" />{e.city} · <Tag className="w-3 h-3" />{e.category}</p>
                  </div>
                  <span className="text-xs text-muted">{new Date(e.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted">No results found for "{query}"</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
