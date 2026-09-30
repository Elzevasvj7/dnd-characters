# Puesta en marcha

Cuatro pasos. El 3 es el que no puedes saltarte.

## 1. Variables de entorno

```bash
cp .env.example .env.local
```

Rellena las dos. Salen de **Supabase → Settings → API**:

| Variable | Cuál |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public / publishable |

No hay cadena de conexión a Postgres: la app habla con la base de datos a
través de la API de Supabase (`supabase.from(...)`), con la sesión del usuario.

## 2. Crear las tablas — ✅ hecho

El esquema vive en `supabase/migrations/`, en SQL, uno por cambio y en orden.
Ya están todos aplicados. Los tres primeros son los que generó Prisma cuando lo
usábamos, y se conservan como historial.

Para un cambio nuevo: crea `supabase/migrations/<AAAAMMDDHHMMSS>_<nombre>.sql`,
pégalo en **Supabase → SQL Editor** y ejecútalo. Después regenera los tipos:

```bash
pnpm db:types
```

La primera vez te pedirá `pnpm dlx supabase login`. Sobrescribe
`lib/supabase/database.types.ts`, del que salen los tipos de todas las queries.
Si te saltas este paso, TypeScript no se entera de la columna nueva.

> Si algún día instalas el CLI de Supabase y usas `supabase db push`, antes
> marca como aplicadas las migraciones existentes con
> `supabase migration repair --status applied <versión>`: si no, intentará
> crear otra vez tablas que ya existen.

## 3. Seguridad (RLS) y bucket — ✅ hecho

`supabase/setup.sql`, ya aplicado. **Te toca a ti mantenerlo**, así que lee sus
comentarios.

La app usa la publishable key, que también está en el navegador. Lo único que
impide que un usuario lea o edite las fichas de otro son las políticas RLS de
ese fichero: cada usuario ve sus `characters` y las filas hijas de sus
personajes. Ya está verificado: otro usuario ve 0 filas y un anónimo no puede
insertar.

**Cada tabla nueva nace sin RLS y queda expuesta por la API** hasta que le
añadas en `setup.sql` su `enable row level security` **y** su política. El
fichero es idempotente: añade las líneas y vuelve a lanzarlo entero.

## 4. Ajustes de Auth

En **Supabase → Authentication**:

- **URL Configuration → Site URL**: `http://localhost:3000` en local.
- **Providers → Email**: si dejas *Confirm email* activado (el default), al
  registrarte no habrá sesión hasta pinchar el enlace del correo. La app ya lo
  contempla y muestra el aviso. Para ir más rápido en desarrollo puedes
  desactivarlo.

Falta una variable para poder arrancar:
**`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`** (Settings → API, la marcada como
public / publishable). Sin ella la app lanza en el primer render.

No cojas la `service_role` / secret: se salta RLS y esta variable viaja al
navegador. `lib/supabase/server.ts` lo detecta y se niega a arrancar.

```bash
pnpm dev
```

---

## Cómo está montado

```
app/                      solo rutas y composición, sin lógica
  (auth)/login|register
  character/              lista, create, [id]
modules/
  auth/
    queries.ts            server-only: getCurrentUser, requireUser
    actions.ts            "use server": login, register, logout
    components/
  character/
    queries.ts            server-only: lecturas
    mutations.ts          server-only: escrituras
    actions.ts            "use server": valida y delega, sin tocar la BD
    schemas.ts            zod, una sección por bloque editable de la ficha
    rules.ts              aritmética de 5e: modificadores, competencia, CD…
    components/           formularios y secciones editables
lib/
  storage.ts              Supabase Storage
  supabase/               clientes server / browser + database.types.ts
supabase/
  migrations/             el esquema, en SQL
  setup.sql               RLS y bucket (idempotente)
proxy.ts                  refresco de sesión (era middleware.ts en Next ≤15)
```

Tres reglas que sostienen el resto:

1. **Las lecturas van directas del Server Component al módulo.** Sin `fetch`,
   sin `app/api`. Los route handlers solo hacen falta para webhooks o
   consumidores externos.
2. **Cada action revalida sesión y propiedad.** Una Server Action es un endpoint
   POST público; el `redirect` de la página no la protege. Por eso `actions.ts`
   solo valida y delega, y quien toca la base de datos es `mutations.ts`.
3. **La autorización de datos la hace RLS, no el código.** Las queries también
   filtran por `owner_id` para que se lea la intención, pero si se te olvida
   uno, la política de `setup.sql` sigue cerrando la puerta. Una tabla sin
   política es una tabla abierta.
