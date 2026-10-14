import type { Skill } from '@/lib/supabase/database.types';

export interface BackgroundSpecialty {
  value: number;
  label: string;
  description?: string;
}

export interface BackgroundVariant {
  name: string;
  description: string;
  featureName: string;
  featureDescription: string;
  skillProficiencies: Skill[];
  toolProficiencies: string[];
  languagesCount: number;
  equipment: string[];
  gold: number;
}

export interface Background {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  featureName: string;
  featureDescription: string;
  skillProficiencies: Skill[];
  toolProficiencies: string[];
  languagesCount: number;
  languagesChoice: boolean;
  equipment: string[];
  gold: number;
  variantOf: string | null;
  variant: BackgroundVariant | null;
  specialties: BackgroundSpecialty[] | null;
  personalityTraits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BackgroundFormData {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  featureName: string;
  featureDescription: string;
  skillProficiencies: Skill[];
  toolProficiencies: string[];
  languagesCount: number;
  languagesChoice: boolean;
  equipment: string[];
  gold: number;
  variantOf?: string | null;
  variant?: BackgroundVariant | null;
  specialties?: BackgroundSpecialty[] | null;
  personalityTraits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
}

export const BACKGROUND_SKILL_MAPPING: Record<string, Skill> = {
  'Acrobacias': 'ACROBATICS',
  'Atletismo': 'ATHLETICS',
  'Arcano': 'ARCANA',
  'Engañar': 'DECEPTION',
  'Historia': 'HISTORY',
  'Interpretación': 'PERFORMANCE',
  'Intimidación': 'INTIMIDATION',
  'Investigación': 'INVESTIGATION',
  'Juego de Manos': 'SLEIGHT_OF_HAND',
  'Medicina': 'MEDICINE',
  'Naturaleza': 'NATURE',
  'Percepción': 'PERCEPTION',
  'Persuasión': 'PERSUASION',
  'Religión': 'RELIGION',
  'Sigilo': 'STEALTH',
  'Supervivencia': 'SURVIVAL',
  'Trato con animales': 'ANIMAL_HANDLING',
  'Averiguar intenciones': 'INSIGHT',
};