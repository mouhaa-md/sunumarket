import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ValueSection from "@/components/ValueSection";
import MarketSection from "@/components/MarketSection";
import StrategySection from "@/components/StrategySection";
import TeamSection from "@/components/TeamSection";
import VisionSection from "@/components/VisionSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ValueSection />
        <MarketSection />
        <StrategySection />
        <TeamSection />
        <VisionSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
