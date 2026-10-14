import "server-only";
import { createClient } from "@/lib/supabase/server";

export const CHARACTER_IMAGES_BUCKET = "character-images";

/** Las URLs firmadas caducan; una hora sobra para una sesión de juego. */
const SIGNED_URL_TTL_SECONDS = 60 * 60;

/**
 * Sube la imagen al bucket privado y devuelve la RUTA (no una URL).
 *
 * La ruta empieza por el id del usuario a propósito: así la política de
 * Storage puede comprobar `(storage.foldername(name))[1] = auth.uid()::text`
 * y un usuario no puede escribir en la carpeta de otro.
 */
export async function uploadCharacterImage(
  userId: string,
  file: File,
): Promise<string> {
  const supabase = await createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(CHARACTER_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`No se pudo subir la imagen: ${error.message}`);
  }
  return path;
}

export async function deleteCharacterImage(path: string | null): Promise<void> {
  if (!path) return;
  const supabase = await createClient();
  await supabase.storage.from(CHARACTER_IMAGES_BUCKET).remove([path]);
}

export async function getSignedImageUrl(
  path: string | null,
): Promise<string | null> {
  if (!path) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(CHARACTER_IMAGES_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  return error ? null : data.signedUrl;
}

/**
 * Versión en lote para los listados. Firmar N URLs con N llamadas sería un
 * N+1 contra la API de Storage; `createSignedUrls` lo resuelve en una.
 */
export async function getSignedImageUrls(
  paths: (string | null)[],
): Promise<Map<string, string>> {
  const unique = [...new Set(paths.filter((p): p is string => Boolean(p)))];
  if (unique.length === 0) return new Map();
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(CHARACTER_IMAGES_BUCKET)
    .createSignedUrls(unique, SIGNED_URL_TTL_SECONDS);
  if (error || !data) return new Map();

  // `createSignedUrls` tipa `path` y `signedUrl` como anulables (falla por
  // fichero, no por lote), así que hay que estrecharlos de uno en uno.
  const entries: [string, string][] = [];
  for (const entry of data) {
    if (entry.path && entry.signedUrl) entries.push([entry.path, entry.signedUrl]);
  }
  return new Map(entries);
}
