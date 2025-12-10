import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { products as staticProducts } from "@/data/products";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    images?: string[] | null;
    image?: string;
    seller_id?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Check if a product ID is a static product
const isStaticProduct = (productId: string): boolean => {
  return staticProducts.some(p => p.id === productId);
};

// Get static product data
const getStaticProduct = (productId: string) => {
  const product = staticProducts.find(p => p.id === productId);
  if (product) {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    };
  }
  return null;
};

// Local storage key for cart
const CART_STORAGE_KEY = "sunumarket_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, userRole } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && userRole === "acheteur") {
      refreshCart();
    } else {
      // Load from localStorage for non-authenticated users
      loadLocalCart();
    }
  }, [user, userRole]);

  const loadLocalCart = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const cartData = JSON.parse(stored);
        const mappedItems = cartData.map((item: any) => ({
          id: item.product_id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: getStaticProduct(item.product_id)
        })).filter((item: CartItem) => item.product);
        setItems(mappedItems);
      }
    } catch (e) {
      console.error("Error loading cart from localStorage:", e);
    }
  };

  const saveLocalCart = (cartItems: CartItem[]) => {
    try {
      const toStore = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  };

  const refreshCart = async () => {
    if (!user) {
      loadLocalCart();
      return;
    }
    
    setIsLoading(true);
    
    // Fetch cart items from database
    const { data: cartData } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);
    
    if (cartData && cartData.length > 0) {
      // Separate static and DB products
      const staticItems: CartItem[] = [];
      const dbProductIds: string[] = [];
      
      cartData.forEach(item => {
        const staticProduct = getStaticProduct(item.product_id);
        if (staticProduct) {
          staticItems.push({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            product: staticProduct
          });
        } else {
          dbProductIds.push(item.product_id);
        }
      });

      // Fetch DB products
      let dbItems: CartItem[] = [];
      if (dbProductIds.length > 0) {
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name, price, images, seller_id")
          .in("id", dbProductIds);
        
        dbItems = cartData
          .filter(item => dbProductIds.includes(item.product_id))
          .map(item => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            product: productsData?.find(p => p.id === item.product_id)
          }));
      }

      setItems([...staticItems, ...dbItems]);
    } else {
      // Also load from localStorage and merge
      loadLocalCart();
    }
    setIsLoading(false);
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
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

    // Add to database
    const { error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity
      });

    if (error) {
      console.error("Error adding to cart:", error);
      toast.error("Erreur lors de l'ajout au panier");
      return;
    }

    toast.success("Ajouté au panier");
    await refreshCart();
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      // Remove from local storage
      const newItems = items.filter(item => item.product_id !== productId);
      setItems(newItems);
      saveLocalCart(newItems);
      toast.success("Retiré du panier");
      return;
    }

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    setItems(items.filter(item => item.product_id !== productId));
    toast.success("Retiré du panier");
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    if (!user) {
      const newItems = items.map(item => 
        item.product_id === productId ? { ...item, quantity } : item
      );
      setItems(newItems);
      saveLocalCart(newItems);
      return;
    }

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
    if (!user) {
      setItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      toast.success("Panier vidé");
      return;
    }

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
