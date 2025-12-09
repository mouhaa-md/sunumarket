import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileDown,
  Users,
  Package,
  ShoppingCart,
  Award,
  MapPin,
  Calendar,
  FileSpreadsheet,
  FileText,
  Loader2,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface AgentExportModuleProps {
  allSellers: any[];
  allProducts: any[];
  allOrders: any[];
  processedCertifications: any[];
}

const SENEGAL_REGIONS = [
  { value: "all", label: "Toutes les régions" },
  { value: "dakar", label: "Dakar" },
  { value: "thies", label: "Thiès" },
  { value: "saint_louis", label: "Saint-Louis" },
  { value: "diourbel", label: "Diourbel" },
  { value: "louga", label: "Louga" },
  { value: "fatick", label: "Fatick" },
  { value: "kaolack", label: "Kaolack" },
  { value: "kolda", label: "Kolda" },
  { value: "ziguinchor", label: "Ziguinchor" },
  { value: "tambacounda", label: "Tambacounda" },
  { value: "matam", label: "Matam" },
  { value: "kaffrine", label: "Kaffrine" },
  { value: "kedougou", label: "Kédougou" },
  { value: "sedhiou", label: "Sédhiou" },
];

const MONTHS = [
  { value: "all", label: "Tous les mois" },
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

export const AgentExportModule = ({
  allSellers,
  allProducts,
  allOrders,
  processedCertifications,
}: AgentExportModuleProps) => {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<{ type: string; date: Date }[]>([]);

  const getRegionLabel = (value: string) => {
    return SENEGAL_REGIONS.find((r) => r.value === value)?.label || value;
  };

  const filterByRegion = (data: any[], regionField: string = "region") => {
    if (selectedRegion === "all") return data;
    return data.filter((item) => item[regionField] === selectedRegion);
  };

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(";"),
      ...data.map((row) =>
        headers.map((h) => {
          const key = h.toLowerCase().replace(/ /g, "_").replace(/é/g, "e").replace(/è/g, "e");
          const value = row[key] ?? row[h] ?? "";
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(";")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleExportSellers = async () => {
    setIsExporting("sellers");
    try {
      const filteredSellers = filterByRegion(allSellers);
      const exportData = filteredSellers.map((s) => ({
        Entreprise: s.business_name,
        Type: s.business_type?.replace("_", " "),
        Region: getRegionLabel(s.region),
        Secteur: s.activity_sector,
        NINEA: s.ninea || "Non renseigné",
        Employes: s.employees_count || 1,
        Certifie: s.is_certified ? "Oui" : "Non",
        Statut: s.validation_status,
        Date_inscription: new Date(s.created_at).toLocaleDateString("fr-FR"),
      }));

      exportToCSV(
        exportData,
        `vendeurs_${selectedRegion}`,
        ["Entreprise", "Type", "Region", "Secteur", "NINEA", "Employes", "Certifie", "Statut", "Date_inscription"]
      );

      setExportHistory((prev) => [{ type: "Vendeurs", date: new Date() }, ...prev.slice(0, 9)]);
      toast({ title: "Export réussi", description: `${filteredSellers.length} vendeurs exportés` });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de l'export", variant: "destructive" });
    }
    setIsExporting(null);
  };

  const handleExportProducts = async () => {
    setIsExporting("products");
    try {
      const filteredProducts = filterByRegion(allProducts, "origin_region");
      const exportData = filteredProducts.map((p) => ({
        Nom: p.name,
        Categorie: p.category,
        Prix: p.price,
        Stock: p.stock || 0,
        Region: getRegionLabel(p.origin_region),
        Certifie: p.is_certified ? "Oui" : "Non",
        Actif: p.is_active ? "Oui" : "Non",
        Date_creation: new Date(p.created_at).toLocaleDateString("fr-FR"),
      }));

      exportToCSV(
        exportData,
        `produits_${selectedRegion}`,
        ["Nom", "Categorie", "Prix", "Stock", "Region", "Certifie", "Actif", "Date_creation"]
      );

      setExportHistory((prev) => [{ type: "Produits", date: new Date() }, ...prev.slice(0, 9)]);
      toast({ title: "Export réussi", description: `${filteredProducts.length} produits exportés` });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de l'export", variant: "destructive" });
    }
    setIsExporting(null);
  };

  const handleExportCertifications = async () => {
    setIsExporting("certifications");
    try {
      const exportData = processedCertifications.map((c) => ({
        Entreprise: c.seller_details?.business_name || "N/A",
        Region: getRegionLabel(c.seller_details?.region),
        Statut: c.status === "approuvee" ? "Approuvée" : "Refusée",
        Motif_refus: c.rejection_reason || "",
        Date_demande: new Date(c.created_at).toLocaleDateString("fr-FR"),
        Date_traitement: c.review_date ? new Date(c.review_date).toLocaleDateString("fr-FR") : "",
      }));

      exportToCSV(
        exportData,
        "certifications",
        ["Entreprise", "Region", "Statut", "Motif_refus", "Date_demande", "Date_traitement"]
      );

      setExportHistory((prev) => [{ type: "Certifications", date: new Date() }, ...prev.slice(0, 9)]);
      toast({ title: "Export réussi", description: `${processedCertifications.length} certifications exportées` });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de l'export", variant: "destructive" });
    }
    setIsExporting(null);
  };

  const handleExportOrders = async () => {
    setIsExporting("orders");
    try {
      const exportData = allOrders.map((o) => ({
        Commande: o.id.slice(0, 8),
        Montant: o.total_amount,
        Quantite: o.quantity,
        Statut: o.status,
        Mode_paiement: o.payment_method || "Non spécifié",
        Ville_livraison: o.delivery_city || "Non spécifiée",
        Date: new Date(o.created_at).toLocaleDateString("fr-FR"),
      }));

      exportToCSV(
        exportData,
        "commandes",
        ["Commande", "Montant", "Quantite", "Statut", "Mode_paiement", "Ville_livraison", "Date"]
      );

      setExportHistory((prev) => [{ type: "Commandes", date: new Date() }, ...prev.slice(0, 9)]);
      toast({ title: "Export réussi", description: `${allOrders.length} commandes exportées` });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de l'export", variant: "destructive" });
    }
    setIsExporting(null);
  };

  const handleExportPDFReport = async () => {
    setIsExporting("pdf");
    try {
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString("fr-FR");
      const regionLabel = selectedRegion === "all" ? "National" : getRegionLabel(selectedRegion);

      // Header
      doc.setFillColor(0, 100, 0);
      doc.rect(0, 0, 210, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("RAPPORT SUNUMARKET", 105, 18, { align: "center" });
      doc.setFontSize(12);
      doc.text(`Ministère de l'Industrie et du Commerce - ${regionLabel}`, 105, 28, { align: "center" });
      doc.text(`Date: ${today}`, 105, 35, { align: "center" });

      doc.setTextColor(0, 0, 0);
      let yPos = 55;

      // Stats générales
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Statistiques Générales", 20, yPos);
      yPos += 10;

      const filteredSellers = filterByRegion(allSellers);
      const filteredProducts = filterByRegion(allProducts, "origin_region");
      const certifiedSellers = filteredSellers.filter((s) => s.is_certified).length;
      const totalEmployees = filteredSellers.reduce((sum, s) => sum + (s.employees_count || 1), 0);
      const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const stats = [
        `• Nombre total de vendeurs: ${filteredSellers.length}`,
        `• Vendeurs certifiés SunuMark: ${certifiedSellers}`,
        `• Taux de certification: ${filteredSellers.length > 0 ? ((certifiedSellers / filteredSellers.length) * 100).toFixed(1) : 0}%`,
        `• Emplois créés: ${totalEmployees}`,
        `• Produits référencés: ${filteredProducts.length}`,
        `• Volume total des commandes: ${totalRevenue.toLocaleString()} FCFA`,
      ];

      stats.forEach((stat) => {
        doc.text(stat, 25, yPos);
        yPos += 8;
      });

      yPos += 10;

      // Répartition par région
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Répartition par Région", 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      SENEGAL_REGIONS.filter((r) => r.value !== "all").forEach((region) => {
        const count = allSellers.filter((s) => s.region === region.value).length;
        const employees = allSellers
          .filter((s) => s.region === region.value)
          .reduce((sum, s) => sum + (s.employees_count || 1), 0);
        if (count > 0) {
          doc.text(`${region.label}: ${count} vendeur(s), ${employees} emploi(s)`, 25, yPos);
          yPos += 6;
        }
      });

      yPos += 10;

      // Certifications récentes
      if (processedCertifications.length > 0) {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Certifications Récentes", 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        processedCertifications.slice(0, 5).forEach((cert) => {
          const status = cert.status === "approuvee" ? "✓ Approuvée" : "✗ Refusée";
          doc.text(
            `${cert.seller_details?.business_name || "N/A"} - ${status}`,
            25,
            yPos
          );
          yPos += 6;
        });
      }

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Document généré automatiquement par SunuMarket - Vision Sénégal 2050", 105, 285, {
        align: "center",
      });

      doc.save(`rapport_sunumarket_${regionLabel.toLowerCase()}_${today.replace(/\//g, "-")}.pdf`);

      setExportHistory((prev) => [{ type: "Rapport PDF", date: new Date() }, ...prev.slice(0, 9)]);
      toast({ title: "Rapport généré", description: "Le rapport PDF a été téléchargé" });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la génération du rapport", variant: "destructive" });
    }
    setIsExporting(null);
  };

  const handleExportRegionalStats = async () => {
    setIsExporting("regional");
    try {
      const exportData = SENEGAL_REGIONS.filter((r) => r.value !== "all").map((region) => {
        const regionSellers = allSellers.filter((s) => s.region === region.value);
        const regionProducts = allProducts.filter((p) => p.origin_region === region.value);
        return {
          Region: region.label,
          Vendeurs: regionSellers.length,
          Vendeurs_certifies: regionSellers.filter((s) => s.is_certified).length,
          Emplois: regionSellers.reduce((sum, s) => sum + (s.employees_count || 1), 0),
          Produits: regionProducts.length,
          Produits_certifies: regionProducts.filter((p) => p.is_certified).length,
        };
      });

      exportToCSV(
        exportData,
        "statistiques_regionales",
        ["Region", "Vendeurs", "Vendeurs_certifies", "Emplois", "Produits", "Produits_certifies"]
      );

      setExportHistory((prev) => [{ type: "Stats régionales", date: new Date() }, ...prev.slice(0, 9)]);
      toast({ title: "Export réussi", description: "Statistiques régionales exportées" });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de l'export", variant: "destructive" });
    }
    setIsExporting(null);
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-secondary" />
            Export de données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Filtrer par région
              </Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SENEGAL_REGIONS.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Période (optionnel)
              </Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:border-secondary hover:bg-secondary/5"
              onClick={handleExportSellers}
              disabled={isExporting !== null}
            >
              {isExporting === "sellers" ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Users className="h-6 w-6 text-blue-500" />
              )}
              <span className="font-medium">Vendeurs</span>
              <span className="text-xs text-muted-foreground">
                {filterByRegion(allSellers).length} enregistrement(s)
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:border-secondary hover:bg-secondary/5"
              onClick={handleExportProducts}
              disabled={isExporting !== null}
            >
              {isExporting === "products" ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Package className="h-6 w-6 text-green-500" />
              )}
              <span className="font-medium">Produits</span>
              <span className="text-xs text-muted-foreground">
                {filterByRegion(allProducts, "origin_region").length} enregistrement(s)
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:border-secondary hover:bg-secondary/5"
              onClick={handleExportCertifications}
              disabled={isExporting !== null}
            >
              {isExporting === "certifications" ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Award className="h-6 w-6 text-yellow-500" />
              )}
              <span className="font-medium">Certifications</span>
              <span className="text-xs text-muted-foreground">
                {processedCertifications.length} enregistrement(s)
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:border-secondary hover:bg-secondary/5"
              onClick={handleExportOrders}
              disabled={isExporting !== null}
            >
              {isExporting === "orders" ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ShoppingCart className="h-6 w-6 text-purple-500" />
              )}
              <span className="font-medium">Commandes</span>
              <span className="text-xs text-muted-foreground">
                {allOrders.length} enregistrement(s)
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:border-secondary hover:bg-secondary/5"
              onClick={handleExportRegionalStats}
              disabled={isExporting !== null}
            >
              {isExporting === "regional" ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <TrendingUp className="h-6 w-6 text-orange-500" />
              )}
              <span className="font-medium">Stats régionales</span>
              <span className="text-xs text-muted-foreground">14 régions</span>
            </Button>

            <Button
              className="h-24 flex-col gap-2 bg-primary hover:bg-primary/90"
              onClick={handleExportPDFReport}
              disabled={isExporting !== null}
            >
              {isExporting === "pdf" ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <FileText className="h-6 w-6" />
              )}
              <span className="font-medium">Rapport PDF complet</span>
              <span className="text-xs opacity-80">Document officiel</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historique des exports */}
      {exportHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Historique des exports récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {exportHistory.map((exp, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {exp.type} - {exp.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Les fichiers CSV sont compatibles avec Excel, Google Sheets et autres tableurs.
            Le rapport PDF inclut un résumé complet des statistiques de la plateforme.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentExportModule;
