import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  CheckCircle,
  Award,
  BarChart3,
  AlertTriangle,
  FileDown,
  Shield,
  Users,
  Package,
  MapPin,
  XCircle,
  Eye,
  CreditCard,
  QrCode,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MemberCard } from "@/components/dashboard/MemberCard";
import { MemberVerification } from "@/components/dashboard/MemberVerification";
import TraceabilityModule from "@/components/dashboard/TraceabilityModule";

const SENEGAL_REGIONS = [
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

const AgentDashboard = () => {
  const { profile, user } = useAuth();
  const [agentDetails, setAgentDetails] = useState<any>(null);
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [pendingCertifications, setPendingCertifications] = useState<any[]>([]);
  const [allSellers, setAllSellers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("accueil");
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [selectedCertification, setSelectedCertification] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [certRejectionReason, setCertRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isCertRejectDialogOpen, setIsCertRejectDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch agent details
    const { data: detailsData } = await supabase
      .from("agent_details")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (detailsData) setAgentDetails(detailsData);

    // Fetch pending sellers
    const { data: sellersData } = await supabase
      .from("seller_details")
      .select("*, profiles!inner(full_name, email, phone)")
      .eq("validation_status", "en_attente");
    
    if (sellersData) setPendingSellers(sellersData);

    // Fetch all sellers for stats
    const { data: allSellersData } = await supabase
      .from("seller_details")
      .select("*");
    
    if (allSellersData) setAllSellers(allSellersData);

    // Fetch pending certifications with seller info
    const { data: certData } = await supabase
      .from("certifications")
      .select("*")
      .eq("status", "en_attente");
    
    if (certData) {
      // Fetch seller details for each certification
      const enrichedCerts = await Promise.all(certData.map(async (cert) => {
        const { data: sellerData } = await supabase
          .from("seller_details")
          .select("id, business_name, user_id, region")
          .eq("user_id", cert.seller_id)
          .maybeSingle();
        
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("user_id", cert.seller_id)
          .maybeSingle();
        
        return {
          ...cert,
          seller_details: sellerData,
          profiles: profileData,
        };
      }));
      setPendingCertifications(enrichedCerts);
    }

    // Fetch all orders for stats
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*");
    
    if (ordersData) setAllOrders(ordersData);

    // Fetch all products for stats
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true);
    
    if (productsData) setAllProducts(productsData);
  };

  const handleValidateSeller = async (sellerId: string, userId: string) => {
    const { error } = await supabase
      .from("seller_details")
      .update({
        validation_status: "valide",
        validated_by: user?.id,
        validation_date: new Date().toISOString(),
      } as any)
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de valider le vendeur",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Vendeur validé",
      description: "Le vendeur a été approuvé avec succès",
    });
    fetchData();
  };

  const handleRejectSeller = async () => {
    if (!selectedSeller || !rejectionReason) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer le motif du refus",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("seller_details")
      .update({
        validation_status: "refuse",
        validated_by: user?.id,
        validation_date: new Date().toISOString(),
        rejection_reason: rejectionReason,
      } as any)
      .eq("user_id", selectedSeller.user_id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de refuser le vendeur",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Vendeur refusé",
      description: "Le vendeur a été refusé",
    });
    setIsRejectDialogOpen(false);
    setSelectedSeller(null);
    setRejectionReason("");
    fetchData();
  };

  const handleApproveCertification = async (certification: any) => {
    const sellerUserId = certification.seller_id; // This is now the user_id (auth.uid())
    const sellerDetailsId = certification.seller_details?.id;

    // 1. Update certification status
    const { error: certError } = await supabase
      .from("certifications")
      .update({
        status: "approuvee",
        reviewed_by: user?.id,
        review_date: new Date().toISOString(),
      } as any)
      .eq("id", certification.id);

    if (certError) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la certification",
        variant: "destructive",
      });
      return;
    }

    // 2. Update seller to certified
    if (sellerDetailsId) {
      await supabase
        .from("seller_details")
        .update({ is_certified: true } as any)
        .eq("id", sellerDetailsId);
    }

    // 3. Update all seller's products to certified
    await supabase
      .from("products")
      .update({ is_certified: true } as any)
      .eq("seller_id", sellerUserId);

    // 4. Update member card certification status
    await supabase
      .from("member_cards")
      .update({ certification_status: "certifie" } as any)
      .eq("user_id", sellerUserId);

    toast({
      title: "Certification approuvée !",
      description: "Le vendeur et tous ses produits sont maintenant certifiés SunuMark",
    });
    fetchData();
  };

  const handleRejectCertification = async () => {
    if (!selectedCertification || !certRejectionReason) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer le motif du refus",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("certifications")
      .update({
        status: "rejetee",
        reviewed_by: user?.id,
        review_date: new Date().toISOString(),
        rejection_reason: certRejectionReason,
      } as any)
      .eq("id", selectedCertification.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la certification",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Certification refusée",
      description: "Le vendeur a été notifié du refus",
    });
    setIsCertRejectDialogOpen(false);
    setSelectedCertification(null);
    setCertRejectionReason("");
    fetchData();
  };

  // Calculate stats
  const sellersByRegion = SENEGAL_REGIONS.map(region => ({
    ...region,
    count: allSellers.filter(s => s.region === region.value).length,
  })).sort((a, b) => b.count - a.count);

  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const validatedSellers = allSellers.filter(s => s.validation_status === "valide").length;

  const menuItems = [
    { id: "accueil", label: "Accueil Ministère", icon: Building2 },
    { id: "validation", label: "Validation vendeurs", icon: CheckCircle },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "traceability", label: "Traçabilité Nationale", icon: MapPin },
    { id: "verification", label: "Vérification Cartes", icon: QrCode },
    { id: "member-card", label: "Ma Carte Membre", icon: CreditCard },
    { id: "statistiques", label: "Statistiques nationales", icon: BarChart3 },
    { id: "signalements", label: "Signalements", icon: AlertTriangle },
    { id: "export", label: "Export données", icon: FileDown },
    { id: "admin", label: "Administration", icon: Shield },
  ];

  // Global stats for traceability module
  const globalStats = {
    totalSellers: allSellers.length,
    certifiedSellers: allSellers.filter(s => s.is_certified).length,
    totalProducts: allProducts.length,
    totalRevenue,
    sellersByRegion: sellersByRegion.map(r => ({
      id: r.value,
      name: r.label,
      count: r.count
    }))
  };

  const getRegionLabel = (value: string) => {
    return SENEGAL_REGIONS.find(r => r.value === value)?.label || value;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8 bg-primary text-primary-foreground p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">
                  Portail Ministère du Commerce et de l'Industrie
                </h1>
                <p className="text-primary-foreground/80">Vision 2050 - Made in Senegal</p>
              </div>
            </div>
            {agentDetails && (
              <p className="text-sm text-primary-foreground/70 mt-2">
                Agent: {profile?.full_name} • Matricule: {agentDetails.matricule} • {agentDetails.direction}
              </p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          activeTab === item.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.label}</span>
                        {item.id === "validation" && pendingSellers.length > 0 && (
                          <Badge className="ml-auto bg-red-500">{pendingSellers.length}</Badge>
                        )}
                        {item.id === "certifications" && pendingCertifications.length > 0 && (
                          <Badge className="ml-auto bg-orange-500">{pendingCertifications.length}</Badge>
                        )}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {activeTab === "accueil" && (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Vendeurs validés</p>
                            <p className="text-2xl font-bold">{validatedSellers}</p>
                          </div>
                          <Users className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">En attente</p>
                            <p className="text-2xl font-bold">{pendingSellers.length}</p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Certifications</p>
                            <p className="text-2xl font-bold">{pendingCertifications.length}</p>
                          </div>
                          <Award className="h-8 w-8 text-secondary" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Volume total</p>
                            <p className="text-2xl font-bold">{(totalRevenue / 1000000).toFixed(1)}M</p>
                          </div>
                          <Package className="h-8 w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Regional Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-secondary" />
                        Répartition par région
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {sellersByRegion.map((region) => (
                          <div
                            key={region.value}
                            className="p-3 border rounded-lg text-center"
                          >
                            <p className="font-medium">{region.label}</p>
                            <p className="text-2xl font-bold text-secondary">{region.count}</p>
                            <p className="text-xs text-muted-foreground">vendeurs</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeTab === "validation" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      Validation des vendeurs
                      {pendingSellers.length > 0 && (
                        <Badge className="ml-2">{pendingSellers.length} en attente</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingSellers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Aucune demande de validation en attente
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {pendingSellers.map((seller) => (
                          <div
                            key={seller.id}
                            className="p-4 border rounded-lg space-y-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold">{seller.business_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {(seller as any).profiles?.full_name} • {(seller as any).profiles?.email}
                                </p>
                              </div>
                              <Badge variant="outline">En attente</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Type:</span>{" "}
                                <span className="capitalize">{seller.business_type?.replace("_", " ")}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Région:</span>{" "}
                                {getRegionLabel(seller.region)}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Secteur:</span>{" "}
                                <span className="capitalize">{seller.activity_sector}</span>
                              </div>
                              {seller.ninea && (
                                <div>
                                  <span className="text-muted-foreground">NINEA:</span>{" "}
                                  {seller.ninea}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 pt-2 border-t">
                              <Button
                                size="sm"
                                onClick={() => handleValidateSeller(seller.id, seller.user_id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Valider
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedSeller(seller);
                                  setIsRejectDialogOpen(true);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Refuser
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Voir documents
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "certifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-secondary" />
                      Demandes de certification SunuMark
                      {pendingCertifications.length > 0 && (
                        <Badge className="ml-2">{pendingCertifications.length} en attente</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingCertifications.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Aucune demande de certification en attente
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {pendingCertifications.map((cert) => (
                          <div
                            key={cert.id}
                            className="p-4 border rounded-lg space-y-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-lg">
                                  {(cert as any).seller_details?.business_name || "Entreprise"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {(cert as any).profiles?.full_name} • {(cert as any).profiles?.email}
                                </p>
                              </div>
                              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                En attente
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Région:</span>{" "}
                                {getRegionLabel((cert as any).seller_details?.region)}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Date demande:</span>{" "}
                                {new Date(cert.created_at).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveCertification(cert)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approuver et certifier
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => {
                                  setSelectedCertification(cert);
                                  setIsCertRejectDialogOpen(true);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Refuser
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "statistiques" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-secondary" />
                      Tableau de bord national
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="vendeurs">
                      <TabsList className="mb-4">
                        <TabsTrigger value="vendeurs">Vendeurs</TabsTrigger>
                        <TabsTrigger value="categories">Catégories</TabsTrigger>
                        <TabsTrigger value="exportations">Exportations</TabsTrigger>
                      </TabsList>
                      <TabsContent value="vendeurs">
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-3xl font-bold text-green-600">{validatedSellers}</p>
                              <p className="text-sm text-muted-foreground">Vendeurs actifs</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-3xl font-bold text-orange-600">{pendingSellers.length}</p>
                              <p className="text-sm text-muted-foreground">En attente</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-3xl font-bold text-secondary">{allSellers.length}</p>
                              <p className="text-sm text-muted-foreground">Total inscrits</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="categories">
                        <p className="text-muted-foreground text-center py-8">
                          Données en cours de compilation
                        </p>
                      </TabsContent>
                      <TabsContent value="exportations">
                        <p className="text-muted-foreground text-center py-8">
                          Données en cours de compilation
                        </p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {activeTab === "verification" && (
                <MemberVerification />
              )}

              {activeTab === "member-card" && (
                <MemberCard />
              )}

              {activeTab === "signalements" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Signalements et litiges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Aucun signalement en cours
                    </p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "export" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileDown className="h-5 w-5 text-secondary" />
                      Export de données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <FileDown className="h-6 w-6" />
                        <span>Exporter vendeurs (Excel)</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <FileDown className="h-6 w-6" />
                        <span>Exporter commandes (Excel)</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <FileDown className="h-6 w-6" />
                        <span>Rapport PDF mensuel</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <FileDown className="h-6 w-6" />
                        <span>Statistiques régionales</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "traceability" && (
                <TraceabilityModule
                  products={[]}
                  sellerDetails={null}
                  isGlobalView={true}
                  globalStats={globalStats}
                />
              )}

              {activeTab === "admin" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-secondary" />
                      Administration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Accès réservé aux administrateurs système
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motif du refus</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Indiquez le motif du refus..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleRejectSeller}>
                Confirmer le refus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certification Reject Dialog */}
      <Dialog open={isCertRejectDialogOpen} onOpenChange={setIsCertRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motif du refus de certification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Entreprise: {(selectedCertification as any)?.seller_details?.business_name}
            </p>
            <Textarea
              placeholder="Indiquez le motif du refus de certification..."
              value={certRejectionReason}
              onChange={(e) => setCertRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setIsCertRejectDialogOpen(false);
                setSelectedCertification(null);
                setCertRejectionReason("");
              }}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleRejectCertification}>
                Confirmer le refus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentDashboard;
