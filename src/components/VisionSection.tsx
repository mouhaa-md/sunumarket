import { Button } from "@/components/ui/button";
import { Sparkles, Target, Globe, TrendingUp } from "lucide-react";
import visionImage from "@/assets/vision-2050.jpg";

const impacts = [
  { icon: Target, label: "Souveraineté Économique", value: "100%" },
  { icon: Globe, label: "Rayonnement International", value: "Global" },
  { icon: TrendingUp, label: "Croissance Durable", value: "+30%" },
];

const VisionSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(27, 67, 50, 0.85), rgba(139, 69, 19, 0.85)), url(${visionImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="section-container relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 border border-secondary/30 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-secondary text-sm font-medium">Vision Sénégal 2050</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Le Futur du Made in Senegal
          </h2>
          
          <p className="text-xl text-primary-foreground/90 max-w-4xl mx-auto mb-8 leading-relaxed">
            Avec SunuMarket, chaque produit sénégalais devient visible, certifié et traçable. 
            Le Sénégal s'affirme comme un hub industriel et numérique africain, 
            contribuant directement à la Vision 2050 d'un Sénégal souverain, prospère et innovant.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {impacts.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <div 
                key={index} 
                className="bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 rounded-xl p-6 text-center animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="h-10 w-10 text-secondary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary-foreground mb-2">{impact.value}</div>
                <p className="text-primary-foreground/80">{impact.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quote */}
        <div className="bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 rounded-xl p-8 mb-12 animate-fade-in">
          <blockquote className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4 italic">
              "Le futur du Made in Senegal s'écrit aujourd'hui"
            </p>
            <footer className="text-primary-foreground/80">
              Une vision portée par la jeunesse sénégalaise
            </footer>
          </blockquote>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-6 shadow-xl"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Rejoindre le Mouvement
          </Button>
          <p className="mt-4 text-primary-foreground/70">
            Ensemble, construisons le Sénégal de demain
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
