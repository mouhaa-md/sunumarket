import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import {
  Globe,
  Package,
  FileText,
  CheckCircle,
  Truck,
  CreditCard,
  AlertCircle,
  Award,
  Download,
  ArrowRight,
  Edit,
  History,
  TrendingUp,
  FolderOpen,
} from "lucide-react";

const DESTINATION_COUNTRIES = [
  { value: "france", label: "France", flag: "🇫🇷" },
  { value: "usa", label: "États-Unis", flag: "🇺🇸" },
  { value: "cote_ivoire", label: "Côte d'Ivoire", flag: "🇨🇮" },
  { value: "mali", label: "Mali", flag: "🇲🇱" },
  { value: "canada", label: "Canada", flag: "🇨🇦" },
  { value: "belgique", label: "Belgique", flag: "🇧🇪" },
  { value: "suisse", label: "Suisse", flag: "🇨🇭" },
  { value: "allemagne", label: "Allemagne", flag: "🇩🇪" },
  { value: "maroc", label: "Maroc", flag: "🇲🇦" },
  { value: "espagne", label: "Espagne", flag: "🇪🇸" },
];

const TRANSPORTERS = [
  { value: "dhl", label: "DHL Express", price: 45000 },
  { value: "chronopost", label: "Chronopost", price: 35000 },
  { value: "fedex", label: "FedEx", price: 50000 },
  { value: "local", label: "Transporteur Local", price: 20000 },
];

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  is_certified: boolean;
}

interface ExportRequest {
  id: string;
  destination_country: string;
  status: string;
  step_current: number;
  created_at: string;
  total_amount: number;
}

export const ExportModule = ({ isCertified, onRequestCertification }: { isCertified: boolean; onRequestCertification?: () => void }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{id: string; quantity: number}[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([]);
  const [isNewExportOpen, setIsNewExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("nouvelle");
  
  // Form state
  const [destinationCountry, setDestinationCountry] = useState("");
  const [selectedTransporter, setSelectedTransporter] = useState("");
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  
  // Document editing state
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState({
    proforma: "",
    certificatOrigine: "",
    ficheTechnique: "",
    listeColisage: "",
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch certified products
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .eq("is_certified", true);

    if (productsData) setProducts(productsData as Product[]);

    // Fetch export history
    const { data: exportsData } = await supabase
      .from("export_requests")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (exportsData) setExportRequests(exportsData as ExportRequest[]);
  };

  const generateDocuments = () => {
    const selectedProductsInfo = products.filter(p => 
      selectedProducts.some(sp => sp.id === p.id)
    );
    const totalValue = selectedProducts.reduce((sum, sp) => {
      const product = products.find(p => p.id === sp.id);
      return sum + (product?.price || 0) * sp.quantity;
    }, 0);

    const country = DESTINATION_COUNTRIES.find(c => c.value === destinationCountry);

    setDocumentContent({
      proforma: `FACTURE PROFORMA
═══════════════════════════════════════

SUNUMARKET - Export International
Date: ${new Date().toLocaleDateString("fr-FR")}
Référence: PRO-${Date.now().toString(36).toUpperCase()}

DESTINATAIRE:
Pays: ${country?.label || destinationCountry}

PRODUITS:
${selectedProducts.map(sp => {
  const product = products.find(p => p.id === sp.id);
  return `- ${product?.name}: ${sp.quantity} unité(s) x ${product?.price?.toLocaleString()} FCFA`;
}).join('\n')}

TOTAL HT: ${totalValue.toLocaleString()} FCFA
TVA (18%): ${(totalValue * 0.18).toLocaleString()} FCFA
TOTAL TTC: ${(totalValue * 1.18).toLocaleString()} FCFA

Conditions: Paiement avant expédition
Validité: 30 jours

═══════════════════════════════════════`,

      certificatOrigine: `CERTIFICAT D'ORIGINE
═══════════════════════════════════════

RÉPUBLIQUE DU SÉNÉGAL
Ministère de l'Industrie et du Commerce

N° Certificat: CO-${Date.now().toString(36).toUpperCase()}
Date: ${new Date().toLocaleDateString("fr-FR")}

CERTIFIE QUE LES MARCHANDISES DÉCRITES CI-DESSOUS:

${selectedProducts.map(sp => {
  const product = products.find(p => p.id === sp.id);
  return `• ${product?.name} (${sp.quantity} unités)`;
}).join('\n')}

SONT D'ORIGINE SÉNÉGALAISE

Certification SunuMark: ✓ VÉRIFIÉ

Ce certificat est délivré conformément aux règles
d'origine en vigueur.

═══════════════════════════════════════`,

      ficheTechnique: `FICHE TECHNIQUE PRODUIT
═══════════════════════════════════════

${selectedProducts.map(sp => {
  const product = products.find(p => p.id === sp.id);
  return `
PRODUIT: ${product?.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Référence: ${product?.id?.slice(0, 8)}
Certification SunuMark: OUI
Origine: Sénégal
Quantité exportée: ${sp.quantity} unités

Conformité:
✓ Normes de qualité SunuMark
✓ Standards internationaux
✓ Traçabilité garantie
`;
}).join('\n')}

═══════════════════════════════════════`,

      listeColisage: `LISTE DE COLISAGE (PACKING LIST)
═══════════════════════════════════════

Exportateur: SunuMarket
Date: ${new Date().toLocaleDateString("fr-FR")}
Destination: ${country?.label}

DÉTAIL DES COLIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${selectedProducts.map((sp, idx) => {
  const product = products.find(p => p.id === sp.id);
  return `Colis ${idx + 1}: ${product?.name}
  - Quantité: ${sp.quantity}
  - Poids estimé: ${sp.quantity * 0.5} kg
  - Dimensions: Standard`;
}).join('\n\n')}

TOTAL COLIS: ${selectedProducts.length}
POIDS TOTAL: ${selectedProducts.reduce((sum, sp) => sum + sp.quantity * 0.5, 0)} kg

═══════════════════════════════════════`,
    });
  };

  const downloadDocument = (docType: keyof typeof documentContent, fileName: string) => {
    const doc = new jsPDF();
    const content = documentContent[docType];
    
    // Header
    doc.setFillColor(0, 100, 62);
    doc.rect(0, 0, 210, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SUNUMARKET - Export International", 105, 15, { align: "center" });

    // Content
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 15, 40);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Document généré par SunuMarket - Le Hub Numérique du Made in Senegal", 105, 285, { align: "center" });

    doc.save(`${fileName}.pdf`);
    toast({
      title: "Document téléchargé",
      description: `${fileName}.pdf a été téléchargé avec succès`,
    });
  };

  const toggleProductSelection = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, { id: productId, quantity: 1 }]);
    } else {
      setSelectedProducts(selectedProducts.filter(sp => sp.id !== productId));
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(selectedProducts.map(sp => 
      sp.id === productId ? { ...sp, quantity } : sp
    ));
  };

  const calculateTotalAmount = () => {
    const productsTotal = selectedProducts.reduce((sum, sp) => {
      const product = products.find(p => p.id === sp.id);
      return sum + (product?.price || 0) * sp.quantity;
    }, 0);
    const transporter = TRANSPORTERS.find(t => t.value === selectedTransporter);
    const shippingCost = transporter?.price || 0;
    const insuranceCost = includeInsurance ? productsTotal * 0.02 : 0;
    return productsTotal + shippingCost + insuranceCost;
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "pending";
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pays de destination *</Label>
        <Select value={destinationCountry} onValueChange={setDestinationCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir le pays" />
          </SelectTrigger>
          <SelectContent>
            {DESTINATION_COUNTRIES.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.flag} {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Sélectionner les produits certifiés</Label>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-sm p-4 bg-muted rounded-lg">
            Vous n'avez pas de produits certifiés SunuMark. Demandez la certification pour vos produits afin de pouvoir exporter.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedProducts.some(sp => sp.id === product.id)}
                    onCheckedChange={(checked) => toggleProductSelection(product.id, !!checked)}
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.price?.toLocaleString()} FCFA • Stock: {product.stock}
                    </p>
                  </div>
                </div>
                {selectedProducts.some(sp => sp.id === product.id) && (
                  <Input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={selectedProducts.find(sp => sp.id === product.id)?.quantity || 1}
                    onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Les documents suivants ont été générés automatiquement. Vous pouvez les modifier avant téléchargement.
      </p>

      {[
        { key: "proforma" as const, title: "Facture Proforma", icon: FileText },
        { key: "certificatOrigine" as const, title: "Certificat d'Origine", icon: Award },
        { key: "ficheTechnique" as const, title: "Fiche Technique Produit", icon: Package },
        { key: "listeColisage" as const, title: "Liste de Colisage", icon: Truck },
      ].map((doc) => (
        <div key={doc.key} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <doc.icon className="h-5 w-5 text-secondary" />
              <span className="font-medium">{doc.title}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingDocument(editingDocument === doc.key ? null : doc.key)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button
                size="sm"
                onClick={() => downloadDocument(doc.key, doc.title.toLowerCase().replace(/ /g, "-"))}
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
          {editingDocument === doc.key && (
            <Textarea
              value={documentContent[doc.key]}
              onChange={(e) => setDocumentContent({ ...documentContent, [doc.key]: e.target.value })}
              rows={10}
              className="mt-2 font-mono text-xs"
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Suivi de la validation par les autorités compétentes
      </p>

      {[
        { label: "Autorité Douanière", status: "en_cours", detail: "Transmission électronique" },
        { label: "Ministère du Commerce", status: "en_attente", detail: "Validation via portail agent" },
        { label: "Agence Nationale de Certification", status: "en_attente", detail: "Vérification standards" },
      ].map((authority, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">{authority.label}</p>
            <p className="text-sm text-muted-foreground">{authority.detail}</p>
          </div>
          <Badge
            variant={authority.status === "valide" ? "default" : "outline"}
            className={
              authority.status === "valide" ? "bg-green-500" :
              authority.status === "en_cours" ? "border-blue-500 text-blue-600" :
              "border-yellow-500 text-yellow-600"
            }
          >
            {authority.status === "valide" ? "✓ Validé" :
             authority.status === "en_cours" ? "En cours..." : "En attente"}
          </Badge>
        </div>
      ))}

      <div className="mt-4">
        <Label className="text-sm text-muted-foreground">Progression globale</Label>
        <Progress value={33} className="mt-2" />
        <p className="text-xs text-muted-foreground mt-1">1/3 étapes validées</p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Transporteur partenaire *</Label>
        <Select value={selectedTransporter} onValueChange={setSelectedTransporter}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir le transporteur" />
          </SelectTrigger>
          <SelectContent>
            {TRANSPORTERS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label} - {t.price.toLocaleString()} FCFA
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="insurance"
          checked={includeInsurance}
          onCheckedChange={(checked) => setIncludeInsurance(!!checked)}
        />
        <label
          htmlFor="insurance"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Assurance transport (2% de la valeur)
        </label>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Frais de transport:</span>
          <span>{TRANSPORTERS.find(t => t.value === selectedTransporter)?.price.toLocaleString() || 0} FCFA</span>
        </div>
        {includeInsurance && (
          <div className="flex justify-between text-sm">
            <span>Assurance:</span>
            <span>{(selectedProducts.reduce((sum, sp) => {
              const product = products.find(p => p.id === sp.id);
              return sum + (product?.price || 0) * sp.quantity;
            }, 0) * 0.02).toLocaleString()} FCFA</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Mode de paiement international *</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir le mode de paiement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="virement">Virement bancaire international</SelectItem>
            <SelectItem value="lettre_credit">Lettre de crédit</SelectItem>
            <SelectItem value="paypal">PayPal Business</SelectItem>
            <SelectItem value="western_union">Western Union</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-primary/10 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold">Récapitulatif de la commande export</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Produits ({selectedProducts.length}):</span>
            <span>{selectedProducts.reduce((sum, sp) => {
              const product = products.find(p => p.id === sp.id);
              return sum + (product?.price || 0) * sp.quantity;
            }, 0).toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span>Transport:</span>
            <span>{TRANSPORTERS.find(t => t.value === selectedTransporter)?.price.toLocaleString() || 0} FCFA</span>
          </div>
          {includeInsurance && (
            <div className="flex justify-between">
              <span>Assurance:</span>
              <span>{(selectedProducts.reduce((sum, sp) => {
                const product = products.find(p => p.id === sp.id);
                return sum + (product?.price || 0) * sp.quantity;
              }, 0) * 0.02).toLocaleString()} FCFA</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-bold">
            <span>TOTAL:</span>
            <span>{calculateTotalAmount().toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={() => {
        toast({
          title: "Demande d'export soumise !",
          description: "Votre demande est en cours de traitement. Vous recevrez une confirmation par email.",
        });
        setIsNewExportOpen(false);
        setCurrentStep(1);
        setSelectedProducts([]);
      }}>
        <CheckCircle className="h-4 w-4 mr-2" />
        Finaliser et soumettre
      </Button>
    </div>
  );

  if (!isCertified) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <AlertCircle className="h-16 w-16 mx-auto text-yellow-500" />
          <h3 className="text-xl font-bold">Certification SunuMark Requise</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Pour accéder au module d'exportation internationale, vous devez d'abord obtenir
            la certification SunuMark pour vos produits.
          </p>
          <Button className="mt-4" onClick={onRequestCertification}>
            <Award className="h-4 w-4 mr-2" />
            Demander la certification
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-secondary" />
            Export International
          </h2>
          <p className="text-muted-foreground">
            Démarches d'Exportation - Certification SunuMark Requise
          </p>
        </div>
        <Badge className="bg-green-500 text-lg px-4 py-2">
          <Award className="h-4 w-4 mr-1" />
          Certifié SunuMark ✅
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nouvelle">
            <Package className="h-4 w-4 mr-2" />
            Nouvelle Export
          </TabsTrigger>
          <TabsTrigger value="historique">
            <History className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="statistiques">
            <TrendingUp className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FolderOpen className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nouvelle" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Processus d'Export en 5 Étapes</CardTitle>
              <CardDescription>
                Suivez chaque étape pour exporter vos produits certifiés SunuMark
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[
                  { step: 1, label: "Sélection", icon: Package },
                  { step: 2, label: "Documents", icon: FileText },
                  { step: 3, label: "Validation", icon: CheckCircle },
                  { step: 4, label: "Logistique", icon: Truck },
                  { step: 5, label: "Paiement", icon: CreditCard },
                ].map((item, idx) => (
                  <div key={item.step} className="flex items-center">
                    <div
                      className={`flex flex-col items-center cursor-pointer transition-all ${
                        getStepStatus(item.step) === "completed" ? "text-green-500" :
                        getStepStatus(item.step) === "current" ? "text-primary" :
                        "text-muted-foreground"
                      }`}
                      onClick={() => item.step <= currentStep && setCurrentStep(item.step)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        getStepStatus(item.step) === "completed" ? "bg-green-500 border-green-500 text-white" :
                        getStepStatus(item.step) === "current" ? "bg-primary border-primary text-primary-foreground" :
                        "border-muted-foreground"
                      }`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs mt-1">{item.label}</span>
                    </div>
                    {idx < 4 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        currentStep > item.step ? "bg-green-500" : "bg-muted"
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="min-h-[300px]">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Précédent
                </Button>
                {currentStep < 5 && (
                  <Button
                    onClick={() => {
                      if (currentStep === 1) {
                        if (!destinationCountry || selectedProducts.length === 0) {
                          toast({
                            title: "Champs requis",
                            description: "Veuillez sélectionner un pays et au moins un produit",
                            variant: "destructive",
                          });
                          return;
                        }
                        generateDocuments();
                      }
                      setCurrentStep(currentStep + 1);
                    }}
                  >
                    Suivant
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Exportations</CardTitle>
            </CardHeader>
            <CardContent>
              {exportRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucune exportation enregistrée
                </p>
              ) : (
                <div className="space-y-3">
                  {exportRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">Export #{request.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {DESTINATION_COUNTRIES.find(c => c.value === request.destination_country)?.flag}{" "}
                          {DESTINATION_COUNTRIES.find(c => c.value === request.destination_country)?.label} •{" "}
                          {new Date(request.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge>{request.status}</Badge>
                        <p className="text-sm font-medium mt-1">{request.total_amount?.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Exports</p>
                    <p className="text-2xl font-bold">{exportRequests.length}</p>
                  </div>
                  <Globe className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenus Export</p>
                    <p className="text-2xl font-bold">
                      {exportRequests.reduce((sum, r) => sum + (r.total_amount || 0), 0).toLocaleString()} FCFA
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pays Desservis</p>
                    <p className="text-2xl font-bold">
                      {new Set(exportRequests.map(r => r.destination_country)).size}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents Archivés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Les documents de vos exports seront archivés ici
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
