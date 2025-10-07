import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">SunuMarket</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Le hub numérique du Made in Senegal pour la Vision 2050
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#problem" className="hover:text-secondary transition-colors">Le Problème</a></li>
              <li><a href="#solution" className="hover:text-secondary transition-colors">Solutions</a></li>
              <li><a href="#value" className="hover:text-secondary transition-colors">Proposition</a></li>
              <li><a href="#team" className="hover:text-secondary transition-colors">Équipe</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4">Nos Solutions</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-secondary transition-colors">Marketplace</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">SunuChain</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Label SunuMark</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Services B2B</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:mmdiagne@ept.sn" className="hover:text-secondary transition-colors">
                  mmdiagne@ept.sn
                </a>
              </li>
              <li>École Polytechnique de Thiès</li>
              <li>Thiès, Sénégal</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
            <p>© {currentYear} SunuMarket — Propulsé par de jeunes ingénieurs sénégalais engagés pour la souveraineté numérique</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-secondary transition-colors">À propos</a>
              <a href="#" className="hover:text-secondary transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-secondary transition-colors">Confidentialité</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
