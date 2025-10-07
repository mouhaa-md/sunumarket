import { Card } from "@/components/ui/card";
import { CheckCircle, Rocket, TrendingUp, Globe, Handshake } from "lucide-react";

const phases = [
  {
    phase: "Phase 1",
    period: "Q1-Q2 2025",
    title: "Lancement Pilote",
    icon: Rocket,
    actions: [
      "Déploiement à Dakar et Thiès",
      "Onboarding de 500 producteurs",
      "Premiers labels SunuMark",
      "Mise en place de SunuChain",
    ],
  },
  {
    phase: "Phase 2",
    period: "Q3-Q4 2025",
    title: "Extension Nationale",
    icon: TrendingUp,
    actions: [
      "Couverture de toutes les régions",
      "10,000+ producteurs actifs",
      "Partenariat avec transporteurs",
      "Application mobile complète",
    ],
  },
  {
    phase: "Phase 3",
    period: "2026",
    title: "Ouverture Diaspora",
    icon: Globe,
    actions: [
      "Export vers France et USA",
      "Place de marché internationale",
      "Certification export SunuMark",
      "Logistique internationale",
    ],
  },
  {
    phase: "Phase 4",
    period: "2027+",
    title: "Hub Régional",
    icon: Handshake,
    actions: [
      "Extension CEDEAO",
      "Partenariats institutionnels",
      "Hub tech africain",
      "IPO potentielle",
    ],
  },
];

const StrategySection = () => {
  return (
    <section className="section-container bg-muted/30">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Stratégie & Opportunités
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Une feuille de route claire pour faire de SunuMarket le leader du Made in Senegal
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-primary to-accent transform -translate-x-1/2" />

        {/* Phases */}
        <div className="space-y-12">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div 
                key={index} 
                className={`relative flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Timeline Dot */}
                <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-secondary rounded-full items-center justify-center border-4 border-background shadow-lg z-10">
                  <Icon className="h-6 w-6 text-secondary-foreground" />
                </div>

                {/* Content Card */}
                <Card className={`w-full lg:w-5/12 ${isEven ? 'lg:mr-auto lg:pr-12' : 'lg:ml-auto lg:pl-12'} p-6 hover:shadow-xl transition-all border-border bg-card`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="lg:hidden bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-secondary">{phase.phase}</span>
                      <h3 className="text-xl font-bold">{phase.title}</h3>
                      <p className="text-sm text-muted-foreground">{phase.period}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {phase.actions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StrategySection;
