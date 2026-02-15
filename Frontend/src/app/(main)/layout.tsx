import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react'

function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className='bg-accent/20'>
                <AppHeader />
                <main className='flex-1'>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout
