import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { Product } from "@/data/products";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.certified && (
          <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground gap-1 shadow-lg">
            <ShieldCheck className="h-3 w-3" />
            Certifié SunuMark
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{product.producer}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <p className="text-xs text-muted-foreground">{product.region}</p>
          </div>
          <p className="text-xl font-bold text-secondary">{product.price.toLocaleString()} FCFA</p>
        </div>
        
        <Link to={`/produit/${product.id}`}>
          <Button variant="secondary" className="w-full">
            Voir détails
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
