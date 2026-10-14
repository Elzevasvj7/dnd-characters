import React from "react";
import { CharacterDetail } from "../queries";
import {
  ABILITIES,
  ABILITY_LABELS,
  ABILITY_SHORT,
  abilityModifier,
  abilityScore,
  characterProficiencyBonus,
  formatModifier,
  initiative,
  passivePerception,
  saveBonus,
  SKILL_ABILITY,
  SKILL_LABELS,
  skillBonus,
  SKILLS,
} from "../rules";
import { Enums } from "@/lib/supabase/database.types";
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

export const CharacterSheet = ({
  character,
}: {
  character: CharacterDetail;
}) => {
  const bonus = characterProficiencyBonus(character);
  const byLevel = new Map<number, Spell[]>();
  for (const spell of character.spells) {
    const group = byLevel.get(spell.level);
    if (group) group.push(spell);
    else byLevel.set(spell.level, [spell]);
  }
  const spellesListTitles = new Array(9)
    .fill(null)
    .map((_, i) => spellGroupLabel(i + 1));
  return (
    <div id="character-sheet" className="flex flex-col items-center gap-6">
      {/* <!-- PAGE 1 --> */}
      <section className="sheet p-10 flex flex-col" id="page-1">
        <header className="flex mb-2.5">
          <div className="w-[215px]">
            <div className="relative h-[52px]">
              <div
                className="absolute inset-x-0 top-0 h-[31px] border-b border-black pt-[5px] text-[13px] handwriting"
                data-bind="name"
              >
                {character.name}
              </div>
              <div className="absolute bottom-0 left-0 text-[9px] uppercase">
                Nombre del personaje
              </div>
            </div>
          </div>

          <div className="rounded-[17px] border-[1.5px] border-black bg-white px-3 py-[9px] flex-1">
            <div className="grid grid-cols-3 gap-x-3">
              <div className="relative">
                <div
                  className="= inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="classNameLevel"
                >
                  {character.class} {character.level}
                </div>
                <div className="text-[9px] uppercase">Clase y nivel</div>
              </div>
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="background"
                >
                  {character.background}
                </div>
                <div className="text-[9px] uppercase">Trasfondo</div>
              </div>
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="player"
                >
                  {character.playerName}
                </div>
                <div className="bottom-0 text-[9px] uppercase">Jugador</div>
              </div>
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="race"
                >
                  {character.race}
                </div>
                <div className="text-[9px] uppercase">Especie</div>
              </div>
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="alignment"
                >
                  {character.alignment}
                </div>
                <div className="text-[9px] uppercase">Alineamiento</div>
              </div>
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="xp"
                >
                  &nbsp;
                </div>
                <div className="text-[9px] uppercase">
                  Puntos de experiencia
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="grid grid-cols-3 gap-x-[9px] overflow-hidden flex-1">
          <div className="relative flex flex-col max-h-full overflow-hidden">
            <div className="flex gap-[9px] mb-[9px]">
              <div className="rounded-2xl bg-gray-200 p-[6px] h-full">
                <div className="flex flex-col h-full">
                  {ABILITIES.map((ability) => {
                    const score = abilityScore(character, ability);
                    return (
                      <div
                        key={ability}
                        className="relative h-[75px] rounded-2xl border-[1.5px] border-black bg-white pt-3 text-center mb-3.5"
                      >
                        <div className="text-[8px] font-bold uppercase">
                          {ABILITY_LABELS[ability]}
                        </div>
                        <div
                          className="text-[19px] handwriting"
                          data-bind="chaMod"
                        >
                          {formatModifier(abilityModifier(score))}
                        </div>
                        <div
                          className="absolute -bottom-3 left-1/2 flex h-[34px] w-[34px] -translate-x-1/2 items-center justify-center rounded-full border-[1.5px] border-black bg-white text-[13px] handwriting"
                          data-bind="cha"
                        >
                          {score}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-[9px] flex-1">
                <div className="relative rounded-2xl border-[1.5px] border-black bg-white px-2 pt-2 pb-5">
                  {ABILITIES.map((ability) => {
                    const proficient =
                      character.saveProficiencies.includes(ability);
                    return (
                      <div
                        key={ability}
                        className="flex items-center text-[10px]"
                      >
                        <span className="handwriting text-[11px] mr-1">
                          {proficient ? "● " : "○ "}
                        </span>
                        {ABILITY_LABELS[ability]}
                        <span className="ml-auto handwriting">
                          {formatModifier(saveBonus(character, ability))}
                        </span>
                      </div>
                    );
                  })}
                  <div className="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase">
                    Tiradas de salvación
                  </div>
                </div>
                <div className="relative rounded-2xl border-[1.5px] border-black bg-white px-2 pt-2 pb-5 h-full">
                  <div className="space-y-1.5 text-[10px]">
                    {SKILLS.map((skill) => {
                      const proficient =
                        character.skillProficiencies.includes(skill);
                      return (
                        <div key={skill} className="flex items-center">
                          <span className="handwriting text-[11px] mr-1">
                            {proficient ? "● " : "○ "}
                          </span>
                          {SKILL_LABELS[skill]}{" "}
                          <span className="ml-auto handwriting">
                            {formatModifier(skillBonus(character, skill))}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase">
                    Habilidades
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[9px] flex-1">
              <div className="flex h-[39px] items-center">
                <div
                  className="flex h-[39px] w-[48px] items-center justify-center border-[1.5px] border-black text-[18px] handwriting"
                  data-bind="passivePerception"
                >
                  {passivePerception(character)}
                </div>
                <div className="flex h-7 flex-1 items-center justify-center rounded-r-[14px] border-[1.5px] border-l-0 border-black text-[8px] font-bold uppercase">
                  Sabiduría (percepción) pasiva
                </div>
              </div>
              <div className="flex flex-col flex-1 items-center justify-start rounded-[14px] border-[1.5px] border-black text-[8px] font-bold uppercase p-2.5 w-full">
                <div
                  className="handwriting flex justify-start w-full"
                  data-bind="proficiencies"
                >
                  {character.otherProficiencies}
                </div>
                <div className="label bottom-0 absolute pb-2">
                  Otras competencias e idiomas
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col">
            <div className="mb-[10px] grid h-[31px] grid-cols-[44px_1fr] items-center">
              <div
                className="flex h-[37px] items-center justify-center border-[1.5px] border-black text-[17px] handwriting"
                data-bind="inspiration"
              >
                {character.inspiration}
              </div>
              <div className="flex h-7 items-center justify-center rounded-r-2xl border-[1.5px] border-l-0 border-black text-[8px] font-bold uppercase">
                Inspiración
              </div>
            </div>
            <div className="mb-[9px] grid h-[31px] grid-cols-[44px_1fr] items-center">
              <div
                className="flex h-[37px] items-center justify-center border-[1.5px] border-black text-[17px] handwriting"
                data-bind="profBonus"
              >
                {bonus}
              </div>
              <div className="flex h-7 items-center justify-center rounded-r-2xl border-[1.5px] border-l-0 border-black text-[8px] font-bold uppercase">
                Bonificador de competencia
              </div>
            </div>
            <div className="mb-[9px] grid grid-cols-3 gap-[7px]">
              <div className="flex h-[65px] flex-col items-center justify-center rounded-[18px] border-[1.5px] border-black">
                <span className="text-[17px] handwriting" data-bind="ac">
                  {character.armorClass}
                </span>
                <span className="mt-[3px] text-[7px] font-bold uppercase">
                  CA
                </span>
              </div>
              <div className="flex h-[65px] flex-col items-center justify-center rounded-[18px] border-[1.5px] border-black">
                <span
                  className="text-[17px] handwriting"
                  data-bind="initiative"
                >
                  {formatModifier(initiative(character))}
                </span>
                <span className="mt-[3px] text-[7px] font-bold uppercase">
                  Iniciativa
                </span>
              </div>
              <div className="flex h-[65px] flex-col items-center justify-center rounded-[18px] border-[1.5px] border-black">
                <span className="text-[17px] handwriting" data-bind="speed">
                  {character.speed}
                </span>
                <span className="mt-[3px] text-center text-[7px] font-bold uppercase">
                  Velocidad
                  <br />
                  (pies)
                </span>
              </div>
            </div>
            <div className="mb-[9px] rounded-2xl border-[1.5px] p-[5px] bg-gray-200 flex flex-col gap-[5px]">
              <div className="h-[65px] rounded-t-2xl border-[1.5px] border-black px-[10px] relative bg-white">
                <div className="ml-0 text-[9px] text-gray-500">
                  Puntos de Golpe Máximos
                  <span className="handwriting" data-bind="maxHp">
                    {character.maxHp}
                  </span>
                </div>
                <div className="flex items-center justify-center text-[8px] text-center font-bold uppercase absolute bottom-0 left-0 right-0">
                  Puntos de golpe actuales
                </div>
              </div>
              <div className="h-[65px] rounded-b-2xl border-[1.5px] border-black px-[10px] relative bg-white">
                <div className="flex items-center justify-center pb-[5px] text-[8px] text-center font-bold uppercase absolute bottom-0 left-0 right-0">
                  Puntos de golpe temporales
                </div>
              </div>
            </div>
            <div className="mb-[9px] grid grid-cols-2 gap-[7px]">
              <div className="flex h-[65px] flex-col items-center rounded-2xl border-[1.5px] border-black text-[8px] font-bold uppercase relative p-1.5">
                <span
                  className="text-[17px] font-normal handwriting"
                  data-bind="hitDice"
                >
                  {character.hitDice}
                </span>
                <div className="absolute bottom-0 left-0 right-0 text-center">
                  Dados de golpe
                </div>
              </div>
              <div className="flex h-[65px] flex-col items-center rounded-2xl border-[1.5px] border-black text-[8px] font-bold uppercase relative p-1.5">
                <span className="text-[10px] font-normal handwriting">
                  Éxitos ○○○
                  <br />
                  Fallos ○○○
                </span>
                <p className="absolute bottom-0 left-0 right-0 text-center w-full">
                  Salvaciones <br /> de muerte
                </p>
              </div>
            </div>
            <div className="relative mb-[9px] h-[160px] rounded-2xl border-[1.5px] border-black px-[9px] pt-4">
              <div className="grid grid-cols-[1fr_52px_1fr] text-center text-[7px]">
                <span>NOMBRE</span>
                <span>BONIF.</span>
                <span>DAÑO/TIPO</span>
              </div>
              <div>
                {character.attacks.map((atk, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_52px_1fr] text-center text-[7px] handwriting"
                  >
                    <span>{atk.name}</span>
                    <span>{atk.bonus}</span>
                    <span>{atk.damage}</span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase">
                Ataques y lanzamiento de conjuros
              </div>
            </div>
            <div className="relative h-auto rounded-2xl border-[1.5px] border-black px-[10px] pt-3 flex-1">
              {character.items.length > 0 ? (
                <ul className="flex flex-col">
                  {character.items.map((it, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-[10px] handwriting"
                    >
                      <span className="">
                        {it.name} <span className="">(x{it.quantity})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                ""
              )}
              <div className="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase">
                Equipo
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full gap-[5px]">
            <div>
              <div className="bg-gray-200 p-[6px] h-full rounded-2xl space-y-1.5">
                <div className="border-[1.5px] border-black rounded-t-[14px] bg-white p-2 text-[9px] h-[100px] relative">
                  <div className="handwriting" data-bind="personality">
                    {character.personalityTraits}
                  </div>
                  <div className="text-[9px] font-bold text-center uppercase absolute bottom-0 left-0 right-0">
                    Rasgos de personalidad
                  </div>
                </div>
                <div className="border-[1.5px] border-black bg-white p-2 text-[9px] h-[85px] relative">
                  <div className="handwriting" data-bind="ideals">
                    {character.ideals}
                  </div>
                  <div className="text-[9px] font-bold text-center uppercase absolute bottom-0 left-0 right-0">
                    Ideales
                  </div>
                </div>
                <div className="border-[1.5px] border-black bg-white p-2 text-[9px] h-[85px] relative">
                  <div className="handwriting" data-bind="bonds">
                    {character.bonds}
                  </div>
                  <div className="text-[9px] font-bold text-center uppercase absolute bottom-0 left-0 right-0">
                    Vínculos
                  </div>
                </div>
                <div className="border-[1.5px] border-black bg-white p-2 rounded-b-[14px] text-[9px] h-[85px] relative">
                  <div className="handwriting" data-bind="flaws">
                    {character.flaws}
                  </div>
                  <div className="text-[9px] font-bold text-center uppercase absolute bottom-0 left-0 right-0">
                    Defectos
                  </div>
                </div>
              </div>
            </div>
            <div className="border-[1.5px] border-black bg-white p-[6px] rounded-2xl flex-1 relative">
              <div className="handwriting text-[9px]" data-bind="features">
                {character.featuresAndTraits}
              </div>
              <div className="text-[8px] font-bold uppercase bottom-[7px] absolute text-center left-0 right-0">
                Rasgos y atributos
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* <!-- PAGE 2: same fixed A4 canvas, with Tailwind utilities --> */}
      <section className="sheet p-10 flex flex-col" id="page-2">
        <header className="flex mb-2.5">
          <div className="w-[215px]">
            <div className="relative h-[52px]">
              <div
                className="absolute inset-x-0 top-0 h-[31px] border-b border-black pt-[5px] text-[13px] handwriting"
                data-bind="name"
              >
                {character.name}
              </div>
              <div className="absolute bottom-0 left-0 text-[9px] uppercase">
                Nombre del personaje
              </div>
            </div>
          </div>
          <div className="rounded-[17px] border-[1.5px] border-black bg-white px-3 py-[9px] flex-1">
            <div className="grid grid-cols-3 gap-x-3">
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="age"
                >
                  {character.age ? (
                    String(character.age)
                  ) : (
                    <span className="italic">&nbsp;</span>
                  )}
                </div>
                <div className="text-[9px] uppercase">Edad</div>
              </div>
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="height"
                >
                  {character.height ? (
                    String(character.height)
                  ) : (
                    <span className="italic">&nbsp;</span>
                  )}
                </div>
                <div className="text-[9px] uppercase">Altura</div>
              </div>
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="weight"
                >
                  {character.weight ? (
                    String(character.weight)
                  ) : (
                    <span className="italic">&nbsp;</span>
                  )}
                </div>
                <div className="bottom-0 text-[9px] uppercase">Peso</div>
              </div>
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="eyes"
                >
                  {character.eyes ? (
                    String(character.eyes)
                  ) : (
                    <span className="italic">&nbsp;</span>
                  )}
                </div>
                <div className="text-[9px] uppercase">Ojos</div>
              </div>
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="skin"
                >
                  {character.skin ? (
                    String(character.skin)
                  ) : (
                    <span className="italic">&nbsp;</span>
                  )}
                </div>
                <div className="text-[9px] uppercase">Piel</div>
              </div>
              <div className="relative">
                <div
                  className="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                  data-bind="hair"
                >
                  {character.hair ? (
                    String(character.hair)
                  ) : (
                    <span className="italic">&nbsp;</span>
                  )}
                </div>
                <div className="text-[9px] uppercase">Pelo</div>
              </div>
            </div>
          </div>
        </header>
        <main className="grid grid-cols-2 gap-x-[9px] overflow-hidden flex-1">
          <div className="flex flex-col gap-3">
            <div className="relative h-[401px] rounded-2xl border-[1.5px] border-black p-1">
              <div className="flex items-center justify-center text-gray-400">
                <div className="flex h-[310px] w-[192px] items-center justify-center border border-dashed border-gray-400 text-[10px]">
                  Imagen del personaje
                </div>
              </div>
              <div className="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase">
                Apariencia
              </div>
            </div>
            <div className="relative rounded-2xl border-[1.5px] border-black p-[10px] pb-[22px] flex-1">
              <div
                className="whitespace-pre-wrap text-[11px] leading-[1.08] handwriting"
                data-bind="notes"
              ></div>
              <div className="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase">
                Notas adicionales
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="relative h-[450px] rounded-2xl border-[1.5px] border-black p-[10px] pb-[22px]">
              <div
                className="whitespace-pre-wrap text-[10px] leading-[1.15] handwriting"
                data-bind="history"
              ></div>
              <div className="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase">
                Historia del personaje
              </div>
            </div>
            <div className="relative h-full rounded-2xl border-[1.5px] border-black p-[10px] pb-[22px] flex-1">
              <div
                className="whitespace-pre-wrap text-[10px] leading-[1.15]"
                data-bind="features"
              ></div>
              <div className="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase">
                Rasgos y atributos
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* <!-- PAGE 3: SPELLS --> */}
      <section className="sheet p-10" id="page-3">
        <header className="grid grid-cols-[1.4fr_1.2fr_.9fr_1fr] gap-2 mb-[9px]">
          <div className="relative rounded-2xl border-[1.5px] border-black p-[9px] pb-5">
            <div
              className="flex items-center border-b border-black text-[13px] handwriting"
              data-bind="spellcastingclassName"
            >
              {character.spellcastingClass}
            </div>
            <div className="absolute bottom-[6px] left-2 right-2 text-[7px] font-bold uppercase">
              Clase lanzadora de conjuros
            </div>
          </div>
          <div className="relative rounded-2xl border-[1.5px] border-black p-[9px] pb-5">
            <div
              className="flex items-center border-b border-black text-[13px] handwriting"
              data-bind="spellcastingAbility"
            >
              {character.spellcastingAbility}
            </div>
            <div className="absolute bottom-[6px] left-2 right-2 text-[7px] font-bold uppercase">
              Característica mágica
            </div>
          </div>
          <div className="relative rounded-2xl border-[1.5px] border-black p-[9px] pb-5">
            <div
              className="flex items-center border-b border-black text-[13px] handwriting"
              data-bind="spellSaveDc"
            >
              {/* {character.spellSaveDc} */} &nbsp;
            </div>
            <div className="absolute bottom-[6px] left-2 right-2 text-center text-[7px] font-bold uppercase">
              CD salvación conjuros
            </div>
          </div>
          <div className="relative rounded-2xl border-[1.5px] border-black p-[9px] pb-5">
            <div
              className="flex items-center border-b border-black text-[13px] handwriting"
              data-bind="spellAttackBonus"
            >
              {/* +6 */} &nbsp;
            </div>
            <div className="absolute bottom-[6px] left-2 right-2 text-center text-[7px] font-bold uppercase">
              Bonif. ataque conjuros
            </div>
          </div>
        </header>
        <div className="grid grid-cols-9 gap-[5px] mb-[9px]">
          {character.spellSlots.length === 0 && (
            <>
              {spellesListTitles.map((title) => (
                <div
                  key={title}
                  className="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center"
                >
                  <div className="text-[7px] font-extrabold uppercase">
                    {title}
                  </div>
                </div>
              ))}
            </>
          )}
          {character.spellSlots.map((slot) => (
            <div key={slot.id} className="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center">
              <div className="text-[7px] font-extrabold uppercase handwriting">
                Nivel {slot.level}
              </div>
              <div
                className="mt-[7px] h-[19px] text-[15px] handwriting"
                data-bind="slot1"
              >
                {slot.total}
              </div>
              <span className="flex flex-1 flex-wrap gap-1">
                {Array.from({ length: slot.total }, (_, index) => (
                 <span key={index}>○</span>
                ))}
              </span>
            </div>
          ))}
        </div>
        <main className="flex flex-col gap-[10px] overflow-hidden mb-[9px]">
          <div className="grid min-h-0 grid-rows-9 gap-[7px]">
            {character.spells.length === 0 && (
              <>
                {spellesListTitles.map((title) => (
                  <div
                    key={title}
                    className="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px]"
                  >
                    <div className="mb-1 flex justify-between border-b border-black pb-1 text-[8px] font-extrabold uppercase">
                      {title}
                    </div>
                  </div>
                ))}
              </>
            )}
            {[...byLevel].map(([level, group]) => (
              <div
                className="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px] flex-1"
                key={level}
              >
                <div className="mb-1 flex justify-between border-b border-black pb-1 text-[8px] font-extrabold uppercase">
                  {spellGroupLabel(level)}
                </div>
                <div className="space-y-0 text-[7px]">
                  {group.map((spell) => {
                    return (
                      <div
                        key={spell.id}
                        className="grid grid-cols-[13px_1fr_45px_45px_48px] gap-1 border-b border-dotted border-gray-400 py-[2px] handwriting"
                      >
                        <span>●</span>
                        <span className="font-bold">{spell.name}</span>
                        <span className="text-center text-[6px]">
                          {spell.school
                            ? SPELL_SCHOOL_LABELS[spell.school]
                            : ""}
                        </span>
                        <span className="text-center text-[6px]">
                          {spell.castingTime}
                        </span>
                        <span className="text-center text-[6px]">
                          {spell.range}
                        </span>
                        <span className="text-center text-[6px]">
                          {spell.duration}
                        </span>
                        <span className="text-center text-[6px]">
                          {spell.components}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>
      </section>
    </div>
  );
};
