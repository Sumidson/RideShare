"use client"
import React from 'react';
import { Shield, Users, Clock, Globe, Quote, ArrowRight, CheckCircle, Smartphone, Github, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
    },
    hover: {
        scale: 1.05,
        y: -5,
        transition: { duration: 0.3 }
    }
};

export default function AboutPage() {
    const teamMembers = [
        {
            name: "Sumidson S Henry",
            role: "Co-Creator",
            image: "https://ui-avatars.com/api/?name=Sumidson+S+Henry&background=0D9488&color=fff&size=256", // Placeholder: Replace with actual image path
            bio: "Visionary leader passionate about sustainable urban mobility."
        },
        {
            name: "Avi Srivastava",
            role: "Co-Creator",
            image: "https://ui-avatars.com/api/?name=Avi+Srivastava&background=0f172a&color=fff&size=256", // Placeholder: Replace with actual image path
            bio: "Tech enthusiast driving innovation in ridesharing algorithms."
        },
        {
            name: "Vyoum",
            role: "Co-Creator",
            image: "https://ui-avatars.com/api/?name=Vyoum&background=2563eb&color=fff&size=256", // Placeholder: Replace with actual image path
            bio: "Creative mind crafting intuitive and beautiful user experiences."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">

            {/* Hero Section */}
            <motion.div
                className="relative py-24 sm:py-32 overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div variants={itemVariants}>
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6 tracking-wide uppercase">Our Vision</span>
                    </motion.div>
                    <motion.h1
                        className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight mb-8"
                        variants={itemVariants}
                    >
                        Reimagining <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">Urban Mobility</span>
                    </motion.h1>
                    <motion.p
                        className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed font-light"
                        variants={itemVariants}
                    >
                        We're building a community-first platform that connects people, reduces carbon footprints, and makes travel efficient for everyone.
                    </motion.p>
                </div>

                {/* Background decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-100/30 to-blue-100/30 rounded-full blur-3xl -z-10 animate-pulse" />
            </motion.div>

            {/* Mission Section */}
            <motion.section
                className="py-16 sm:py-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/20">
                        <div className="grid lg:grid-cols-2 gap-0">
                            <div className="p-10 sm:p-16 flex flex-col justify-center">
                                <motion.h2
                                    className="text-3xl font-bold text-slate-900 mb-6"
                                    variants={itemVariants}
                                >
                                    Our Mission
                                </motion.h2>
                                <motion.div className="space-y-6 text-lg text-slate-600 leading-relaxed" variants={itemVariants}>
                                    <p>
                                        At RideShare, we believe that every empty seat is a wasted opportunity. Our mission is to transform the daily commute from a solitary grind into a shared experience.
                                    </p>
                                    <p>
                                        By connecting drivers with empty seats to passengers heading the same way, we're creating a network that's smarter, friendlier, and better for the planet.
                                    </p>
                                </motion.div>
                                <motion.div className="mt-10" variants={itemVariants}>
                                    <ul className="space-y-4">
                                        {[
                                            "Reduce traffic congestion",
                                            "Lower carbon emissions",
                                            "Make travel affordable",
                                            "Foster community connections"
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-center text-slate-700">
                                                <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>
                            <div className="relative h-96 lg:h-auto bg-slate-900 overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity duration-700">
                                    <Globe className="w-64 h-64 text-white animate-spin-slow duration-[20s]" />
                                </div>
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-slate-900 to-transparent">
                                    <p className="text-white/80 text-sm font-medium tracking-wider uppercase">Global Impact</p>
                                    <p className="text-3xl font-bold text-white mt-2">Connecting 10,000+ Cities</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Features Grid */}
            <motion.section
                className="py-16 sm:py-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionVariants}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div className="text-center mb-16" variants={itemVariants}>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why RideShare?</h2>
                        <p className="text-xl text-slate-600 font-light">Built on trust, driven by community.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Safe & Secure",
                                desc: "Verified profiles and secure payments ensure peace of mind.",
                                color: "text-emerald-600",
                                bg: "bg-emerald-50"
                            },
                            {
                                icon: Users,
                                title: "Community First",
                                desc: "Building connections and fostering a friendly environment.",
                                color: "text-blue-600",
                                bg: "bg-blue-50"
                            },
                            {
                                icon: Clock,
                                title: "Time Efficient",
                                desc: "Optimized routes and real-time updates to get you there.",
                                color: "text-purple-600",
                                bg: "bg-purple-50"
                            },
                            {
                                icon: Globe,
                                title: "Eco Friendly",
                                desc: "Reducing traffic congestion and carbon emissions.",
                                color: "text-teal-600",
                                bg: "bg-teal-50"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-light">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Meet the Team Section */}
            <motion.section
                className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={sectionVariants}
            >
                <div className="absolute top-0 left-0 w-full h-full opacity-5">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div className="text-center mb-16" variants={itemVariants}>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Meet the Makers</h2>
                        <p className="text-xl text-slate-400 font-light">The passionate minds behind RideShare.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors duration-300"
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                <div className="relative w-32 h-32 mx-auto mb-6">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full rounded-full object-cover border-4 border-slate-700/50 shadow-xl"
                                    />
                                    <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-1.5 border-4 border-slate-800">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                                <p className="text-emerald-400 font-medium mb-4">{member.role}</p>
                                <p className="text-slate-400 leading-relaxed mb-6">
                                    {member.bio}
                                </p>

                                <div className="flex justify-center gap-4">
                                    <button className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                                        <Github className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all">
                                        <Twitter className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-700 transition-all">
                                        <Linkedin className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Mobile App CTA */}
            <motion.section
                className="py-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={sectionVariants}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 sm:p-16 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/50 transform skew-x-12 translate-x-20"></div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div className="text-left">
                                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ride anywhere, anytime.</h2>
                                <p className="text-slate-300 text-lg mb-8 max-w-md">
                                    Get the app to book rides, track your driver, and travel seamlessly. Coming soon to iOS and Android.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="flex items-center gap-3 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                                        <Smartphone className="w-5 h-5" />
                                        Download App
                                    </button>
                                    <button className="flex items-center gap-3 px-6 py-3 bg-transparent border border-slate-600 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                        Learn More <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="hidden lg:flex justify-end">
                                {/* Abstract phone mockup representation */}
                                <div className="w-64 h-[500px] bg-slate-950 border-8 border-slate-800 rounded-[3rem] shadow-2xl relative overflow-hidden transform rotate-[-10deg] translate-y-10">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl"></div>
                                    <div className="p-6 mt-8 space-y-4">
                                        <div className="h-32 bg-slate-800/50 rounded-2xl animate-pulse"></div>
                                        <div className="h-16 bg-emerald-900/20 rounded-xl animate-pulse delay-100"></div>
                                        <div className="h-16 bg-slate-800/30 rounded-xl animate-pulse delay-200"></div>
                                        <div className="h-16 bg-slate-800/30 rounded-xl animate-pulse delay-300"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

        </div>
    );
}
