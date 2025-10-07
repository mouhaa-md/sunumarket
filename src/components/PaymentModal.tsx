import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  amount: number;
}

const PaymentModal = ({ isOpen, onClose, productName, amount }: PaymentModalProps) => {
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"wave" | "orange" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!phone || !paymentMethod) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Paiement réussi ! Votre commande sera livrée sous peu.", {
        description: `${productName} - ${amount.toLocaleString()} FCFA`,
      });
      setPhone("");
      setPaymentMethod(null);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Paiement Mobile</DialogTitle>
          <DialogDescription>
            Payez votre commande via Wave ou Orange Money
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Produit</Label>
            <p className="text-sm font-medium">{productName}</p>
          </div>
          
          <div className="space-y-2">
            <Label>Montant</Label>
            <p className="text-2xl font-bold text-secondary">{amount.toLocaleString()} FCFA</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              placeholder="77 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Méthode de paiement</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentMethod === "wave" ? "default" : "outline"}
                onClick={() => setPaymentMethod("wave")}
                className="h-16"
              >
                <div className="text-center">
                  <div className="font-bold text-lg">Wave</div>
                  <div className="text-xs">Paiement rapide</div>
                </div>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "orange" ? "default" : "outline"}
                onClick={() => setPaymentMethod("orange")}
                className="h-16"
              >
                <div className="text-center">
                  <div className="font-bold text-lg">Orange Money</div>
                  <div className="text-xs">Paiement sécurisé</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isProcessing}>
            Annuler
          </Button>
          <Button onClick={handlePayment} className="flex-1 bg-secondary hover:bg-secondary/90" disabled={isProcessing}>
            {isProcessing ? "Traitement..." : "Confirmer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
