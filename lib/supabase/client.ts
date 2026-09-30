import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/** Cliente de Supabase para Client Components (solo lo necesita el logout rápido
 *  y, más adelante, la subida directa a Storage con URL firmada). */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
