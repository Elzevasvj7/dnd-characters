import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta ${name}. Copia .env.example a .env.local y rellénalo.`);
  }
  return value;
}

/**
 * En el panel de Supabase la clave pública y la `service_role` salen juntas y
 * se parecen. Pegar la equivocada aquí sería grave: `service_role` bypassa RLS
 * y, al ir en una variable `NEXT_PUBLIC_`, acabaría empaquetada en el bundle
 * del navegador. Mejor no arrancar que arrancar así.
 */
function assertPublishableKey(key: string) {
  const isSecretFormat = key.startsWith("sb_secret_");

  // Las claves legacy son JWT: el payload va en base64url en el segundo tramo.
  let isServiceRoleJwt = false;
  const [, payload] = key.split(".");
  if (payload) {
    try {
      const decoded = JSON.parse(
        Buffer.from(payload, "base64url").toString("utf8"),
      ) as { role?: string };
      isServiceRoleJwt = decoded.role === "service_role";
    } catch {
      // No es un JWT: será el formato nuevo, y ya lo cubre la comprobación de
      // arriba. Nada que hacer aquí.
    }
  }

  if (isSecretFormat || isServiceRoleJwt) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY contiene una clave secreta " +
        "(service_role). " +
        "Esa clave se salta RLS y esta variable viaja al navegador. " +
        "Usa la clave marcada como public / publishable.",
    );
  }

  return key;
}

/**
 * Cliente de Supabase para Server Components, Server Actions y `proxy.ts`.
 * La sesión vive en cookies, no en memoria: por eso hay que construirlo por
 * request y nunca guardarlo en una variable de módulo.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    assertPublishableKey(requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Los Server Components no pueden escribir cookies. No es un fallo:
            // el refresco del token lo hace `proxy.ts` antes de llegar aquí.
          }
        },
      },
    },
  );
}
