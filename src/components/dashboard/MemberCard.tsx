import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import {
  CreditCard,
  Download,
  Smartphone,
  Printer,
  Award,
  Calendar,
  User,
  Shield,
} from "lucide-react";

interface MemberCardData {
  id: string;
  card_id: string;
  user_id: string;
  date_emission: string;
  date_expiration: string;
  member_type: string;
  certification_status: string;
  is_active: boolean;
}

export const MemberCard = () => {
  const { user, profile, userRole } = useAuth();
  const [cardData, setCardData] = useState<MemberCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrCreateCard();
    }
  }, [user]);

  const fetchOrCreateCard = async () => {
    if (!user) return;
    setIsLoading(true);

    const { data: existingCard, error: fetchError } = await supabase
      .from("member_cards")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingCard) {
      setCardData(existingCard as MemberCardData);
    } else {
      // Generate new card
      await generateNewCard();
    }
    setIsLoading(false);
  };

  const generateNewCard = async () => {
    if (!user) return;
    setIsGenerating(true);

    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const cardId = `SM-${year}-DKR-${randomNum}`;
    const qrHash = btoa(`${user.id}-${cardId}-${Date.now()}`);

    const { data, error } = await supabase
      .from("member_cards")
      .insert({
        user_id: user.id,
        card_id: cardId,
        qr_code_hash: qrHash,
        member_type: userRole || "acheteur",
        certification_status: "en_attente",
      } as any)
      .select()
      .single();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer la carte membre",
        variant: "destructive",
      });
    } else {
      setCardData(data as MemberCardData);
      toast({
        title: "Carte générée !",
        description: "Votre carte de membre SunuMarket a été créée avec succès.",
      });
    }
    setIsGenerating(false);
  };

  const downloadPDF = () => {
    if (!cardData || !profile) return;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [85.6, 54],
    });

    // Background
    doc.setFillColor(0, 100, 62); // Green
    doc.rect(0, 0, 85.6, 54, "F");
    
    // Yellow stripe
    doc.setFillColor(255, 205, 0);
    doc.rect(0, 18, 85.6, 3, "F");
    
    // Red stripe
    doc.setFillColor(230, 57, 70);
    doc.rect(0, 21, 85.6, 3, "F");

    // Header
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(3, 3, 79.6, 12, 2, 2, "F");
    doc.setTextColor(0, 100, 62);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("SUNUMARKET", 42.8, 7, { align: "center" });
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    doc.text("Le Hub Numérique du Made in Senegal", 42.8, 11, { align: "center" });

    // Card content area
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(3, 26, 79.6, 25, 2, 2, "F");

    // Member info
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(profile.full_name?.toUpperCase() || "MEMBRE", 7, 32);
    
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    
    const memberTypeLabel = 
      cardData.member_type === "vendeur" ? "Vendeur / Artisan" :
      cardData.member_type === "agent" ? "Agent du Ministère" : "Acheteur";
    doc.text(memberTypeLabel, 7, 36);
    
    doc.text(`ID: ${cardData.card_id}`, 7, 40);
    doc.text(`Émis le: ${new Date(cardData.date_emission).toLocaleDateString("fr-FR")}`, 7, 44);
    doc.text(`Valide jusqu'au: ${new Date(cardData.date_expiration).toLocaleDateString("fr-FR")}`, 7, 48);

    // Certification badge
    if (cardData.certification_status === "certifie") {
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(50, 30, 30, 8, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(5);
      doc.setFont("helvetica", "bold");
      doc.text("CERTIFIÉ SUNUMARK", 65, 35, { align: "center" });
    }

    // Download
    doc.save(`carte-membre-${cardData.card_id}.pdf`);
    toast({
      title: "Téléchargement réussi",
      description: "Votre carte membre a été téléchargée en PDF",
    });
  };

  const getMemberTypeLabel = (type: string) => {
    switch (type) {
      case "vendeur": return "Vendeur / Artisan";
      case "agent": return "Agent du Ministère";
      default: return "Acheteur";
    }
  };

  const getCertificationBadge = (status: string) => {
    switch (status) {
      case "certifie":
        return <Badge className="bg-green-500">Certifié SunuMark ✅</Badge>;
      case "en_attente":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">En attente</Badge>;
      default:
        return <Badge variant="secondary">Non éligible</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Chargement de votre carte...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-secondary" />
          Ma Carte Membre SunuMarket
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Digital Card Preview */}
        <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80">
          {/* Senegal flag stripes */}
          <div className="absolute top-1/3 left-0 right-0 h-2 bg-secondary" />
          <div className="absolute top-1/3 translate-y-2 left-0 right-0 h-2 bg-accent" />
          
          {/* Header */}
          <div className="absolute top-3 left-4 right-4">
            <div className="bg-white/95 rounded-lg px-3 py-2">
              <h3 className="text-primary font-bold text-sm">SUNUMARKET</h3>
              <p className="text-[10px] text-muted-foreground">Le Hub Numérique du Made in Senegal</p>
            </div>
          </div>

          {/* Content */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="bg-white/95 rounded-lg p-3 flex gap-4">
              <div className="flex-1 space-y-1">
                <p className="font-bold text-sm text-foreground">
                  {profile?.full_name?.toUpperCase() || "MEMBRE"}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {getMemberTypeLabel(cardData?.member_type || "acheteur")}
                </p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  ID: {cardData?.card_id}
                </p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Valide jusqu'au: {cardData && new Date(cardData.date_expiration).toLocaleDateString("fr-FR")}
                </p>
                <div className="pt-1">
                  {getCertificationBadge(cardData?.certification_status || "non_eligible")}
                </div>
              </div>
              
              {/* QR Code */}
              <div className="bg-white p-1.5 rounded">
                <QRCodeSVG 
                  value={`https://sunumarket.shop/verification?id=${cardData?.card_id}`}
                  size={60}
                  level="M"
                />
              </div>
            </div>
          </div>

          {/* Star decoration */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
            <Award className="h-20 w-20 text-secondary" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={downloadPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Télécharger PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => {
            toast({
              title: "Affichage mobile",
              description: "Utilisez cette carte depuis votre téléphone pour les vérifications",
            });
          }}>
            <Smartphone className="h-4 w-4" />
            Version Mobile
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
        </div>

        {/* Info */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
          <p className="font-medium">À propos de votre carte membre</p>
          <ul className="text-muted-foreground space-y-1 text-xs">
            <li>• Cette carte vous identifie officiellement dans l'écosystème SunuMarket</li>
            <li>• Le QR Code peut être scanné pour vérifier votre statut</li>
            <li>• Présentez cette carte pour vos démarches administratives</li>
            <li>• Carte valide pendant 2 ans à partir de la date d'émission</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
