import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getSignedImageUrl, getSignedImageUrls } from "@/lib/storage";
import { requireUser } from "@/modules/auth/queries";
import type { CharacterListItem } from "./types";

// Las columnas viven en snake_case y la app en camelCase. En vez de convertir
// a mano después, PostgREST renombra en el propio `select` con `alias:columna`,
// y los tipos de supabase-js entienden el alias: el resultado ya sale tipado
// con los nombres que usan los componentes.
//
// Faltan `owner_id` e `image_path` a propósito: el primero no le hace falta al
// cliente, y el segundo se pide aparte porque solo sirve para firmar la URL.
const CHARACTER_COLUMNS = `
  id, name, age, race, class, level, background, alignment,
  strength, dexterity, constitution, intelligence, wisdom, charisma,
  maxHp:max_hp, currentHp:current_hp, armorClass:armor_class, speed,
  playerName:player_name, experiencePoints:experience_points, inspiration,
  temporaryHp:temporary_hp, hitDice:hit_dice, hitDiceSpent:hit_dice_spent,
  deathSaveSuccesses:death_save_successes, deathSaveFailures:death_save_failures,
  initiativeOverride:initiative_override,
  proficiencyBonusOverride:proficiency_bonus_override,
  spellSaveDcOverride:spell_save_dc_override,
  spellAttackBonusOverride:spell_attack_bonus_override,
  saveProficiencies:save_proficiencies, skillProficiencies:skill_proficiencies,
  skillExpertise:skill_expertise,
  copper, silver, electrum, gold, platinum,
  otherProficiencies:other_proficiencies, personalityTraits:personality_traits,
  ideals, bonds, flaws, featuresAndTraits:features_and_traits,
  height, weight, eyes, skin, hair,
  alliesAndOrganizations:allies_and_organizations,
  organizationName:organization_name, backstory,
  additionalFeatures:additional_features, treasure,
  spellcastingClass:spellcasting_class, spellcastingAbility:spellcasting_ability,
  createdAt:created_at, updatedAt:updated_at,
  imagePath:image_path,
  items:inventory_items(
    id, characterId:character_id, name, quantity, weight, description,
    equipped, createdAt:created_at
  ),
  notes(
    id, characterId:character_id, body,
    createdAt:created_at, updatedAt:updated_at
  ),
  spells(
    id, characterId:character_id, name, level, school,
    castingTime:casting_time, range, duration, components,
    concentration, ritual, prepared, description, createdAt:created_at
  ),
  attacks(id, characterId:character_id, name, bonus, damage, createdAt:created_at),
  spellSlots:spell_slots(id, characterId:character_id, level, total, expended)
`;

/** Código de Postgres para "eso no es un UUID válido" (p. ej. /character/abc). */
const INVALID_TEXT_REPRESENTATION = "22P02";

export async function listMyCharacters(): Promise<CharacterListItem[]> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("characters")
    .select("id, name, race, class, level, imagePath:image_path")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`No se pudieron cargar los personajes: ${error.message}`);

  // Firmar N URLs con N llamadas sería un N+1 contra la API de Storage.
  const urls = await getSignedImageUrls(rows.map((row) => row.imagePath));

  return rows.map(({ imagePath, ...row }) => ({
    ...row,
    imageUrl: imagePath ? (urls.get(imagePath) ?? null) : null,
  }));
}

/**
 * Devuelve el personaje solo si pertenece al usuario actual.
 *
 * Quien lo garantiza es RLS: el cliente de Supabase habla con la base de datos
 * con la sesión del usuario, y la política de `characters` (supabase/setup.sql)
 * solo le deja ver sus filas. El `.eq("owner_id", ...)` es redundante a
 * propósito: deja la intención escrita aquí y aprovecha el índice de `owner_id`.
 */
export async function getCharacter(id: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: character, error } = await supabase
    .from("characters")
    .select(CHARACTER_COLUMNS)
    .eq("id", id)
    .eq("owner_id", user.id)
    // En las relaciones anidadas se ordena por el alias (`items`), pero con el
    // nombre real de la columna (`created_at`).
    .order("created_at", { referencedTable: "items", ascending: true })
    .order("created_at", { referencedTable: "notes", ascending: false })
    // Trucos primero (nivel 0) y alfabético dentro de cada nivel, que es
    // como está ordenada la hoja de papel.
    .order("level", { referencedTable: "spells", ascending: true })
    .order("name", { referencedTable: "spells", ascending: true })
    .order("created_at", { referencedTable: "attacks", ascending: true })
    .order("level", { referencedTable: "spellSlots", ascending: true })
    .maybeSingle();

  if (error) {
    if (error.code === INVALID_TEXT_REPRESENTATION) return null;
    throw new Error(`No se pudo cargar el personaje: ${error.message}`);
  }
  if (!character) return null;

  const { imagePath, notes, ...rest } = character;
  return {
    ...rest,
    // PostgREST devuelve las fechas como texto ISO; la ficha las formatea con
    // `Intl.DateTimeFormat`, que necesita un `Date`.
    notes: notes.map((note) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    })),
    imageUrl: await getSignedImageUrl(imagePath),
  };
}

export type CharacterDetail = NonNullable<
  Awaited<ReturnType<typeof getCharacter>>
>;
