import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Certification from "./pages/Certification";
import Reseau from "./pages/Reseau";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import BuyerDashboard from "./pages/dashboard/BuyerDashboard";
import SellerDashboard from "./pages/dashboard/SellerDashboard";
import AgentDashboard from "./pages/dashboard/AgentDashboard";
import LuumaChatbot from "./components/LuumaChatbot";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === "acheteur") return <Navigate to="/dashboard/acheteur" replace />;
    if (userRole === "vendeur") return <Navigate to="/dashboard/vendeur" replace />;
    if (userRole === "agent") return <Navigate to="/dashboard/agent" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Dashboard redirect based on role
const DashboardRedirect = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (userRole) {
    case "acheteur":
      return <Navigate to="/dashboard/acheteur" replace />;
    case "vendeur":
      return <Navigate to="/dashboard/vendeur" replace />;
    case "agent":
      return <Navigate to="/dashboard/agent" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

const AppRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited) {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem("hasVisited", "true");
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/produit/:id" element={<ProductDetail />} />
      <Route path="/certification" element={<Certification />} />
      <Route path="/reseau" element={<Reseau />} />
      
      {/* Dashboard redirect */}
      <Route path="/dashboard" element={<DashboardRedirect />} />
      
      {/* Protected dashboard routes */}
      <Route
        path="/dashboard/acheteur"
        element={
          <ProtectedRoute allowedRoles={["acheteur"]}>
            <BuyerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/vendeur"
        element={
          <ProtectedRoute allowedRoles={["vendeur"]}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/agent"
        element={
          <ProtectedRoute allowedRoles={["agent"]}>
            <AgentDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
              <LuumaChatbot />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
