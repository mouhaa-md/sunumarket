import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  MapPin, 
  Users, 
  TrendingUp, 
  Package, 
  Truck, 
  CheckCircle2, 
  ShieldCheck,
  Factory,
  Store,
  Eye,
  Download,
  Plus
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RegionalStatsTable from "./RegionalStatsTable";
import { jsPDF } from "jspdf";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  origin_region?: string;
  is_certified?: boolean;
  created_at: string;
}

interface TraceabilityModuleProps {
  products: Product[];
  sellerDetails: {
    business_name: string;
    region: string;
    activity_sector: string;
    is_certified?: boolean;
  } | null;
  onNavigateToProducts?: () => void;
  isGlobalView?: boolean;
  globalStats?: {
    totalSellers: number;
    certifiedSellers: number;
    totalProducts: number;
    totalRevenue: number;
    sellersByRegion: { id: string; name: string; count: number }[];
  };
}

// Default region data for sellers
const DEFAULT_REGIONS_DATA = [
  { id: "dakar", name: "Dakar", producers: 245 },
  { id: "thies", name: "Thiès", producers: 189 },
  { id: "saint_louis", name: "Saint-Louis", producers: 134 },
  { id: "diourbel", name: "Diourbel", producers: 98 },
  { id: "fatick", name: "Fatick", producers: 87 },
  { id: "kaolack", name: "Kaolack", producers: 156 },
  { id: "louga", name: "Louga", producers: 76 },
  { id: "matam", name: "Matam", producers: 45 },
  { id: "tambacounda", name: "Tambacounda", producers: 67 },
  { id: "kedougou", name: "Kédougou", producers: 34 },
  { id: "kolda", name: "Kolda", producers: 89 },
  { id: "sedhiou", name: "Sédhiou", producers: 56 },
  { id: "ziguinchor", name: "Ziguinchor", producers: 123 },
  { id: "kaffrine", name: "Kaffrine", producers: 78 },
];

const PRODUCT_JOURNEY_STEPS = [
  { id: 1, label: "Production", icon: Factory, description: "Fabrication artisanale locale" },
  { id: 2, label: "Certification", icon: ShieldCheck, description: "Contrôle qualité SunuMark" },
  { id: 3, label: "Stockage", icon: Package, description: "Entreposage sécurisé" },
  { id: 4, label: "Expédition", icon: Truck, description: "Livraison tracée" },
  { id: 5, label: "Livraison", icon: Store, description: "Réception client" },
];

// Generate consistent QR code URL (same format as Marketplace/ProductDetail)
const generateProductQRUrl = (productId: string) => {
  return `https://sunumarket.sn/verify/${productId}`;
};

const TraceabilityModule = ({ 
  products, 
  sellerDetails, 
  onNavigateToProducts,
  isGlobalView = false,
  globalStats
}: TraceabilityModuleProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Calculate impact scores
  const totalProducts = isGlobalView ? (globalStats?.totalProducts || 0) : products.length;
  const certifiedProducts = isGlobalView 
    ? (globalStats?.certifiedSellers || 0) 
    : products.filter(p => p.is_certified).length;
  
  const impactMetrics = isGlobalView ? {
    jobsCreated: globalStats?.totalSellers ? globalStats.totalSellers * 3 : 0,
    localEconomy: globalStats?.totalRevenue || 0,
  } : {
    jobsCreated: Math.max(2, Math.floor(totalProducts * 1.5)),
    localEconomy: totalProducts * 75000,
  };

  // Region data for the map
  const regionsData = isGlobalView && globalStats?.sellersByRegion
    ? globalStats.sellersByRegion.map(r => ({
        id: r.id,
        name: r.name,
        producers: r.count
      }))
    : DEFAULT_REGIONS_DATA;

  const totalProducers = regionsData.reduce((sum, r) => sum + r.producers, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20">
          <QrCode className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Traçabilité & Transparence</h2>
          <p className="text-muted-foreground">
            {isGlobalView 
              ? "Vue nationale du réseau Made in Senegal"
              : "Suivez le parcours de vos produits et mesurez votre impact"
            }
          </p>
        </div>
      </div>

      {/* Impact Score Cards - Only 2 metrics now */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{impactMetrics.jobsCreated.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {isGlobalView ? "Emplois directs" : "Emplois créés"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold text-secondary">
              {impactMetrics.localEconomy >= 1000000 
                ? `${(impactMetrics.localEconomy / 1000000).toFixed(1)}M`
                : impactMetrics.localEconomy.toLocaleString()
              }
            </p>
            <p className="text-xs text-muted-foreground">FCFA Économie locale</p>
          </CardContent>
        </Card>
      </div>

      {/* Product QR Codes (seller view) - HORIZONTAL at top */}
      {!isGlobalView && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-secondary" />
              QR Codes Produits
            </CardTitle>
            <CardDescription>Traçabilité complète pour vos clients</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-6">
                <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="font-medium mb-1">Aucun produit à afficher</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Ajoutez des produits pour générer leurs QR codes de traçabilité
                </p>
                {onNavigateToProducts && (
                  <Button onClick={onNavigateToProducts} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un produit
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {products.slice(0, 10).map((product) => (
                  <Dialog key={product.id}>
                    <DialogTrigger asChild>
                      <div className="flex flex-col items-center gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
                        <div className="p-2 bg-white rounded-lg border group-hover:shadow-md transition-shadow">
                          <QRCodeSVG
                            value={generateProductQRUrl(product.id)}
                            size={56}
                            level="M"
                          />
                        </div>
                        <div className="text-center min-w-0 w-full">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Parcours Produit</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex justify-center p-4 bg-white rounded-xl border">
                          <QRCodeSVG
                            value={generateProductQRUrl(product.id)}
                            size={180}
                            level="H"
                            includeMargin
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          Scannez pour vérifier sur sunumarket.sn/verify/{product.id.slice(0, 8)}...
                        </p>
                        
                        <div className="text-center">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {sellerDetails?.business_name} • {product.origin_region || sellerDetails?.region}
                          </p>
                          {product.is_certified && (
                            <Badge className="mt-2 bg-secondary text-secondary-foreground">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Certifié SunuMark
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Parcours du produit</p>
                          <div className="relative">
                            {PRODUCT_JOURNEY_STEPS.map((step, index) => (
                              <div key={step.id} className="flex items-center gap-3 py-2">
                                <div className={`p-2 rounded-full ${
                                  index <= 2 ? 'bg-green-500/20 text-green-600' : 'bg-muted text-muted-foreground'
                                }`}>
                                  <step.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{step.label}</p>
                                  <p className="text-xs text-muted-foreground">{step.description}</p>
                                </div>
                                {index <= 2 && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger QR Code
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Global Stats (agent view) */}
      {isGlobalView && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              Statistiques Certifications
            </CardTitle>
            <CardDescription>État des certifications SunuMark</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-lg bg-primary/10 text-center">
                <p className="text-3xl font-bold text-primary">{globalStats?.totalSellers || 0}</p>
                <p className="text-xs text-muted-foreground">Vendeurs inscrits</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/10 text-center">
                <p className="text-3xl font-bold text-secondary">{globalStats?.certifiedSellers || 0}</p>
                <p className="text-xs text-muted-foreground">Certifiés SunuMark</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/20 text-center">
                <p className="text-3xl font-bold text-secondary">
                  {globalStats?.totalSellers 
                    ? Math.round((globalStats.certifiedSellers / globalStats.totalSellers) * 100)
                    : 0
                  }%
                </p>
                <p className="text-xs text-muted-foreground">Taux certification</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border text-center">
                <p className="text-3xl font-bold">{globalStats?.totalProducts || 0}</p>
                <p className="text-xs text-muted-foreground">Produits marketplace</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regional Statistics Table - BELOW QR codes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary" />
            Statistiques {isGlobalView ? "Nationales" : "Régionales"}
          </CardTitle>
          <CardDescription>
            {isGlobalView 
              ? "Distribution des artisans sur le territoire"
              : "Réseau national des artisans Made in Senegal"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegionalStatsTable 
            regionsData={regionsData}
            selectedRegion={selectedRegion}
            onRegionClick={(id) => setSelectedRegion(selectedRegion === id ? null : id)}
            isGlobalView={isGlobalView}
          />
        </CardContent>
      </Card>

      {/* Impact Certificate */}
      <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-secondary/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-secondary to-primary">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">
                {isGlobalView ? "Bilan National Made in Senegal" : "Certificat d'Impact Local"}
              </h3>
              <p className="text-muted-foreground mb-3">
                {isGlobalView 
                  ? "Contribution globale à l'économie sénégalaise"
                  : "Votre contribution à l'économie sénégalaise est mesurable et vérifiable"
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">
                    {isGlobalView ? (globalStats?.totalProducts || 0) : totalProducts}
                  </p>
                  <p className="text-xs text-muted-foreground">Produits tracés</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {isGlobalView ? (globalStats?.certifiedSellers || 0) : certifiedProducts}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isGlobalView ? "Vendeurs certifiés" : "Certifiés SunuMark"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-xs text-muted-foreground">Made in Senegal</p>
                </div>
              </div>
            </div>
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => handleDownloadCertificate(
                isGlobalView,
                isGlobalView ? "Bilan National" : (sellerDetails?.business_name || "Vendeur"),
                isGlobalView ? (globalStats?.totalProducts || 0) : totalProducts,
                isGlobalView ? (globalStats?.certifiedSellers || 0) : certifiedProducts,
                impactMetrics
              )}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGlobalView ? "Exporter Rapport" : "Télécharger Certificat"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Function to download the impact certificate as PDF
const handleDownloadCertificate = (
  isGlobalView: boolean,
  businessName: string,
  totalProducts: number,
  certifiedCount: number,
  impactMetrics: { jobsCreated: number; localEconomy: number }
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(26, 54, 39); // Dark green
  doc.rect(0, 0, pageWidth, 45, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("SUNUMARKET", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(isGlobalView ? "Bilan National Made in Senegal" : "Certificat d'Impact Local", pageWidth / 2, 32, { align: "center" });
  
  // Gold accent line
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 45, pageWidth, 3, "F");
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Certificate content
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Certifié le : " + new Date().toLocaleDateString("fr-FR", { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  }), 20, 65);
  
  doc.setFontSize(16);
  doc.text(businessName, 20, 85);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Ce certificat atteste de la contribution à l'économie locale sénégalaise", 20, 100);
  doc.text("à travers la plateforme SunuMarket.", 20, 108);
  
  // Stats box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(20, 120, pageWidth - 40, 70, 5, 5, "F");
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Indicateurs d'Impact", 30, 135);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const stats = [
    { label: "Produits tracés", value: totalProducts.toString() },
    { label: isGlobalView ? "Vendeurs certifiés" : "Produits certifiés SunuMark", value: certifiedCount.toString() },
    { label: "Emplois créés/soutenus", value: impactMetrics.jobsCreated.toLocaleString() },
    { label: "Impact économique local", value: `${impactMetrics.localEconomy.toLocaleString()} FCFA` },
    { label: "Origine", value: "100% Made in Senegal" },
  ];
  
  stats.forEach((stat, index) => {
    const yPos = 148 + (index * 10);
    doc.text(stat.label + " :", 30, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, 130, yPos);
    doc.setFont("helvetica", "normal");
  });
  
  // Footer
  doc.setFillColor(26, 54, 39);
  doc.rect(0, 270, pageWidth, 27, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("SunuMarket - Plateforme Officielle Made in Senegal", pageWidth / 2, 280, { align: "center" });
  doc.text("Ministère du Commerce et de l'Industrie du Sénégal", pageWidth / 2, 288, { align: "center" });
  
  // Save
  const fileName = isGlobalView 
    ? `bilan-national-sunumarket-${new Date().toISOString().split('T')[0]}.pdf`
    : `certificat-impact-${businessName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  
  doc.save(fileName);
  
  toast({
    title: "Certificat téléchargé",
    description: `Le ${isGlobalView ? "bilan national" : "certificat d'impact"} a été enregistré.`,
  });
};

export default TraceabilityModule;
