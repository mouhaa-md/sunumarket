import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Award, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroSenegal from "@/assets/hero-senegal.jpg";
import heroFashion from "@/assets/hero-fashion.jpg";
import heroLeather from "@/assets/hero-leather.jpg";

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [heroSenegal, heroFashion, heroLeather];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Images Carousel with Overlay */}
      {images.map((image, index) => (
        <div 
          key={index}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(27, 67, 50, 0.9), rgba(27, 67, 50, 0.7))',
            }}
          />
        </div>
      ))}
      
      {/* Content */}
      <div className="section-container relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/20 border border-secondary/30 rounded-full mb-4 sm:mb-6 backdrop-blur-sm">
            <span className="text-secondary text-xs sm:text-sm font-medium">Vision Sénégal 2050</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-primary-foreground leading-tight">
            Valoriser, Certifier et Connecter
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-primary-foreground/90 font-light">
            L'Excellence Locale au Service de la Vision 2050
          </p>
          
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 text-primary-foreground/80 max-w-2xl mx-auto px-2">
            SunuMarket est la première plateforme numérique dédiée au Made in Senegal, reliant producteurs, artisans, PME et consommateurs autour de la confiance, de la traçabilité et de l'innovation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
            <Link to="/marketplace">
              <Button size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:scale-105 transition-transform duration-300 text-sm sm:text-base">
                <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Découvrir la marketplace
              </Button>
            </Link>
            <Link to="/certification">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-primary-foreground/5 border-primary-foreground/30 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary hover:scale-105 sm:hover:scale-110 hover:shadow-2xl hover:shadow-secondary/50 transition-all duration-500 backdrop-blur-sm text-sm sm:text-base">
                <Award className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Certifier mes produits
              </Button>
            </Link>
            <Link to="/reseau">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-primary-foreground/5 border-primary-foreground/30 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary hover:scale-105 sm:hover:scale-110 hover:shadow-2xl hover:shadow-secondary/50 transition-all duration-500 backdrop-blur-sm text-sm sm:text-base">
                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Rejoindre le réseau
              </Button>
            </Link>
          </div>

          {/* Values Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4 sm:px-0">
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-foreground/10 backdrop-blur-md rounded-full border border-primary-foreground/20">
              <span className="text-primary-foreground font-medium text-sm sm:text-base">Souveraineté</span>
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-foreground/10 backdrop-blur-md rounded-full border border-primary-foreground/20">
              <span className="text-primary-foreground font-medium text-sm sm:text-base">Innovation</span>
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-foreground/10 backdrop-blur-md rounded-full border border-primary-foreground/20">
              <span className="text-primary-foreground font-medium text-sm sm:text-base">Excellence</span>
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
