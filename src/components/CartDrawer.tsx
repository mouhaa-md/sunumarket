import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const CartDrawer = () => {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, userRole } = useAuth();

  if (!user || userRole !== "acheteur") return null;

  const handleWhatsAppOrder = () => {
    const itemsList = items.map(item => 
      `📦 ${item.product?.name} x${item.quantity} - ${((item.product?.price || 0) * item.quantity).toLocaleString()} FCFA`
    ).join("\n");

    const message = `Bonjour, je souhaite commander les produits suivants :\n\n${itemsList}\n\n💰 Total : ${totalPrice.toLocaleString()} FCFA\n\nMerci de me contacter pour finaliser ma commande.`;
    
    const whatsappUrl = `https://wa.me/221769481773?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Mon Panier ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Votre panier est vide</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <img
                      src={item.product?.image || item.product?.images?.[0] || "/placeholder.svg"}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate text-sm">{item.product?.name}</h4>
                      <p className="text-secondary font-bold text-sm">
                        {item.product?.price?.toLocaleString()} FCFA
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-red-500 hover:text-red-600 ml-auto"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-secondary">
                    {totalPrice.toLocaleString()} FCFA
                  </span>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleWhatsAppOrder}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Commander via WhatsApp
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  Vider le panier
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
