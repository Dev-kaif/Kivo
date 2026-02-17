'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export const Hero = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    return (
        <section
            className="relative pt-20 pb-28 px-6 overflow-hidden"
            style={{
                backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                backgroundColor: '#fafafa'
            }}
        >
            {/* Decorative gradient blobs */}
            <div className="absolute top-20 -left-40 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-4xl mx-auto">

                    {/* Badge */}
                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-600 border border-sky-200 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-6"
                    >
                        <Sparkles className="w-3 h-3" />
                        Simple project management
                    </motion.span>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-6"
                    >
                        Organize Your Work,<br />
                        <span className="bg-linear-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                            Simply.
                        </span>
                    </motion.h1>

                    {/* Paragraph */}
                    <motion.p
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
                    >
                        Create boards, manage tasks, and collaborate in real-time without the clutter.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {
                            isLoggedIn ?
                                <Link
                                    href={"/signup"}
                                    className="px-8 py-3.5 text-base font-semibold text-white bg-linear-to-r from-sky-500 to-blue-600 rounded-xl shadow-lg shadow-sky-500/30 flex items-center gap-2"
                                >
                                    Get Started it's free
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                :
                                <Link
                                    href={"/dashboard"}
                                    className="px-8 py-3.5 text-base font-semibold text-white bg-linear-to-r from-sky-500 to-blue-600 rounded-xl shadow-lg shadow-sky-500/30 flex items-center gap-2"
                                >
                                    Continue To Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                        }

                        <a
                            href="#how-it-works"
                            className="px-8 py-3.5 text-base font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            See how it works
                        </a>
                    </motion.div>
                </div>

                {/* Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="mt-20 max-w-5xl mx-auto"
                >
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-300/40 overflow-hidden">

                        <div className="flex items-center gap-2 px-6 py-2 bg-slate-100 border-b border-slate-200">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>

                        <div className="relative bg-slate-50">
                            <img
                                src="/main/dashboard.png"
                                alt="Kivo Dashboard Preview"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};
