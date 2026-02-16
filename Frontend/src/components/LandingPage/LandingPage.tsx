import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/Work';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <CTA />
            <Footer />
        </main>
    );
}