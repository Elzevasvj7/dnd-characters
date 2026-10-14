"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Enums } from "@/lib/supabase/database.types";
import {
  ABILITIES,
  ABILITY_LABELS,
  ABILITY_SHORT,
  type AbilityScores,
  type CharacterStats,
  SKILL_ABILITY,
  SKILL_LABELS,
  SKILLS,
  formatModifier,
  proficiencyBonus,
  saveBonus,
  skillBonus,
} from "../rules";

type Ability = Enums<"Ability">;
type Skill = Enums<"Skill">;

export type ProficiencyDefaults = {
  proficiencyBonusOverride: number | null;
  saveProficiencies: Ability[];
  skillProficiencies: Skill[];
  skillExpertise: Skill[];
};

/**
 * Bonificador de competencia, tiradas de salvación y habilidades, con el bono
 * de cada una calculado mientras marcas.
 *
 * Los checkboxes son controlados solo para poder recalcular: lo que viaja al
 * servidor sigue siendo el formulario (`name` repetido por cada marca), así
 * que la action no sabe ni le importa que aquí haya estado.
 *
 * `scores` y `level` vienen de fuera porque en el alta cambian mientras se
 * rellena el resto del formulario.
 */
export function ProficiencyFields({
  scores,
  level,
  defaults,
}: {
  scores: AbilityScores;
  level: number;
  defaults: ProficiencyDefaults;
}) {
  const [bonusInput, setBonusInput] = useState(
    defaults.proficiencyBonusOverride?.toString() ?? "",
  );
  const [saves, setSaves] = useState(defaults.saveProficiencies);
  const [skills, setSkills] = useState(defaults.skillProficiencies);
  const [expertise, setExpertise] = useState(defaults.skillExpertise);

  const parsedBonus = Number.parseInt(bonusInput, 10);
  const stats: CharacterStats = {
    ...scores,
    level,
    proficiencyBonusOverride: Number.isNaN(parsedBonus) ? null : parsedBonus,
    saveProficiencies: saves,
    skillProficiencies: skills,
    skillExpertise: expertise,
    // Solo pintamos salvaciones y habilidades: estos no intervienen.
    initiativeOverride: null,
    spellcastingAbility: null,
    spellSaveDcOverride: null,
    spellAttackBonusOverride: null,
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="proficiencyBonusOverride">
          Bonificador de competencia
        </Label>
        <Input
          id="proficiencyBonusOverride"
          name="proficiencyBonusOverride"
          type="number"
          min={0}
          max={20}
          value={bonusInput}
          onChange={(event) => setBonusInput(event.target.value)}
          placeholder={`${formatModifier(proficiencyBonus(level))} (por nivel)`}
          className="max-w-40"
        />
        <p className="text-xs text-muted-foreground">
          Vacío usa el del manual para nivel {level}. Rellénalo solo si tu mesa
          lo cambia.
        </p>
      </div>

      <Separator />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
          Tiradas de salvación
        </legend>
        <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {ABILITIES.map((ability) => (
            <li key={ability}>
              <Label className="flex items-center gap-2 font-normal">
                <Checkbox
                  name="saveProficiencies"
                  value={ability}
                  checked={saves.includes(ability)}
                  onCheckedChange={(checked) =>
                    setSaves(toggle(saves, ability, checked))
                  }
                />
                <span className="flex-1">{ABILITY_LABELS[ability]}</span>
                <span className="text-sm tabular-nums">
                  {formatModifier(saveBonus(stats, ability))}
                </span>
              </Label>
            </li>
          ))}
        </ul>
      </fieldset>

      <Separator />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
          Habilidades
        </legend>
        <p className="mb-2 text-xs text-muted-foreground">
          Marca las de tu clase y tu trasfondo. La casilla redonda es
          experiencia: dobla el bonificador y solo cuenta si además eres
          competente.
        </p>
        <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {SKILLS.map((skill) => {
            const proficient = skills.includes(skill);
            return (
              <li key={skill} className="flex items-center gap-3 text-sm">
                <Checkbox
                  name="skillProficiencies"
                  value={skill}
                  checked={proficient}
                  onCheckedChange={(checked) => {
                    setSkills(toggle(skills, skill, checked));
                    // Sin competencia no hay nada que doblar.
                    if (!checked) setExpertise(toggle(expertise, skill, false));
                  }}
                  aria-label={`Competente en ${SKILL_LABELS[skill]}`}
                />
                <Checkbox
                  name="skillExpertise"
                  value={skill}
                  checked={expertise.includes(skill)}
                  disabled={!proficient}
                  onCheckedChange={(checked) =>
                    setExpertise(toggle(expertise, skill, checked))
                  }
                  aria-label={`Experiencia en ${SKILL_LABELS[skill]}`}
                  className="rounded-full"
                />
                <span className={proficient ? "flex-1 font-medium" : "flex-1"}>
                  {SKILL_LABELS[skill]}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    ({ABILITY_SHORT[SKILL_ABILITY[skill]]})
                  </span>
                </span>
                <span className="tabular-nums">
                  {formatModifier(skillBonus(stats, skill))}
                </span>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}

function toggle<T>(list: T[], item: T, on: boolean): T[] {
  return on ? [...list, item] : list.filter((x) => x !== item);
}
