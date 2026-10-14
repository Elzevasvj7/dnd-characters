-- ============================================================================
-- Paso de Prisma al cliente de Supabase.
--
-- Prisma generaba en JavaScript cosas que la base de datos no sabía hacer sola:
-- los `id` (`@default(uuid())`) y los `updated_at` (`@updatedAt`). Con el
-- cliente de Supabase el INSERT llega tal cual a Postgres, así que ahora es
-- Postgres quien tiene que rellenarlos.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. Ids generados por la base de datos
-- ---------------------------------------------------------------------------
-- `profiles` no: su id es el del usuario de `auth.users`, no uno nuevo.

alter table public.characters      alter column id set default gen_random_uuid();
alter table public.inventory_items alter column id set default gen_random_uuid();
alter table public.notes           alter column id set default gen_random_uuid();
alter table public.spells          alter column id set default gen_random_uuid();
alter table public.attacks         alter column id set default gen_random_uuid();
alter table public.spell_slots     alter column id set default gen_random_uuid();


-- ---------------------------------------------------------------------------
-- 2. `updated_at` mantenido por un trigger
-- ---------------------------------------------------------------------------
-- El default cubre el INSERT; el trigger, cada UPDATE. Así da igual desde dónde
-- se escriba (la app, el panel de Supabase, el SQL Editor): siempre cuadra.

alter table public.characters alter column updated_at set default now();
alter table public.notes      alter column updated_at set default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.characters;
create trigger set_updated_at
  before update on public.characters
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.notes;
create trigger set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 3. Arrays de competencias NOT NULL
-- ---------------------------------------------------------------------------
-- Prisma los trataba como no nulos, pero en la tabla sí admitían NULL. Los
-- tipos de Supabase se generan a partir de la tabla, así que los alineamos
-- aquí en vez de arrastrar un `?? []` por todo el código.

update public.characters set save_proficiencies  = '{}' where save_proficiencies  is null;
update public.characters set skill_proficiencies = '{}' where skill_proficiencies is null;
update public.characters set skill_expertise     = '{}' where skill_expertise     is null;

alter table public.characters alter column save_proficiencies  set not null;
alter table public.characters alter column skill_proficiencies set not null;
alter table public.characters alter column skill_expertise     set not null;
