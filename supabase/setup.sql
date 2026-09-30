-- ============================================================================
-- Ejecutar en Supabase → SQL Editor, DESPUÉS de las migraciones de
-- `supabase/migrations/` (necesita que las tablas ya existan).
-- Es idempotente: puedes volver a lanzarlo cuando añadas tablas o políticas.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. Activar RLS en todas las tablas.   <-- ESTO NO ES OPCIONAL
-- ---------------------------------------------------------------------------
-- Supabase expone automáticamente todo el esquema `public` por PostgREST, y la
-- publishable key va en el navegador a la vista de cualquiera. Una tabla nace
-- SIN row level security, así que tal cual está, cualquiera con esa clave
-- puede hacer un GET a /rest/v1/characters y leerse tus fichas enteras.
--
-- Con RLS activo y sin políticas, nadie ve nada. Las políticas del bloque 2
-- son las que abren a cada usuario lo suyo y nada más. La app habla con la
-- base de datos con la sesión del usuario (cliente de Supabase), así que estas
-- políticas son la autorización de verdad, no un adorno.
--
-- Repite estas líneas para cada tabla nueva que añadas.

alter table public.profiles        enable row level security;
alter table public.characters      enable row level security;
alter table public.inventory_items enable row level security;
alter table public.notes           enable row level security;
alter table public.spells          enable row level security;
alter table public.attacks         enable row level security;
alter table public.spell_slots     enable row level security;

-- Restos de cuando migrábamos con Prisma. No guarda datos tuyos, pero sí el
-- historial de migraciones, y no hay razón para publicarlo.
alter table if exists public._prisma_migrations enable row level security;


-- ---------------------------------------------------------------------------
-- 2. Cada usuario, solo sus filas
-- ---------------------------------------------------------------------------
-- `(select auth.uid())` y no `auth.uid()` a secas: envuelto en un select,
-- Postgres lo evalúa una vez por query en vez de una vez por fila.
--
-- Solo `to authenticated`: el rol `anon` (sin sesión) se queda sin ninguna
-- política y por tanto sin acceso a nada.

drop policy if exists "profiles: el propio" on public.profiles;
create policy "profiles: el propio"
  on public.profiles for all to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "characters: los propios" on public.characters;
create policy "characters: los propios"
  on public.characters for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

-- Las tablas hijas no tienen `owner_id`: la propiedad se hereda del personaje.
-- El `exists` sobre `characters` pasa a su vez por la política de arriba, así
-- que no hay forma de colgar una nota de un personaje ajeno.

drop policy if exists "inventory_items: de personajes propios" on public.inventory_items;
create policy "inventory_items: de personajes propios"
  on public.inventory_items for all to authenticated
  using (exists (
    select 1 from public.characters c
    where c.id = character_id and c.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.characters c
    where c.id = character_id and c.owner_id = (select auth.uid())
  ));

drop policy if exists "notes: de personajes propios" on public.notes;
create policy "notes: de personajes propios"
  on public.notes for all to authenticated
  using (exists (
    select 1 from public.characters c
    where c.id = character_id and c.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.characters c
    where c.id = character_id and c.owner_id = (select auth.uid())
  ));

drop policy if exists "spells: de personajes propios" on public.spells;
create policy "spells: de personajes propios"
  on public.spells for all to authenticated
  using (exists (
    select 1 from public.characters c
    where c.id = character_id and c.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.characters c
    where c.id = character_id and c.owner_id = (select auth.uid())
  ));

drop policy if exists "attacks: de personajes propios" on public.attacks;
create policy "attacks: de personajes propios"
  on public.attacks for all to authenticated
  using (exists (
    select 1 from public.characters c
    where c.id = character_id and c.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.characters c
    where c.id = character_id and c.owner_id = (select auth.uid())
  ));

drop policy if exists "spell_slots: de personajes propios" on public.spell_slots;
create policy "spell_slots: de personajes propios"
  on public.spell_slots for all to authenticated
  using (exists (
    select 1 from public.characters c
    where c.id = character_id and c.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.characters c
    where c.id = character_id and c.owner_id = (select auth.uid())
  ));


-- ---------------------------------------------------------------------------
-- 3. Bucket privado para los retratos
-- ---------------------------------------------------------------------------
-- Igual que las tablas: Storage se accede con la sesión del usuario, así que
-- sus políticas RLS son la defensa real.

-- El límite de tamaño y los tipos permitidos se repiten aquí a propósito.
-- `modules/character/actions.ts` ya los valida, pero esa comprobación solo
-- protege la puerta que pasa por nuestro servidor: la API de Storage es
-- alcanzable directamente con la sesión del usuario. Estos son los de verdad.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'character-images',
  'character-images',
  false,
  4194304,                                        -- 4 MB, igual que MAX_IMAGE_BYTES
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- ---------------------------------------------------------------------------
-- 4. Cada usuario, solo su carpeta
-- ---------------------------------------------------------------------------
-- Las rutas se guardan como "<uuid-del-usuario>/<uuid>.<ext>", por eso basta
-- con comparar el primer segmento con auth.uid().

drop policy if exists "character images: subir en carpeta propia" on storage.objects;
create policy "character images: subir en carpeta propia"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'character-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- El select hace falta para poder firmar URLs, no solo para descargar.
drop policy if exists "character images: leer carpeta propia" on storage.objects;
create policy "character images: leer carpeta propia"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'character-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "character images: borrar carpeta propia" on storage.objects;
create policy "character images: borrar carpeta propia"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'character-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
