import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Heart,
  Package,
  User,
  Home,
  CreditCard,
  HelpCircle,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

const BuyerDashboard = () => {
  const { profile, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [buyerDetails, setBuyerDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("commandes");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch orders
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });
    
    if (ordersData) setOrders(ordersData);

    // Fetch favorites
    const { data: favoritesData } = await supabase
      .from("favorites")
      .select("*, product_id")
      .eq("user_id", user.id);
    
    if (favoritesData) setFavorites(favoritesData);

    // Fetch buyer details
    const { data: detailsData } = await supabase
      .from("buyer_details")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (detailsData) setBuyerDetails(detailsData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente": return "bg-yellow-500";
      case "confirmee": return "bg-blue-500";
      case "en_preparation": return "bg-purple-500";
      case "expediee": return "bg-orange-500";
      case "livree": return "bg-green-500";
      case "annulee": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_attente": return "En attente";
      case "confirmee": return "Confirmée";
      case "en_preparation": return "En préparation";
      case "expediee": return "Expédiée";
      case "livree": return "Livrée";
      case "annulee": return "Annulée";
      default: return status;
    }
  };

  const menuItems = [
    { id: "commandes", label: "Mes commandes", icon: ShoppingCart },
    { id: "favoris", label: "Favoris", icon: Heart },
    { id: "suivi", label: "Suivi de colis", icon: Package },
    { id: "profil", label: "Mon profil", icon: User },
    { id: "adresses", label: "Mes adresses", icon: MapPin },
    { id: "paiement", label: "Paiement mobile", icon: CreditCard },
    { id: "aide", label: "Aide/Support", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Bienvenue, <span className="gradient-text">{profile?.full_name?.split(" ")[0] || "Utilisateur"}</span> !
            </h1>
            <p className="text-muted-foreground mt-2">Explorez le Made in Senegal</p>
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
                            ? "bg-secondary text-secondary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                    <Link
                      to="/marketplace"
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Home className="h-5 w-5" />
                      <span className="text-sm">Accueil boutique</span>
                    </Link>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {activeTab === "commandes" && (
                <>
                  {/* Current Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-secondary" />
                        Commandes en cours
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {orders.filter(o => o.status !== "livree" && o.status !== "annulee").length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Aucune commande en cours
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {orders
                            .filter(o => o.status !== "livree" && o.status !== "annulee")
                            .map((order) => (
                              <div
                                key={order.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">Commande #{order.id.slice(0, 8)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge className={getStatusColor(order.status)}>
                                    {getStatusLabel(order.status)}
                                  </Badge>
                                  <p className="text-sm font-medium mt-1">
                                    {order.total_amount?.toLocaleString()} FCFA
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Order History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Historique d'achats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {orders.filter(o => o.status === "livree").length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Aucun achat précédent
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {orders
                            .filter(o => o.status === "livree")
                            .map((order) => (
                              <div
                                key={order.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">Commande #{order.id.slice(0, 8)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Livré le {new Date(order.updated_at).toLocaleDateString("fr-FR")}
                                  </p>
                                </div>
                                <p className="font-medium">
                                  {order.total_amount?.toLocaleString()} FCFA
                                </p>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {activeTab === "favoris" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Mes favoris
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {favorites.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Aucun produit en favoris</p>
                        <Link to="/marketplace">
                          <Button className="mt-4">Explorer les produits</Button>
                        </Link>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        {favorites.length} produit(s) en favoris
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "suivi" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-secondary" />
                      Suivi de colis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Intégration SunuChain - Suivi en temps réel bientôt disponible
                    </p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "profil" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mon profil</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Nom complet</label>
                        <p className="font-medium">{profile?.full_name || "-"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Email</label>
                        <p className="font-medium">{profile?.email || "-"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Téléphone</label>
                        <p className="font-medium">{profile?.phone || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "adresses" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-secondary" />
                      Mes adresses de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {buyerDetails ? (
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium">Adresse principale</p>
                        <p className="text-muted-foreground">
                          {buyerDetails.delivery_address || "Non renseignée"}
                        </p>
                        <p className="text-muted-foreground">
                          {buyerDetails.city || ""}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Aucune adresse enregistrée
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "paiement" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-secondary" />
                      Paiement mobile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg text-center hover:border-secondary transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                          OM
                        </div>
                        <p className="font-medium">Orange Money</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center hover:border-secondary transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                          W
                        </div>
                        <p className="font-medium">Wave</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center hover:border-secondary transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                          M
                        </div>
                        <p className="font-medium">Mixx By Yas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "aide" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-secondary" />
                      Aide & Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium">Numéro vert (gratuit)</p>
                      <p className="text-2xl font-bold text-secondary">800 00 12 34</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium">WhatsApp Support</p>
                      <p className="text-lg">+221 76 948 17 73</p>
                    </div>
                    <Button className="w-full">Démarrer un chat</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;
