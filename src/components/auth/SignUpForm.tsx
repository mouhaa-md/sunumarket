import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, ShoppingBag, Factory, Building2 } from "lucide-react";

interface SignUpFormProps {
  onSuccess: () => void;
}

const SENEGAL_REGIONS = [
  { value: "dakar", label: "Dakar" },
  { value: "thies", label: "Thiès" },
  { value: "saint_louis", label: "Saint-Louis" },
  { value: "diourbel", label: "Diourbel" },
  { value: "louga", label: "Louga" },
  { value: "fatick", label: "Fatick" },
  { value: "kaolack", label: "Kaolack" },
  { value: "kolda", label: "Kolda" },
  { value: "ziguinchor", label: "Ziguinchor" },
  { value: "tambacounda", label: "Tambacounda" },
  { value: "matam", label: "Matam" },
  { value: "kaffrine", label: "Kaffrine" },
  { value: "kedougou", label: "Kédougou" },
  { value: "sedhiou", label: "Sédhiou" },
];

const SENEGAL_CITIES = [
  "Dakar", "Thiès", "Saint-Louis", "Rufisque", "Kaolack", 
  "Mbour", "Ziguinchor", "Touba", "Diourbel", "Tambacounda"
];

const ACTIVITY_SECTORS = [
  { value: "artisanat", label: "Artisanat" },
  { value: "textile", label: "Textile" },
  { value: "agroalimentaire", label: "Agroalimentaire" },
  { value: "cosmetiques", label: "Cosmétiques" },
  { value: "autre", label: "Autre" },
];

const PRODUCT_PREFERENCES = [
  "Artisanat", "Textile", "Mode", "Agroalimentaire", 
  "Cosmétiques", "Décoration", "Bijoux", "Cuir"
];

type UserRole = "acheteur" | "vendeur" | "agent";

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("acheteur");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Buyer
    deliveryAddress: "",
    city: "",
    // Seller
    businessType: "artisan_individuel",
    businessName: "",
    region: "dakar",
    activitySector: "artisanat",
    ninea: "",
    // Agent
    accessCode: "",
    matricule: "",
    direction: "",
    assignedRegion: "",
  });

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 0, label: "Trop court" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 1) return { strength: 25, label: "Faible", color: "bg-destructive" };
    if (score === 2) return { strength: 50, label: "Moyen", color: "bg-yellow-500" };
    if (score === 3) return { strength: 75, label: "Fort", color: "bg-blue-500" };
    return { strength: 100, label: "Très fort", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast({
        title: "Conditions requises",
        description: "Veuillez accepter les conditions générales",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      role,
      deliveryAddress: formData.deliveryAddress,
      city: formData.city,
      productPreferences: selectedPreferences,
      businessType: formData.businessType,
      businessName: formData.businessName,
      region: formData.region,
      activitySector: formData.activitySector,
      ninea: formData.ninea,
      accessCode: formData.accessCode,
      matricule: formData.matricule,
      direction: formData.direction,
      assignedRegion: formData.assignedRegion,
    });

    if (error) {
      toast({
        title: "Erreur d'inscription",
        description: error.message === "User already registered"
          ? "Un compte existe déjà avec cet email"
          : error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Inscription réussie !",
      description: "Bienvenue sur SunuMarket !",
    });

    onSuccess();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const togglePreference = (pref: string) => {
    setSelectedPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role Selection */}
      <div className="space-y-3">
        <Label>Type de profil</Label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setRole("acheteur")}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
              role === "acheteur"
                ? "border-secondary bg-secondary/10"
                : "border-border hover:border-secondary/50"
            }`}
          >
            <ShoppingBag className={`h-6 w-6 ${role === "acheteur" ? "text-secondary" : "text-muted-foreground"}`} />
            <span className="text-xs font-medium">Acheteur</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("vendeur")}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
              role === "vendeur"
                ? "border-secondary bg-secondary/10"
                : "border-border hover:border-secondary/50"
            }`}
          >
            <Factory className={`h-6 w-6 ${role === "vendeur" ? "text-secondary" : "text-muted-foreground"}`} />
            <span className="text-xs font-medium">Vendeur</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("agent")}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
              role === "agent"
                ? "border-secondary bg-secondary/10"
                : "border-border hover:border-secondary/50"
            }`}
          >
            <Building2 className={`h-6 w-6 ${role === "agent" ? "text-secondary" : "text-muted-foreground"}`} />
            <span className="text-xs font-medium">Agent</span>
          </button>
        </div>
      </div>

      {/* Common Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="fullName">Nom complet *</Label>
          <Input
            id="fullName"
            placeholder="Prénom Nom"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
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
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+221 XX XXX XX XX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe *</Label>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {formData.password && (
            <div className="space-y-1">
              <div className="h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full transition-all ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{passwordStrength.label}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer *</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Role-specific Fields */}
      {role === "acheteur" && (
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm">Informations Acheteur</h4>
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Adresse de livraison</Label>
            <Input
              id="deliveryAddress"
              placeholder="Votre adresse"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Ville</Label>
            <Select
              value={formData.city}
              onValueChange={(value) => setFormData({ ...formData, city: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une ville" />
              </SelectTrigger>
              <SelectContent>
                {SENEGAL_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Préférences produits</Label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_PREFERENCES.map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => togglePreference(pref)}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    selectedPreferences.includes(pref)
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {role === "vendeur" && (
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm">Informations Vendeur</h4>
          <div className="space-y-2">
            <Label>Type d'entreprise</Label>
            <RadioGroup
              value={formData.businessType}
              onValueChange={(value) => setFormData({ ...formData, businessType: value })}
              className="flex flex-wrap gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="artisan_individuel" id="artisan" />
                <Label htmlFor="artisan" className="text-sm">Artisan individuel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pme" id="pme" />
                <Label htmlFor="pme" className="text-sm">PME</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cooperative" id="coop" />
                <Label htmlFor="coop" className="text-sm">Coopérative</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessName">Nom de l'entreprise *</Label>
            <Input
              id="businessName"
              placeholder="Nom de votre atelier/entreprise"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Région d'activité</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SENEGAL_REGIONS.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Secteur d'activité</Label>
              <Select
                value={formData.activitySector}
                onValueChange={(value) => setFormData({ ...formData, activitySector: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_SECTORS.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ninea">NINEA (optionnel)</Label>
            <Input
              id="ninea"
              placeholder="Numéro d'identification fiscale"
              value={formData.ninea}
              onChange={(e) => setFormData({ ...formData, ninea: e.target.value })}
            />
          </div>
        </div>
      )}

      {role === "agent" && (
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm">Informations Agent Ministère</h4>
          <div className="space-y-2">
            <Label htmlFor="accessCode">Code d'accès spécial *</Label>
            <Input
              id="accessCode"
              type="password"
              placeholder="Code fourni par le ministère"
              value={formData.accessCode}
              onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="matricule">Matricule *</Label>
              <Input
                id="matricule"
                placeholder="Votre matricule"
                value={formData.matricule}
                onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direction">Direction *</Label>
              <Input
                id="direction"
                placeholder="Direction/Service"
                value={formData.direction}
                onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Région assignée</Label>
            <Select
              value={formData.assignedRegion}
              onValueChange={(value) => setFormData({ ...formData, assignedRegion: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une région" />
              </SelectTrigger>
              <SelectContent>
                {SENEGAL_REGIONS.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Terms */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
          J'accepte les{" "}
          <a href="#" className="text-secondary hover:underline">
            conditions générales
          </a>{" "}
          et la{" "}
          <a href="#" className="text-secondary hover:underline">
            politique de confidentialité
          </a>
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Inscription...
          </>
        ) : (
          "S'inscrire"
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
