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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      attacks: {
        Row: {
          bonus: string | null
          character_id: string
          created_at: string
          damage: string | null
          id: string
          name: string
        }
        Insert: {
          bonus?: string | null
          character_id: string
          created_at?: string
          damage?: string | null
          id?: string
          name: string
        }
        Update: {
          bonus?: string | null
          character_id?: string
          created_at?: string
          damage?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "attacks_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          additional_features: string | null
          age: number | null
          alignment: string | null
          allies_and_organizations: string | null
          armor_class: number | null
          background: string | null
          backstory: string | null
          bonds: string | null
          campaign: string | null
          charisma: number
          class: string | null
          constitution: number
          copper: number
          created_at: string
          current_hp: number | null
          death_save_failures: number
          death_save_successes: number
          dexterity: number
          electrum: number
          experience_points: number | null
          eyes: string | null
          features_and_traits: string | null
          flaws: string | null
          gold: number
          hair: string | null
          height: string | null
          hit_dice: string | null
          hit_dice_spent: number
          id: string
          ideals: string | null
          image_path: string | null
          initiative_override: number | null
          inspiration: boolean
          intelligence: number
          level: number
          max_hp: number | null
          name: string
          organization_name: string | null
          other_proficiencies: string | null
          owner_id: string
          personality_traits: string | null
          platinum: number
          player_name: string | null
          proficiency_bonus_override: number | null
          race: string | null
          save_proficiencies: Database["public"]["Enums"]["Ability"][]
          silver: number
          skill_expertise: Database["public"]["Enums"]["Skill"][]
          skill_proficiencies: Database["public"]["Enums"]["Skill"][]
          skin: string | null
          speed: number | null
          spell_attack_bonus_override: number | null
          spell_save_dc_override: number | null
          spellcasting_ability: Database["public"]["Enums"]["Ability"] | null
          spellcasting_class: string | null
          strength: number
          temporary_hp: number | null
          treasure: string | null
          updated_at: string
          weight: string | null
          wisdom: number
        }
        Insert: {
          additional_features?: string | null
          age?: number | null
          alignment?: string | null
          allies_and_organizations?: string | null
          armor_class?: number | null
          background?: string | null
          backstory?: string | null
          bonds?: string | null
          campaign?: string | null
          charisma?: number
          class?: string | null
          constitution?: number
          copper?: number
          created_at?: string
          current_hp?: number | null
          death_save_failures?: number
          death_save_successes?: number
          dexterity?: number
          electrum?: number
          experience_points?: number | null
          eyes?: string | null
          features_and_traits?: string | null
          flaws?: string | null
          gold?: number
          hair?: string | null
          height?: string | null
          hit_dice?: string | null
          hit_dice_spent?: number
          id?: string
          ideals?: string | null
          image_path?: string | null
          initiative_override?: number | null
          inspiration?: boolean
          intelligence?: number
          level?: number
          max_hp?: number | null
          name: string
          organization_name?: string | null
          other_proficiencies?: string | null
          owner_id: string
          personality_traits?: string | null
          platinum?: number
          player_name?: string | null
          proficiency_bonus_override?: number | null
          race?: string | null
          save_proficiencies?: Database["public"]["Enums"]["Ability"][]
          silver?: number
          skill_expertise?: Database["public"]["Enums"]["Skill"][]
          skill_proficiencies?: Database["public"]["Enums"]["Skill"][]
          skin?: string | null
          speed?: number | null
          spell_attack_bonus_override?: number | null
          spell_save_dc_override?: number | null
          spellcasting_ability?: Database["public"]["Enums"]["Ability"] | null
          spellcasting_class?: string | null
          strength?: number
          temporary_hp?: number | null
          treasure?: string | null
          updated_at?: string
          weight?: string | null
          wisdom?: number
        }
        Update: {
          additional_features?: string | null
          age?: number | null
          alignment?: string | null
          allies_and_organizations?: string | null
          armor_class?: number | null
          background?: string | null
          backstory?: string | null
          bonds?: string | null
          campaign?: string | null
          charisma?: number
          class?: string | null
          constitution?: number
          copper?: number
          created_at?: string
          current_hp?: number | null
          death_save_failures?: number
          death_save_successes?: number
          dexterity?: number
          electrum?: number
          experience_points?: number | null
          eyes?: string | null
          features_and_traits?: string | null
          flaws?: string | null
          gold?: number
          hair?: string | null
          height?: string | null
          hit_dice?: string | null
          hit_dice_spent?: number
          id?: string
          ideals?: string | null
          image_path?: string | null
          initiative_override?: number | null
          inspiration?: boolean
          intelligence?: number
          level?: number
          max_hp?: number | null
          name?: string
          organization_name?: string | null
          other_proficiencies?: string | null
          owner_id?: string
          personality_traits?: string | null
          platinum?: number
          player_name?: string | null
          proficiency_bonus_override?: number | null
          race?: string | null
          save_proficiencies?: Database["public"]["Enums"]["Ability"][]
          silver?: number
          skill_expertise?: Database["public"]["Enums"]["Skill"][]
          skill_proficiencies?: Database["public"]["Enums"]["Skill"][]
          skin?: string | null
          speed?: number | null
          spell_attack_bonus_override?: number | null
          spell_save_dc_override?: number | null
          spellcasting_ability?: Database["public"]["Enums"]["Ability"] | null
          spellcasting_class?: string | null
          strength?: number
          temporary_hp?: number | null
          treasure?: string | null
          updated_at?: string
          weight?: string | null
          wisdom?: number
        }
        Relationships: [
          {
            foreignKeyName: "characters_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          character_id: string
          created_at: string
          description: string | null
          equipped: boolean
          id: string
          name: string
          quantity: number
          weight: number | null
        }
        Insert: {
          character_id: string
          created_at?: string
          description?: string | null
          equipped?: boolean
          id?: string
          name: string
          quantity?: number
          weight?: number | null
        }
        Update: {
          character_id?: string
          created_at?: string
          description?: string | null
          equipped?: boolean
          id?: string
          name?: string
          quantity?: number
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          body: string
          character_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          body: string
          character_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          body?: string
          character_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          display_name: string | null
          id: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string | null
          id: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      spell_slots: {
        Row: {
          character_id: string
          expended: number
          id: string
          level: number
          total: number
        }
        Insert: {
          character_id: string
          expended?: number
          id?: string
          level: number
          total?: number
        }
        Update: {
          character_id?: string
          expended?: number
          id?: string
          level?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "spell_slots_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      spells: {
        Row: {
          casting_time: string | null
          character_id: string
          components: string | null
          concentration: boolean
          created_at: string
          description: string | null
          duration: string | null
          id: string
          level: number
          name: string
          prepared: boolean
          range: string | null
          ritual: boolean
          school: Database["public"]["Enums"]["SpellSchool"] | null
        }
        Insert: {
          casting_time?: string | null
          character_id: string
          components?: string | null
          concentration?: boolean
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          level?: number
          name: string
          prepared?: boolean
          range?: string | null
          ritual?: boolean
          school?: Database["public"]["Enums"]["SpellSchool"] | null
        }
        Update: {
          casting_time?: string | null
          character_id?: string
          components?: string | null
          concentration?: boolean
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          level?: number
          name?: string
          prepared?: boolean
          range?: string | null
          ritual?: boolean
          school?: Database["public"]["Enums"]["SpellSchool"] | null
        }
        Relationships: [
          {
            foreignKeyName: "spells_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Ability:
        | "STRENGTH"
        | "DEXTERITY"
        | "CONSTITUTION"
        | "INTELLIGENCE"
        | "WISDOM"
        | "CHARISMA"
      Skill:
        | "ACROBATICS"
        | "ATHLETICS"
        | "ARCANA"
        | "DECEPTION"
        | "HISTORY"
        | "PERFORMANCE"
        | "INTIMIDATION"
        | "INVESTIGATION"
        | "SLEIGHT_OF_HAND"
        | "MEDICINE"
        | "NATURE"
        | "PERCEPTION"
        | "INSIGHT"
        | "PERSUASION"
        | "RELIGION"
        | "STEALTH"
        | "SURVIVAL"
        | "ANIMAL_HANDLING"
      SpellSchool:
        | "ABJURATION"
        | "CONJURATION"
        | "DIVINATION"
        | "ENCHANTMENT"
        | "EVOCATION"
        | "ILLUSION"
        | "NECROMANCY"
        | "TRANSMUTATION"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      Ability: [
        "STRENGTH",
        "DEXTERITY",
        "CONSTITUTION",
        "INTELLIGENCE",
        "WISDOM",
        "CHARISMA",
      ],
      Skill: [
        "ACROBATICS",
        "ATHLETICS",
        "ARCANA",
        "DECEPTION",
        "HISTORY",
        "PERFORMANCE",
        "INTIMIDATION",
        "INVESTIGATION",
        "SLEIGHT_OF_HAND",
        "MEDICINE",
        "NATURE",
        "PERCEPTION",
        "INSIGHT",
        "PERSUASION",
        "RELIGION",
        "STEALTH",
        "SURVIVAL",
        "ANIMAL_HANDLING",
      ],
      SpellSchool: [
        "ABJURATION",
        "CONJURATION",
        "DIVINATION",
        "ENCHANTMENT",
        "EVOCATION",
        "ILLUSION",
        "NECROMANCY",
        "TRANSMUTATION",
      ],
    },
  },
} as const
