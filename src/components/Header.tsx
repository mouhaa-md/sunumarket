import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold gradient-text cursor-pointer">SunuMarket</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-secondary transition-colors">
              Accueil
            </Link>
            <Link to="/marketplace" className="text-sm font-medium hover:text-secondary transition-colors">
              Marketplace
            </Link>
            <Link to="/certification" className="text-sm font-medium hover:text-secondary transition-colors">
              Certification
            </Link>
            <Link to="/reseau" className="text-sm font-medium hover:text-secondary transition-colors">
              Réseau
            </Link>
            <button onClick={() => scrollToSection("team")} className="text-sm font-medium hover:text-secondary transition-colors">
              Contact
            </button>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 border-t border-border">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left text-sm font-medium hover:text-secondary py-2">
              Accueil
            </Link>
            <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left text-sm font-medium hover:text-secondary py-2">
              Marketplace
            </Link>
            <Link to="/certification" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left text-sm font-medium hover:text-secondary py-2">
              Certification
            </Link>
            <Link to="/reseau" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left text-sm font-medium hover:text-secondary py-2">
              Réseau
            </Link>
            <button onClick={() => scrollToSection("team")} className="block w-full text-left text-sm font-medium hover:text-secondary py-2">
              Contact
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
