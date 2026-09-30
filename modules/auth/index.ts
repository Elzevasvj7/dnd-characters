// Barrel seguro desde cualquier sitio: solo tipos y server actions.
//
// `queries.ts` NO se re-exporta aquí a propósito: importa `server-only`, y si
// un Client Component tocara este barrel el build fallaría. Los Server
// Components importan de "@/modules/auth/queries" directamente.
export * from "./actions";
export type { AuthState, SessionUser } from "./types";
