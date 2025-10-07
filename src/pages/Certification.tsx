import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Upload, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

const Certification = () => {
  const [submitted, setSubmitted] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    region: "",
    description: "",
    ninea: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.category || !formData.region || !formData.ninea) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Generate unique QR code
    const uniqueId = `SM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setQrCode(uniqueId);
    setSubmitted(true);
    
    toast.success("Demande soumise avec succès !");
    
    // Scroll to confirmation
    setTimeout(() => {
      document.getElementById("confirmation")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <main className="pt-16">
          <div className="section-container">
            <div id="confirmation" className="max-w-2xl mx-auto animate-fade-in">
              <Card className="border-2 border-secondary/30">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">Demande enregistrée !</CardTitle>
                  <CardDescription className="text-base">
                    Merci ! Votre demande de certification SunuMark a bien été enregistrée.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Notre équipe vous contactera sous peu pour la suite du processus de certification.
                    </p>
                  </div>

                  <div className="bg-muted/30 p-4 md:p-6 rounded-lg">
                    <h3 className="text-sm md:text-base font-semibold text-center mb-3 md:mb-4">Votre QR Code SunuMark</h3>
                    <div className="flex justify-center mb-3 md:mb-4">
                      <QRCodeSVG
                        value={`https://sunumarket.sn/verify/${qrCode}`}
                        size={160}
                        level="H"
                        includeMargin
                        className="md:w-[200px] md:h-[200px]"
                      />
                    </div>
                    <p className="text-xs md:text-sm text-center text-muted-foreground break-all">
                      Code : <span className="font-mono font-bold">{qrCode}</span>
                    </p>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Activé après validation
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold">Prochaines étapes :</h4>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Vérification de votre dossier (2-3 jours ouvrables)</li>
                      <li>Inspection du produit (si nécessaire)</li>
                      <li>Validation et activation du certificat SunuMark</li>
                      <li>Réception de votre kit de certification</li>
                    </ol>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          productName: "",
                          category: "",
                          region: "",
                          description: "",
                          ninea: "",
                        });
                      }}
                    >
                      Nouvelle demande
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => window.location.href = "/"}
                    >
                      Retour à l'accueil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-8 md:py-16">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <ShieldCheck className="h-12 md:h-16 w-12 md:w-16 mx-auto mb-3 md:mb-4 text-secondary" />
              <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
                Certification SunuMark
              </h1>
              <p className="text-base md:text-xl opacity-90">
                Certifiez vos produits et gagnez la confiance
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="section-container">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary/20 animate-fade-in">
              <CardHeader>
                <CardTitle>Demande de certification</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous pour soumettre votre produit à la certification SunuMark
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Nom du produit *</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="Ex: Huile d'arachide pure"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="artisanat">Artisanat</SelectItem>
                        <SelectItem value="textile">Textile</SelectItem>
                        <SelectItem value="agroalimentaire">Agroalimentaire</SelectItem>
                        <SelectItem value="cosmetique">Cosmétique</SelectItem>
                        <SelectItem value="maroquinerie">Maroquinerie</SelectItem>
                        <SelectItem value="bijouterie">Bijouterie</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Région de production *</Label>
                    <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une région" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dakar">Dakar</SelectItem>
                        <SelectItem value="thies">Thiès</SelectItem>
                        <SelectItem value="kaolack">Kaolack</SelectItem>
                        <SelectItem value="saint-louis">Saint-Louis</SelectItem>
                        <SelectItem value="casamance">Casamance</SelectItem>
                        <SelectItem value="fatick">Fatick</SelectItem>
                        <SelectItem value="tambacounda">Tambacounda</SelectItem>
                        <SelectItem value="kedougou">Kédougou</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description du produit</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Décrivez votre produit, son processus de fabrication..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ninea">Numéro NINEA ou identification *</Label>
                    <Input
                      id="ninea"
                      value={formData.ninea}
                      onChange={(e) => setFormData({ ...formData, ninea: e.target.value })}
                      placeholder="Ex: 123456789"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photos">Photos du produit</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-secondary/50 transition-colors cursor-pointer">
                      <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Cliquez pour télécharger ou glissez vos images ici
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG ou WEBP (max. 5MB)
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Soumettre ma demande
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    * Champs obligatoires
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Certification;
