import { getSignedImageUrl } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";
import CharacterById from "@/modules/character/components/character-by-id";
import { notFound } from "next/navigation";

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
  spellSlots:spell_slots(id, characterId:character_id, level, total, expended),
  campaign
`;
const INVALID_TEXT_REPRESENTATION = "22P02";

export async function getCharacterIronAndEther(id: string) {
  const supabase = await createClient();

  const { data: character, error } = await supabase
    .from("characters")
    .select(CHARACTER_COLUMNS)
    .eq("id", id)
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

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // `getCharacter` filtra por propietario: si el id es de otro usuario devuelve
  // null y aquí se convierte en un 404, que no revela si el recurso existe.
  const character = await getCharacterIronAndEther(id);
  console.log("character", character);
  if (!character) notFound();

  return <CharacterById id={id} character={character} />;
}
