import { Card } from "@/components/ui/card";
import { CheckCircle, Rocket, TrendingUp, Globe, Castle } from "lucide-react";

const phases = [
  {
    phase: "PHASE 1",
    period: "T1-T2 2026",
    title: "Lancement Pilote",
    icon: Rocket,
    actions: [
      "Déploiement à Dakar et Thiès",
      "Intégration de 500 producteurs",
      "Premiers labels SunuMark",
      "Mise en place de SunuChain",
    ],
  },
  {
    phase: "PHASE 2",
    period: "T3-T4 2026",
    title: "Extension Nationale",
    icon: TrendingUp,
    actions: [
      "Couverture de toutes les régions",
      "Plus de 10 000 producteurs actifs",
      "Partenariat avec les transporteurs",
      "Application mobile complète",
    ],
  },
  {
    phase: "PHASE 3",
    period: "2027",
    title: "Ouverture Diaspora",
    icon: Globe,
    actions: [
      "Exportation vers la France et les USA",
      "Place du marché international",
      "Certification d'exportation SunuMark",
      "Logistique internationale",
    ],
  },
  {
    phase: "PHASE 4",
    period: "2028+",
    title: "Hub Régional",
    icon: Castle,
    actions: [
      "Extension CEDEAO",
      "Partenariats institutionnels",
      "Hub technologique africain",
      "Potentiel d'introduction en bourse",
    ],
  },
];

const StrategySection = () => {
  return (
    <section className="section-container relative overflow-hidden">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted/30 to-secondary/10 -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-secondary/12 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDuration: '5s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_60%)] -z-10" />
      
      <div className="text-center mb-12 md:mb-16 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-primary">
          Stratégie de Déploiement 2026-2028
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
          Une feuille de route claire pour faire de SunuMarket le leader du Made in Senegal
        </p>
      </div>

      {/* Phase Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <div 
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon Circle */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary/20 flex items-center justify-center border-4 border-secondary shadow-lg">
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                </div>
              </div>

              {/* Phase Card */}
              <Card className="relative p-4 md:p-6 bg-card/90 backdrop-blur-sm border-2 border-muted hover:border-secondary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                {/* Arrow pointer at top */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-muted group-hover:border-b-secondary/40 transition-colors duration-300" />
                
                <div className="text-center mb-4">
                  <span className="text-xs md:text-sm font-bold text-primary">{phase.phase}</span>
                  <h3 className="text-lg md:text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">{phase.title}</h3>
                </div>
                
                <ul className="space-y-2">
                  {phase.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm group/item">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-200" />
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-200">{action}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative px-4 md:px-8">
        {/* Timeline Line */}
        <div className="relative h-2 bg-gradient-to-r from-primary via-secondary to-primary rounded-full">
          {/* Timeline Dots */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 bg-secondary rounded-full border-2 border-background shadow-md" />
          <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 bg-secondary rounded-full border-2 border-background shadow-md" />
          <div className="absolute left-2/3 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 bg-secondary rounded-full border-2 border-background shadow-md" />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 bg-secondary rounded-full border-2 border-background shadow-md" />
          
          {/* Arrow at the end */}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-primary" />
          </div>
        </div>
        
        {/* Timeline Labels */}
        <div className="flex justify-between mt-4 text-center">
          <div className="flex-1">
            <p className="text-sm md:text-base font-bold text-primary">T1-T2</p>
            <p className="text-xs md:text-sm text-muted-foreground">2026</p>
          </div>
          <div className="flex-1">
            <p className="text-sm md:text-base font-bold text-primary">T3-T4</p>
            <p className="text-xs md:text-sm text-muted-foreground">2026</p>
          </div>
          <div className="flex-1">
            <p className="text-sm md:text-base font-bold text-primary">2027</p>
            <p className="text-xs md:text-sm text-muted-foreground">&nbsp;</p>
          </div>
          <div className="flex-1">
            <p className="text-sm md:text-base font-bold text-primary">2028+</p>
            <p className="text-xs md:text-sm text-muted-foreground">&nbsp;</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategySection;
