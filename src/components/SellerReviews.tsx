import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  product_id: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
  products?: {
    name: string;
    images: string[] | null;
  };
}

const SellerReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    if (user) fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Fetch reviews for this seller
    const { data: reviewsData } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (reviewsData && reviewsData.length > 0) {
      // Fetch profiles and products
      const userIds = reviewsData.map(r => r.user_id);
      const productIds = reviewsData.map(r => r.product_id);
      
      const [profilesRes, productsRes] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", userIds),
        supabase.from("products").select("id, name, images").in("id", productIds)
      ]);
      
      const mappedReviews = reviewsData.map(review => ({
        ...review,
        profiles: profilesRes.data?.find(p => p.user_id === review.user_id),
        products: productsRes.data?.find(p => p.id === review.product_id)
      })) as Review[];
      
      setReviews(mappedReviews);
      
      // Calculate stats
      const total = mappedReviews.length;
      const average = total > 0 
        ? mappedReviews.reduce((sum, r) => sum + r.rating, 0) / total 
        : 0;
      const distribution = [0, 0, 0, 0, 0];
      mappedReviews.forEach(r => distribution[r.rating - 1]++);
      
      setStats({ average, total, distribution });
    } else {
      setReviews([]);
      setStats({ average: 0, total: 0, distribution: [0, 0, 0, 0, 0] });
    }
    setIsLoading(false);
  };

  const StarDisplay = ({ value }: { value: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Chargement des avis...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            Avis clients sur mes produits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Average rating */}
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold">{stats.average.toFixed(1)}</div>
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(stats.average)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{stats.total} avis au total</p>
              </div>
            </div>

            {/* Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.distribution[star - 1];
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{star}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Derniers avis</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun avis reçu pour le moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <div className="flex gap-4">
                    {/* Product image */}
                    <img
                      src={review.products?.images?.[0] || "/placeholder.svg"}
                      alt={review.products?.name}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      {/* Product name and rating */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            {review.products?.name || "Produit"}
                          </p>
                          <StarDisplay value={review.rating} />
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {new Date(review.created_at).toLocaleDateString("fr-FR")}
                        </Badge>
                      </div>

                      {/* Reviewer info */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          {review.profiles?.avatar_url ? (
                            <img
                              src={review.profiles.avatar_url}
                              alt=""
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                        </div>
                        <span>{review.profiles?.full_name || "Acheteur"}</span>
                      </div>

                      {/* Comment */}
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerReviews;
