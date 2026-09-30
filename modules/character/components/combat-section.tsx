"use client";

import { useState } from "react";
import { ShieldIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { updateCombatAction } from "../actions";
import {
  type CharacterStats,
  formatModifier,
  initiative,
  passivePerception,
} from "../rules";
import { Field } from "./field";
import { FormError, ReadRow, SectionCard } from "./section-card";
import { useFormAction } from "./use-form-action";

type Props = {
  character: CharacterStats & {
    id: string;
    maxHp: number | null;
    currentHp: number | null;
    temporaryHp: number | null;
    armorClass: number | null;
    speed: number | null;
    hitDice: string | null;
    hitDiceSpent: number;
    deathSaveSuccesses: number;
    deathSaveFailures: number;
  };
};

/** Los tres círculos de éxitos / fallos de la hoja. */
function DeathTrack({ label, filled }: { label: string; filled: number }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={`size-3.5 rounded-full border ${
              index < filled ? "border-foreground bg-foreground" : "border-input"
            }`}
            aria-hidden
          />
        ))}
      </span>
    </div>
  );
}

export function CombatSection({ character }: Props) {
  const [editing, setEditing] = useState(false);
  const { state, pending, submit } = useFormAction(updateCombatAction, () =>
    setEditing(false),
  );

  const hasDeathSaves =
    character.deathSaveSuccesses > 0 || character.deathSaveFailures > 0;

  return (
    <SectionCard
      title="Combate"
      icon={ShieldIcon}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
    >
      {editing ? (
        <form action={submit} className="flex flex-col gap-4">
          <input type="hidden" name="characterId" value={character.id} />

          <div className="grid grid-cols-2 gap-3">
            <Field
              name="armorClass"
              label="Clase de armadura"
              type="number"
              min={0}
              defaultValue={character.armorClass ?? ""}
            />
            <Field
              name="speed"
              label="Velocidad"
              type="number"
              min={0}
              defaultValue={character.speed ?? ""}
            />
            <Field
              name="maxHp"
              label="PG máximos"
              type="number"
              min={0}
              defaultValue={character.maxHp ?? ""}
            />
            <Field
              name="currentHp"
              label="PG actuales"
              type="number"
              defaultValue={character.currentHp ?? ""}
            />
            <Field
              name="temporaryHp"
              label="PG temporales"
              type="number"
              min={0}
              defaultValue={character.temporaryHp ?? ""}
            />
            <Field
              name="hitDice"
              label="Dados de golpe"
              maxLength={30}
              placeholder="5d8"
              defaultValue={character.hitDice ?? ""}
            />
            <Field
              name="hitDiceSpent"
              label="Dados gastados"
              type="number"
              min={0}
              max={20}
              defaultValue={character.hitDiceSpent}
            />
            <Field
              name="initiativeOverride"
              label="Iniciativa (forzada)"
              type="number"
              defaultValue={character.initiativeOverride ?? ""}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            La iniciativa sale del modificador de Destreza. Rellena el campo solo
            si algo te da otro valor.
          </p>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <Field
              name="deathSaveSuccesses"
              label="Éxitos contra muerte"
              type="number"
              min={0}
              max={3}
              defaultValue={character.deathSaveSuccesses}
            />
            <Field
              name="deathSaveFailures"
              label="Fallos contra muerte"
              type="number"
              min={0}
              max={3}
              defaultValue={character.deathSaveFailures}
            />
          </div>

          <FormError state={state} />

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-2">
          <ReadRow label="Clase de armadura" value={character.armorClass} />
          <ReadRow
            label="Iniciativa"
            value={
              <>
                {formatModifier(initiative(character))}
                {character.initiativeOverride !== null ? (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    forzada
                  </span>
                ) : null}
              </>
            }
          />
          <ReadRow label="Velocidad" value={character.speed} />
          <ReadRow
            label="Percepción pasiva"
            value={passivePerception(character)}
          />

          <Separator className="my-1" />

          <ReadRow
            label="Puntos de golpe"
            value={
              character.maxHp === null && character.currentHp === null
                ? null
                : `${character.currentHp ?? "?"} / ${character.maxHp ?? "?"}`
            }
          />
          <ReadRow label="PG temporales" value={character.temporaryHp} />
          <ReadRow
            label="Dados de golpe"
            value={
              character.hitDice
                ? `${character.hitDice}${
                    character.hitDiceSpent > 0
                      ? ` · ${character.hitDiceSpent} gastados`
                      : ""
                  }`
                : null
            }
          />

          {hasDeathSaves ? (
            <>
              <Separator className="my-1" />
              <DeathTrack
                label="Éxitos contra muerte"
                filled={character.deathSaveSuccesses}
              />
              <DeathTrack
                label="Fallos contra muerte"
                filled={character.deathSaveFailures}
              />
            </>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}
