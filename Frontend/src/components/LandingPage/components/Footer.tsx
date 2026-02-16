'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white py-6 px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Left */}
                <span className="text-sm text-slate-500">
                    © 2026 Kivo
                </span>

                {/* Right */}
                <div className="flex items-center gap-5">
                    <Link
                        href="https://github.com/Dev-kaif"
                        target="_blank"
                        className="text-slate-500 hover:text-sky-600 transition-colors"
                    >
                        <Github size={18} />
                    </Link>

                    <Link
                        href="https://www.linkedin.com/in/mohammadkaif123"
                        target="_blank"
                        className="text-slate-500 hover:text-sky-600 transition-colors"
                    >
                        <Linkedin size={18} />
                    </Link>
                </div>
            </div>
        </footer>
    );
};
