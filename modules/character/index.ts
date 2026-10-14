// Barrel seguro desde cualquier sitio: solo tipos, esquemas y server actions.
//
// `queries.ts` y `mutations.ts` NO se re-exportan aquí a propósito: importan
// `server-only`, y si un Client Component tocara este barrel el build fallaría.
// Los Server Components importan de "@/modules/character/queries" directamente.
export * from "./actions";
export * from "./schemas";
export type { CharacterListItem, FormState } from "./types";
