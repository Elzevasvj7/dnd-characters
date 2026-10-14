import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SessionUser } from "./types";

/**
 * Usuario autenticado, o `null`.
 *
 * `getUser()` y no `getSession()`: el primero valida el JWT contra el servidor
 * de Supabase, el segundo se fía de la cookie, que el cliente puede manipular.
 * Envuelto en `cache()` de React para que esa validación ocurra una sola vez
 * por request aunque la llamen cinco componentes distintos.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return { id: user.id, email: user.email ?? null };
});

/**
 * Igual que `getCurrentUser` pero exige sesión y garantiza que exista la fila
 * en `profiles`.
 *
 * Los usuarios los crea Supabase en `auth.users`. En vez de un trigger de
 * Postgres creamos el perfil de forma perezosa la primera vez que el usuario
 * toca la app: una escritura de más por request, irrelevante a esta escala, y
 * nos ahorra meternos en el esquema `auth` de Supabase.
 *
 * `ignoreDuplicates` lo convierte en un `ON CONFLICT DO NOTHING`: si el perfil
 * ya existe no se toca (ni se pisa el `display_name` que haya elegido).
 */
export const requireUser = cache(async (): Promise<SessionUser> => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert(
    { id: user.id, display_name: user.email?.split("@")[0] ?? null },
    { onConflict: "id", ignoreDuplicates: true },
  );
  if (error) throw new Error(`No se pudo crear el perfil: ${error.message}`);

  return user;
});
