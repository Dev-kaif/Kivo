import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/Work';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { checkAuth } from '@/lib/requireAuth';

export default async function LandingPage() {

    const data = await checkAuth();
    const isLoggedIn = data == null ? true : false;

    return (
        <main className="min-h-screen bg-white">
            <Navbar isLoggedIn={isLoggedIn} />
            <Hero isLoggedIn={isLoggedIn} />
            <Features />
            <HowItWorks />
            <CTA isLoggedIn={isLoggedIn} />
            <Footer />
        </main>
    );
}