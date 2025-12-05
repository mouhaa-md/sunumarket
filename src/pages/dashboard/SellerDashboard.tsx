import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  BarChart3,
  Package,
  ClipboardList,
  TrendingUp,
  Award,
  DollarSign,
  Factory,
  Megaphone,
  Plus,
  Star,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

const CATEGORIES = [
  "Artisanat",
  "Textile",
  "Agroalimentaire",
  "Cosmétiques",
  "Décoration",
  "Bijoux",
  "Mode",
  "Cuir",
];

const SellerDashboard = () => {
  const { profile, user } = useAuth();
  const [sellerDetails, setSellerDetails] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    origin_region: "dakar",
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch seller details
    const { data: detailsData } = await supabase
      .from("seller_details")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (detailsData) setSellerDetails(detailsData);

    // Fetch products
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });
    
    if (productsData) setProducts(productsData);

    // Fetch orders
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });
    
    if (ordersData) setOrders(ordersData);
  };

  const handleAddProduct = async () => {
    if (!user || !newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("products").insert({
      seller_id: user.id,
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      origin_region: newProduct.origin_region,
    } as any);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Produit ajouté",
      description: "Votre produit a été ajouté avec succès",
    });

    setIsAddProductOpen(false);
    setNewProduct({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      origin_region: "dakar",
    });
    fetchData();
  };

  // Calculate stats
  const totalRevenue = orders
    .filter(o => o.status === "livree")
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "en_attente").length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
    { id: "products", label: "Mes produits", icon: Package },
    { id: "orders", label: "Commandes", icon: ClipboardList },
    { id: "stats", label: "Statistiques", icon: TrendingUp },
    { id: "certification", label: "Certification SunuMark", icon: Award },
    { id: "revenue", label: "Paiements/revenus", icon: DollarSign },
    { id: "business", label: "Mon entreprise", icon: Factory },
    { id: "promotions", label: "Promotions", icon: Megaphone },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Tableau de bord Vendeur
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Factory className="h-4 w-4" />
                {sellerDetails?.business_name || "Mon entreprise"}
                {sellerDetails?.is_certified && (
                  <Badge className="bg-green-500">Certifié SunuMarket</Badge>
                )}
              </p>
            </div>
            {sellerDetails?.validation_status === "en_attente" && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                Validation en attente
              </Badge>
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
                            ? "bg-secondary text-secondary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {activeTab === "dashboard" && (
                <>
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6 h-full">
                        <div className="flex items-start justify-between h-full">
                          <div className="flex flex-col justify-between h-full min-h-[60px]">
                            <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                            <p className="text-2xl font-bold mt-2">{totalRevenue.toLocaleString()} FCFA</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-green-500 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 h-full">
                        <div className="flex items-start justify-between h-full">
                          <div className="flex flex-col justify-between h-full min-h-[60px]">
                            <p className="text-sm text-muted-foreground">Commandes en attente</p>
                            <p className="text-2xl font-bold mt-2">{pendingOrders}</p>
                          </div>
                          <ShoppingBag className="h-8 w-8 text-orange-500 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 h-full">
                        <div className="flex items-start justify-between h-full">
                          <div className="flex flex-col justify-between h-full min-h-[60px]">
                            <p className="text-sm text-muted-foreground">Produits en stock</p>
                            <p className="text-2xl font-bold mt-2">{totalStock}</p>
                          </div>
                          <Package className="h-8 w-8 text-blue-500 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 h-full">
                        <div className="flex items-start justify-between h-full">
                          <div className="flex flex-col justify-between h-full min-h-[60px]">
                            <p className="text-sm text-muted-foreground">Avis clients</p>
                            <p className="text-2xl font-bold flex items-center gap-1 mt-2">
                              4.8 <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            </p>
                          </div>
                          <Star className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Commandes récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {orders.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Aucune commande pour le moment
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {orders.slice(0, 5).map((order) => (
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
                                <Badge>{getStatusLabel(order.status)}</Badge>
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
                </>
              )}

              {activeTab === "products" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Mes produits</CardTitle>
                    <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un produit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nouveau produit</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="productName">Nom du produit *</Label>
                            <Input
                              id="productName"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                              placeholder="Ex: Panier en osier"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="productDesc">Description</Label>
                            <Textarea
                              id="productDesc"
                              value={newProduct.description}
                              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                              placeholder="Décrivez votre produit..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Catégorie *</Label>
                              <Select
                                value={newProduct.category}
                                onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choisir" />
                                </SelectTrigger>
                                <SelectContent>
                                  {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Région d'origine</Label>
                              <Select
                                value={newProduct.origin_region}
                                onValueChange={(value) => setNewProduct({ ...newProduct, origin_region: value })}
                              >
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
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="price">Prix (FCFA) *</Label>
                              <Input
                                id="price"
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                placeholder="15000"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="stock">Stock</Label>
                              <Input
                                id="stock"
                                type="number"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                placeholder="10"
                              />
                            </div>
                          </div>
                          <Button onClick={handleAddProduct} className="w-full">
                            Ajouter le produit
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {products.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Aucun produit</p>
                        <p className="text-sm text-muted-foreground">
                          Commencez par ajouter votre premier produit
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.category} • Stock: {product.stock}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{product.price?.toLocaleString()} FCFA</p>
                              {product.is_certified && (
                                <Badge className="bg-green-500 mt-1">Certifié</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "orders" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Commandes à traiter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Aucune commande
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="p-4 border rounded-lg space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Commande #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                              <Badge>{getStatusLabel(order.status)}</Badge>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                              <p className="font-medium">{order.total_amount?.toLocaleString()} FCFA</p>
                              {order.status === "en_attente" && (
                                <Button size="sm">Confirmer</Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "certification" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-secondary" />
                      Certification SunuMark
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        La certification SunuMark garantit l'authenticité et la qualité de vos produits Made in Senegal.
                      </p>
                      <ul className="text-sm space-y-1">
                        <li>✓ Badge de qualité visible sur vos produits</li>
                        <li>✓ QR Code de traçabilité</li>
                        <li>✓ Meilleure visibilité sur la marketplace</li>
                        <li>✓ Confiance accrue des acheteurs</li>
                      </ul>
                    </div>
                    <Button className="w-full">
                      Demander la certification SunuMark
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "business" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mon entreprise</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sellerDetails ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Nom de l'entreprise</label>
                          <p className="font-medium">{sellerDetails.business_name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Type</label>
                          <p className="font-medium capitalize">{sellerDetails.business_type?.replace("_", " ")}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Région</label>
                          <p className="font-medium capitalize">{sellerDetails.region?.replace("_", " ")}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Secteur</label>
                          <p className="font-medium capitalize">{sellerDetails.activity_sector}</p>
                        </div>
                        {sellerDetails.ninea && (
                          <div>
                            <label className="text-sm text-muted-foreground">NINEA</label>
                            <p className="font-medium">{sellerDetails.ninea}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Informations non disponibles</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {(activeTab === "stats" || activeTab === "revenue" || activeTab === "promotions") && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {activeTab === "stats" && "Statistiques de vente"}
                      {activeTab === "revenue" && "Paiements et revenus"}
                      {activeTab === "promotions" && "Promotions"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Cette fonctionnalité sera bientôt disponible
                    </p>
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

export default SellerDashboard;
