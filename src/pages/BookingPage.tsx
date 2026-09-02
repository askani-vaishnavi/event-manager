import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, Minus, Plus, ArrowRight, ArrowLeft, Lock, CreditCard, Calendar, MapPin, Clock, Download, Share2, CalendarPlus, Sparkles } from 'lucide-react';
import { events } from '../data';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import type { TicketTier } from '../types';

type Step = 0 | 1 | 2 | 3 | 4;

const stepLabels = ['Event', 'Tickets', 'Details', 'Payment', 'Confirmed'];

export function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const event = events.find((e) => e.id === id);
  const [step, setStep] = useState<Step>(1);
  const [selectedTicket, setSelectedTicket] = useState<TicketTier | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [processing, setProcessing] = useState(false);

  if (!event) {
    return (
      <div className="pt-24 max-w-4xl mx-auto px-6 text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const selectedTickets = event.tickets.filter((t) => (quantities[t.id] ?? 0) > 0);
  const subtotal = selectedTickets.reduce((sum, t) => sum + t.price * (quantities[t.id] ?? 0), 0);
  const discount = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.18);
  const platformFee = 49;
  const total = subtotal - discount + tax + platformFee;

  const handleProceed = () => {
    if (step === 1 && selectedTickets.length === 0) {
      push('Please select at least one ticket', 'error');
      return;
    }
    if (step === 2 && (!customer.name || !customer.email || !customer.phone)) {
      push('Please fill in all details', 'error');
      return;
    }
    if (step === 3) {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setStep(4);
      }, 2000);
      return;
    }
    setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
    else navigate(`/event/${event.id}`);
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-brand-600 text-white shadow-glow animate-pulse-glow' : 'surface text-muted'}`}>
                    {i < step ? <Check className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-[rgb(var(--text))]' : 'text-muted'}`}>{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 sm:mx-3 rounded-full transition-all" style={{ background: i < step ? 'rgb(34 197 94)' : 'rgb(var(--border))' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <TicketSelection
                event={event}
                quantities={quantities}
                setQuantities={setQuantities}
                selectedTicket={selectedTicket}
                setSelectedTicket={setSelectedTicket}
              />
            )}
            {step === 2 && <DetailsStep customer={customer} setCustomer={setCustomer} event={event} />}
            {step === 3 && <PaymentStep event={event} selectedTickets={selectedTickets} quantities={quantities} subtotal={subtotal} discount={discount} tax={tax} platformFee={platformFee} total={total} processing={processing} />}
            {step === 4 && <ConfirmationStep event={event} total={total} selectedTickets={selectedTickets} quantities={quantities} />}
          </motion.div>
        </AnimatePresence>

        {step < 4 && (
          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={handleProceed} disabled={processing} size="lg">
              {processing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : step === 3 ? (
                <>
                  <Lock className="w-4 h-4" /> Pay ₹{total.toLocaleString()}
                </>
              ) : (
                <>
                  Continue <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function TicketSelection({ event, quantities, setQuantities, selectedTicket, setSelectedTicket }: {
  event: typeof events[0];
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  selectedTicket: TicketTier | null;
  setSelectedTicket: React.Dispatch<React.SetStateAction<TicketTier | null>>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Select your tickets</h1>
      <p className="text-muted text-sm mb-6">{event.title} · {event.city}</p>

      <div className="space-y-4">
        {event.tickets.map((ticket) => {
          const qty = quantities[ticket.id] ?? 0;
          const isSelected = qty > 0;
          return (
            <Card key={ticket.id} className={`p-5 transition-all ${isSelected ? 'ring-2 ring-brand-500 shadow-glow' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{ticket.name}</h3>
                    {ticket.badge && <Badge variant="accent">{ticket.badge}</Badge>}
                  </div>
                  <ul className="space-y-1.5 mt-3">
                    {ticket.perks.map((perk) => (
                      <li key={perk} className="text-sm text-muted flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> {perk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-extrabold gradient-text mb-3">₹{ticket.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => {
                        const newQty = Math.max(0, qty - 1);
                        setQuantities((q) => ({ ...q, [ticket.id]: newQty }));
                        if (newQty === 0) setSelectedTicket(null);
                      }}
                      className="w-8 h-8 rounded-lg surface flex items-center justify-center hover:surface-2 transition-colors disabled:opacity-30"
                      disabled={qty === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{qty}</span>
                    <button
                      onClick={() => {
                        const newQty = qty + 1;
                        setQuantities((q) => ({ ...q, [ticket.id]: newQty }));
                        setSelectedTicket(ticket);
                      }}
                      className="w-8 h-8 rounded-lg surface flex items-center justify-center hover:surface-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function DetailsStep({ customer, setCustomer, event }: {
  customer: { name: string; email: string; phone: string };
  setCustomer: React.Dispatch<React.SetStateAction<{ name: string; email: string; phone: string }>>;
  event: typeof events[0];
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Your details</h1>
      <p className="text-muted text-sm mb-6">We'll send your tickets and updates here</p>

      <Card className="p-6 space-y-4 max-w-lg">
        <div>
          <label className="text-sm font-medium block mb-1.5">Full Name</label>
          <input
            value={customer.name}
            onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
            placeholder="Vaishnavi Reddy"
            className="w-full px-4 py-3 rounded-xl surface-2 text-sm outline-none focus:ring-2 ring-brand-500 transition-all"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Email Address</label>
          <input
            value={customer.email}
            onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
            placeholder="vaishnavi@example.com"
            type="email"
            className="w-full px-4 py-3 rounded-xl surface-2 text-sm outline-none focus:ring-2 ring-brand-500 transition-all"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Phone Number</label>
          <input
            value={customer.phone}
            onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 rounded-xl surface-2 text-sm outline-none focus:ring-2 ring-brand-500 transition-all"
          />
        </div>
      </Card>

      <Card className="p-4 mt-4 flex items-center gap-3 max-w-lg">
        <Calendar className="w-4 h-4 text-brand-500" />
        <span className="text-sm text-muted">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })} · {event.time}</span>
      </Card>
    </div>
  );
}

function PaymentStep({ event, selectedTickets, quantities, subtotal, discount, tax, platformFee, total, processing }: {
  event: typeof events[0];
  selectedTickets: TicketTier[];
  quantities: Record<string, number>;
  subtotal: number;
  discount: number;
  tax: number;
  platformFee: number;
  total: number;
  processing: boolean;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Payment</h1>
      <p className="text-muted text-sm mb-6">Complete your booking securely</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Customer + card */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-brand-500" /> Card Details</h3>
            <div className="space-y-3">
              <input placeholder="Card number" className="w-full px-4 py-3 rounded-xl surface-2 text-sm outline-none focus:ring-2 ring-brand-500 transition-all" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM / YY" className="px-4 py-3 rounded-xl surface-2 text-sm outline-none focus:ring-2 ring-brand-500 transition-all" />
                <input placeholder="CVV" className="px-4 py-3 rounded-xl surface-2 text-sm outline-none focus:ring-2 ring-brand-500 transition-all" />
              </div>
              <input placeholder="Name on card" className="w-full px-4 py-3 rounded-xl surface-2 text-sm outline-none focus:ring-2 ring-brand-500 transition-all" />
            </div>
          </Card>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Lock className="w-3.5 h-3.5" /> Your payment is secure. We use 256-bit SSL encryption.
          </div>
        </div>

        {/* Right: Order summary */}
        <div>
          <Card className="p-6 sticky top-20">
            <h3 className="font-bold mb-4">Order Summary</h3>
            <div className="flex items-center gap-3 mb-4">
              <img src={event.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-sm">{event.title}</p>
                <p className="text-xs text-muted">{event.city}</p>
              </div>
            </div>
            <div className="space-y-2.5 text-sm">
              {selectedTickets.map((t) => (
                <div key={t.id} className="flex justify-between">
                  <span className="text-muted">{t.name} × {quantities[t.id]}</span>
                  <span className="font-medium">₹{(t.price * quantities[t.id]).toLocaleString()}</span>
                </div>
              ))}
              <div className="h-px bg-[rgb(var(--border))] my-3" />
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-green-600"><span>Discount (5%)</span><span>-₹{discount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted">Tax (18%)</span><span>₹{tax.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted">Platform fee</span><span>₹{platformFee}</span></div>
              <div className="h-px bg-[rgb(var(--border))] my-3" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-base">TOTAL</span>
                <span className="font-extrabold text-xl gradient-text">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ConfirmationStep({ event, total, selectedTickets, quantities }: {
  event: typeof events[0];
  total: number;
  selectedTickets: TicketTier[];
  quantities: Record<string, number>;
}) {
  const navigate = useNavigate();
  const bookingId = `EVT-${Math.floor(Math.random() * 90000 + 10000)}`;

  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      {/* Confetti dots */}
      <div className="relative">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              background: ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#22c55e'][i % 5],
            }}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: [-20, 200], opacity: [1, 0], rotate: 360 }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatDelay: 3 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-green-500 mx-auto flex items-center justify-center mb-6 shadow-glow"
      >
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-extrabold mb-2">
        You're In!
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-muted text-lg mb-8">
        Your booking is confirmed. Get ready for an amazing experience.
      </motion.p>

      {/* Digital ticket */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Card className="overflow-hidden">
            <div className="relative h-32">
              <img src={event.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <Badge variant="default" className="glass text-white border-0 mb-1">{event.category}</Badge>
                <p className="font-bold text-lg">{event.title}</p>
              </div>
            </div>
            <div className="p-5">
              {/* Perforation */}
              <div className="flex items-center gap-1 mb-4">
                <div className="w-5 h-5 rounded-full bg-[rgb(var(--bg))] -ml-3" />
                <div className="flex-1 border-t-2 border-dashed border-[rgb(var(--border))]" />
                <div className="w-5 h-5 rounded-full bg-[rgb(var(--bg))] -mr-3" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div>
                  <p className="text-[10px] text-muted uppercase">Date</p>
                  <p className="text-sm font-semibold">{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase">Time</p>
                  <p className="text-sm font-semibold">{event.time.split('–')[0]}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase">Venue</p>
                  <p className="text-sm font-semibold">{event.city}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase">Booking ID</p>
                  <p className="text-sm font-semibold">{bookingId}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase">Ticket Type</p>
                  <p className="text-sm font-semibold">{selectedTickets.map((t) => `${t.name} ×${quantities[t.id]}`).join(', ')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase">Total Paid</p>
                  <p className="text-sm font-bold gradient-text">₹{total.toLocaleString()}</p>
                </div>
              </div>
              {/* QR placeholder */}
              <div className="mt-5 flex flex-col items-center">
                <div className="w-24 h-24 rounded-xl surface-2 grid grid-cols-6 gap-px p-2">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-[rgb(var(--text))]' : 'bg-transparent'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-muted mt-2">Scan at entry</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          View Ticket
        </Button>
        <Button variant="secondary">
          <CalendarPlus className="w-4 h-4" /> Add to Calendar
        </Button>
        <Button variant="ghost">
          <Share2 className="w-4 h-4" /> Share Event
        </Button>
      </div>
    </div>
  );
}
