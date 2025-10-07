import { Card } from "@/components/ui/card";
import { Users, Globe, Building, TrendingUp, CreditCard, Award, Database, Boxes } from "lucide-react";

const segments = [
  { icon: Users, label: "Consommateurs locaux", value: "17M+" },
  { icon: Globe, label: "Diaspora sénégalaise", value: "3M+" },
  { icon: Building, label: "PME & Artisans", value: "50K+" },
];

const revenues = [
  { icon: CreditCard, title: "Commissions", description: "3-7% par transaction" },
  { icon: Award, title: "Certification SunuMark", description: "Frais de labellisation" },
  { icon: Boxes, title: "Abonnements Premium", description: "Producteurs & distributeurs" },
  { icon: Database, title: "Services B2B & Data", description: "Insights & API" },
];

const MarketSection = () => {
  return (
    <section className="section-container">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Le Marché & Le Modèle Économique
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Un marché en forte croissance avec un modèle économique diversifié et pérenne
        </p>
      </div>

      {/* Market Segments */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">Segments de Marché</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <Card 
                key={index} 
                className="p-8 text-center hover:shadow-lg transition-all border-border bg-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="h-12 w-12 text-secondary mx-auto mb-4" />
                <div className="text-4xl font-bold gradient-text mb-2">{segment.value}</div>
                <p className="text-muted-foreground">{segment.label}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Revenue Streams */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-8">Sources de Revenus</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {revenues.map((revenue, index) => {
            const Icon = revenue.icon;
            return (
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-border bg-card animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{revenue.title}</h4>
                <p className="text-sm text-muted-foreground">{revenue.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Market Potential */}
      <div className="mt-12 p-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-border">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h3 className="text-2xl font-bold">Potentiel de Marché</h3>
        </div>
        <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
          Le e-commerce au Sénégal devrait atteindre <span className="font-bold text-secondary">500M€</span> d'ici 2027, 
          avec une croissance annuelle de <span className="font-bold text-secondary">30%</span>
        </p>
      </div>
    </section>
  );
};

export default MarketSection;
