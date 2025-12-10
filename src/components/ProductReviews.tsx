import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
  sellerId: string;
}

const ProductReviews = ({ productId, sellerId }: ProductReviewsProps) => {
  const { user, userRole } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [productId, user]);

  const fetchReviews = async () => {
    setIsLoading(true);
    
    // Fetch reviews
    const { data: reviewsData } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (reviewsData && reviewsData.length > 0) {
      // Fetch profiles for reviewers
      const userIds = reviewsData.map(r => r.user_id);
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);
      
      const mappedReviews = reviewsData.map(review => ({
        ...review,
        profiles: profilesData?.find(p => p.user_id === review.user_id)
      })) as Review[];
      
      setReviews(mappedReviews);
      
      if (user) {
        const existing = mappedReviews.find(r => r.user_id === user.id);
        if (existing) {
          setUserReview(existing);
          setRating(existing.rating);
          setComment(existing.comment || "");
        }
      }
    } else {
      setReviews([]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Connectez-vous pour laisser un avis");
      return;
    }

    if (userRole !== "acheteur") {
      toast.error("Seuls les acheteurs peuvent laisser des avis");
      return;
    }

    if (rating === 0) {
      toast.error("Veuillez sélectionner une note");
      return;
    }

    setIsSubmitting(true);

    if (userReview) {
      // Update existing review
      const { error } = await supabase
        .from("product_reviews")
        .update({ rating, comment: comment || null })
        .eq("id", userReview.id);

      if (error) {
        toast.error("Erreur lors de la mise à jour");
      } else {
        toast.success("Avis mis à jour");
        fetchReviews();
      }
    } else {
      // Create new review
      const { error } = await supabase
        .from("product_reviews")
        .insert({
          product_id: productId,
          seller_id: sellerId,
          user_id: user.id,
          rating,
          comment: comment || null
        });

      if (error) {
        toast.error("Erreur lors de l'envoi de l'avis");
      } else {
        toast.success("Avis publié");
        fetchReviews();
      }
    }

    setIsSubmitting(false);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const StarRating = ({ value, interactive = false }: { value: number; interactive?: boolean }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (interactive ? (hoverRating || value) : value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            Avis clients
          </span>
          <span className="text-lg">
            {averageRating} <span className="text-muted-foreground text-sm">({reviews.length} avis)</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form for buyers */}
        {user && userRole === "acheteur" && (
          <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
            <h4 className="font-medium">{userReview ? "Modifier mon avis" : "Donner mon avis"}</h4>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Note</p>
              <StarRating value={rating} interactive />
            </div>
            <div>
              <Textarea
                placeholder="Partagez votre expérience avec ce produit..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : userReview ? "Mettre à jour" : "Publier l'avis"}
            </Button>
          </div>
        )}

        {/* Reviews list */}
        {isLoading ? (
          <p className="text-center text-muted-foreground py-4">Chargement...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Aucun avis pour ce produit. Soyez le premier !
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {review.profiles?.avatar_url ? (
                      <img
                        src={review.profiles.avatar_url}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.profiles?.full_name || "Utilisateur"}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <StarRating value={review.rating} />
                    {review.comment && (
                      <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
