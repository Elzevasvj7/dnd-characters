"use client";

import { useState } from "react";
import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSpellcastingAction } from "../actions";
import {
  ABILITIES,
  ABILITY_LABELS,
  type CharacterStats,
  formatModifier,
  spellAttackBonus,
  spellSaveDc,
} from "../rules";
import { Field } from "./field";
import { FormError, ReadRow, SectionCard } from "./section-card";
import { useFormAction } from "./use-form-action";

const ABILITY_ITEMS = ABILITIES.map((ability) => ({
  label: ABILITY_LABELS[ability],
  value: ability,
}));

type Props = {
  character: CharacterStats & {
    id: string;
    spellcastingClass: string | null;
  };
};

export function SpellcastingSection({ character }: Props) {
  const [editing, setEditing] = useState(false);
  const { state, pending, submit } = useFormAction(
    updateSpellcastingAction,
    () => setEditing(false),
  );

  const dc = spellSaveDc(character);
  const attack = spellAttackBonus(character);

  return (
    <SectionCard
      title="Lanzamiento de conjuros"
      icon={SparklesIcon}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
    >
      {editing ? (
        <form action={submit} className="flex flex-col gap-4">
          <input type="hidden" name="characterId" value={character.id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="spellcastingClass"
              label="Clase lanzadora"
              maxLength={60}
              defaultValue={character.spellcastingClass ?? ""}
              placeholder="Mago"
            />

            <div className="flex flex-col gap-2">
              <Label htmlFor="spellcastingAbility">Aptitud mágica</Label>
              <Select
                name="spellcastingAbility"
                items={ABILITY_ITEMS}
                defaultValue={character.spellcastingAbility ?? undefined}
              >
                <SelectTrigger id="spellcastingAbility" className="w-full">
                  <SelectValue placeholder="Sin especificar" />
                </SelectTrigger>
                <SelectContent>
                  {ABILITY_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            La CD y el bonificador de ataque se calculan solos a partir de la
            aptitud mágica y el nivel. Rellena los campos de abajo únicamente si
            un objeto mágico te da otra cifra.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="spellSaveDcOverride"
              label="CD de salvación (forzada)"
              type="number"
              defaultValue={character.spellSaveDcOverride ?? ""}
            />
            <Field
              name="spellAttackBonusOverride"
              label="Bonif. de ataque (forzado)"
              type="number"
              defaultValue={character.spellAttackBonusOverride ?? ""}
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
          <ReadRow label="Clase lanzadora" value={character.spellcastingClass} />
          <ReadRow
            label="Aptitud mágica"
            value={
              character.spellcastingAbility
                ? ABILITY_LABELS[character.spellcastingAbility]
                : null
            }
          />
          <ReadRow
            label="CD de salvación"
            value={
              dc === null ? null : (
                <>
                  {dc}
                  {character.spellSaveDcOverride !== null ? (
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      forzada
                    </span>
                  ) : null}
                </>
              )
            }
          />
          <ReadRow
            label="Bonificador de ataque"
            value={
              attack === null ? null : (
                <>
                  {formatModifier(attack)}
                  {character.spellAttackBonusOverride !== null ? (
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      forzado
                    </span>
                  ) : null}
                </>
              )
            }
          />
        </div>
      )}
    </SectionCard>
  );
}
