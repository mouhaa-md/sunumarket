import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  QrCode,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Shield,
  Award,
  History,
} from "lucide-react";

interface VerificationResult {
  card_id: string;
  member_name: string;
  member_type: string;
  date_emission: string;
  date_expiration: string;
  certification_status: string;
  is_active: boolean;
  transactions_count?: number;
}

interface VerificationLog {
  card_id: string;
  verified_at: string;
  result: "valid" | "invalid" | "expired";
}

export const MemberVerification = () => {
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);

  const handleVerification = async () => {
    if (!searchId.trim()) {
      toast({
        title: "ID requis",
        description: "Veuillez entrer un ID de carte membre",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setNotFound(false);
    setResult(null);

    const { data: cardData, error } = await supabase
      .from("member_cards")
      .select("*, profiles!inner(full_name)")
      .eq("card_id", searchId.trim().toUpperCase())
      .maybeSingle();

    if (error || !cardData) {
      setNotFound(true);
      addVerificationLog(searchId, "invalid");
    } else {
      const isExpired = new Date(cardData.date_expiration) < new Date();
      
      // Get transactions count
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .or(`buyer_id.eq.${cardData.user_id},seller_id.eq.${cardData.user_id}`);

      setResult({
        card_id: cardData.card_id,
        member_name: (cardData as any).profiles?.full_name || "Non renseigné",
        member_type: cardData.member_type,
        date_emission: cardData.date_emission,
        date_expiration: cardData.date_expiration,
        certification_status: cardData.certification_status,
        is_active: cardData.is_active && !isExpired,
        transactions_count: ordersCount || 0,
      });

      addVerificationLog(
        searchId,
        cardData.is_active && !isExpired ? "valid" : "expired"
      );
    }

    setIsSearching(false);
  };

  const addVerificationLog = (cardId: string, result: "valid" | "invalid" | "expired") => {
    setVerificationLogs([
      { card_id: cardId, verified_at: new Date().toISOString(), result },
      ...verificationLogs.slice(0, 9),
    ]);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-secondary" />
            Vérification des Cartes Membres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Entrez l'ID de la carte (ex: SM-2025-DKR-0001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerification()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleVerification} disabled={isSearching}>
              {isSearching ? "Recherche..." : "Vérifier"}
            </Button>
          </div>

          {/* Scan QR Code button (placeholder) */}
          <Button variant="outline" className="w-full gap-2">
            <QrCode className="h-4 w-4" />
            Scanner un QR Code
          </Button>

          {/* Not Found */}
          {notFound && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <XCircle className="h-12 w-12 mx-auto text-red-500 mb-3" />
              <h3 className="font-bold text-red-700 dark:text-red-400">Carte Non Trouvée</h3>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                Aucune carte membre correspondant à cet ID n'a été trouvée dans le système.
              </p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`border-2 rounded-lg p-6 ${
              result.is_active 
                ? "bg-green-50 dark:bg-green-900/20 border-green-500" 
                : "bg-red-50 dark:bg-red-900/20 border-red-500"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {result.is_active ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-500" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">
                      {result.is_active ? "Carte Valide" : "Carte Invalide/Expirée"}
                    </h3>
                    <p className="text-sm text-muted-foreground">ID: {result.card_id}</p>
                  </div>
                </div>
                <Badge className={result.is_active ? "bg-green-500" : "bg-red-500"}>
                  {result.is_active ? "ACTIF" : "INACTIF"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Membre</p>
                    <p className="font-medium">{result.member_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium">{getMemberTypeLabel(result.member_type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date d'émission</p>
                    <p className="font-medium">
                      {new Date(result.date_emission).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date d'expiration</p>
                    <p className="font-medium">
                      {new Date(result.date_expiration).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Certification:</span>
                  {getCertificationBadge(result.certification_status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {result.transactions_count} transactions
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-muted-foreground" />
            Historique des Vérifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verificationLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4 text-sm">
              Aucune vérification effectuée
            </p>
          ) : (
            <div className="space-y-2">
              {verificationLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{log.card_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.verified_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <Badge
                    variant={log.result === "valid" ? "default" : "destructive"}
                    className={log.result === "valid" ? "bg-green-500" : ""}
                  >
                    {log.result === "valid" ? "Valide" : log.result === "expired" ? "Expiré" : "Invalide"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
