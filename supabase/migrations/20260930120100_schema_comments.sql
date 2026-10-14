-- ============================================================================
-- Las notas de diseño que vivían en `prisma/schema.prisma`, ahora en la propia
-- base de datos. Se ven en el panel de Supabase (Table Editor → columna).
-- ============================================================================

comment on table public.profiles is
  'Espejo en `public` de un usuario de Supabase Auth. `id` es el de auth.users; '
  'la fila la crea de forma perezosa requireUser() (modules/auth/queries.ts).';

comment on column public.characters.hit_dice is
  'Tal cual se escribe en la hoja: "5d8".';

comment on column public.characters.initiative_override is
  'Los derivados se calculan en rules.ts. Los *_override solo existen para cuando '
  'un objeto mágico rompe la fórmula; null significa "usa el cálculo".';
comment on column public.characters.spell_save_dc_override is
  'null = usa el cálculo de rules.ts.';
comment on column public.characters.spell_attack_bonus_override is
  'null = usa el cálculo de rules.ts.';

comment on column public.characters.skill_proficiencies is
  'Arrays de enum en vez de 18 columnas booleanas: se leen de un vistazo, se '
  'actualizan de golpe y añadir una habilidad no es una migración de 18.';
comment on column public.characters.skill_expertise is
  'Competencia doble (pícaro, bardo). La hoja de papel no tiene casilla, pero '
  'existe en las reglas y sin esto los bonos saldrían mal.';

comment on column public.characters.image_path is
  'Ruta dentro del bucket character-images ("<uuid-usuario>/<uuid>.webp"), nunca '
  'una URL: las URLs firmadas caducan y se generan al leer.';

comment on type public."SpellSchool" is
  'Conjunto cerrado desde hace ediciones: un enum hace que la base de datos '
  'rechace cualquier escuela inventada.';

comment on column public.spells.level is
  '0 = truco (cantrip), 1-9 = nivel del conjuro. Un truco es literalmente un '
  'conjuro de nivel 0; separarlos duplicaría todo lo demás.';

comment on column public.attacks.bonus is
  'Texto porque en la hoja se escriben cosas como "+5".';
comment on column public.attacks.damage is
  'Texto porque en la hoja se escriben cosas como "1d8+3 cortante".';

comment on table public.spell_slots is
  'Una fila por nivel usado, no las nueve siempre: un mago de nivel 3 no tiene '
  'por qué guardar ceros del 3 al 9. Sin nivel 0: los trucos no gastan espacios.';
