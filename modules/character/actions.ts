"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import type { z } from "zod";
import {
  addAttack,
  addItem,
  addNote,
  addSpell,
  createCharacter,
  deleteCharacter,
  adjustSpellSlot,
  deleteAttack,
  deleteItem,
  deleteNote,
  deleteSpell,
  removeCharacterImage,
  setSpellSlot,
  toggleItemEquipped,
  toggleSpellPrepared,
  updateAbilities,
  updateAppearance,
  updateCharacterImage,
  updateCombat,
  updateCurrency,
  updateIdentity,
  updateLore,
  updatePersonality,
  updateProficiencies,
  updateSpellcasting,
} from "./mutations";
import {
  abilitiesSchema,
  appearanceSchema,
  attackSchema,
  characterSchema,
  combatSchema,
  currencySchema,
  formToObject,
  formToObjectWithLists,
  identitySchema,
  imageSchema,
  itemSchema,
  loreSchema,
  noteSchema,
  personalitySchema,
  PROFICIENCY_LIST_KEYS,
  proficienciesSchema,
  spellcastingSchema,
  spellSchema,
  spellSlotSchema,
} from "./schemas";
import type { FormState } from "./types";

/**
 * Toda action es un endpoint POST público: cualquiera puede invocarla sin pasar
 * por la UI, y el `redirect` de una página no la protege. Por eso aquí solo se
 * valida la entrada y se delega en `mutations.ts`, que es quien comprueba
 * sesión y propiedad. En este fichero no hay ni una consulta a la base de datos.
 */

/** Todas las escrituras fallan igual; esto evita repetir el mismo catch. */
function toFormState(error: unknown, fallback: string): FormState {
  // Un `redirect()` de `requireUser()` viaja como excepción de control de Next.
  // Sin este rethrow el catch se la comería y el usuario vería el mensaje de
  // error en lugar de la pantalla de login.
  unstable_rethrow(error);
  return { error: error instanceof Error ? error.message : fallback };
}

function characterPath(id: string) {
  return `/character/${id}`;
}

/**
 * El cuerpo compartido de todas las secciones editables de la ficha.
 *
 * Las ocho hacen exactamente lo mismo: sacar el id, parsear, delegar en la
 * mutación y revalidar. Escribirlo ocho veces era garantía de que la novena se
 * olvidaría de comprobar algo.
 */
async function runSectionUpdate<T>(
  formData: FormData,
  schema: z.ZodType<T>,
  apply: (characterId: string, data: T) => Promise<void>,
  options: { listKeys?: readonly string[]; revalidateList?: boolean } = {},
): Promise<FormState> {
  const id = formData.get("characterId");
  if (typeof id !== "string") return { error: "Personaje inválido" };

  const raw = options.listKeys
    ? formToObjectWithLists(formData, options.listKeys)
    : formToObject(formData);

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await apply(id, parsed.data);
  } catch (error) {
    return toFormState(error, "No se pudo guardar");
  }

  // La tarjeta del listado muestra nombre, raza, clase y nivel: solo la
  // identidad necesita invalidar también esa página.
  if (options.revalidateList) revalidatePath("/character");
  revalidatePath(characterPath(id));
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Alta y baja
// ---------------------------------------------------------------------------

export async function createCharacterAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = characterSchema.safeParse(
    formToObjectWithLists(formData, PROFICIENCY_LIST_KEYS),
  );
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const file = formData.get("image");
  let image: File | null = null;
  if (file instanceof File && file.size > 0) {
    const validated = imageSchema.safeParse(file);
    if (!validated.success) return { error: validated.error.issues[0].message };
    image = validated.data;
  }

  let characterId: string;
  try {
    const created = await createCharacter(parsed.data, image);
    characterId = created.id;
  } catch (error) {
    return toFormState(error, "No se pudo crear el personaje");
  }

  revalidatePath("/character");
  redirect(characterPath(characterId));
}

export async function deleteCharacterAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await deleteCharacter(id);
  revalidatePath("/character");
  redirect("/character");
}

// ---------------------------------------------------------------------------
// Edición por secciones
// ---------------------------------------------------------------------------

export async function updateIdentityAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runSectionUpdate(formData, identitySchema, updateIdentity, {
    revalidateList: true,
  });
}

export async function updateAbilitiesAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runSectionUpdate(formData, abilitiesSchema, updateAbilities);
}

export async function updateCombatAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runSectionUpdate(formData, combatSchema, updateCombat);
}

export async function updateProficienciesAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runSectionUpdate(formData, proficienciesSchema, updateProficiencies, {
    listKeys: PROFICIENCY_LIST_KEYS,
  });
}

export async function updatePersonalityAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runSectionUpdate(formData, personalitySchema, updatePersonality);
}

export async function updateAppearanceAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runSectionUpdate(formData, appearanceSchema, updateAppearance);
}

export async function updateLoreAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runSectionUpdate(formData, loreSchema, updateLore);
}

export async function updateCurrencyAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runSectionUpdate(formData, currencySchema, updateCurrency);
}

export async function updateSpellcastingAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runSectionUpdate(formData, spellcastingSchema, updateSpellcasting);
}

// ---------------------------------------------------------------------------
// Retrato
// ---------------------------------------------------------------------------

export async function updateImageAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = formData.get("characterId");
  if (typeof id !== "string") return { error: "Personaje inválido" };

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Elige una imagen antes de guardar" };
  }

  const validated = imageSchema.safeParse(file);
  if (!validated.success) return { error: validated.error.issues[0].message };

  try {
    await updateCharacterImage(id, validated.data);
  } catch (error) {
    return toFormState(error, "No se pudo actualizar el retrato");
  }

  // El retrato también sale en la tarjeta del listado.
  revalidatePath("/character");
  revalidatePath(characterPath(id));
  return { ok: true };
}

export async function removeImageAction(formData: FormData) {
  const id = formData.get("characterId");
  if (typeof id !== "string") return;

  await removeCharacterImage(id);
  revalidatePath("/character");
  revalidatePath(characterPath(id));
}

// ---------------------------------------------------------------------------
// Ataques y espacios de conjuro
// ---------------------------------------------------------------------------

export async function addAttackAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = attackSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await addAttack(parsed.data);
  } catch (error) {
    return toFormState(error, "No se pudo añadir el ataque");
  }

  revalidatePath(characterPath(parsed.data.characterId));
  return { ok: true };
}

export async function deleteAttackAction(formData: FormData) {
  const id = formData.get("id");
  const characterId = formData.get("characterId");
  if (typeof id !== "string") return;

  await deleteAttack(id);
  if (typeof characterId === "string") {
    revalidatePath(characterPath(characterId));
  }
}

export async function setSpellSlotAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = spellSlotSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await setSpellSlot(parsed.data);
  } catch (error) {
    return toFormState(error, "No se pudieron guardar los espacios");
  }

  revalidatePath(characterPath(parsed.data.characterId));
  return { ok: true };
}

export async function adjustSpellSlotAction(formData: FormData) {
  const id = formData.get("id");
  const characterId = formData.get("characterId");
  const delta = Number(formData.get("delta"));
  if (typeof id !== "string" || !Number.isFinite(delta)) return;

  await adjustSpellSlot(id, delta > 0 ? 1 : -1);
  if (typeof characterId === "string") {
    revalidatePath(characterPath(characterId));
  }
}

// ---------------------------------------------------------------------------
// Conjuros
// ---------------------------------------------------------------------------

export async function addSpellAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = spellSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await addSpell(parsed.data);
  } catch (error) {
    return toFormState(error, "No se pudo añadir el conjuro");
  }

  revalidatePath(characterPath(parsed.data.characterId));
  return { ok: true };
}

export async function deleteSpellAction(formData: FormData) {
  const id = formData.get("id");
  const characterId = formData.get("characterId");
  if (typeof id !== "string") return;

  await deleteSpell(id);
  if (typeof characterId === "string") {
    revalidatePath(characterPath(characterId));
  }
}

export async function toggleSpellPreparedAction(formData: FormData) {
  const id = formData.get("id");
  const characterId = formData.get("characterId");
  if (typeof id !== "string") return;

  await toggleSpellPrepared(id);
  if (typeof characterId === "string") {
    revalidatePath(characterPath(characterId));
  }
}

// ---------------------------------------------------------------------------
// Notas e inventario
// ---------------------------------------------------------------------------

export async function addNoteAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = noteSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await addNote(parsed.data.characterId, parsed.data.body);
  } catch (error) {
    return toFormState(error, "No se pudo guardar la nota");
  }

  revalidatePath(characterPath(parsed.data.characterId));
  return { ok: true };
}

export async function deleteNoteAction(formData: FormData) {
  const id = formData.get("id");
  const characterId = formData.get("characterId");
  if (typeof id !== "string") return;

  await deleteNote(id);
  if (typeof characterId === "string") {
    revalidatePath(characterPath(characterId));
  }
}

export async function addItemAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = itemSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await addItem(parsed.data);
  } catch (error) {
    return toFormState(error, "No se pudo añadir el objeto");
  }

  revalidatePath(characterPath(parsed.data.characterId));
  return { ok: true };
}

export async function deleteItemAction(formData: FormData) {
  const id = formData.get("id");
  const characterId = formData.get("characterId");
  if (typeof id !== "string") return;

  await deleteItem(id);
  if (typeof characterId === "string") {
    revalidatePath(characterPath(characterId));
  }
}

export async function toggleItemEquippedAction(formData: FormData) {
  const id = formData.get("id");
  const characterId = formData.get("characterId");
  if (typeof id !== "string") return;

  await toggleItemEquipped(id);
  if (typeof characterId === "string") {
    revalidatePath(characterPath(characterId));
  }
}
