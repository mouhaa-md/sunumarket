import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, CheckCircle2, TrendingUp, Award, Handshake, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Reseau = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    profileType: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.profileType || !formData.email || !formData.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setSubmitted(true);
    toast.success("Inscription réussie !");
    
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
                  <CardTitle className="text-2xl md:text-3xl">Bienvenue dans le réseau SunuMarket !</CardTitle>
                  <CardDescription className="text-base">
                    Vous serez contacté très bientôt pour la prochaine étape.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Notre équipe va étudier votre profil et vous contacter sous 48h pour vous accompagner dans votre intégration au réseau.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <Card className="border-2 border-primary/20">
                      <CardContent className="p-3 md:p-4 text-center">
                        <Mail className="h-6 md:h-8 w-6 md:w-8 mx-auto mb-1.5 md:mb-2 text-primary" />
                        <h4 className="font-semibold text-xs md:text-sm mb-1">Email</h4>
                        <a href="mailto:mmdiagne@ept.sn" className="text-xs text-secondary hover:underline break-all">
                          mmdiagne@ept.sn
                        </a>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-primary/20">
                      <CardContent className="p-3 md:p-4 text-center">
                        <MessageCircle className="h-6 md:h-8 w-6 md:w-8 mx-auto mb-1.5 md:mb-2 text-primary" />
                        <h4 className="font-semibold text-xs md:text-sm mb-1">WhatsApp</h4>
                        <a 
                          href="https://wa.me/221771234567" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-secondary hover:underline"
                        >
                          +221 77 123 45 67
                        </a>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold">Ce qui vous attend :</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Entretien personnalisé avec notre équipe</li>
                      <li>Accès à la plateforme et formation</li>
                      <li>Intégration dans notre réseau de partenaires</li>
                      <li>Opportunités de collaboration et de croissance</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: "",
                          profileType: "",
                          email: "",
                          phone: "",
                          message: "",
                        });
                      }}
                    >
                      Nouvelle inscription
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
              <Users className="h-12 md:h-16 w-12 md:w-16 mx-auto mb-3 md:mb-4 text-secondary" />
              <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
                Rejoindre le Réseau
              </h1>
              <p className="text-base md:text-xl opacity-90">
                Connectez-vous avec les acteurs du Made in Senegal
              </p>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="section-container py-6 md:py-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Pourquoi rejoindre SunuMarket ?</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Intégrez un écosystème dynamique qui valorise l'excellence locale
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16">
            <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="h-12 md:h-14 w-12 md:w-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <TrendingUp className="h-6 md:h-7 w-6 md:w-7 text-secondary" />
                </div>
                <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-3">Visibilité accrue</h3>
                <p className="text-xs md:text-base text-muted-foreground">
                  Exposez vos produits à un large public via notre marketplace
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="h-12 md:h-14 w-12 md:w-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Award className="h-6 md:h-7 w-6 md:w-7 text-secondary" />
                </div>
                <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-3">Certification</h3>
                <p className="text-xs md:text-base text-muted-foreground">
                  Obtenez la certification SunuMark et gagnez la confiance
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="h-12 md:h-14 w-12 md:w-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Handshake className="h-6 md:h-7 w-6 md:w-7 text-secondary" />
                </div>
                <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-3">Opportunités</h3>
                <p className="text-xs md:text-base text-muted-foreground">
                  Accédez à un réseau de partenaires et opportunités de collaboration
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary/20 animate-fade-in">
              <CardHeader>
                <CardTitle>Formulaire d'inscription</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour rejoindre notre réseau
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ex: Amadou Diallo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profileType">Type de profil *</Label>
                    <Select value={formData.profileType} onValueChange={(value) => setFormData({ ...formData, profileType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre profil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="producteur">Producteur</SelectItem>
                        <SelectItem value="artisan">Artisan</SelectItem>
                        <SelectItem value="pme">PME</SelectItem>
                        <SelectItem value="institution">Institution</SelectItem>
                        <SelectItem value="partenaire">Partenaire</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="exemple@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="77 123 45 67"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message ou motivation</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Parlez-nous de votre projet et de vos motivations..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                    <Users className="mr-2 h-5 w-5" />
                    Rejoindre le réseau
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

export default Reseau;
