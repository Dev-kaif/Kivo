'use client';

import React from 'react';
import { Plus, Mail } from 'lucide-react';

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-sky-50 text-sky-600 border border-sky-200 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-5">
                        Simple by design
                    </span>

                    <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5">
                        Up and running in{' '}
                        <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                            3 steps
                        </span>
                    </h2>

                    <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto">
                        No setup guides. No tutorials. Just start working.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connector line (desktop only) */}
                    <div
                        className="hidden md:block absolute top-12 h-0.5"
                        style={{
                            left: '16.66%',
                            right: '16.66%',
                            background: 'linear-gradient(to right, #bae6fd, #bfdbfe, #bae6fd)'
                        }}
                    />

                    {/* Step 1 */}
                    <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                        {/* Step number badge */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-sky-500/30">
                            <span className="font-bold text-white text-sm">1</span>
                        </div>

                        {/* Preview illustration */}
                        <div className="mb-6">
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/30">
                                        <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-800">New Board</span>
                                </div>
                                <input
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-400 mb-3"
                                    placeholder="e.g. Product Roadmap"
                                    readOnly
                                />
                                <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg shadow-lg shadow-sky-500/30">
                                    Create Board
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="font-bold text-xl text-slate-900 mb-2">
                            Create a Board
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Give your project a name and create your first board in seconds.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                        {/* Step number badge */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-sky-500/30">
                            <span className="font-bold text-white text-sm">2</span>
                        </div>

                        {/* Preview illustration */}
                        <div className="mb-6">
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-100">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2.5">To Do</div>
                                        <div className="bg-white rounded-lg p-3 border border-slate-200 text-xs text-slate-700 font-medium mb-2 shadow-sm flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-400" />
                                            Design mockup
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-slate-200 text-xs text-slate-700 font-medium shadow-sm flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                                            Write tests
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-bold text-sky-600 uppercase tracking-wide mb-2.5">In Progress</div>
                                        <div className="bg-white rounded-lg p-3 border-l-2 border-sky-400 border border-slate-200 text-xs text-slate-700 font-medium shadow-sm flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                                            Build UI
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="font-bold text-xl text-slate-900 mb-2">
                            Add Tasks
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Create lists, add tasks, set priorities and due dates, then drag them as work progresses.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                        {/* Step number badge */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-sky-500/30">
                            <span className="font-bold text-white text-sm">3</span>
                        </div>

                        {/* Preview illustration */}
                        <div className="mb-6">
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex -space-x-2">
                                        {['bg-amber-400', 'bg-emerald-400', 'bg-violet-400'].map((color, i) => (
                                            <div
                                                key={i}
                                                className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-semibold shadow-sm`}
                                            >
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-600 font-medium">3 members active</span>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-slate-200 text-xs mb-3">
                                    <span className="text-emerald-600 font-semibold">Alex</span>
                                    <span className="text-slate-400"> moved "Design mockup" to </span>
                                    <span className="text-sky-600 font-semibold">Done ✓</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-400"
                                        placeholder="Invite via email…"
                                        readOnly
                                    />
                                    <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-sky-500/30 flex items-center gap-1">
                                        <Mail size={12} />
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="font-bold text-xl text-slate-900 mb-2">
                            Collaborate
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Invite your team via email or link, assign tasks, and watch progress happen in real-time.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};