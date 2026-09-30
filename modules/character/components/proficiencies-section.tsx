"use client";

import { useState } from "react";
import { AwardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { updateProficienciesAction } from "../actions";
import {
  ABILITIES,
  ABILITY_LABELS,
  ABILITY_SHORT,
  SKILL_ABILITY,
  SKILL_LABELS,
  SKILLS,
  type CharacterStats,
  characterProficiencyBonus,
  formatModifier,
  saveBonus,
  skillBonus,
} from "../rules";
import { ProficiencyFields } from "./proficiency-fields";
import { FormError, SectionCard } from "./section-card";
import { useFormAction } from "./use-form-action";

type Props = {
  character: CharacterStats & {
    id: string;
    otherProficiencies: string | null;
  };
};

export function ProficienciesSection({ character }: Props) {
  const [editing, setEditing] = useState(false);
  const { state, pending, submit } = useFormAction(
    updateProficienciesAction,
    () => setEditing(false),
  );

  const bonus = characterProficiencyBonus(character);
  // Si alguien lo ha forzado conviene que se note: si no, al subir de nivel
  // parecería que la app no lo actualiza.
  const edited = character.proficiencyBonusOverride !== null ? " (editado)" : "";

  return (
    <SectionCard
      title={`Competencias · bonificador ${formatModifier(bonus)}${edited}`}
      icon={AwardIcon}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
    >
      {editing ? (
        <form action={submit} className="flex flex-col gap-5">
          <input type="hidden" name="characterId" value={character.id} />

          <ProficiencyFields
            scores={character}
            level={character.level}
            defaults={character}
          />

          <Separator />

          <div className="flex flex-col gap-2">
            <Label htmlFor="otherProficiencies">
              Otras competencias e idiomas
            </Label>
            <Textarea
              id="otherProficiencies"
              name="otherProficiencies"
              rows={3}
              defaultValue={character.otherProficiencies ?? ""}
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
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">
              Tiradas de salvación
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {ABILITIES.map((ability) => {
                const proficient =
                  character.saveProficiencies.includes(ability);
                return (
                  <li
                    key={ability}
                    className="flex items-baseline justify-between gap-2 text-sm"
                  >
                    <span
                      className={
                        proficient ? "font-medium" : "text-muted-foreground"
                      }
                    >
                      {proficient ? "● " : "○ "}
                      {ABILITY_LABELS[ability]}
                    </span>
                    <span className="tabular-nums">
                      {formatModifier(saveBonus(character, ability))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">
              Habilidades
            </h3>
            <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {SKILLS.map((skill) => {
                const proficient = character.skillProficiencies.includes(skill);
                const expert = character.skillExpertise.includes(skill);
                return (
                  <li
                    key={skill}
                    className="flex items-baseline justify-between gap-2 text-sm"
                  >
                    <span
                      className={
                        proficient ? "font-medium" : "text-muted-foreground"
                      }
                    >
                      {expert ? "◉ " : proficient ? "● " : "○ "}
                      {SKILL_LABELS[skill]}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({ABILITY_SHORT[SKILL_ABILITY[skill]]})
                      </span>
                    </span>
                    <span className="tabular-nums">
                      {formatModifier(skillBonus(character, skill))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {character.otherProficiencies ? (
            <div className="flex flex-col gap-1">
              <h3 className="text-xs tracking-wide text-muted-foreground uppercase">
                Otras competencias e idiomas
              </h3>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {character.otherProficiencies}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}
