import { Card } from "@/components/ui/card";
import marketplaceIcon from "@/assets/marketplace-icon.jpg";
import supplyChainIcon from "@/assets/supply-chain-icon.jpg";
import certificationIcon from "@/assets/certification-icon.jpg";

const pillars = [
  {
    title: "Marketplace Nationale",
    subtitle: "SunuMarket Platform",
    description: "Une plateforme web et mobile regroupant l'ensemble du Made in Senegal. Chaque producteur dispose de sa vitrine digitale pour atteindre les consommateurs locaux et la diaspora.",
    image: marketplaceIcon,
    features: ["Catalogue unifié", "Paiement sécurisé", "Livraison intégrée"],
  },
  {
    title: "Chaîne d'Approvisionnement",
    subtitle: "SunuChain",
    description: "Une logistique connectée entre producteurs, transformateurs et distributeurs. Optimisation des flux, réduction des coûts et transparence totale sur toute la chaîne de valeur.",
    image: supplyChainIcon,
    features: ["Suivi en temps réel", "Gestion des stocks", "Optimisation routes"],
  },
  {
    title: "Label Numérique",
    subtitle: "SunuMark",
    description: "Un QR code pour certifier l'origine, la qualité et la traçabilité de chaque produit. Garantit l'authenticité du Made in Senegal et renforce la confiance des consommateurs.",
    image: certificationIcon,
    features: ["QR code unique", "Traçabilité complète", "Certification officielle"],
  },
];

const SolutionSection = () => {
  return (
    <section id="solution" className="section-container">
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
            className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border bg-card animate-fade-in"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="aspect-square overflow-hidden bg-muted/50">
              <img 
                src={pillar.image} 
                alt={pillar.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="mb-4">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  {pillar.subtitle}
                </span>
                <h3 className="text-2xl font-bold mt-1">{pillar.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                {pillar.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {pillar.features.map((feature, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
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
