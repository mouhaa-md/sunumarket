import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold gradient-text">SunuMarket</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("problem")} className="text-sm font-medium hover:text-secondary transition-colors">
              Le Problème
            </button>
            <button onClick={() => scrollToSection("solution")} className="text-sm font-medium hover:text-secondary transition-colors">
              Solutions
            </button>
            <button onClick={() => scrollToSection("value")} className="text-sm font-medium hover:text-secondary transition-colors">
              Proposition
            </button>
            <button onClick={() => scrollToSection("team")} className="text-sm font-medium hover:text-secondary transition-colors">
              Équipe
            </button>
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
              Rejoindre
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 border-t border-border">
            <button onClick={() => scrollToSection("problem")} className="block w-full text-left text-sm font-medium hover:text-secondary py-2">
              Le Problème
            </button>
            <button onClick={() => scrollToSection("solution")} className="block w-full text-left text-sm font-medium hover:text-secondary py-2">
              Solutions
            </button>
            <button onClick={() => scrollToSection("value")} className="block w-full text-left text-sm font-medium hover:text-secondary py-2">
              Proposition
            </button>
            <button onClick={() => scrollToSection("team")} className="block w-full text-left text-sm font-medium hover:text-secondary py-2">
              Équipe
            </button>
            <Button variant="default" size="sm" className="w-full bg-primary hover:bg-primary/90">
              Rejoindre
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
