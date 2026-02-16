'use client';

import React from 'react';
import { ArrowRight, Sparkles, Users, Plus } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => {
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

                    <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-600 border border-sky-200 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-6 animate-in fade-in slide-in-from-top-1 duration-500">
                        <Sparkles className="w-3 h-3" />
                        Simple project management
                    </span>

                    <h1 className="font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-6 animate-in fade-in slide-in-from-top-2 duration-500 delay-100">
                        Organize Your Work,<br />
                        <span className="bg-linear-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                            Simply.
                        </span>
                    </h1>

                    <p className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-top-3 duration-500 delay-200">
                        Create boards, manage tasks, and collaborate in real-time without the clutter.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-300">
                        <Link href={"/signup"} className="group px-8 py-3.5 text-base font-semibold text-white bg-linear-to-r from-sky-500 to-blue-600 rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                            Get Started it's free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#how-it-works" className="px-8 py-3.5 text-base font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                            See how it works
                        </a>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="mt-20 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-700 delay-400">
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-300/40 overflow-hidden">

                        <div className="flex items-center gap-2 px-6 py-2 bg-slate-100 border-b border-slate-200">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>

                        {/* Image Container */}
                        <div className="relative bg-slate-50">
                            <img
                                src="/main/dashboard.png"
                                alt="Kivo Dashboard Preview"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};