import "server-only";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Enums, TablesUpdate } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { deleteCharacterImage, uploadCharacterImage } from "@/lib/storage";
import { requireUser } from "@/modules/auth/queries";
import type {
  AbilitiesInput,
  AppearanceInput,
  CharacterInput,
  CombatInput,
  CurrencyInput,
  IdentityInput,
  LoreInput,
  PersonalityInput,
  ProficienciesInput,
  SpellcastingInput,
  SpellInput,
} from "./schemas";

// Quién puede tocar qué lo decide RLS (supabase/setup.sql), no este fichero:
// el cliente de Supabase va con la sesión del usuario, y una fila ajena es para
// él una fila que no existe. Por eso los borrados y toggles de hijos (notas,
// objetos, conjuros...) filtran solo por `id`. En `characters` se mantiene el
// `.eq("owner_id", ...)` para que la intención quede escrita donde se lee.
//
// supabase-js no lanza excepciones: devuelve `{ data, error }`. Si no se mira
// `error`, un fallo pasa en silencio. `throwIf` es para no olvidarlo.

function throwIf(error: PostgrestError | null) {
  if (error) throw new Error(error.message);
}

export async function createCharacter(
  input: CharacterInput,
  image: File | null,
): Promise<{ id: string }> {
  const user = await requireUser();
  const supabase = await createClient();
  const imagePath = image ? await uploadCharacterImage(user.id, image) : null;
  console.log("abilitiesRow", abilitiesRow(input));
  const { data, error } = await supabase
    .from("characters")
    .insert({
      ...identityRow(input),
      ...abilitiesRow(input),
      ...combatRow(input),
      ...proficienciesRow(input),
      ...personalityRow(input),
      ...appearanceRow(input),
      ...loreRow(input),
      ...currencyRow(input),
      ...spellcastingRow(input),
      owner_id: user.id,
      image_path: imagePath,
    })
    .select("id")
    .single();

  if (error) {
    // Si el insert falla nos quedaría un huérfano en Storage ocupando espacio.
    await deleteCharacterImage(imagePath);
    throw new Error(error.message);
  }

  // Insertar ataques si se incluyeron en la creación
  if (input.attacksJson) {
    try {
      const attacks = JSON.parse(input.attacksJson);
      if (Array.isArray(attacks) && attacks.length > 0) {
        await supabase.from("attacks").insert(
          attacks.map((a: { name: string; bonus?: string; damage?: string }) => ({
            character_id: data.id,
            name: a.name,
            bonus: a.bonus || null,
            damage: a.damage || null,
          })),
        );
      }
    } catch {
      // Ignorar json inválido
    }
  }

  // Insertar objetos del inventario si se incluyeron en la creación
  if (input.itemsJson) {
    try {
      const items = JSON.parse(input.itemsJson);
      if (Array.isArray(items) && items.length > 0) {
        await supabase.from("inventory_items").insert(
          items.map((i: { name: string; quantity?: number; weight?: number; description?: string }) => ({
            character_id: data.id,
            name: i.name,
            quantity: i.quantity || 1,
            weight: i.weight || null,
            description: i.description || null,
          })),
        );
      }
    } catch {
      // Ignorar json inválido
    }
  }

  // Insertar conjuros si se incluyeron en la creación
  if (input.spellsJson) {
    try {
      const spells = JSON.parse(input.spellsJson);
      if (Array.isArray(spells) && spells.length > 0) {
        await supabase.from("spells").insert(
          spells.map((s: {
            name: string;
            level?: number;
            school?: Enums<"SpellSchool"> | null;
            castingTime?: string;
            range?: string;
            duration?: string;
            components?: string;
            concentration?: boolean;
            ritual?: boolean;
            description?: string;
          }) => ({
            character_id: data.id,
            name: s.name,
            level: s.level ?? 0,
            school: s.school || null,
            casting_time: s.castingTime || null,
            range: s.range || null,
            duration: s.duration || null,
            components: s.components || null,
            concentration: Boolean(s.concentration),
            ritual: Boolean(s.ritual),
            description: s.description || null,
          })),
        );
      }
    } catch {
      // Ignorar json inválido
    }
  }

  return data;
}


export async function deleteCharacter(id: string): Promise<void> {
  const user = await requireUser();
  const supabase = await createClient();

  // `.delete().select()` devuelve la fila borrada: así sabemos qué imagen
  // limpiar sin una lectura previa.
  const { data: deleted, error } = await supabase
    .from("characters")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("image_path")
    .maybeSingle();
  throwIf(error);

  await deleteCharacterImage(deleted?.image_path ?? null);
}

/**
 * Comprueba propiedad antes de tocar cualquier hijo (notas, objetos).
 *
 * RLS ya rechazaría el insert, pero con un error genérico de política. Esto
 * da un "Personaje no encontrado" legible.
 */
async function assertOwnsCharacter(characterId: string, userId: string) {
  const supabase = await createClient();
  const { data: owned, error } = await supabase
    .from("characters")
    .select("id")
    .eq("id", characterId)
    .eq("owner_id", userId)
    .maybeSingle();
  throwIf(error);
  if (!owned) throw new Error("Personaje no encontrado");
}

export async function addNote(characterId: string, body: string) {
  const user = await requireUser();
  await assertOwnsCharacter(characterId, user.id);

  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .insert({ character_id: characterId, body });
  throwIf(error);
}

export async function deleteNote(noteId: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", noteId);
  throwIf(error);
}

export async function addItem(input: {
  characterId: string;
  name: string;
  quantity: number;
  weight?: number;
  description?: string;
}) {
  const user = await requireUser();
  await assertOwnsCharacter(input.characterId, user.id);

  const supabase = await createClient();
  const { error } = await supabase.from("inventory_items").insert({
    character_id: input.characterId,
    name: input.name,
    quantity: input.quantity,
    weight: input.weight,
    description: input.description,
  });
  throwIf(error);
}

export async function deleteItem(itemId: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", itemId);
  throwIf(error);
}

export async function toggleItemEquipped(itemId: string) {
  await requireUser();
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("inventory_items")
    .select("id, equipped")
    .eq("id", itemId)
    .maybeSingle();
  throwIf(error);
  if (!item) return;

  const { error: updateError } = await supabase
    .from("inventory_items")
    .update({ equipped: !item.equipped })
    .eq("id", item.id);
  throwIf(updateError);
}

// ---------------------------------------------------------------------------
// Edición por secciones
// ---------------------------------------------------------------------------
//
// Todas pasan por `updateOwned`: un solo UPDATE filtrado por id y propietario
// que devuelve las filas tocadas. Si no vuelve ninguna, el personaje no existe
// o no es tuyo (sin distinguir cuál, que es lo correcto).
//
// El `?? null` no es adorno: `formToObject` descarta los campos vacíos, así que
// llegan como `undefined`, y supabase-js omite las claves `undefined` al
// serializar a JSON, que para PostgREST significa "no toques esta columna".
// Sin la traducción a `null`, vaciar un campo en el formulario no lo borraría
// jamás.

async function updateOwned(
  characterId: string,
  userId: string,
  data: TablesUpdate<"characters">,
) {
  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("characters")
    .update(data)
    .eq("id", characterId)
    .eq("owner_id", userId)
    .select("id");
  throwIf(error);
  if (updated?.length === 0) throw new Error("Personaje no encontrado");
}

// Las columnas son snake_case y los formularios camelCase. La traducción de
// cada sección vive en una función porque el alta y la edición comparten las
// mismas cuatro (identidad, puntuaciones, combate y competencias).

function identityRow(input: IdentityInput) {
  return {
    name: input.name,
    age: input.age ?? null,
    race: input.race ?? null,
    class: input.class ?? null,
    level: input.level,
    background: input.background ?? null,
    alignment: input.alignment ?? null,
    player_name: input.playerName ?? null,
    experience_points: input.experiencePoints ?? null,
    inspiration: input.inspiration,
    campaign: input.campaign ?? null,
  } satisfies TablesUpdate<"characters">;
}

/**
 * Copia campo a campo en vez de pasar `input` entero: en el alta `input` trae
 * también identidad y combate en camelCase, y PostgREST rechazaría esas claves
 * por no ser columnas.
 */
function abilitiesRow(input: AbilitiesInput) {
  return {
    strength: input.strength,
    dexterity: input.dexterity,
    constitution: input.constitution,
    intelligence: input.intelligence,
    wisdom: input.wisdom,
    charisma: input.charisma,
  } satisfies TablesUpdate<"characters">;
}

function combatRow(input: CombatInput) {
  return {
    max_hp: input.maxHp ?? null,
    current_hp: input.currentHp ?? null,
    temporary_hp: input.temporaryHp ?? null,
    armor_class: input.armorClass ?? null,
    speed: input.speed ?? null,
    hit_dice: input.hitDice ?? null,
    hit_dice_spent: input.hitDiceSpent,
    death_save_successes: input.deathSaveSuccesses,
    death_save_failures: input.deathSaveFailures,
    initiative_override: input.initiativeOverride ?? null,
  } satisfies TablesUpdate<"characters">;
}

function proficienciesRow(input: ProficienciesInput) {
  // La experiencia sin competencia no existe en las reglas: si se cuela una,
  // el bono saldría doblado sobre una base que no tienes. La filtramos aquí y
  // no en el formulario, porque el formulario no es la única puerta de entrada.
  const skillExpertise = input.skillExpertise.filter((skill) =>
    input.skillProficiencies.includes(skill),
  );

  return {
    proficiency_bonus_override: input.proficiencyBonusOverride ?? null,
    save_proficiencies: input.saveProficiencies,
    skill_proficiencies: input.skillProficiencies,
    skill_expertise: skillExpertise,
    other_proficiencies: input.otherProficiencies ?? null,
  } satisfies TablesUpdate<"characters">;
}

function personalityRow(input: PersonalityInput) {
  return {
    personality_traits: input.personalityTraits ?? null,
    ideals: input.ideals ?? null,
    bonds: input.bonds ?? null,
    flaws: input.flaws ?? null,
  } satisfies TablesUpdate<"characters">;
}

function appearanceRow(input: AppearanceInput) {
  return {
    height: input.height ?? null,
    weight: input.weight ?? null,
    eyes: input.eyes ?? null,
    skin: input.skin ?? null,
    hair: input.hair ?? null,
  } satisfies TablesUpdate<"characters">;
}

function loreRow(input: LoreInput) {
  return {
    backstory: input.backstory ?? null,
    allies_and_organizations: input.alliesAndOrganizations ?? null,
    organization_name: input.organizationName ?? null,
    features_and_traits: input.featuresAndTraits ?? null,
    additional_features: input.additionalFeatures ?? null,
    treasure: input.treasure ?? null,
  } satisfies TablesUpdate<"characters">;
}

function currencyRow(input: CurrencyInput) {
  return {
    platinum: input.platinum,
    gold: input.gold,
    electrum: input.electrum,
    silver: input.silver,
    copper: input.copper,
  } satisfies TablesUpdate<"characters">;
}

function spellcastingRow(input: SpellcastingInput) {
  return {
    spellcasting_class: input.spellcastingClass ?? null,
    spellcasting_ability: input.spellcastingAbility ?? null,
    spell_save_dc_override: input.spellSaveDcOverride ?? null,
    spell_attack_bonus_override: input.spellAttackBonusOverride ?? null,
  } satisfies TablesUpdate<"characters">;
}


export async function updateIdentity(characterId: string, input: IdentityInput) {
  const user = await requireUser();
  console.log("updateIdentity", characterId, input, user.id);
  await updateOwned(characterId, user.id, identityRow(input));
}

export async function updateAbilities(
  characterId: string,
  input: AbilitiesInput,
) {
  const user = await requireUser();
  await updateOwned(characterId, user.id, abilitiesRow(input));
}

export async function updateCombat(characterId: string, input: CombatInput) {
  const user = await requireUser();
  await updateOwned(characterId, user.id, combatRow(input));
}

// ---------------------------------------------------------------------------
// Conjuros
// ---------------------------------------------------------------------------

export async function addSpell(input: SpellInput) {
  const user = await requireUser();
  await assertOwnsCharacter(input.characterId, user.id);

  // En un insert, una clave `undefined` no viaja y la columna se queda en su
  // default (null), que es justo lo que queremos para los opcionales vacíos.
  const supabase = await createClient();
  const { error } = await supabase.from("spells").insert({
    character_id: input.characterId,
    name: input.name,
    level: input.level,
    school: input.school,
    casting_time: input.castingTime,
    range: input.range,
    duration: input.duration,
    components: input.components,
    concentration: input.concentration,
    ritual: input.ritual,
    description: input.description,
  });
  throwIf(error);
}

export async function deleteSpell(spellId: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("spells").delete().eq("id", spellId);
  throwIf(error);
}

export async function toggleSpellPrepared(spellId: string) {
  await requireUser();
  const supabase = await createClient();

  const { data: spell, error } = await supabase
    .from("spells")
    .select("id, prepared")
    .eq("id", spellId)
    .maybeSingle();
  throwIf(error);
  if (!spell) return;

  const { error: updateError } = await supabase
    .from("spells")
    .update({ prepared: !spell.prepared })
    .eq("id", spell.id);
  throwIf(updateError);
}

export async function updateProficiencies(
  characterId: string,
  input: ProficienciesInput,
) {
  const user = await requireUser();
  await updateOwned(characterId, user.id, proficienciesRow(input));
}

export async function updatePersonality(
  characterId: string,
  input: PersonalityInput,
) {
  const user = await requireUser();
  await updateOwned(characterId, user.id, {
    personality_traits: input.personalityTraits ?? null,
    ideals: input.ideals ?? null,
    bonds: input.bonds ?? null,
    flaws: input.flaws ?? null,
  });
}

export async function updateAppearance(
  characterId: string,
  input: AppearanceInput,
) {
  const user = await requireUser();
  await updateOwned(characterId, user.id, {
    height: input.height ?? null,
    weight: input.weight ?? null,
    eyes: input.eyes ?? null,
    skin: input.skin ?? null,
    hair: input.hair ?? null,
  });
}

export async function updateLore(characterId: string, input: LoreInput) {
  const user = await requireUser();
  await updateOwned(characterId, user.id, {
    backstory: input.backstory ?? null,
    allies_and_organizations: input.alliesAndOrganizations ?? null,
    organization_name: input.organizationName ?? null,
    features_and_traits: input.featuresAndTraits ?? null,
    additional_features: input.additionalFeatures ?? null,
    treasure: input.treasure ?? null,
  });
}

export async function updateCurrency(
  characterId: string,
  input: CurrencyInput,
) {
  const user = await requireUser();
  // Todas tienen default 0, no son anulables y se llaman igual que la columna.
  await updateOwned(characterId, user.id, input);
}

export async function updateSpellcasting(
  characterId: string,
  input: SpellcastingInput,
) {
  const user = await requireUser();
  await updateOwned(characterId, user.id, {
    spellcasting_class: input.spellcastingClass ?? null,
    spellcasting_ability: input.spellcastingAbility ?? null,
    spell_save_dc_override: input.spellSaveDcOverride ?? null,
    spell_attack_bonus_override: input.spellAttackBonusOverride ?? null,
  });
}

// ---------------------------------------------------------------------------
// Ataques y espacios de conjuro
// ---------------------------------------------------------------------------

export async function addAttack(input: {
  characterId: string;
  name: string;
  bonus?: string;
  damage?: string;
}) {
  const user = await requireUser();
  await assertOwnsCharacter(input.characterId, user.id);

  const supabase = await createClient();
  const { error } = await supabase.from("attacks").insert({
    character_id: input.characterId,
    name: input.name,
    bonus: input.bonus,
    damage: input.damage,
  });
  throwIf(error);
}

export async function deleteAttack(attackId: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("attacks").delete().eq("id", attackId);
  throwIf(error);
}

/**
 * Crea o actualiza los espacios de un nivel. Si el total queda a 0 borramos la
 * fila: un nivel sin espacios no es "cero espacios", es que no lo tienes.
 */
export async function setSpellSlot(input: {
  characterId: string;
  level: number;
  total: number;
  expended: number;
}) {
  const user = await requireUser();
  await assertOwnsCharacter(input.characterId, user.id);

  const supabase = await createClient();
  const { characterId, level, total } = input;
  const expended = Math.min(input.expended, total);

  if (total === 0) {
    const { error } = await supabase
      .from("spell_slots")
      .delete()
      .eq("character_id", characterId)
      .eq("level", level);
    throwIf(error);
    return;
  }

  // `onConflict` apunta al índice único (character_id, level): si ya hay fila
  // para ese nivel se actualiza, si no se crea.
  const { error } = await supabase
    .from("spell_slots")
    .upsert(
      { character_id: characterId, level, total, expended },
      { onConflict: "character_id,level" },
    );
  throwIf(error);
}

/** Gasta o recupera un espacio, sin salirse del rango 0..total. */
export async function adjustSpellSlot(slotId: string, delta: number) {
  await requireUser();
  const supabase = await createClient();

  const { data: slot, error } = await supabase
    .from("spell_slots")
    .select("id, total, expended")
    .eq("id", slotId)
    .maybeSingle();
  throwIf(error);
  if (!slot) return;

  const expended = Math.min(Math.max(slot.expended + delta, 0), slot.total);
  if (expended === slot.expended) return;

  const { error: updateError } = await supabase
    .from("spell_slots")
    .update({ expended })
    .eq("id", slot.id);
  throwIf(updateError);
}

// ---------------------------------------------------------------------------
// Retrato
// ---------------------------------------------------------------------------

async function getImagePath(characterId: string, userId: string) {
  const supabase = await createClient();
  const { data: character, error } = await supabase
    .from("characters")
    .select("image_path")
    .eq("id", characterId)
    .eq("owner_id", userId)
    .maybeSingle();
  throwIf(error);
  return character;
}

/**
 * Sustituye el retrato: sube el nuevo, apunta la fila y solo entonces borra el
 * viejo.
 *
 * El orden importa. Si borrásemos primero y fallara la subida, el personaje se
 * quedaría sin imagen. Así el peor caso es un fichero huérfano ocupando sitio
 * en Storage, que es un problema de limpieza y no de pérdida de datos.
 */
export async function updateCharacterImage(characterId: string, image: File) {
  const user = await requireUser();

  const character = await getImagePath(characterId, user.id);
  if (!character) throw new Error("Personaje no encontrado");

  const imagePath = await uploadCharacterImage(user.id, image);

  try {
    await updateOwned(characterId, user.id, { image_path: imagePath });
  } catch (error) {
    // El update falló: el fichero recién subido no lo referencia nadie.
    await deleteCharacterImage(imagePath);
    throw error;
  }

  await deleteCharacterImage(character.image_path);
}

export async function removeCharacterImage(characterId: string) {
  const user = await requireUser();

  const character = await getImagePath(characterId, user.id);
  if (!character?.image_path) return;

  await updateOwned(characterId, user.id, { image_path: null });
  await deleteCharacterImage(character.image_path);
}
