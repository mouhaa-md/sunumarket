import { AlertCircle, TrendingDown, Link2Off, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

const problems = [
  {
    icon: TrendingDown,
    title: "Manque de visibilité",
    description: "Les producteurs locaux peinent à faire connaître leurs produits au-delà de leur zone géographique.",
  },
  {
    icon: Link2Off,
    title: "Fragmentation logistique",
    description: "Absence de coordination entre production, transformation et distribution.",
  },
  {
    icon: ShieldAlert,
    title: "Manque de confiance",
    description: "Difficultés à garantir l'authenticité et la qualité des produits Made in Senegal.",
  },
  {
    icon: AlertCircle,
    title: "Accès limité au digital",
    description: "Les PME et artisans n'ont pas les outils pour vendre en ligne efficacement.",
  },
];

const ProblemSection = () => {
  return (
    <section id="problem" className="section-container relative overflow-hidden">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-background to-muted/30 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(239,68,68,0.15),transparent_50%)] -z-10" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-muted/20 rounded-full blur-3xl -z-10" />
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Le Problème
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Le secteur du Made in Senegal fait face à des défis structurels qui limitent son potentiel de croissance et sa compétitivité sur les marchés national et international.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {problems.map((problem, index) => {
          const Icon = problem.icon;
          return (
            <Card 
              key={index} 
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 border-2 border-destructive/20 hover:border-destructive/40 bg-card/80 backdrop-blur-sm animate-slide-in-right group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-destructive/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors duration-300">
                <Icon className="h-6 w-6 text-destructive group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-destructive transition-colors duration-300">{problem.title}</h3>
              <p className="text-sm text-muted-foreground">{problem.description}</p>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 p-6 bg-card rounded-lg border-2 border-destructive/30 text-center">
        <p className="text-lg font-medium text-foreground">
          <span className="gradient-text font-bold">75%</span> des PME sénégalaises n'ont pas de présence en ligne efficace
        </p>
      </div>
    </section>
  );
};

export default ProblemSection;
