"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { AuthState } from "./types";

const credentialsSchema = z.object({
  email: z.email("Introduce un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

/** Evita open redirects: solo rutas internas, y `//host` no lo es. */
function safeNext(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/character";
  if (!value.startsWith("/") || value.startsWith("//")) return "/character";
  return value;
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  // Mensaje genérico a propósito: distinguir "no existe" de "contraseña mala"
  // le regala a un atacante una forma de enumerar qué emails están registrados.
  if (error) return { error: "Email o contraseña incorrectos" };

  redirect(safeNext(formData.get("next")));
}

export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) return { error: error.message };

  // Con "Confirm email" activado (el default en Supabase) signUp no devuelve
  // sesión: el usuario tiene que pasar antes por el enlace del correo.
  if (!data.session) {
    return {
      message:
        "Cuenta creada. Revisa tu correo y confirma la dirección para entrar.",
    };
  }

  redirect("/character");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
