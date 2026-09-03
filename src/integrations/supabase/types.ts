export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      co_living_inquiries: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          message: string | null;
          name: string | null;
          phone: string | null;
          preferred_location: string | null;
          role: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string | null;
          name?: string | null;
          phone?: string | null;
          preferred_location?: string | null;
          role?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string | null;
          name?: string | null;
          phone?: string | null;
          preferred_location?: string | null;
          role?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      crowdsourced_room_listings: {
        Row: {
          address_location: string | null;
          created_at: string;
          id: string;
          owner_name: string | null;
          owner_phone: string | null;
          photos_urls: string[];
          ratings: number | null;
          rent_amount: number | null;
          status: string;
          student_id: string | null;
          student_review: string | null;
        };
        Insert: {
          address_location?: string | null;
          created_at?: string;
          id?: string;
          owner_name?: string | null;
          owner_phone?: string | null;
          photos_urls?: string[];
          ratings?: number | null;
          rent_amount?: number | null;
          status?: string;
          student_id?: string | null;
          student_review?: string | null;
        };
        Update: {
          address_location?: string | null;
          created_at?: string;
          id?: string;
          owner_name?: string | null;
          owner_phone?: string | null;
          photos_urls?: string[];
          ratings?: number | null;
          rent_amount?: number | null;
          status?: string;
          student_id?: string | null;
          student_review?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      stash_bookings: {
        Row: {
          bag_count: number | null;
          city: string | null;
          created_at: string;
          duration_months: number | null;
          email: string | null;
          id: string;
          phone: string | null;
          total_amount: number | null;
          user_id: string | null;
          user_name: string | null;
        };
        Insert: {
          bag_count?: number | null;
          city?: string | null;
          created_at?: string;
          duration_months?: number | null;
          email?: string | null;
          id?: string;
          phone?: string | null;
          total_amount?: number | null;
          user_id?: string | null;
          user_name?: string | null;
        };
        Update: {
          bag_count?: number | null;
          city?: string | null;
          created_at?: string;
          duration_months?: number | null;
          email?: string | null;
          id?: string;
          phone?: string | null;
          total_amount?: number | null;
          user_id?: string | null;
          user_name?: string | null;
        };
        Relationships: [];
      };
      waitlist_leads: {
        Row: {
          city: string | null;
          created_at: string;
          email: string | null;
          id: string;
          note: string | null;
          phone: string | null;
          source: string | null;
          user_id: string | null;
          user_type: string | null;
        };
        Insert: {
          city?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          note?: string | null;
          phone?: string | null;
          source?: string | null;
          user_id?: string | null;
          user_type?: string | null;
        };
        Update: {
          city?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          note?: string | null;
          phone?: string | null;
          source?: string | null;
          user_id?: string | null;
          user_type?: string | null;
        };
        Relationships: [];
      };
      users_waitlist: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone_number: string | null;
          user_type: string;
          college_or_locality: string | null;
          verified: boolean;
          avatar_url: string | null;
          source: string | null;
          created_at: string;
          bio: string | null;
          address: string | null;
          emergency_contact: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone_number?: string | null;
          user_type?: string;
          college_or_locality?: string | null;
          verified?: boolean;
          avatar_url?: string | null;
          source?: string | null;
          created_at?: string;
          bio?: string | null;
          address?: string | null;
          emergency_contact?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone_number?: string | null;
          user_type?: string;
          college_or_locality?: string | null;
          verified?: boolean;
          avatar_url?: string | null;
          source?: string | null;
          created_at?: string;
          bio?: string | null;
          address?: string | null;
          emergency_contact?: string | null;
        };
        Relationships: [];
      };
      meal_vendors: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          location: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          location: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          location?: string;
          name?: string;
        };
        Relationships: [];
      };
      meal_bookings: {
        Row: {
          created_at: string;
          cutoff_time: string | null;
          delivery_address: string | null;
          delivery_runner_payout: number | null;
          fulfillment_type: string | null;
          id: string;
          meal_date: string | null;
          meal_slot: string | null;
          menu_id: string | null;
          order_status: string | null;
          pickup_code: string | null;
          tokens_debited: number;
          user_name: string | null;
          user_phone: string;
          vendor_id: string | null;
          vendor_payout: number | null;
          vendor_selected: string | null;
        };
        Insert: {
          created_at?: string;
          cutoff_time?: string | null;
          delivery_address?: string | null;
          delivery_runner_payout?: number | null;
          fulfillment_type?: string | null;
          id?: string;
          meal_date?: string | null;
          meal_slot?: string | null;
          menu_id?: string | null;
          order_status?: string | null;
          pickup_code?: string | null;
          tokens_debited?: number;
          user_name?: string | null;
          user_phone: string;
          vendor_id?: string | null;
          vendor_payout?: number | null;
          vendor_selected?: string | null;
        };
        Update: {
          created_at?: string;
          cutoff_time?: string | null;
          delivery_address?: string | null;
          delivery_runner_payout?: number | null;
          fulfillment_type?: string | null;
          id?: string;
          meal_date?: string | null;
          meal_slot?: string | null;
          menu_id?: string | null;
          order_status?: string | null;
          pickup_code?: string | null;
          tokens_debited?: number;
          user_name?: string | null;
          user_phone?: string;
          vendor_id?: string | null;
          vendor_payout?: number | null;
          vendor_selected?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "meal_bookings_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "meal_vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      meal_reviews: {
        Row: {
          booking_id: string;
          created_at: string;
          feedback_text: string | null;
          id: string;
          issue_category:
            | "taste_quality"
            | "raw_or_burnt"
            | "hygiene_foreign_object"
            | "missing_items"
            | "other"
            | null;
          photo_url: string | null;
          rating: number;
          refund_status: "not_eligible" | "auto_credited" | "under_review" | "rejected";
          refund_tokens: number;
          user_phone: string;
          vendor_id: string;
        };
        Insert: {
          booking_id: string;
          created_at?: string;
          feedback_text?: string | null;
          id?: string;
          issue_category?:
            | "taste_quality"
            | "raw_or_burnt"
            | "hygiene_foreign_object"
            | "missing_items"
            | "other"
            | null;
          photo_url?: string | null;
          rating: number;
          refund_status?: "not_eligible" | "auto_credited" | "under_review" | "rejected";
          refund_tokens?: number;
          user_phone: string;
          vendor_id: string;
        };
        Update: {
          booking_id?: string;
          created_at?: string;
          feedback_text?: string | null;
          id?: string;
          issue_category?:
            | "taste_quality"
            | "raw_or_burnt"
            | "hygiene_foreign_object"
            | "missing_items"
            | "other"
            | null;
          photo_url?: string | null;
          rating?: number;
          refund_status?: "not_eligible" | "auto_credited" | "under_review" | "rejected";
          refund_tokens?: number;
          user_phone?: string;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meal_reviews_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "meal_bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meal_reviews_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "meal_vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      user_shield_quotas: {
        Row: {
          is_shield_blocked: boolean;
          last_claim_date: string | null;
          monthly_claims_used: number;
          total_lifetime_strikes: number;
          user_phone: string;
        };
        Insert: {
          is_shield_blocked?: boolean;
          last_claim_date?: string | null;
          monthly_claims_used?: number;
          total_lifetime_strikes?: number;
          user_phone: string;
        };
        Update: {
          is_shield_blocked?: boolean;
          last_claim_date?: string | null;
          monthly_claims_used?: number;
          total_lifetime_strikes?: number;
          user_phone?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      process_taste_shield_claim: {
        Args: {
          p_booking_id: string;
          p_user_phone: string;
          p_vendor_id: string;
          p_rating: number;
          p_issue_category?: string | null;
          p_feedback_text?: string | null;
          p_photo_url?: string | null;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
