'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const CTA = () => {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="relative bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl px-8 sm:px-12 py-16 sm:py-20 text-center overflow-hidden shadow-2xl shadow-sky-500/30">
                    {/* Decorative elements */}
                    <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute top-8 right-24 w-20 h-20 bg-white/10 rounded-full blur-xl" />

                    {/* Floating particles */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-white/30 rounded-full animate-pulse delay-500" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                            <Sparkles size={14} />
                            Free to use
                        </div>

                        <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mb-5">
                            Start managing your<br className="hidden sm:block" />work today.
                        </h2>

                        <p className="text-sky-50 text-lg sm:text-xl mb-10 max-w-xl mx-auto">
                            Join teams that keep it simple. No credit card needed.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup" className="group px-8 py-3.5 text-base font-semibold text-sky-600 bg-white hover:bg-sky-50 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                Get Started Free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/login" className="px-8 py-3.5 text-base font-semibold text-white bg-white/15 hover:bg-white/25 rounded-xl transition-all border border-white/30 backdrop-blur-sm">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};