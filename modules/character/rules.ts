import type { Enums } from "@/lib/supabase/database.types";

type Ability = Enums<"Ability">;
type Skill = Enums<"Skill">;

/**
 * Las reglas derivadas de D&D 5e, en funciones puras.
 *
 * Sin React ni base de datos: se puede importar desde cualquier sitio y razonar sobre
 * ella sin montar nada. Todo lo que la app calcula en vez de guardar sale de
 * aquí, así que si una cifra de la ficha no cuadra, el fallo está en este
 * fichero y en ningún otro.
 */

export const ABILITIES = [
  "STRENGTH",
  "DEXTERITY",
  "CONSTITUTION",
  "INTELLIGENCE",
  "WISDOM",
  "CHARISMA",
] as const satisfies readonly Ability[];

export const ABILITY_LABELS: Record<Ability, string> = {
  STRENGTH: "Fuerza",
  DEXTERITY: "Destreza",
  CONSTITUTION: "Constitución",
  INTELLIGENCE: "Inteligencia",
  WISDOM: "Sabiduría",
  CHARISMA: "Carisma",
};

export const ABILITY_SHORT: Record<Ability, string> = {
  STRENGTH: "FUE",
  DEXTERITY: "DES",
  CONSTITUTION: "CON",
  INTELLIGENCE: "INT",
  WISDOM: "SAB",
  CHARISMA: "CAR",
};

/** Nombre de la columna que guarda cada puntuación. */
export const ABILITY_FIELD = {
  STRENGTH: "strength",
  DEXTERITY: "dexterity",
  CONSTITUTION: "constitution",
  INTELLIGENCE: "intelligence",
  WISDOM: "wisdom",
  CHARISMA: "charisma",
} as const satisfies Record<Ability, string>;

/** Las 18 habilidades, en el orden en que aparecen en la hoja en español. */
export const SKILLS = [
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
] as const satisfies readonly Skill[];

export const SKILL_LABELS: Record<Skill, string> = {
  ACROBATICS: "Acrobacias",
  ATHLETICS: "Atletismo",
  ARCANA: "C. Arcano",
  DECEPTION: "Engaño",
  HISTORY: "Historia",
  PERFORMANCE: "Interpretación",
  INTIMIDATION: "Intimidación",
  INVESTIGATION: "Investigación",
  SLEIGHT_OF_HAND: "Juego de Manos",
  MEDICINE: "Medicina",
  NATURE: "Naturaleza",
  PERCEPTION: "Percepción",
  INSIGHT: "Perspicacia",
  PERSUASION: "Persuasión",
  RELIGION: "Religión",
  STEALTH: "Sigilo",
  SURVIVAL: "Supervivencia",
  ANIMAL_HANDLING: "T. con Animales",
};

/** De qué característica depende cada habilidad. */
export const SKILL_ABILITY: Record<Skill, Ability> = {
  ACROBATICS: "DEXTERITY",
  ATHLETICS: "STRENGTH",
  ARCANA: "INTELLIGENCE",
  DECEPTION: "CHARISMA",
  HISTORY: "INTELLIGENCE",
  PERFORMANCE: "CHARISMA",
  INTIMIDATION: "CHARISMA",
  INVESTIGATION: "INTELLIGENCE",
  SLEIGHT_OF_HAND: "DEXTERITY",
  MEDICINE: "WISDOM",
  NATURE: "INTELLIGENCE",
  PERCEPTION: "WISDOM",
  INSIGHT: "WISDOM",
  PERSUASION: "CHARISMA",
  RELIGION: "INTELLIGENCE",
  STEALTH: "DEXTERITY",
  SURVIVAL: "WISDOM",
  ANIMAL_HANDLING: "WISDOM",
};

/** Puntuaciones de las seis características. */
export type AbilityScores = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export function abilityScore(scores: AbilityScores, ability: Ability): number {
  switch (ability) {
    case "STRENGTH":
      return scores.strength;
    case "DEXTERITY":
      return scores.dexterity;
    case "CONSTITUTION":
      return scores.constitution;
    case "INTELLIGENCE":
      return scores.intelligence;
    case "WISDOM":
      return scores.wisdom;
    case "CHARISMA":
      return scores.charisma;
  }
}

/** (puntuación - 10) / 2, redondeando hacia abajo. */
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** +2 a nivel 1-4, +3 a 5-8, +4 a 9-12, +5 a 13-16, +6 a 17-20. */
export function proficiencyBonus(level: number): number {
  return 2 + Math.floor((Math.min(Math.max(level, 1), 20) - 1) / 4);
}

/** Los bonos siempre se escriben con signo: "+3", "-1", "+0". */
export function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

export type CharacterStats = AbilityScores & {
  level: number;
  saveProficiencies: Ability[];
  skillProficiencies: Skill[];
  skillExpertise: Skill[];
  initiativeOverride: number | null;
  spellcastingAbility: Ability | null;
  spellSaveDcOverride: number | null;
  spellAttackBonusOverride: number | null;
};

export function saveBonus(stats: CharacterStats, ability: Ability): number {
  const base = abilityModifier(abilityScore(stats, ability));
  const proficient = stats.saveProficiencies.includes(ability);
  return base + (proficient ? proficiencyBonus(stats.level) : 0);
}

export function skillBonus(stats: CharacterStats, skill: Skill): number {
  const base = abilityModifier(abilityScore(stats, SKILL_ABILITY[skill]));
  const bonus = proficiencyBonus(stats.level);

  // La experiencia (expertise) dobla la competencia, no la sustituye. Y solo
  // aplica si además eres competente: sin competencia no hay nada que doblar.
  if (stats.skillExpertise.includes(skill)) return base + bonus * 2;
  if (stats.skillProficiencies.includes(skill)) return base + bonus;
  return base;
}

/** Sin tirar el dado: 10 + el bono de Percepción. */
export function passivePerception(stats: CharacterStats): number {
  return 10 + skillBonus(stats, "PERCEPTION");
}

export function initiative(stats: CharacterStats): number {
  return stats.initiativeOverride ?? abilityModifier(stats.dexterity);
}

/** `null` si el personaje no lanza conjuros (no ha elegido aptitud mágica). */
export function spellSaveDc(stats: CharacterStats): number | null {
  if (stats.spellSaveDcOverride !== null) return stats.spellSaveDcOverride;
  if (!stats.spellcastingAbility) return null;
  return (
    8 +
    proficiencyBonus(stats.level) +
    abilityModifier(abilityScore(stats, stats.spellcastingAbility))
  );
}

export function spellAttackBonus(stats: CharacterStats): number | null {
  if (stats.spellAttackBonusOverride !== null) {
    return stats.spellAttackBonusOverride;
  }
  if (!stats.spellcastingAbility) return null;
  return (
    proficiencyBonus(stats.level) +
    abilityModifier(abilityScore(stats, stats.spellcastingAbility))
  );
}

export const CURRENCIES = [
  { field: "platinum", short: "PPT", label: "Platino" },
  { field: "gold", short: "PO", label: "Oro" },
  { field: "electrum", short: "PE", label: "Electro" },
  { field: "silver", short: "PP", label: "Plata" },
  { field: "copper", short: "PC", label: "Cobre" },
] as const;

export type CurrencyField = (typeof CURRENCIES)[number]["field"];
