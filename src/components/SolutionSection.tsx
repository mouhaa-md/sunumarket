import { Card } from "@/components/ui/card";
import marketplaceIcon from "@/assets/marketplace-icon.jpg";
import supplyChainIcon from "@/assets/supply-chain-icon.jpg";
import certificationIcon from "@/assets/certification-icon.jpg";

const pillars = [
  {
    title: "Marketplace Nationale",
    subtitle: "SunuMarket Platform",
    description: "Une plateforme web et mobile regroupant l'ensemble du Made in Senegal. Vitrines digitales pour chaque producteur et artisan.",
    image: marketplaceIcon,
    features: ["Catalogue unifié", "Paiement sécurisé", "Livraison intégrée"],
  },
  {
    title: "Chaîne Logistique",
    subtitle: "SunuChain",
    description: "Une logistique connectée entre producteurs, transformateurs et distributeurs. Optimisation des flux et transparence totale.",
    image: supplyChainIcon,
    features: ["Suivi en temps réel", "Gestion des stocks", "Optimisation routes"],
  },
  {
    title: "Label Numérique",
    subtitle: "SunuMark",
    description: "Un QR code pour certifier l'origine, la qualité et la traçabilité de chaque produit. Garantie Made in Senegal authentique.",
    image: certificationIcon,
    features: ["QR code unique", "Traçabilité complète", "Certification officielle"],
  },
];

const SolutionSection = () => {
  return (
    <section id="solution" className="section-container relative overflow-hidden">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-secondary/15 -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Notre Solution
        </h2>
        <p className="text-xl gradient-text font-semibold mb-4">
          Les 3 Piliers de SunuMarket
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Une solution intégrée pour transformer le Made in Senegal en un écosystème digital performant et souverain.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {pillars.map((pillar, index) => (
          <Card 
            key={index} 
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 border-2 border-primary/20 hover:border-secondary/40 bg-card/80 backdrop-blur-sm animate-fade-in group"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="aspect-square overflow-hidden bg-muted/50 relative">
              <img 
                src={pillar.image} 
                alt={pillar.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-6">
              <div className="mb-4">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider group-hover:text-secondary/80 transition-colors duration-300">
                  {pillar.subtitle}
                </span>
                <h3 className="text-2xl font-bold mt-1 group-hover:gradient-text transition-all duration-300">{pillar.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300">
                {pillar.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {pillar.features.map((feature, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SolutionSection;
