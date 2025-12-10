export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agent_details: {
        Row: {
          assigned_region: Database["public"]["Enums"]["senegal_region"] | null
          created_at: string
          direction: string
          id: string
          matricule: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_region?: Database["public"]["Enums"]["senegal_region"] | null
          created_at?: string
          direction: string
          id?: string
          matricule: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_region?: Database["public"]["Enums"]["senegal_region"] | null
          created_at?: string
          direction?: string
          id?: string
          matricule?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      buyer_details: {
        Row: {
          city: string | null
          created_at: string
          delivery_address: string | null
          id: string
          product_preferences: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          delivery_address?: string | null
          id?: string
          product_preferences?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          delivery_address?: string | null
          id?: string
          product_preferences?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          qr_code: string | null
          rejection_reason: string | null
          review_date: string | null
          reviewed_by: string | null
          seller_id: string
          status: Database["public"]["Enums"]["certification_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          qr_code?: string | null
          rejection_reason?: string | null
          review_date?: string | null
          reviewed_by?: string | null
          seller_id: string
          status?: Database["public"]["Enums"]["certification_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          qr_code?: string | null
          rejection_reason?: string | null
          review_date?: string | null
          reviewed_by?: string | null
          seller_id?: string
          status?: Database["public"]["Enums"]["certification_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      export_authorizations: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          countries_authorized: string[]
          created_at: string
          id: string
          products_authorized: Json
          seller_id: string
          status: string
          valid_until: string
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          countries_authorized?: string[]
          created_at?: string
          id?: string
          products_authorized?: Json
          seller_id: string
          status?: string
          valid_until?: string
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          countries_authorized?: string[]
          created_at?: string
          id?: string
          products_authorized?: Json
          seller_id?: string
          status?: string
          valid_until?: string
        }
        Relationships: []
      }
      export_requests: {
        Row: {
          created_at: string
          destination_country: string
          documents_generated: Json | null
          finalized_at: string | null
          id: string
          insurance: boolean | null
          payment_method: string | null
          products: Json
          quantity_total: number
          seller_id: string
          shipping_cost: number | null
          status: string
          step_current: number
          step_statuses: Json
          total_amount: number | null
          tracking_number: string | null
          transporter: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_country: string
          documents_generated?: Json | null
          finalized_at?: string | null
          id?: string
          insurance?: boolean | null
          payment_method?: string | null
          products?: Json
          quantity_total?: number
          seller_id: string
          shipping_cost?: number | null
          status?: string
          step_current?: number
          step_statuses?: Json
          total_amount?: number | null
          tracking_number?: string | null
          transporter?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_country?: string
          documents_generated?: Json | null
          finalized_at?: string | null
          id?: string
          insurance?: boolean | null
          payment_method?: string | null
          products?: Json
          quantity_total?: number
          seller_id?: string
          shipping_cost?: number | null
          status?: string
          step_current?: number
          step_statuses?: Json
          total_amount?: number | null
          tracking_number?: string | null
          transporter?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      member_cards: {
        Row: {
          card_id: string
          certification_status: string
          created_at: string
          date_emission: string
          date_expiration: string
          id: string
          is_active: boolean
          member_type: string
          qr_code_hash: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          card_id: string
          certification_status?: string
          created_at?: string
          date_emission?: string
          date_expiration?: string
          id?: string
          is_active?: boolean
          member_type?: string
          qr_code_hash?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string
          certification_status?: string
          created_at?: string
          date_emission?: string
          date_expiration?: string
          id?: string
          is_active?: boolean
          member_type?: string
          qr_code_hash?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          delivery_address: string | null
          delivery_city: string | null
          id: string
          payment_method: string | null
          product_id: string
          quantity: number
          seller_id: string
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          tracking_code: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          delivery_address?: string | null
          delivery_city?: string | null
          id?: string
          payment_method?: string | null
          product_id: string
          quantity?: number
          seller_id: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          tracking_code?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          delivery_address?: string | null
          delivery_city?: string | null
          id?: string
          payment_method?: string | null
          product_id?: string
          quantity?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          tracking_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          seller_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          seller_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          seller_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          certification_id: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_certified: boolean | null
          name: string
          origin_region: Database["public"]["Enums"]["senegal_region"] | null
          price: number
          qr_code: string | null
          seller_id: string
          stock: number | null
          updated_at: string
        }
        Insert: {
          category: string
          certification_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_certified?: boolean | null
          name: string
          origin_region?: Database["public"]["Enums"]["senegal_region"] | null
          price: number
          qr_code?: string | null
          seller_id: string
          stock?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          certification_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_certified?: boolean | null
          name?: string
          origin_region?: Database["public"]["Enums"]["senegal_region"] | null
          price?: number
          qr_code?: string | null
          seller_id?: string
          stock?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seller_details: {
        Row: {
          activity_sector: Database["public"]["Enums"]["activity_sector"]
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"]
          created_at: string
          employees_count: number
          id: string
          is_certified: boolean | null
          ninea: string | null
          photos: string[] | null
          region: Database["public"]["Enums"]["senegal_region"]
          rejection_reason: string | null
          updated_at: string
          user_id: string
          validated_by: string | null
          validation_date: string | null
          validation_status: Database["public"]["Enums"]["seller_status"]
        }
        Insert: {
          activity_sector: Database["public"]["Enums"]["activity_sector"]
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"]
          created_at?: string
          employees_count?: number
          id?: string
          is_certified?: boolean | null
          ninea?: string | null
          photos?: string[] | null
          region: Database["public"]["Enums"]["senegal_region"]
          rejection_reason?: string | null
          updated_at?: string
          user_id: string
          validated_by?: string | null
          validation_date?: string | null
          validation_status?: Database["public"]["Enums"]["seller_status"]
        }
        Update: {
          activity_sector?: Database["public"]["Enums"]["activity_sector"]
          business_name?: string
          business_type?: Database["public"]["Enums"]["business_type"]
          created_at?: string
          employees_count?: number
          id?: string
          is_certified?: boolean | null
          ninea?: string | null
          photos?: string[] | null
          region?: Database["public"]["Enums"]["senegal_region"]
          rejection_reason?: string | null
          updated_at?: string
          user_id?: string
          validated_by?: string | null
          validation_date?: string | null
          validation_status?: Database["public"]["Enums"]["seller_status"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_card_id: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      activity_sector:
        | "artisanat"
        | "textile"
        | "agroalimentaire"
        | "cosmetiques"
        | "autre"
      app_role: "acheteur" | "vendeur" | "agent"
      business_type: "artisan_individuel" | "pme" | "cooperative"
      certification_status: "en_attente" | "approuvee" | "refusee"
      order_status:
        | "en_attente"
        | "confirmee"
        | "en_preparation"
        | "expediee"
        | "livree"
        | "annulee"
      seller_status: "en_attente" | "valide" | "refuse"
      senegal_region:
        | "dakar"
        | "thies"
        | "saint_louis"
        | "diourbel"
        | "louga"
        | "fatick"
        | "kaolack"
        | "kolda"
        | "ziguinchor"
        | "tambacounda"
        | "matam"
        | "kaffrine"
        | "kedougou"
        | "sedhiou"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_sector: [
        "artisanat",
        "textile",
        "agroalimentaire",
        "cosmetiques",
        "autre",
      ],
      app_role: ["acheteur", "vendeur", "agent"],
      business_type: ["artisan_individuel", "pme", "cooperative"],
      certification_status: ["en_attente", "approuvee", "refusee"],
      order_status: [
        "en_attente",
        "confirmee",
        "en_preparation",
        "expediee",
        "livree",
        "annulee",
      ],
      seller_status: ["en_attente", "valide", "refuse"],
      senegal_region: [
        "dakar",
        "thies",
        "saint_louis",
        "diourbel",
        "louga",
        "fatick",
        "kaolack",
        "kolda",
        "ziguinchor",
        "tambacounda",
        "matam",
        "kaffrine",
        "kedougou",
        "sedhiou",
      ],
    },
  },
} as const
