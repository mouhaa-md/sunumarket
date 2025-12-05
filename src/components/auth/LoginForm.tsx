import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { signIn, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message === "Invalid login credentials" 
          ? "Email ou mot de passe incorrect"
          : error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Connexion réussie",
      description: "Bienvenue sur SunuMarket !",
    });

    onSuccess();
    
    // Redirect will happen based on role after profile loads
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email ou Téléphone</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded" />
          <span className="text-muted-foreground">Se souvenir de moi</span>
        </label>
        <button type="button" className="text-secondary hover:underline">
          Mot de passe oublié ?
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connexion...
          </>
        ) : (
          "Se Connecter"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
