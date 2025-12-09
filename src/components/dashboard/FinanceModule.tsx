import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Building2,
  PiggyBank,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Banknote,
  CalendarDays,
  Target,
  LineChart,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FinanceModuleProps {
  isCertified: boolean;
  totalRevenue: number;
  orders: any[];
  products: any[];
}

// EcoBank - Partenaire exclusif
const BANK_PARTNERS = [
  { id: "ecobank", name: "Ecobank", logo: "/ecobank-logo.png", maxAmount: 15000000, rate: 6.0, artisanBonus: true, description: "Leader panafricain du financement des artisans et PME" },
];

export const FinanceModule = ({ isCertified, totalRevenue, orders, products }: FinanceModuleProps) => {
  const [activeFinanceTab, setActiveFinanceTab] = useState("overview");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanDuration, setLoanDuration] = useState("12");
  const [selectedBank, setSelectedBank] = useState("");
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [loanStatus, setLoanStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");

  // Calculate financial metrics
  const completedOrders = orders.filter(o => o.status === "livree");
  const pendingPayments = orders.filter(o => o.status === "expediee").reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const monthlyRevenue = calculateMonthlyRevenue(orders);
  const revenueGrowth = calculateRevenueGrowth(monthlyRevenue);
  const avgOrderValue = completedOrders.length > 0 
    ? Math.round(totalRevenue / completedOrders.length) 
    : 0;

  // Revenue forecast (simple linear projection)
  const forecastedRevenue = calculateForecast(monthlyRevenue);

  function calculateMonthlyRevenue(orders: any[]) {
    const months: { [key: string]: number } = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[key] = 0;
    }

    // Sum up completed orders
    orders
      .filter(o => o.status === "livree")
      .forEach(order => {
        const date = new Date(order.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (months[key] !== undefined) {
          months[key] += order.total_amount || 0;
        }
      });

    return Object.entries(months).map(([month, revenue]) => ({
      month: new Date(month + "-01").toLocaleDateString("fr-FR", { month: "short" }),
      revenue
    }));
  }

  function calculateRevenueGrowth(monthlyData: { month: string; revenue: number }[]) {
    if (monthlyData.length < 2) return 0;
    const current = monthlyData[monthlyData.length - 1].revenue;
    const previous = monthlyData[monthlyData.length - 2].revenue;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  function calculateForecast(monthlyData: { month: string; revenue: number }[]) {
    const values = monthlyData.map(m => m.revenue);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const trend = revenueGrowth > 0 ? 1.1 : revenueGrowth < 0 ? 0.95 : 1;
    
    // Calculate explicit future month names
    const now = new Date();
    const getMonthName = (offset: number) => {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      return futureDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    };
    
    return [
      { month: getMonthName(1), revenue: Math.round(avg * trend) },
      { month: getMonthName(2), revenue: Math.round(avg * trend * trend) },
      { month: getMonthName(3), revenue: Math.round(avg * trend * trend * trend) },
    ];
  }

  const handleLoanRequest = () => {
    if (!loanAmount || !selectedBank || !loanDuration) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    // Simulate loan request
    setLoanStatus("pending");
    setIsLoanDialogOpen(false);
    
    toast({
      title: "Demande envoyée !",
      description: `Votre demande de micro-financement de ${parseInt(loanAmount).toLocaleString()} FCFA a été transmise à ${BANK_PARTNERS.find(b => b.id === selectedBank)?.name}.`,
    });

    // Simulate approval after 3 seconds
    setTimeout(() => {
      setLoanStatus("approved");
      toast({
        title: "Demande pré-approuvée !",
        description: "Un conseiller bancaire vous contactera sous 48h.",
      });
    }, 3000);
  };

  const selectedBankData = BANK_PARTNERS.find(b => b.id === selectedBank);
  const calculatedMonthlyPayment = loanAmount && loanDuration && selectedBankData
    ? Math.round((parseInt(loanAmount) * (1 + selectedBankData.rate / 100)) / parseInt(loanDuration))
    : 0;

  const maxLoanAmount = isCertified 
    ? Math.max(totalRevenue * 3, 500000) 
    : Math.max(totalRevenue * 1.5, 250000);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-secondary" />
            Financement & Croissance
          </h2>
          <p className="text-muted-foreground">
            Gérez vos finances et accédez au micro-financement
          </p>
        </div>
        {isCertified && (
          <Badge className="bg-green-500">
            <Sparkles className="h-3 w-3 mr-1" />
            Avantages Certifié
          </Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenus totaux</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} FCFA</p>
              </div>
              <Banknote className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{pendingPayments.toLocaleString()} FCFA</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Panier moyen</p>
                <p className="text-2xl font-bold">{avgOrderValue.toLocaleString()} FCFA</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${revenueGrowth >= 0 ? "border-l-green-500" : "border-l-red-500"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Croissance</p>
                <p className={`text-2xl font-bold flex items-center gap-1 ${revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth}%
                  {revenueGrowth >= 0 ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5" />
                  )}
                </p>
              </div>
              <TrendingUp className={`h-8 w-8 ${revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeFinanceTab} onValueChange={setActiveFinanceTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Prévisions
          </TabsTrigger>
          <TabsTrigger value="microfinance" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            Micro-financement
          </TabsTrigger>
        </TabsList>

        {/* Revenue Forecast Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart (Simplified visual) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-secondary" />
                  Évolution des revenus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyRevenue.map((data, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm w-12 text-muted-foreground">{data.month}</span>
                      <div className="flex-1">
                        <Progress 
                          value={data.revenue > 0 ? Math.min((data.revenue / Math.max(...monthlyRevenue.map(m => m.revenue))) * 100, 100) : 0} 
                          className="h-6"
                        />
                      </div>
                      <span className="text-sm font-medium w-24 text-right">
                        {data.revenue.toLocaleString()} F
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Forecast */}
            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Prévisions de revenus
                </CardTitle>
                <CardDescription>
                  Basées sur vos performances actuelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forecastedRevenue.map((forecast, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? "bg-blue-500" : index === 1 ? "bg-green-500" : "bg-secondary"
                        }`} />
                        <span className="font-medium">{forecast.month}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{forecast.revenue.toLocaleString()} FCFA</p>
                        <p className="text-xs text-muted-foreground">Estimation</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Conseil :</strong> Augmentez votre catalogue produits pour améliorer vos prévisions. 
                    {isCertified ? " Votre certification SunuMark vous donne accès à l'export international." : " Obtenez la certification pour accéder à l'export."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Micro-financing Tab */}
        <TabsContent value="microfinance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-secondary" />
                Micro-financement pour Artisans
              </CardTitle>
              <CardDescription>
                Accédez à des financements adaptés via nos partenaires bancaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loan Status */}
              {loanStatus !== "none" && (
                <div className={`p-4 rounded-lg border ${
                  loanStatus === "pending" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20" :
                  loanStatus === "approved" ? "bg-green-50 border-green-200 dark:bg-green-900/20" :
                  "bg-red-50 border-red-200 dark:bg-red-900/20"
                }`}>
                  <div className="flex items-center gap-3">
                    {loanStatus === "pending" && <Clock className="h-5 w-5 text-yellow-600" />}
                    {loanStatus === "approved" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {loanStatus === "rejected" && <AlertCircle className="h-5 w-5 text-red-600" />}
                    <div>
                      <p className={`font-medium ${
                        loanStatus === "pending" ? "text-yellow-700 dark:text-yellow-400" :
                        loanStatus === "approved" ? "text-green-700 dark:text-green-400" :
                        "text-red-700 dark:text-red-400"
                      }`}>
                        {loanStatus === "pending" && "Demande en cours d'analyse..."}
                        {loanStatus === "approved" && "Demande pré-approuvée !"}
                        {loanStatus === "rejected" && "Demande refusée"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {loanStatus === "pending" && "Un conseiller analyse votre dossier"}
                        {loanStatus === "approved" && "Un conseiller vous contactera sous 48h"}
                        {loanStatus === "rejected" && "Contactez le support pour plus d'informations"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Eligibility Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Montant maximum éligible</p>
                  <p className="text-2xl font-bold text-secondary">{maxLoanAmount.toLocaleString()} FCFA</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isCertified ? "Bonus certification : +100% capacité" : "Obtenez la certification pour doubler ce montant"}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Score de confiance</p>
                  <div className="flex items-center gap-2">
                    <Progress value={isCertified ? 85 : 60} className="flex-1" />
                    <span className="font-bold">{isCertified ? "85" : "60"}/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Basé sur votre historique de ventes
                  </p>
                </div>
              </div>

              {/* Ecobank Partner Highlight */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0066B3] via-[#004A82] to-[#003366] p-6 text-white shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400 rounded-full blur-3xl transform -translate-x-24 translate-y-24" />
                </div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-white rounded-xl p-3 shadow-lg">
                        <Building2 className="h-10 w-10 text-[#0066B3]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-wide">ECOBANK</h3>
                        <p className="text-blue-200 text-sm">Partenaire Officiel SunuMarket</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-400 text-black font-bold px-4 py-2 text-sm">
                      <Sparkles className="h-4 w-4 mr-1" />
                      Artisan+
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-blue-100 mb-6 text-lg">
                    Leader panafricain du financement des artisans et PME sénégalaises. 
                    Bénéficiez de conditions préférentielles exclusives via SunuMarket.
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <Banknote className="h-8 w-8 text-yellow-400 mb-2" />
                      <p className="text-2xl font-bold">15 000 000</p>
                      <p className="text-blue-200 text-sm">FCFA Maximum</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <TrendingUp className="h-8 w-8 text-green-400 mb-2" />
                      <p className="text-2xl font-bold">6%</p>
                      <p className="text-blue-200 text-sm">Taux préférentiel /an</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <Clock className="h-8 w-8 text-orange-400 mb-2" />
                      <p className="text-2xl font-bold">48h</p>
                      <p className="text-blue-200 text-sm">Réponse rapide</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Aucun frais de dossier</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Remboursement flexible</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Accompagnement personnalisé</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <Dialog open={isLoanDialogOpen} onOpenChange={setIsLoanDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <PiggyBank className="h-5 w-5 mr-2" />
                    Demander un financement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Demande de micro-financement</DialogTitle>
                    <DialogDescription>
                      Simulez et soumettez votre demande de financement
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Montant souhaité (FCFA)</Label>
                      <Input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        placeholder="Ex: 500000"
                        max={maxLoanAmount}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum: {maxLoanAmount.toLocaleString()} FCFA
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Banque partenaire</Label>
                      <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une banque" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANK_PARTNERS.map((bank) => (
                            <SelectItem key={bank.id} value={bank.id}>
                              {bank.logo} {bank.name} - {bank.rate}%/an
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Durée de remboursement</Label>
                      <Select value={loanDuration} onValueChange={setLoanDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 mois</SelectItem>
                          <SelectItem value="12">12 mois</SelectItem>
                          <SelectItem value="18">18 mois</SelectItem>
                          <SelectItem value="24">24 mois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {calculatedMonthlyPayment > 0 && (
                      <div className="p-4 bg-secondary/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Mensualité estimée</p>
                        <p className="text-2xl font-bold text-secondary">
                          {calculatedMonthlyPayment.toLocaleString()} FCFA/mois
                        </p>
                      </div>
                    )}

                    <Button onClick={handleLoanRequest} className="w-full">
                      Soumettre la demande
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};
