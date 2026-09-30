// Generado a partir del esquema de Supabase, con el formato de
// `supabase gen types typescript`. No lo edites a mano: cuando cambies una
// tabla, vuelve a generarlo (ver SETUP.md → `pnpm db:types`).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12"
  }
  public: {
    Tables: {
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

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]

export type Enums<T extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][T]

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
