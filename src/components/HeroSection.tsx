import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-senegal.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(27, 67, 50, 0.9), rgba(27, 67, 50, 0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="section-container relative z-10 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 border border-secondary/30 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-secondary text-sm font-medium">Vision Sénégal 2050</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary-foreground">
            Valoriser, Certifier et Connecter
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90 font-light">
            L'Excellence Locale au Service de la Vision 2050
          </p>
          
          <p className="text-lg mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            SunuMarket est la première plateforme numérique dédiée au Made in Senegal, reliant producteurs, artisans, PME et consommateurs autour de la confiance, de la traçabilité et de l'innovation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 group">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Découvrir la marketplace
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Award className="mr-2 h-5 w-5" />
              Certifier mes produits
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Users className="mr-2 h-5 w-5" />
              Rejoindre le réseau
            </Button>
          </div>

          {/* Values Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-primary-foreground/10 backdrop-blur-md rounded-full border border-primary-foreground/20">
              <span className="text-primary-foreground font-medium">Souveraineté</span>
            </div>
            <div className="px-6 py-3 bg-primary-foreground/10 backdrop-blur-md rounded-full border border-primary-foreground/20">
              <span className="text-primary-foreground font-medium">Innovation</span>
            </div>
            <div className="px-6 py-3 bg-primary-foreground/10 backdrop-blur-md rounded-full border border-primary-foreground/20">
              <span className="text-primary-foreground font-medium">Excellence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowRight className="h-6 w-6 text-primary-foreground rotate-90" />
      </div>
    </section>
  );
};

export default HeroSection;
