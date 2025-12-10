import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
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
  Plus,
  Minus,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { MemberCard } from "@/components/dashboard/MemberCard";

const BuyerDashboard = () => {
  const { profile, user } = useAuth();
  const { items: cartItems, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
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

    // Fetch favorites with product details
    const { data: favoritesData } = await supabase
      .from("favorites")
      .select("*, products(*)")
      .eq("user_id", user.id);
    
    if (favoritesData) {
      // Map the products data to a more usable format
      const mappedFavorites = favoritesData.map(fav => ({
        ...fav,
        product: fav.products
      }));
      setFavorites(mappedFavorites);
    }

    // Fetch buyer details
    const { data: detailsData } = await supabase
      .from("buyer_details")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (detailsData) setBuyerDetails(detailsData);
  };

  const removeFavorite = async (productId: string) => {
    if (!user) return;
    
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
    
    setFavorites(favorites.filter(f => f.product_id !== productId));
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
    { id: "panier", label: `Mon panier (${totalItems})`, icon: ShoppingCart },
    { id: "commandes", label: "Mes commandes", icon: Clock },
    { id: "favoris", label: "Favoris", icon: Heart },
    { id: "member-card", label: "Ma Carte Membre", icon: CreditCard },
    { id: "suivi", label: "Suivi de colis", icon: Package },
    { id: "profil", label: "Mon profil", icon: User },
    { id: "adresses", label: "Mes adresses", icon: MapPin },
    { id: "aide", label: "Aide/Support", icon: HelpCircle },
  ];

  const handleWhatsAppOrder = () => {
    const itemsList = cartItems.map(item => 
      `📦 ${item.product?.name} x${item.quantity} - ${((item.product?.price || 0) * item.quantity).toLocaleString()} FCFA`
    ).join("\n");

    const message = `Bonjour, je souhaite commander les produits suivants :\n\n${itemsList}\n\n💰 Total : ${totalPrice.toLocaleString()} FCFA\n\nMerci de me contacter pour finaliser ma commande.`;
    
    const whatsappUrl = `https://wa.me/221769481773?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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
              {activeTab === "panier" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-secondary" />
                      Mon panier ({totalItems} articles)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Votre panier est vide</p>
                        <Link to="/marketplace">
                          <Button className="mt-4">Explorer les produits</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                              <img
                                src={item.product?.image || item.product?.images?.[0] || "/placeholder.svg"}
                                alt={item.product?.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{item.product?.name}</h4>
                                <p className="text-secondary font-bold">
                                  {item.product?.price?.toLocaleString()} FCFA
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">
                                  {((item.product?.price || 0) * item.quantity).toLocaleString()} FCFA
                                </p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-600 mt-2"
                                  onClick={() => removeFromCart(item.product_id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Retirer
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4 space-y-4">
                          <div className="flex justify-between items-center text-lg">
                            <span className="font-semibold">Total</span>
                            <span className="text-2xl font-bold text-secondary">
                              {totalPrice.toLocaleString()} FCFA
                            </span>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={handleWhatsAppOrder}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Commander via WhatsApp
                            </Button>
                            <Button variant="outline" onClick={clearCart}>
                              Vider le panier
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

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
                      Mes favoris ({favorites.length})
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favorites.map((fav) => (
                          <div key={fav.id} className="flex items-center gap-4 p-4 border rounded-lg hover:border-secondary transition-colors">
                            <img
                              src={fav.product?.image || "/placeholder.svg"}
                              alt={fav.product?.name || "Produit"}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{fav.product?.name || "Produit"}</h4>
                              <p className="text-sm text-muted-foreground">{fav.product?.producer || ""}</p>
                              <p className="text-secondary font-bold">{fav.product?.price?.toLocaleString() || 0} FCFA</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Link to={`/produit/${fav.product_id}`}>
                                <Button size="sm" variant="outline">Voir</Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => removeFavorite(fav.product_id)}
                              >
                                <Heart className="h-4 w-4 fill-current" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        <div className="w-12 h-12 bg-emerald-600 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs">
                          ECO
                        </div>
                        <p className="font-medium">EcoBank</p>
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

              {activeTab === "member-card" && (
                <MemberCard />
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
                      <p className="font-medium">Support SunuMarket</p>
                      <p className="text-2xl font-bold text-secondary">+221 76 948 17 73</p>
                    </div>
                    <a
                      href="https://wa.me/221769481773?text=Bonjour, j'ai besoin d'aide sur SunuMarket"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Contacter via WhatsApp
                      </Button>
                    </a>
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
