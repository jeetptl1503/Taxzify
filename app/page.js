// app/page.js
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import FeaturesGrid from '../components/FeaturesGrid';
import HowItWorks from '../components/HowItWorks';
import BenefitShowcase from '../components/BenefitShowcase';
import RegimeComparison from '../components/RegimeComparison';
import SecuritySection from '../components/SecuritySection';
import Roadmap from '../components/Roadmap';
import FooterCTA from '../components/FooterCTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-light-text-primary dark:text-dark-text-primary overflow-x-hidden">
      <Navbar />
      <Hero />
      <ProblemSection />
      <FeaturesGrid />
      <HowItWorks />
      <BenefitShowcase />
      <RegimeComparison />
      <SecuritySection />
      <Roadmap />
      <FooterCTA />
    </main>
  );
}
