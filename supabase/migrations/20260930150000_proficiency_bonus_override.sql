-- Bonificador de competencia editable.
--
-- Por reglas sale del nivel (+2 a nivel 1-4, +3 a 5-8...), y eso sigue siendo
-- el valor por defecto: `null` significa "usa el cálculo de rules.ts". La
-- columna existe para las mesas con reglas caseras que lo suben antes de tiempo.

alter table public.characters
  add column if not exists proficiency_bonus_override integer;

comment on column public.characters.proficiency_bonus_override is
  'null = el que toca por nivel (rules.ts). Solo se rellena por reglas caseras.';
