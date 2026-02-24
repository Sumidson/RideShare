'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Send,
  Mail,
  MessageCircle,
  AlertCircle,
  Ticket,
  CheckCircle,
} from 'lucide-react';
import { useSupabaseAuth } from '@/app/providers/SupabaseAuthProvider';

const SUPPORT_TICKETS_KEY = 'rideshare_support_tickets';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' as const, staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: { duration: 0.3 },
  },
};

interface SupportTicket {
  id: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open';
  createdAt: string;
}

const FAQ_ITEMS = [
  {
    question: 'How do I book a ride?',
    answer:
      'Go to Find Rides, search by origin/destination, and click on a ride to view details. Then choose the number of seats and confirm your booking. You must be signed in to book.',
  },
  {
    question: 'How do I cancel a booking?',
    answer:
      'Open My Bookings or your Profile, find the booking you want to cancel, and use the cancel option. Cancellations may be subject to the driver\'s policy.',
  },
  {
    question: 'How does payment work?',
    answer:
      'RideShare uses transparent per-seat pricing. The total is shown before you confirm. Payment is handled between you and the driver as agreed (e.g. cash or digital transfer).',
  },
  {
    question: 'How do I offer a ride?',
    answer:
      'Click Offer Ride from the menu, enter your route (origin, destination, departure time), set price per seat and available seats, then publish. Passengers can then book with you.',
  },
  {
    question: 'Who can see my rides as a driver?',
    answer:
      'Your offered rides appear on the Find Rides page. From the Driver dashboard you can see all your rides and the passengers who have booked each one.',
  },
];

function getTicketsFromStorage(): SupportTicket[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SUPPORT_TICKETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SupportTicket[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTicketsToStorage(tickets: SupportTicket[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SUPPORT_TICKETS_KEY, JSON.stringify(tickets));
}

export default function SupportPage() {
  const { user } = useSupabaseAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    setTickets(getTicketsFromStorage());
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email ?? '' }));
    }
  }, [user?.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket: SupportTicket = {
      id: crypto.randomUUID(),
      email: formData.email || 'Not provided',
      subject: formData.subject || 'Support request',
      message: formData.message,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => {
      const next = [ticket, ...prev];
      saveTicketsToStorage(next);
      return next;
    });
    setFormData({ email: formData.email, subject: '', message: '' });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      document.getElementById('my-tickets')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <motion.span
            className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4 tracking-wide uppercase"
            variants={itemVariants}
          >
            Help Center
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
            variants={itemVariants}
          >
            Support & <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">FAQ</span>
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600 font-light max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Find answers and submit a support ticket.
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.section
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-slate-700" />
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 text-slate-600 border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Submit a ticket */}
        <motion.section
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Ticket className="w-7 h-7 text-slate-700" />
            Submit a ticket
          </h2>
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200"
            variants={cardVariants}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Ticket submitted</h3>
                  <p className="text-slate-600">It has been saved to My tickets below.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <label htmlFor="support-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Email (optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="support-email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="support-subject" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <div className="relative">
                      <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="support-subject"
                        type="text"
                        required
                        placeholder="Brief subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="support-message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Message
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                      <textarea
                        id="support-message"
                        required
                        rows={4}
                        placeholder="Describe your issue or question..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none resize-none text-slate-800"
                      />
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5" />
                    Submit ticket
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>

        {/* My tickets */}
        <motion.section
          id="my-tickets"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Ticket className="w-7 h-7 text-slate-700" />
            My tickets
          </h2>
          {tickets.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center"
            >
              <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No tickets yet. Submit one above to see it here.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  variants={cardVariants}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{ticket.subject}</p>
                      <p className="text-sm text-slate-500 mt-1">{ticket.email}</p>
                      <p className="text-slate-600 mt-2 line-clamp-2">{ticket.message}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
                      {ticket.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
