'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, animate } from 'motion/react';
import Link from 'next/link';

export const Navbar = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    }, [isMobileMenuOpen]);

    const handleSmoothScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        targetId: string
    ) => {
        e.preventDefault();

        const element = document.querySelector(targetId);
        if (!element) return;

        const navbarHeight = 80;
        const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;

        const targetPosition = elementPosition - navbarHeight;

        animate(window.scrollY, targetPosition, {
            duration: 0.6,
            ease: 'easeInOut',
            onUpdate: (latest) => window.scrollTo(0, latest),
        });

        setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm'
                : 'bg-transparent'
                }`}
        >
            <div className="relative max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <a href="/" className="flex items-center">
                        <Image
                            alt="Niro"
                            width={100}
                            height={100}
                            className="h-11 w-fit"
                            src="/main/logo.png"
                        />
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 pl-20">
                        <a
                            href="#features"
                            onClick={(e) =>
                                handleSmoothScroll(e, '#features')
                            }
                            className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
                        >
                            Features
                        </a>

                        <a
                            href="#how-it-works"
                            onClick={(e) =>
                                handleSmoothScroll(e, '#how-it-works')
                            }
                            className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
                        >
                            How it works
                        </a>
                    </nav>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-sky-500 to-blue-600 rounded-xl shadow-lg"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-sky-500 to-blue-600 rounded-xl shadow-lg"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>


                    {/* Mobile Toggle */}
                    <button
                        onClick={() =>
                            setIsMobileMenuOpen(!isMobileMenuOpen)
                        }
                        className="md:hidden p-2"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Background overlay */}
                            <motion.div
                                className="fixed left-0 right-0 bottom-0 top-20 bg-black/40 backdrop-blur-sm md:hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />


                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="absolute left-0 top-full w-full bg-white shadow-xl border-t border-slate-200 md:hidden"
                            >
                                <nav className="flex flex-col gap-5 p-6">
                                    <a
                                        href="#features"
                                        onClick={(e) =>
                                            handleSmoothScroll(
                                                e,
                                                '#features'
                                            )
                                        }
                                        className="text-sm font-medium text-slate-700 hover:text-sky-600"
                                    >
                                        Features
                                    </a>

                                    <a
                                        href="#how-it-works"
                                        onClick={(e) =>
                                            handleSmoothScroll(
                                                e,
                                                '#how-it-works'
                                            )
                                        }
                                        className="text-sm font-medium text-slate-700 hover:text-sky-600"
                                    >
                                        How it works
                                    </a>

                                    <div className="flex flex-col gap-3 pt-4 border-t">
                                        {isLoggedIn ? (
                                            <>
                                                <Link
                                                    href="/login"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="w-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl text-center"
                                                >
                                                    Log in
                                                </Link>

                                                <Link
                                                    href="/signup"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="w-full px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-sky-500 to-blue-600 rounded-xl text-center"
                                                >
                                                    Get Started
                                                </Link>
                                            </>
                                        ) : (
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-sky-500 to-blue-600 rounded-xl text-center"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                    </div>
                                </nav>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};
