'use client';

import React from 'react';
import { Grid2X2, CheckSquare, Users, Mail, Clock, Shield } from 'lucide-react';

export const Features = () => {
    const features = [
        {
            icon: Grid2X2,
            title: "Boards & Lists",
            description: "Create project boards and organize tasks into customizable lists that match your workflow."
        },
        {
            icon: CheckSquare,
            title: "Task Management",
            description: "Set priorities, due dates, and drag & drop tasks across lists. Keep every detail in one place."
        },
        {
            icon: Users,
            title: "Real-time Collaboration",
            description: "Work together with your team in real-time. Assign members to tasks and stay in sync always."
        },
        {
            icon: Mail,
            title: "Member Invitations",
            description: "Invite teammates via email or shareable link. Set roles — Admin or Member — with a click."
        },
        {
            icon: Clock,
            title: "Activity Tracking",
            description: "View a full history of every change made on your board. Stay on top of what's happening."
        },
        {
            icon: Shield,
            title: "Role Management",
            description: "Control access with Admin and Member roles. Manage permissions without the headache."
        }
    ];

    return (
        <section id="features" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-sky-50 text-sky-600 border border-sky-200 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-5">
                        Everything you need
                    </span>

                    <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5">
                        Built for how teams{' '}
                        <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                            actually work
                        </span>
                    </h2>

                    <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto">
                        No complexity. No bloat. Just the tools you need to ship work together.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-blue-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="w-6 h-6 text-sky-600" strokeWidth={2} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-semibold text-lg text-slate-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};