import { Button } from "@/components/ui/button";
import { Menu, LogIn, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { user, profile, userRole, signOut } = useAuth();

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case "acheteur":
        return "/dashboard/acheteur";
      case "vendeur":
        return "/dashboard/vendeur";
      case "agent":
        return "/dashboard/agent";
      default:
        return "/dashboard";
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case "acheteur":
        return "Acheteur";
      case "vendeur":
        return "Vendeur";
      case "agent":
        return "Agent";
      default:
        return "";
    }
  };

  return (
    <>
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

              {/* Auth Section */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="max-w-[100px] truncate">{profile?.full_name?.split(" ")[0] || "Mon compte"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-background">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{profile?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="cursor-pointer">
                        Mon tableau de bord
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Connexion / Inscription
                </Button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background">
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()}>Tableau de bord</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="icon" variant="outline" onClick={() => setIsAuthModalOpen(true)}>
                  <LogIn className="h-4 w-4" />
                </Button>
              )}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6" />
              </button>
            </div>
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

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
