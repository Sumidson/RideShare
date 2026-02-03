"use client"
import React, { useState } from 'react';
import { MessageSquare, X, Send, Mail, AlertCircle, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactUsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setIsOpen(false);
                setFormData({ email: '', subject: '', message: '' });
            }, 3000);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group border border-slate-700/50"
                aria-label="Contact Us"
                whileHover={{ rotate: 10 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                <MessageSquare className="w-6 h-6" />
            </motion.button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
                            onClick={() => setIsOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Modal Content */}
                        <motion.div
                            className="relative w-full sm:max-w-md m-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl pointer-events-auto border border-slate-200"
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <MessageCircle className="w-5 h-5 text-slate-700" />
                                    </div>
                                    Contact Us
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {!submitted ? (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Email Address
                                            </label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                                                <input
                                                    type="email"
                                                    id="email"
                                                    required
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                                    placeholder="you@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                How can we help?
                                            </label>
                                            <div className="relative group">
                                                <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                                                <select
                                                    id="subject"
                                                    required
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all appearance-none text-slate-800 cursor-pointer"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                >
                                                    <option value="">Select a topic</option>
                                                    <option value="general">General Inquiry</option>
                                                    <option value="support">Technical Support</option>
                                                    <option value="billing">Billing Issue</option>
                                                    <option value="feedback">Feedback</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                required
                                                rows={4}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
                                                placeholder="Tell us more about what you need..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </div>

                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3.5 px-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </motion.button>
                                    </form>
                                ) : (
                                    <div className="text-center py-10">
                                        <motion.div
                                            className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", damping: 12 }}
                                        >
                                            <Send className="w-10 h-10 ml-1" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                        <p className="text-slate-600 max-w-xs mx-auto">
                                            Thank you for contacting us. We'll get back to you at <strong>{formData.email}</strong> shortly.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
