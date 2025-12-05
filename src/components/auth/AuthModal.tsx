import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center gradient-text">
            SunuMarket
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            Plateforme Made in Senegal
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Se Connecter</TabsTrigger>
            <TabsTrigger value="signup">S'inscrire</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <LoginForm onSuccess={onClose} />
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <SignUpForm onSuccess={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
