import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/data/products";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  averageRating?: number;
  reviewCount?: number;
}

const ProductCard = ({ product, averageRating = 0, reviewCount = 0 }: ProductCardProps) => {
  const { user, userRole } = useAuth();
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && userRole === "acheteur") {
      checkFavorite();
    }
  }, [user, userRole, product.id]);

  const checkFavorite = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();
    
    setIsFavorite(!!data);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Connectez-vous pour ajouter aux favoris");
      return;
    }

    if (userRole !== "acheteur") {
      toast.error("Seuls les acheteurs peuvent ajouter aux favoris");
      return;
    }

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
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  return (
    <Card className="group overflow-hidden border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.certified && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground gap-1 shadow-lg">
            <ShieldCheck className="h-3 w-3" />
            Certifié SunuMark
          </Badge>
        )}
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isFavorite 
              ? "bg-red-500 text-white" 
              : "bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{product.producer}</p>
        </div>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviewCount})</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <p className="text-xs text-muted-foreground">{product.region}</p>
          </div>
          <p className="text-xl font-bold text-secondary">{product.price.toLocaleString()} FCFA</p>
        </div>
        
        <div className="flex gap-2">
          <Link to={`/produit/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              Voir détails
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleAddToCart}
            className="flex-shrink-0"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
