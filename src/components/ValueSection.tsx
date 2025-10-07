import { Card } from "@/components/ui/card";
import { ShoppingCart, Factory, Building2, CheckCircle } from "lucide-react";

const valueProps = [
  {
    icon: ShoppingCart,
    title: "Pour les Consommateurs",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    benefits: [
      "Accès à des produits locaux certifiés et traçables",
      "Garantie d'authenticité via le label SunuMark",
      "Plateforme unique pour tout le Made in Senegal",
      "Soutien direct aux producteurs locaux",
      "Livraison fiable et rapide",
    ],
  },
  {
    icon: Factory,
    title: "Pour les Producteurs & PME",
    color: "text-primary",
    bgColor: "bg-primary/10",
    benefits: [
      "Visibilité accrue auprès de millions de consommateurs",
      "Accès à une logistique optimisée via SunuChain",
      "Certification et labellisation SunuMark",
      "Opportunités d'export vers la diaspora",
      "Données et insights pour optimiser la production",
    ],
  },
  {
    icon: Building2,
    title: "Pour l'État & la Vision 2050",
    color: "text-accent",
    bgColor: "bg-accent/10",
    benefits: [
      "Données économiques fiables en temps réel",
      "Renforcement de la souveraineté industrielle",
      "Création d'emplois et croissance durable",
      "Hub numérique attractif pour les investisseurs",
      "Rayonnement international du Sénégal",
    ],
  },
];

const ValueSection = () => {
  return (
    <section id="value" className="section-container relative overflow-hidden">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 via-background to-primary/10 -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDuration: '5s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDuration: '7s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.08),transparent_50%)] -z-10" />
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Proposition de Valeur
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          SunuMarket crée de la valeur pour tous les acteurs de l'écosystème Made in Senegal
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {valueProps.map((prop, index) => {
          const Icon = prop.icon;
          return (
            <Card 
              key={index} 
              className="p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-border bg-card/80 backdrop-blur-sm animate-slide-in-right group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`${prop.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-8 w-8 ${prop.color} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <h3 className="text-2xl font-bold mb-6 transition-colors duration-300">{prop.title}</h3>
              <ul className="space-y-3">
                {prop.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-200" />
                    <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors duration-200">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default ValueSection;
