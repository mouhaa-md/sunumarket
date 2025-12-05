import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "acheteur" | "vendeur" | "agent";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  profile: any | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: UserRole;
  // Buyer specific
  deliveryAddress?: string;
  city?: string;
  productPreferences?: string[];
  // Seller specific
  businessType?: string;
  businessName?: string;
  region?: string;
  activitySector?: string;
  ninea?: string;
  // Agent specific
  accessCode?: string;
  matricule?: string;
  direction?: string;
  assignedRegion?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AGENT_ACCESS_CODE = "SUNU2024AGENT";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      setProfile(profileData);

      // Fetch role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (roleData) {
        setUserRole(roleData.role as UserRole);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData): Promise<{ error: any }> => {
    // Validate agent access code
    if (data.role === "agent" && data.accessCode !== AGENT_ACCESS_CODE) {
      return { error: { message: "Code d'accès agent invalide" } };
    }

    const redirectUrl = `${window.location.origin}/`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: data.fullName,
          phone: data.phone,
        },
      },
    });

    if (authError) return { error: authError };
    if (!authData.user) return { error: { message: "Erreur lors de l'inscription" } };

    const userId = authData.user.id;

    // Insert role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: data.role });

    if (roleError) {
      console.error("Error inserting role:", roleError);
      return { error: roleError };
    }

    // Insert role-specific details
    if (data.role === "acheteur") {
      const { error } = await supabase.from("buyer_details").insert({
        user_id: userId,
        delivery_address: data.deliveryAddress || "",
        city: data.city || "",
        product_preferences: data.productPreferences || [],
      } as any);
      if (error) console.error("Error inserting buyer details:", error);
    } else if (data.role === "vendeur") {
      const { error } = await supabase.from("seller_details").insert({
        user_id: userId,
        business_type: data.businessType || "artisan_individuel",
        business_name: data.businessName || "",
        region: data.region || "dakar",
        activity_sector: data.activitySector || "artisanat",
        ninea: data.ninea || null,
      } as any);
      if (error) console.error("Error inserting seller details:", error);
    } else if (data.role === "agent") {
      const { error } = await supabase.from("agent_details").insert({
        user_id: userId,
        matricule: data.matricule || "",
        direction: data.direction || "",
        assigned_region: data.assignedRegion || null,
      } as any);
      if (error) console.error("Error inserting agent details:", error);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: any }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserRole(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
