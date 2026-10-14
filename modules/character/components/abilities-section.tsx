"use client";

import { useState } from "react";
import { DicesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateAbilitiesAction } from "../actions";
import {
  ABILITIES,
  ABILITY_FIELD,
  ABILITY_LABELS,
  ABILITY_SHORT,
  type AbilityScores,
  abilityModifier,
  abilityScore,
  formatModifier,
} from "../rules";
import { Field } from "./field";
import { FormError, SectionCard } from "./section-card";
import { useFormAction } from "./use-form-action";

export function AbilitiesSection({
  character,
}: {
  character: AbilityScores & { id: string };
}) {
  const [editing, setEditing] = useState(false);
  const { state, pending, submit } = useFormAction(updateAbilitiesAction, () =>
    setEditing(false),
  );

  return (
    <SectionCard
      title="Características"
      icon={DicesIcon}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
    >
      {editing ? (
        <form action={submit} className="flex flex-col gap-4">
          <input type="hidden" name="characterId" value={character.id} />

          <div className="grid grid-cols-2 gap-3">
            {ABILITIES.map((ability) => (
              <Field
                key={ability}
                name={ABILITY_FIELD[ability]}
                label={ABILITY_LABELS[ability]}
                type="number"
                min={1}
                max={30}
                defaultValue={abilityScore(character, ability)}
              />
            ))}
          </div>

          <FormError state={state} />

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {ABILITIES.map((ability) => {
            const score = abilityScore(character, ability);
            return (
              <div
                key={ability}
                className="flex flex-col items-center rounded-lg border py-2"
              >
                <span
                  className="text-[0.7rem] text-muted-foreground"
                  title={ABILITY_LABELS[ability]}
                >
                  {ABILITY_SHORT[ability]}
                </span>
                <span className="text-lg font-semibold">{score}</span>
                <span className="text-xs text-muted-foreground">
                  {formatModifier(abilityModifier(score))}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
