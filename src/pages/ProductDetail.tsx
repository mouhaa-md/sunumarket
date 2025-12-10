import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { products, findProduct } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, MapPin, User, ArrowLeft, Package, Heart, ShoppingCart, ChevronRight, Home } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import NotFound from "./NotFound";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProductReviews from "@/components/ProductReviews";
import ProductSEO from "@/components/ProductSEO";

const ProductDetail = () => {
  const { id } = useParams();
  const { user, userRole } = useAuth();
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 });
  
  // Find product by ID or slug
  const product = findProduct(id || "");
  
  // For database products, we need the seller_id
  const sellerId = product?.id || "";

  useEffect(() => {
    if (user && userRole === "acheteur" && product) {
      checkFavorite();
    }
    if (product) {
      fetchReviewStats();
    }
  }, [user, userRole, product?.id]);

  const fetchReviewStats = async () => {
    if (!product) return;
    
    const { data } = await supabase
      .from("product_reviews")
      .select("rating")
      .eq("product_id", product.id);
    
    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setReviewStats({ average: avg, count: data.length });
    }
  };

  const checkFavorite = async () => {
    if (!user || !product) return;
    
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();
    
    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Connectez-vous pour ajouter aux favoris");
      return;
    }

    if (userRole !== "acheteur") {
      toast.error("Seuls les acheteurs peuvent ajouter aux favoris");
      return;
    }

    if (!product) return;

    setIsLoading(true);

    try {
      if (isFavorite) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id);
        
        setIsFavorite(false);
        toast.success("Retiré des favoris");
      } else {
        await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            product_id: product.id
          });
        
        setIsFavorite(true);
        toast.success("Ajouté aux favoris");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return <NotFound />;
  }

  const handleWhatsAppOrder = () => {
    const message = `Bonjour, je souhaite commander le produit suivant :\n\n` +
      `📦 Produit : ${product.name}\n` +
      `💰 Prix : ${product.price.toLocaleString()} FCFA\n` +
      `👨‍🌾 Producteur : ${product.producer}\n` +
      `📍 Région : ${product.region}\n` +
      `🏷️ Catégorie : ${product.category}\n\n` +
      `Merci de me contacter pour finaliser ma commande.`;
    
    const whatsappUrl = `https://wa.me/221769481773?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product.id);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* SEO Component */}
      <ProductSEO 
        product={product} 
        averageRating={reviewStats.average} 
        reviewCount={reviewStats.count} 
      />
      
      <main className="pt-16">
        <div className="section-container py-6 md:py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground flex items-center gap-1">
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/marketplace" className="hover:text-foreground">
              Marketplace
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/marketplace?category=${encodeURIComponent(product.category)}`} className="hover:text-foreground">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>

          <Link to="/marketplace">
            <Button variant="ghost" className="mb-4 md:mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 animate-fade-in">
            {/* Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg border-2 border-secondary/20">
                <img
                  src={product.image}
                  alt={`${product.name} - ${product.producer} - Made in Senegal`}
                  className="w-full aspect-square object-cover"
                />
                {product.certified && (
                  <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground gap-1 shadow-lg text-sm px-3 py-1">
                    <ShieldCheck className="h-4 w-4" />
                    Certifié SunuMark
                  </Badge>
                )}
              </div>

              {/* QR Code */}
              {product.certified && (
                <Card className="border-2 border-secondary/20">
                  <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                      <QRCodeSVG
                        value={`https://sunumarket.sn/verify/${product.id}`}
                        size={80}
                        level="H"
                        includeMargin
                        className="md:w-[100px] md:h-[100px]"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-semibold text-sm md:text-base mb-1">QR Code SunuMark</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Scannez pour vérifier l'authenticité
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-xl md:text-3xl font-bold text-secondary mb-3 md:mb-4">
                  {product.price.toLocaleString()} FCFA
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1">
                  <Package className="h-3 w-3" />
                  {product.category}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {product.region}
                </Badge>
              </div>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-sm">Producteur</h3>
                      <p className="text-sm">{product.producer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Description</h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Origine</h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {product.origin}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={toggleFavorite}
                  disabled={isLoading}
                  className={isFavorite ? "text-red-500 border-red-500 hover:bg-red-50" : ""}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>

              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleWhatsAppOrder}
              >
                Commander via WhatsApp
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Ajoutez au panier ou commandez directement via WhatsApp
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <ProductReviews productId={product.id} sellerId={sellerId} />
          </div>

          {/* Related Products */}
          <div className="mt-12 md:mt-16">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products
                .filter((p) => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <Link key={relatedProduct.id} to={`/produit/${relatedProduct.slug || relatedProduct.id}`}>
                    <Card className="group overflow-hidden border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300">
                      <img
                        src={relatedProduct.image}
                        alt={`${relatedProduct.name} - Made in Senegal`}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1">{relatedProduct.name}</h3>
                        <p className="text-secondary font-bold">{relatedProduct.price.toLocaleString()} FCFA</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
