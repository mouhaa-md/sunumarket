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
  Leaf,
  Heart,
  Plus
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
}

// Senegal regions with coordinates for the map
const SENEGAL_REGIONS = [
  { id: "dakar", name: "Dakar", x: 15, y: 45, producers: 245, color: "hsl(var(--secondary))" },
  { id: "thies", name: "Thiès", x: 25, y: 42, producers: 189, color: "hsl(var(--primary))" },
  { id: "saint_louis", name: "Saint-Louis", x: 30, y: 15, producers: 134, color: "hsl(var(--accent))" },
  { id: "diourbel", name: "Diourbel", x: 35, y: 45, producers: 98, color: "hsl(var(--secondary))" },
  { id: "fatick", name: "Fatick", x: 32, y: 55, producers: 87, color: "hsl(var(--primary))" },
  { id: "kaolack", name: "Kaolack", x: 40, y: 55, producers: 156, color: "hsl(var(--accent))" },
  { id: "louga", name: "Louga", x: 35, y: 25, producers: 76, color: "hsl(var(--secondary))" },
  { id: "matam", name: "Matam", x: 55, y: 20, producers: 45, color: "hsl(var(--primary))" },
  { id: "tambacounda", name: "Tambacounda", x: 65, y: 45, producers: 67, color: "hsl(var(--accent))" },
  { id: "kedougou", name: "Kédougou", x: 75, y: 55, producers: 34, color: "hsl(var(--secondary))" },
  { id: "kolda", name: "Kolda", x: 60, y: 65, producers: 89, color: "hsl(var(--primary))" },
  { id: "sedhiou", name: "Sédhiou", x: 50, y: 68, producers: 56, color: "hsl(var(--accent))" },
  { id: "ziguinchor", name: "Ziguinchor", x: 40, y: 72, producers: 123, color: "hsl(var(--secondary))" },
  { id: "kaffrine", name: "Kaffrine", x: 48, y: 48, producers: 78, color: "hsl(var(--primary))" },
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

const TraceabilityModule = ({ products, sellerDetails, onNavigateToProducts }: TraceabilityModuleProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Calculate impact scores
  const totalProducts = products.length;
  const certifiedProducts = products.filter(p => p.is_certified).length;
  
  const impactMetrics = {
    jobsCreated: Math.max(2, Math.floor(totalProducts * 1.5)),
    localEconomy: totalProducts * 75000,
    co2Saved: totalProducts * 12,
    familiesSupported: Math.max(1, Math.floor(totalProducts * 0.8)),
  };

  // No longer needed - using generateProductQRUrl instead

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20">
          <QrCode className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Traçabilité & Transparence</h2>
          <p className="text-muted-foreground">Suivez le parcours de vos produits et mesurez votre impact</p>
        </div>
      </div>

      {/* Impact Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{impactMetrics.jobsCreated}</p>
            <p className="text-xs text-muted-foreground">Emplois créés</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold text-secondary">{(impactMetrics.localEconomy / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground">FCFA Économie locale</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Leaf className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
            <p className="text-2xl font-bold text-emerald-600">{impactMetrics.co2Saved} kg</p>
            <p className="text-xs text-muted-foreground">CO₂ économisé</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border-rose-500/20">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-rose-600" />
            <p className="text-2xl font-bold text-rose-600">{impactMetrics.familiesSupported}</p>
            <p className="text-xs text-muted-foreground">Familles soutenues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Interactive Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" />
              Cartographie des Producteurs
            </CardTitle>
            <CardDescription>Réseau national des artisans Made in Senegal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 min-h-[300px]">
              {/* Simplified Senegal Map */}
              <svg viewBox="0 0 100 85" className="w-full h-64">
                {/* Map outline */}
                <path
                  d="M10 45 L20 35 L35 30 L50 25 L65 30 L80 40 L85 55 L75 65 L55 70 L35 75 L20 70 L10 60 Z"
                  fill="hsl(var(--muted))"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  className="opacity-50"
                />
                
                {/* Region markers */}
                {SENEGAL_REGIONS.map((region) => (
                  <g key={region.id}>
                    <circle
                      cx={region.x}
                      cy={region.y}
                      r={selectedRegion === region.id ? 4 : 3}
                      fill={region.color}
                      className="cursor-pointer transition-all duration-300 hover:opacity-80"
                      onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                    />
                    {selectedRegion === region.id && (
                      <circle
                        cx={region.x}
                        cy={region.y}
                        r={6}
                        fill="none"
                        stroke={region.color}
                        strokeWidth="1"
                        className="animate-ping"
                      />
                    )}
                  </g>
                ))}
              </svg>

              {/* Region Info Popup */}
              {selectedRegion && (
                <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{SENEGAL_REGIONS.find(r => r.id === selectedRegion)?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {SENEGAL_REGIONS.find(r => r.id === selectedRegion)?.producers} producteurs actifs
                      </p>
                    </div>
                    <Badge variant="secondary">
                      <MapPin className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Region Stats */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-xl font-bold text-primary">14</p>
                <p className="text-xs text-muted-foreground">Régions couvertes</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-xl font-bold text-secondary">1,477</p>
                <p className="text-xs text-muted-foreground">Producteurs total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product QR Codes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-secondary" />
              QR Codes Produits
            </CardTitle>
            <CardDescription>Traçabilité complète pour vos clients</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                  <Package className="h-12 w-12 text-muted-foreground" />
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
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {products.slice(0, 5).map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 bg-white rounded-lg border">
                      <QRCodeSVG
                        value={generateProductQRUrl(product.id)}
                        size={48}
                        level="M"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Parcours Produit</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* QR Code Large - Same URL as Marketplace */}
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
                          
                          {/* Product Info */}
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

                          {/* Journey Steps */}
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Impact Certificate */}
      <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-secondary/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-secondary to-primary">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">Certificat d'Impact Local</h3>
              <p className="text-muted-foreground mb-3">
                Votre contribution à l'économie sénégalaise est mesurable et vérifiable
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{totalProducts}</p>
                  <p className="text-xs text-muted-foreground">Produits tracés</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{certifiedProducts}</p>
                  <p className="text-xs text-muted-foreground">Certifiés SunuMark</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-xs text-muted-foreground">Made in Senegal</p>
                </div>
              </div>
            </div>
            <Button className="bg-secondary hover:bg-secondary/90">
              <Download className="h-4 w-4 mr-2" />
              Télécharger Certificat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraceabilityModule;
