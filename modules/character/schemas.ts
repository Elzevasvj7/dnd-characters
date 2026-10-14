import { z } from "zod";
import type { Enums } from "@/lib/supabase/database.types";
import { ABILITIES, SKILLS } from "./rules";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** Máximo de hojas (imágenes o PDFs) que se pueden enviar al OCR a la vez. */
export const MAX_SHEET_FILES = 3;

const ability = z.coerce.number().int().min(1).max(30).default(10);
const optionalInt = (min: number, max: number) =>
  z.coerce.number().int().min(min).max(max).optional();

/** Un checkbox HTML no envía nada si está desmarcado, y "on" si lo está. */
const checkbox = z.coerce.boolean().default(false);

// ---------------------------------------------------------------------------
// Personaje, partido en las mismas secciones que se editan en la ficha.
// ---------------------------------------------------------------------------

export const identitySchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(80),
  age: optionalInt(0, 10_000),
  race: z.string().trim().max(60).optional(),
  class: z.string().trim().max(60).optional(),
  level: z.coerce.number().int().min(1).max(20).default(1),
  background: z.string().trim().max(120).optional(),
  alignment: z.string().trim().max(40).optional(),
  playerName: z.string().trim().max(80).optional(),
  experiencePoints: optionalInt(0, 999_999),
  inspiration: checkbox,
  campaign: z.string().trim().max(60).optional(),
});

export const abilitiesSchema = z.object({
  strength: ability,
  dexterity: ability,
  constitution: ability,
  intelligence: ability,
  wisdom: ability,
  charisma: ability,
});

export const combatSchema = z.object({
  maxHp: optionalInt(0, 9999),
  currentHp: optionalInt(-999, 9999),
  temporaryHp: optionalInt(0, 9999),
  armorClass: optionalInt(0, 99),
  speed: optionalInt(0, 999),
  hitDice: z.string().trim().max(30).optional(),
  hitDiceSpent: z.coerce.number().int().min(0).max(20).default(0),
  deathSaveSuccesses: z.coerce.number().int().min(0).max(3).default(0),
  deathSaveFailures: z.coerce.number().int().min(0).max(3).default(0),
  // `null` significa "usa el cálculo"; solo se rellena si un objeto mágico
  // rompe la fórmula. Por eso es opcional y no tiene default numérico.
  initiativeOverride: optionalInt(-20, 20),
});


export type IdentityInput = z.infer<typeof identitySchema>;
export type AbilitiesInput = z.infer<typeof abilitiesSchema>;
export type CombatInput = z.infer<typeof combatSchema>;

// ---------------------------------------------------------------------------
// Conjuros
// ---------------------------------------------------------------------------

// `satisfies` ata esta tupla al enum de Postgres: si algún día añades una escuela
// a la base de datos, regeneras los tipos y te olvidas de esta lista, el
// build lo canta.
export const SPELL_SCHOOLS = [
  "ABJURATION",
  "CONJURATION",
  "DIVINATION",
  "ENCHANTMENT",
  "EVOCATION",
  "ILLUSION",
  "NECROMANCY",
  "TRANSMUTATION",
] as const satisfies readonly Enums<"SpellSchool">[];

export const SPELL_SCHOOL_LABELS: Record<Enums<"SpellSchool">, string> = {
  ABJURATION: "Abjuración",
  CONJURATION: "Conjuración",
  DIVINATION: "Adivinación",
  ENCHANTMENT: "Encantamiento",
  EVOCATION: "Evocación",
  ILLUSION: "Ilusión",
  NECROMANCY: "Nigromancia",
  TRANSMUTATION: "Transmutación",
};

export const SPELL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/** Nivel 0 no se llama "nivel 0" en la mesa: es un truco. */
export function spellLevelLabel(level: number): string {
  return level === 0 ? "Truco" : `Nivel ${level}`;
}

/** Igual, pero para encabezar un grupo de conjuros. */
export function spellGroupLabel(level: number): string {
  return level === 0 ? "Trucos" : `Nivel ${level}`;
}

export const spellSchema = z.object({
  characterId: z.uuid("Personaje inválido"),
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  level: z.coerce.number().int().min(0).max(9).default(0),
  school: z.enum(SPELL_SCHOOLS).optional(),
  castingTime: z.string().trim().max(60).optional(),
  range: z.string().trim().max(60).optional(),
  duration: z.string().trim().max(60).optional(),
  components: z.string().trim().max(60).optional(),
  concentration: checkbox,
  ritual: checkbox,
  description: z.string().trim().max(2000).optional(),
});

export type SpellInput = z.infer<typeof spellSchema>;

// ---------------------------------------------------------------------------

export const noteSchema = z.object({
  characterId: z.uuid("Personaje inválido"),
  body: z.string().trim().min(1, "La nota no puede estar vacía").max(5000),
});

export const itemSchema = z.object({
  characterId: z.uuid("Personaje inválido"),
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  quantity: z.coerce.number().int().min(1).max(9999).default(1),
  weight: z.coerce.number().min(0).max(9999).optional(),
  description: z.string().trim().max(1000).optional(),
});

export const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_IMAGE_BYTES, "La imagen supera los 4 MB")
  .refine(
    (file) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type),
    "Formato no admitido: usa JPG, PNG o WebP",
  );

/**
 * FormData → objeto plano para Zod.
 *
 * Los inputs vacíos de un formulario HTML llegan como `""`, y `z.coerce.number()`
 * convertiría eso en `0` silenciosamente: un personaje sin edad acabaría con
 * edad 0. Los descartamos para que `.optional()` haga su trabajo.
 *
 * Ojo al editar: un campo vaciado también desaparece aquí, así que las
 * mutaciones de update tienen que traducir `undefined` a `null` de forma
 * explícita. Si no, borrar un valor no lo borraría nunca.
 */
export function formToObject(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    if (value === "") continue;
    result[key] = value;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Competencias, personalidad, aspecto, trasfondo, monedas y lanzamiento
// ---------------------------------------------------------------------------

export const proficienciesSchema = z.object({
  // Vacío = el que toca por nivel. Solo se rellena por reglas caseras.
  proficiencyBonusOverride: optionalInt(0, 20),
  saveProficiencies: z.array(z.enum(ABILITIES)).default([]),
  skillProficiencies: z.array(z.enum(SKILLS)).default([]),
  skillExpertise: z.array(z.enum(SKILLS)).default([]),
  otherProficiencies: z.string().trim().max(2000).optional(),
});

/** Los campos que llegan repetidos (checkboxes con el mismo `name`). */
export const PROFICIENCY_LIST_KEYS = [
  "saveProficiencies",
  "skillProficiencies",
  "skillExpertise",
] as const;

export const personalitySchema = z.object({
  personalityTraits: z.string().trim().max(2000).optional(),
  ideals: z.string().trim().max(2000).optional(),
  bonds: z.string().trim().max(2000).optional(),
  flaws: z.string().trim().max(2000).optional(),
});

export const appearanceSchema = z.object({
  height: z.string().trim().max(30).optional(),
  weight: z.string().trim().max(30).optional(),
  eyes: z.string().trim().max(30).optional(),
  skin: z.string().trim().max(30).optional(),
  hair: z.string().trim().max(30).optional(),
});

export const loreSchema = z.object({
  backstory: z.string().trim().max(10_000).optional(),
  alliesAndOrganizations: z.string().trim().max(5000).optional(),
  organizationName: z.string().trim().max(120).optional(),
  featuresAndTraits: z.string().trim().max(10_000).optional(),
  additionalFeatures: z.string().trim().max(10_000).optional(),
  treasure: z.string().trim().max(5000).optional(),
});

const coin = z.coerce.number().int().min(0).max(9_999_999).default(0);

export const currencySchema = z.object({
  platinum: coin,
  gold: coin,
  electrum: coin,
  silver: coin,
  copper: coin,
});

export const spellcastingSchema = z.object({
  spellcastingClass: z.string().trim().max(60).optional(),
  spellcastingAbility: z.enum(ABILITIES).optional(),
  spellSaveDcOverride: optionalInt(0, 40),
  spellAttackBonusOverride: optionalInt(-20, 20),
});

/**
 * El alta pide de una vez lo que en la ficha se edita por secciones: con las
 * características, competencias, personalidad, trasfondo, monedas y conjuros.
 */
export const characterSchema = z.object({
  ...identitySchema.shape,
  ...abilitiesSchema.shape,
  ...combatSchema.shape,
  ...proficienciesSchema.shape,
  ...personalitySchema.shape,
  ...appearanceSchema.shape,
  ...loreSchema.shape,
  ...currencySchema.shape,
  ...spellcastingSchema.shape,
  attacksJson: z.string().optional(),
  itemsJson: z.string().optional(),
  spellsJson: z.string().optional(),
});

export type CharacterInput = z.infer<typeof characterSchema>;


export const attackSchema = z.object({
  characterId: z.uuid("Personaje inválido"),
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  bonus: z.string().trim().max(30).optional(),
  damage: z.string().trim().max(60).optional(),
});

export const spellSlotSchema = z.object({
  characterId: z.uuid("Personaje inválido"),
  level: z.coerce.number().int().min(1).max(9),
  total: z.coerce.number().int().min(0).max(20).default(0),
  expended: z.coerce.number().int().min(0).max(20).default(0),
});

export type ProficienciesInput = z.infer<typeof proficienciesSchema>;
export type PersonalityInput = z.infer<typeof personalitySchema>;
export type AppearanceInput = z.infer<typeof appearanceSchema>;
export type LoreInput = z.infer<typeof loreSchema>;
export type CurrencyInput = z.infer<typeof currencySchema>;
export type SpellcastingInput = z.infer<typeof spellcastingSchema>;

/**
 * FormData → objeto, incluyendo los grupos de casillas.
 *
 * `formToObject` se queda con el último valor de cada clave, y las competencias
 * llegan como N casillas con el mismo `name`. Hay que sacarlas con `getAll`.
 */
export function formToObjectWithLists(
  formData: FormData,
  listKeys: readonly string[],
): Record<string, unknown> {
  const result = formToObject(formData);
  for (const key of listKeys) {
    result[key] = formData
      .getAll(key)
      .filter((value): value is string => typeof value === "string");
  }
  return result;
}
