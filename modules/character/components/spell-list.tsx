import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Enums } from "@/lib/supabase/database.types";
import { deleteSpellAction, toggleSpellPreparedAction } from "../actions";
import { SPELL_SCHOOL_LABELS, spellGroupLabel } from "../schemas";

type Spell = {
  id: string;
  name: string;
  level: number;
  school: Enums<"SpellSchool"> | null;
  castingTime: string | null;
  range: string | null;
  duration: string | null;
  components: string | null;
  concentration: boolean;
  ritual: boolean;
  prepared: boolean;
  description: string | null;
};

/** Server Component: los formularios llaman directo a las actions, sin JS. */
export function SpellList({
  characterId,
  spells,
}: {
  characterId: string;
  spells: Spell[];
}) {
  if (spells.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No has apuntado ningún truco ni conjuro todavía.
      </p>
    );
  }

  // La query ya viene ordenada por nivel, así que el Map conserva ese orden.
  const byLevel = new Map<number, Spell[]>();
  for (const spell of spells) {
    const group = byLevel.get(spell.level);
    if (group) group.push(spell);
    else byLevel.set(spell.level, [spell]);
  }

  return (
    <div className="flex flex-col gap-5">
      {[...byLevel].map(([level, group]) => (
        <section key={level} className="flex flex-col gap-1">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {spellGroupLabel(level)}
          </h3>

          <ul className="flex flex-col divide-y">
            {group.map((spell) => {
              const meta = [
                spell.castingTime,
                spell.range,
                spell.duration,
                spell.components,
              ].filter(Boolean);

              return (
                <li key={spell.id} className="flex flex-col gap-1 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          spell.prepared ? "font-semibold" : "font-medium"
                        }
                      >
                        {spell.name}
                      </span>
                      {spell.school ? (
                        <Badge variant="outline">
                          {SPELL_SCHOOL_LABELS[spell.school]}
                        </Badge>
                      ) : null}
                      {spell.concentration ? (
                        <Badge variant="secondary">Concentración</Badge>
                      ) : null}
                      {spell.ritual ? (
                        <Badge variant="secondary">Ritual</Badge>
                      ) : null}
                      {spell.prepared && level > 0 ? (
                        <Badge>Preparado</Badge>
                      ) : null}
                    </div>

                    <span className="flex shrink-0 items-center gap-1">
                      {/* Los trucos se conocen siempre: preparar no aplica. */}
                      {level > 0 ? (
                        <form action={toggleSpellPreparedAction}>
                          <input type="hidden" name="id" value={spell.id} />
                          <input
                            type="hidden"
                            name="characterId"
                            value={characterId}
                          />
                          <Button type="submit" variant="ghost" size="xs">
                            {spell.prepared ? "Olvidar" : "Preparar"}
                          </Button>
                        </form>
                      ) : null}

                      <form action={deleteSpellAction}>
                        <input type="hidden" name="id" value={spell.id} />
                        <input
                          type="hidden"
                          name="characterId"
                          value={characterId}
                        />
                        <Button type="submit" variant="ghost" size="xs">
                          Quitar
                        </Button>
                      </form>
                    </span>
                  </div>

                  {meta.length > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {meta.join(" · ")}
                    </p>
                  ) : null}

                  {spell.description ? (
                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {spell.description}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
