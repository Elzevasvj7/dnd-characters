import { redirect } from "next/navigation";

// `proxy.ts` ya manda a /login a quien no tenga sesión, así que a esta página
// solo llegan usuarios autenticados. Su listado es la portada real.
export default function Home() {
  redirect("/character");
}
