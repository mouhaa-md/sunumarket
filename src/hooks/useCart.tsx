import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[] | null;
    seller_id: string;
  };
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (productId: string, sellerId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, userRole } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && userRole === "acheteur") {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [user, userRole]);

  const refreshCart = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Fetch cart items
    const { data: cartData } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);
    
    if (cartData && cartData.length > 0) {
      // Fetch products for each cart item
      const productIds = cartData.map(item => item.product_id);
      const { data: productsData } = await supabase
        .from("products")
        .select("id, name, price, images, seller_id")
        .in("id", productIds);
      
      const mappedItems = cartData.map(item => ({
        ...item,
        product: productsData?.find(p => p.id === item.product_id)
      })) as CartItem[];
      setItems(mappedItems);
    } else {
      setItems([]);
    }
    setIsLoading(false);
  };

  const addToCart = async (productId: string, sellerId: string, quantity: number = 1) => {
    if (!user) {
      toast.error("Connectez-vous pour ajouter au panier");
      return;
    }

    if (userRole !== "acheteur") {
      toast.error("Seuls les acheteurs peuvent utiliser le panier");
      return;
    }

    const existing = items.find(item => item.product_id === productId);
    
    if (existing) {
      await updateQuantity(productId, existing.quantity + quantity);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity
      });

    if (error) {
      toast.error("Erreur lors de l'ajout au panier");
      return;
    }

    toast.success("Ajouté au panier");
    await refreshCart();
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    setItems(items.filter(item => item.product_id !== productId));
    toast.success("Retiré du panier");
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || quantity < 1) return;

    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("product_id", productId);

    setItems(items.map(item => 
      item.product_id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = async () => {
    if (!user) return;

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    setItems([]);
    toast.success("Panier vidé");
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => 
    sum + (item.product?.price || 0) * item.quantity, 0
  );

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
