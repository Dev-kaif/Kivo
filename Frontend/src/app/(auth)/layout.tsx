'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center bg-slate-50 px-6">

            {/* Logo */}
            <div className="pt-12 pb-8">
                <Link href="/" className="flex items-center justify-center">
                    <Image
                        alt="Niro"
                        width={120}
                        height={120}
                        className="h-12 w-auto"
                        src="/main/logo.png"
                        priority
                    />
                </Link>
            </div>

            <div className="w-full flex justify-center">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;
