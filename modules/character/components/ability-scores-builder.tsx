"use client";

import { useState } from "react";
import { DicesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Enums } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { type AbilityRoll, rollAbilityScores } from "../dice";
import {
  ABILITIES,
  ABILITY_FIELD,
  ABILITY_LABELS,
  ABILITY_SHORT,
  type AbilityScores,
  abilityModifier,
  formatModifier,
} from "../rules";

type Ability = Enums<"Ability">;

/**
 * Lo que se escribe en cada fila. Texto y no número porque es lo que tiene un
 * input mientras lo editas: "" o "-" son estados válidos a medio escribir.
 */
export type AbilityRow = { base: string; bonus: string };
export type AbilityRows = Record<Ability, AbilityRow>;

export const INITIAL_ABILITY_ROWS = Object.fromEntries(
  ABILITIES.map((ability) => [ability, { base: "10", bonus: "" }]),
) as AbilityRows;

/** Base + bono. Un campo vacío o a medias cuenta como 0 de bono / 10 de base. */
export function abilityRowTotal(row: AbilityRow): number {
  const base = Number.parseInt(row.base, 10);
  const bonus = Number.parseInt(row.bonus, 10);
  return (Number.isNaN(base) ? 10 : base) + (Number.isNaN(bonus) ? 0 : bonus);
}

export function abilityRowsToScores(rows: AbilityRows): AbilityScores {
  return Object.fromEntries(
    ABILITIES.map((ability) => [
      ABILITY_FIELD[ability],
      abilityRowTotal(rows[ability]),
    ]),
  ) as AbilityScores;
}

/**
 * Características como en la hoja de papel: se tiran seis veces 4d6 (se
 * descarta el dado más bajo), cada resultado se coloca en la característica
 * que quieras, y después se suman los bonos de raza o clase.
 *
 * Lo único que viaja al servidor es el total, en un input oculto por
 * característica. La base, el bono y las tiradas solo existen mientras
 * rellenas el formulario: en la ficha se apunta la puntuación final.
 */
export function AbilityScoresBuilder({
  rows,
  onChange,
}: {
  rows: AbilityRows;
  onChange: (rows: AbilityRows) => void;
}) {
  const [rolls, setRolls] = useState<AbilityRoll[] | null>(null);
  /** Qué característica ocupa cada tirada, por índice de `rolls`. */
  const [placements, setPlacements] = useState<(Ability | null)[]>([]);
  /** Tirada elegida, esperando a que pulses dónde va. */
  const [selected, setSelected] = useState<number | null>(null);

  function roll() {
    const fresh = rollAbilityScores();
    // Las bases que venían de la tirada anterior ya no significan nada.
    const next = { ...rows };
    for (const ability of placements) {
      if (ability) next[ability] = { ...next[ability], base: "" };
    }
    onChange(next);
    setRolls(fresh);
    setPlacements(fresh.map(() => null));
    setSelected(null);
  }

  function place(ability: Ability) {
    if (selected === null || !rolls) return;
    const next = { ...rows };
    const nextPlacements = [...placements];

    // Si esta tirada ya estaba en otra característica, esa se queda vacía.
    const previous = nextPlacements[selected];
    if (previous && previous !== ability) {
      next[previous] = { ...next[previous], base: "" };
    }
    // Y si en esta característica había otra tirada, esa vuelve a quedar libre.
    const displaced = nextPlacements.indexOf(ability);
    if (displaced !== -1) nextPlacements[displaced] = null;

    nextPlacements[selected] = ability;
    next[ability] = { ...next[ability], base: String(rolls[selected].total) };

    onChange(next);
    setPlacements(nextPlacements);
    setSelected(null);
  }

  function editRow(ability: Ability, field: keyof AbilityRow, value: string) {
    onChange({ ...rows, [ability]: { ...rows[ability], [field]: value } });
    // Escribir la base a mano rompe el vínculo con la tirada que hubiera.
    if (field === "base") {
      setPlacements(placements.map((p) => (p === ability ? null : p)));
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-md text-sm text-muted-foreground">
            {rolls
              ? selected === null
                ? "Elige una tirada y después la característica donde va."
                : `Ahora pulsa la característica donde va el ${rolls[selected].total}.`
              : "Tira 4d6 seis veces: en cada tirada se descarta el dado más bajo. Si ya tiraste en la mesa, escribe las bases a mano."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={roll}>
            <DicesIcon /> {rolls ? "Volver a tirar" : "Tirar 4d6 × 6"}
          </Button>
        </div>

        {rolls ? (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {rolls.map((result, index) => {
              const placedIn = placements[index];
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelected(selected === index ? null : index)
                    }
                    aria-pressed={selected === index}
                    className={cn(
                      "flex w-full flex-col items-center gap-1 rounded-lg border bg-card px-2 py-2 transition-colors hover:bg-muted",
                      selected === index && "border-primary ring-2 ring-primary/40",
                      placedIn && selected !== index && "opacity-60",
                    )}
                  >
                    <span className="text-xl font-semibold tabular-nums">
                      {result.total}
                    </span>
                    <span className="flex gap-1 text-xs text-muted-foreground tabular-nums">
                      {result.dice.map((die, dieIndex) => (
                        <span
                          key={dieIndex}
                          className={cn(
                            dieIndex === result.droppedIndex &&
                              "line-through opacity-50",
                          )}
                        >
                          {die}
                        </span>
                      ))}
                    </span>
                    <span className="h-4 text-[0.7rem] font-medium">
                      {placedIn ? `→ ${ABILITY_SHORT[placedIn]}` : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ABILITIES.map((ability) => {
          const row = rows[ability];
          const total = abilityRowTotal(row);
          return (
            <li
              key={ability}
              className={cn(
                "flex flex-col gap-3 rounded-lg border p-3",
                selected !== null && "border-primary/50",
              )}
            >
              <input
                type="hidden"
                name={ABILITY_FIELD[ability]}
                value={total}
              />
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">{ABILITY_LABELS[ability]}</span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  <span className="text-lg font-semibold text-foreground">
                    {total}
                  </span>{" "}
                  ({formatModifier(abilityModifier(total))})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor={`base-${ability}`}
                    className="text-xs text-muted-foreground"
                  >
                    Base
                  </Label>
                  <Input
                    id={`base-${ability}`}
                    type="number"
                    min={1}
                    max={30}
                    placeholder="10"
                    value={row.base}
                    onChange={(event) =>
                      editRow(ability, "base", event.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor={`bonus-${ability}`}
                    className="text-xs text-muted-foreground"
                  >
                    Raza / clase
                  </Label>
                  <Input
                    id={`bonus-${ability}`}
                    type="number"
                    min={-5}
                    max={10}
                    placeholder="+0"
                    value={row.bonus}
                    onChange={(event) =>
                      editRow(ability, "bonus", event.target.value)
                    }
                  />
                </div>
              </div>

              {selected !== null ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => place(ability)}
                >
                  Colocar el {rolls?.[selected].total} aquí
                </Button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
