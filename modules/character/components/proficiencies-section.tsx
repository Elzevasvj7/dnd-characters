"use client";

import { useState } from "react";
import { AwardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  formatModifier,
  proficiencyBonus,
  saveBonus,
  skillBonus,
} from "../rules";
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

  const bonus = proficiencyBonus(character.level);

  return (
    <SectionCard
      title={`Competencias · bonificador ${formatModifier(bonus)}`}
      icon={AwardIcon}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
    >
      {editing ? (
        <form action={submit} className="flex flex-col gap-5">
          <input type="hidden" name="characterId" value={character.id} />

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
              Tiradas de salvación
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {ABILITIES.map((ability) => (
                <Label
                  key={ability}
                  className="flex items-center gap-2 font-normal"
                >
                  <Checkbox
                    name="saveProficiencies"
                    value={ability}
                    defaultChecked={character.saveProficiencies.includes(
                      ability,
                    )}
                  />
                  {ABILITY_LABELS[ability]}
                </Label>
              ))}
            </div>
          </fieldset>

          <Separator />

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
              Habilidades
            </legend>
            <p className="mb-2 text-xs text-muted-foreground">
              La segunda casilla es experiencia: dobla el bonificador. Solo
              cuenta si además marcas competencia.
            </p>
            <ul className="flex flex-col gap-1.5">
              {SKILLS.map((skill) => (
                <li key={skill} className="flex items-center gap-3 text-sm">
                  <Checkbox
                    name="skillProficiencies"
                    value={skill}
                    defaultChecked={character.skillProficiencies.includes(skill)}
                    aria-label={`Competente en ${SKILL_LABELS[skill]}`}
                  />
                  <Checkbox
                    name="skillExpertise"
                    value={skill}
                    defaultChecked={character.skillExpertise.includes(skill)}
                    aria-label={`Experiencia en ${SKILL_LABELS[skill]}`}
                    className="rounded-full"
                  />
                  <span className="flex-1">{SKILL_LABELS[skill]}</span>
                  <span className="text-xs text-muted-foreground">
                    {ABILITY_SHORT[SKILL_ABILITY[skill]]}
                  </span>
                </li>
              ))}
            </ul>
          </fieldset>

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
