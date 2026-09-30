import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Rutas accesibles sin sesión. El resto redirige a /login. */
const PUBLIC_ROUTES = ["/login", "/register", "/auth", "/ramdom"];

/**
 * En Next.js 16 esto es `proxy.ts`, no `middleware.ts` (mismo comportamiento,
 * nombre nuevo). Casi todos los tutoriales de Supabase que encuentres siguen
 * diciendo `middleware.ts`: ahí no se ejecutaría.
 *
 * Hace dos cosas:
 *  1. Refresca el token de Supabase y reescribe las cookies. Esto es lo
 *     importante: sin ello la sesión caduca a mitad de navegación.
 *  2. Un redirect optimista para no renderizar páginas privadas sin sesión.
 *     Es solo UX. La autorización de verdad vive en el DAL, que vuelve a
 *     comprobar usuario y propiedad en cada consulta.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // No metas nada entre createServerClient y getUser(): getUser() es lo que
  // dispara el refresco del token, y cualquier cosa que lea cookies antes
  // trabajaría con el token viejo.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!user && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/character", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Todo menos assets estáticos e imágenes.
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
