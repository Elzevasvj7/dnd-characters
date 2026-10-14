"use client";

import { useActionState, useState } from "react";
import {
  CheckCircle2Icon,
  PlusIcon,
  SwordsIcon,
  Trash2Icon,
  PackageIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createCharacterAction, parseCharacterSheetAction } from "../actions";
import {
  AbilityScoresBuilder,
  INITIAL_ABILITY_ROWS,
  abilityRowsToScores,
} from "./ability-scores-builder";
import { Field } from "./field";
import { PortraitPicker } from "./portrait-picker";
import {
  ProficiencyFields,
  type ProficiencyDefaults,
} from "./proficiency-fields";
import { SheetUploader } from "./sheet-uploader";
import { ABILITIES } from "../rules";

const NO_PROFICIENCIES: ProficiencyDefaults = {
  proficiencyBonusOverride: null,
  saveProficiencies: [],
  skillProficiencies: [],
  skillExpertise: [],
};

type AttackItem = {
  name: string;
  bonus: string;
  damage: string;
};

type InventoryItem = {
  name: string;
  quantity: number;
  weight?: number;
  description: string;
};

type SpellItem = {
  name: string;
  level: number;
  school?: string;
  castingTime?: string;
  range?: string;
  duration?: string;
  components?: string;
  concentration?: boolean;
  ritual?: boolean;
  description?: string;
};

export function CharacterForm() {
  const [state, action, pending] = useActionState(createCharacterAction, null);

  const [level, setLevel] = useState(1);
  const [abilityRows, setAbilityRows] = useState(INITIAL_ABILITY_ROWS);
  const [proficiencyDefaults, setProficiencyDefaults] =
    useState<ProficiencyDefaults>(NO_PROFICIENCIES);
  const [proficiencyKey, setProficiencyKey] = useState(0);

  const [formDataValues, setFormDataValues] = useState({
    // Identidad
    name: "",
    race: "",
    class: "",
    age: "",
    background: "",
    alignment: "",
    playerName: "",
    experiencePoints: "",
    // Combate
    maxHp: "",
    currentHp: "",
    temporaryHp: "",
    armorClass: "",
    speed: "",
    hitDice: "",
    // Competencias
    otherProficiencies: "",
    // Personalidad
    personalityTraits: "",
    ideals: "",
    bonds: "",
    flaws: "",
    // Aspecto
    height: "",
    weight: "",
    eyes: "",
    skin: "",
    hair: "",
    // Trasfondo y cualidad
    backstory: "",
    alliesAndOrganizations: "",
    organizationName: "",
    featuresAndTraits: "",
    additionalFeatures: "",
    treasure: "",
    // Monedas
    platinum: "0",
    gold: "0",
    electrum: "0",
    silver: "0",
    copper: "0",
    // Lanzamiento de Conjuros
    spellcastingClass: "",
    spellcastingAbility: "",
  });

  // Listas de Ataques, Inventario y Conjuros
  const [attacks, setAttacks] = useState<AttackItem[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [spells, setSpells] = useState<SpellItem[]>([]);

  // Campos temporales para añadir nuevos elementos en la UI
  const [newAttack, setNewAttack] = useState<AttackItem>({
    name: "",
    bonus: "",
    damage: "",
  });
  const [newItem, setNewItem] = useState<{
    name: string;
    quantity: string;
    weight: string;
    description: string;
  }>({
    name: "",
    quantity: "1",
    weight: "",
    description: "",
  });
  const [newSpell, setNewSpell] = useState<{
    name: string;
    level: string;
    school: string;
    description: string;
  }>({
    name: "",
    level: "0",
    school: "",
    description: "",
  });

  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseSuccess, setParseSuccess] = useState(false);

  const updateField = (field: keyof typeof formDataValues, value: string) => {
    setFormDataValues((prev) => ({ ...prev, [field]: value }));
  };

  async function handleParseSheet(files: File[]) {
    setIsParsing(true);
    setParseError(null);
    setParseSuccess(false);

    const formData = new FormData();
    files.forEach((file) => formData.append("sheet", file));

    const result = await parseCharacterSheetAction(formData);
    setIsParsing(false);

    if (!result.ok) {
      setParseError(result.error);
      return;
    }

    const d = result.data;
    
    setParseSuccess(true);

    if (d.level) setLevel(d.level);
    console.log("d", d);
    setFormDataValues((prev) => ({
      name: d.name ?? prev.name,
      race: d.race ?? prev.race,
      class: d.class ?? prev.class,
      age: d.age !== undefined ? String(d.age) : prev.age,
      background: d.background ?? prev.background,
      alignment: d.alignment ?? prev.alignment,
      playerName: d.playerName ?? prev.playerName,
      experiencePoints:
        d.experiencePoints !== undefined
          ? String(d.experiencePoints)
          : prev.experiencePoints,

      maxHp: d.maxHp !== undefined ? String(d.maxHp) : prev.maxHp,
      currentHp:
        d.currentHp !== undefined ? String(d.currentHp) : prev.currentHp,
      temporaryHp:
        d.temporaryHp !== undefined ? String(d.temporaryHp) : prev.temporaryHp,
      armorClass:
        d.armorClass !== undefined ? String(d.armorClass) : prev.armorClass,
      speed: d.speed !== undefined ? String(d.speed) : prev.speed,
      hitDice: d.hitDice ?? prev.hitDice,

      otherProficiencies: d.otherProficiencies ?? prev.otherProficiencies,

      personalityTraits: d.personalityTraits ?? prev.personalityTraits,
      ideals: d.ideals ?? prev.ideals,
      bonds: d.bonds ?? prev.bonds,
      flaws: d.flaws ?? prev.flaws,

      height: d.height ?? prev.height,
      weight: d.weight ?? prev.weight,
      eyes: d.eyes ?? prev.eyes,
      skin: d.skin ?? prev.skin,
      hair: d.hair ?? prev.hair,

      backstory: d.backstory ?? prev.backstory,
      alliesAndOrganizations:
        d.alliesAndOrganizations ?? prev.alliesAndOrganizations,
      organizationName: d.organizationName ?? prev.organizationName,
      featuresAndTraits: d.featuresAndTraits ?? prev.featuresAndTraits,
      additionalFeatures: d.additionalFeatures ?? prev.additionalFeatures,
      treasure: d.treasure ?? prev.treasure,

      platinum: d.platinum !== undefined ? String(d.platinum) : prev.platinum,
      gold: d.gold !== undefined ? String(d.gold) : prev.gold,
      electrum: d.electrum !== undefined ? String(d.electrum) : prev.electrum,
      silver: d.silver !== undefined ? String(d.silver) : prev.silver,
      copper: d.copper !== undefined ? String(d.copper) : prev.copper,

      spellcastingClass: d.spellcastingClass ?? prev.spellcastingClass,
      spellcastingAbility: d.spellcastingAbility ?? prev.spellcastingAbility,
    }));

    if (
      d.strength ||
      d.dexterity ||
      d.constitution ||
      d.intelligence ||
      d.wisdom ||
      d.charisma
    ) {
      setAbilityRows((prev) => ({
        STRENGTH:
          d.strength !== undefined
            ? { base: String(d.strength), bonus: "" }
            : prev.STRENGTH,
        DEXTERITY:
          d.dexterity !== undefined
            ? { base: String(d.dexterity), bonus: "" }
            : prev.DEXTERITY,
        CONSTITUTION:
          d.constitution !== undefined
            ? { base: String(d.constitution), bonus: "" }
            : prev.CONSTITUTION,
        INTELLIGENCE:
          d.intelligence !== undefined
            ? { base: String(d.intelligence), bonus: "" }
            : prev.INTELLIGENCE,
        WISDOM:
          d.wisdom !== undefined
            ? { base: String(d.wisdom), bonus: "" }
            : prev.WISDOM,
        CHARISMA:
          d.charisma !== undefined
            ? { base: String(d.charisma), bonus: "" }
            : prev.CHARISMA,
      }));
    }

    if (
      d.saveProficiencies?.length ||
      d.skillProficiencies?.length ||
      d.skillExpertise?.length
    ) {
      setProficiencyDefaults({
        proficiencyBonusOverride: null,
        saveProficiencies: d.saveProficiencies ?? [],
        skillProficiencies: d.skillProficiencies ?? [],
        skillExpertise: d.skillExpertise ?? [],
      });
      setProficiencyKey((k) => k + 1);
    }

    if (d.attacks?.length) setAttacks(d.attacks);
    if (d.items?.length) setItems(d.items);
    if (d.spells?.length) setSpells(d.spells);
  }

  // Métodos para agregar/quitar ataques, objetos y conjuros
  function addAttack() {
    if (!newAttack.name.trim()) return;
    setAttacks([...attacks, newAttack]);
    setNewAttack({ name: "", bonus: "", damage: "" });
  }

  function removeAttack(index: number) {
    setAttacks(attacks.filter((_, i) => i !== index));
  }

  function addItem() {
    if (!newItem.name.trim()) return;
    const qty = Number.parseInt(newItem.quantity, 10) || 1;
    const w = newItem.weight ? Number.parseFloat(newItem.weight) : undefined;
    setItems([
      ...items,
      {
        name: newItem.name,
        quantity: qty,
        weight: w,
        description: newItem.description,
      },
    ]);
    setNewItem({ name: "", quantity: "1", weight: "", description: "" });
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function addSpell() {
    if (!newSpell.name.trim()) return;
    const lvl = Number.parseInt(newSpell.level, 10) || 0;
    setSpells([
      ...spells,
      {
        name: newSpell.name,
        level: lvl,
        school: newSpell.school || undefined,
        description: newSpell.description,
      },
    ]);
    setNewSpell({ name: "", level: "0", school: "", description: "" });
  }

  function removeSpell(index: number) {
    setSpells(spells.filter((_, i) => i !== index));
  }

  return (
    <form
      action={action}
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      {/* Campos ocultos JSON para guardar las listas en la creación */}
      <input type="hidden" name="attacksJson" value={JSON.stringify(attacks)} />
      <input type="hidden" name="itemsJson" value={JSON.stringify(items)} />
      <input type="hidden" name="spellsJson" value={JSON.stringify(spells)} />

      <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
        <SheetUploader
          onParse={handleParseSheet}
          isParsing={isParsing}
          parseError={parseError}
        />
        {parseSuccess && <pre>{JSON.stringify(formDataValues, null, 2)}</pre>}
      </div>

      <div className="flex flex-col gap-6">
        {parseSuccess ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2Icon className="size-5 shrink-0" />
            <span>
              ¡Hoja leída con éxito con Gemini! Se han extraído todos los datos
              disponibles (identidad, atributos, combate, rasgos, ataques,
              inventario y conjuros).
            </span>
          </div>
        ) : null}

        <Tabs defaultValue="identity" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto p-1 gap-1">
            <TabsTrigger value="identity">Identidad & Combate</TabsTrigger>
            <TabsTrigger value="abilities">Atributos & Comp.</TabsTrigger>
            <TabsTrigger value="personality">Rasgos & Historia</TabsTrigger>
            <TabsTrigger value="equipment">Ataques & Equipo</TabsTrigger>
            <TabsTrigger value="spells">Conjuros</TabsTrigger>
          </TabsList>

          {/* ------------------------------------------------------------------ */}
          {/* TAB 1: IDENTIDAD Y COMBATE                                         */}
          {/* ------------------------------------------------------------------ */}
          <TabsContent value="identity" className="mt-4 flex flex-col gap-6" keepMounted>
            <Card>
              <CardHeader>
                <CardTitle>Identidad</CardTitle>
                <CardDescription>
                  Datos generales de tu personaje.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <PortraitPicker className="mx-auto w-32 sm:mx-0" />

                <div className="grid content-start gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field
                      name="name"
                      label="Nombre"
                      required
                      maxLength={80}
                      value={formDataValues.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>
                  <Field
                    name="race"
                    label="Raza"
                    maxLength={60}
                    value={formDataValues.race}
                    onChange={(e) => updateField("race", e.target.value)}
                  />
                  <Field
                    name="class"
                    label="Clase"
                    maxLength={60}
                    value={formDataValues.class}
                    onChange={(e) => updateField("class", e.target.value)}
                  />
                  <Field
                    name="level"
                    label="Nivel"
                    type="number"
                    min={1}
                    max={20}
                    value={level}
                    onChange={(event) => {
                      const value = Number.parseInt(event.target.value, 10);
                      if (value >= 1 && value <= 20) setLevel(value);
                    }}
                  />
                  <Field
                    name="age"
                    label="Edad"
                    type="number"
                    min={0}
                    value={formDataValues.age}
                    onChange={(e) => updateField("age", e.target.value)}
                  />
                  <Field
                    name="background"
                    label="Trasfondo"
                    maxLength={120}
                    value={formDataValues.background}
                    onChange={(e) => updateField("background", e.target.value)}
                  />
                  <Field
                    name="alignment"
                    label="Alineamiento"
                    maxLength={40}
                    value={formDataValues.alignment}
                    onChange={(e) => updateField("alignment", e.target.value)}
                  />
                  <Field
                    name="playerName"
                    label="Nombre del jugador"
                    maxLength={80}
                    value={formDataValues.playerName}
                    onChange={(e) => updateField("playerName", e.target.value)}
                  />
                  <Field
                    name="experiencePoints"
                    label="Puntos de experiencia (XP)"
                    type="number"
                    min={0}
                    value={formDataValues.experiencePoints}
                    onChange={(e) =>
                      updateField("experiencePoints", e.target.value)
                    }
                  />
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="spellcastingAbility">Campaña</Label>
                    <select
                      id="campaign"
                      name="campaign"
                      className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      value={formDataValues.spellcastingAbility}
                      onChange={(e) =>
                        updateField("spellcastingAbility", e.target.value)
                      }
                    >
                      <option value="">Ninguna</option>
                      <option value="iron-and-ether">Iron and Ether</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Combate</CardTitle>
                <CardDescription>
                  Puntos de golpe, CA, velocidad y dados.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Field
                  name="maxHp"
                  label="PG máximos"
                  type="number"
                  min={0}
                  value={formDataValues.maxHp}
                  onChange={(e) => updateField("maxHp", e.target.value)}
                />
                <Field
                  name="currentHp"
                  label="PG actuales"
                  type="number"
                  value={formDataValues.currentHp}
                  onChange={(e) => updateField("currentHp", e.target.value)}
                />
                <Field
                  name="temporaryHp"
                  label="PG temporales"
                  type="number"
                  min={0}
                  value={formDataValues.temporaryHp}
                  onChange={(e) => updateField("temporaryHp", e.target.value)}
                />
                <Field
                  name="armorClass"
                  label="CA"
                  type="number"
                  min={0}
                  value={formDataValues.armorClass}
                  onChange={(e) => updateField("armorClass", e.target.value)}
                />
                <Field
                  name="speed"
                  label="Velocidad"
                  type="number"
                  min={0}
                  value={formDataValues.speed}
                  onChange={(e) => updateField("speed", e.target.value)}
                />
                <Field
                  name="hitDice"
                  label="Dados de golpe"
                  placeholder="ej. 1d8"
                  value={formDataValues.hitDice}
                  onChange={(e) => updateField("hitDice", e.target.value)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ------------------------------------------------------------------ */}
          {/* TAB 2: CARACTERÍSTICAS Y COMPETENCIAS                               */}
          {/* ------------------------------------------------------------------ */}
          <TabsContent value="abilities" className="mt-4 flex flex-col gap-6" keepMounted>
            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
                <CardDescription>
                  Puntuaciones base y bonos raciales/clase.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AbilityScoresBuilder
                  rows={abilityRows}
                  onChange={setAbilityRows}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competencias y Habilidades</CardTitle>
                <CardDescription>
                  Salvaciones y habilidades del personaje.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <ProficiencyFields
                  key={proficiencyKey}
                  scores={abilityRowsToScores(abilityRows)}
                  level={level}
                  defaults={proficiencyDefaults}
                />

                <div className="flex flex-col gap-2">
                  <Label htmlFor="otherProficiencies">
                    Otras competencias e idiomas
                  </Label>
                  <Textarea
                    id="otherProficiencies"
                    name="otherProficiencies"
                    rows={3}
                    placeholder="Idiomas, armas, armaduras y herramientas..."
                    value={formDataValues.otherProficiencies}
                    onChange={(e) =>
                      updateField("otherProficiencies", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ------------------------------------------------------------------ */}
          {/* TAB 3: RASGOS Y HISTORIA                                           */}
          {/* ------------------------------------------------------------------ */}
          <TabsContent value="personality" className="mt-4 flex flex-col gap-6" keepMounted>
            <Card>
              <CardHeader>
                <CardTitle>Personalidad</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="personalityTraits">
                    Rasgos de personalidad
                  </Label>
                  <Textarea
                    id="personalityTraits"
                    name="personalityTraits"
                    rows={3}
                    value={formDataValues.personalityTraits}
                    onChange={(e) =>
                      updateField("personalityTraits", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ideals">Ideales</Label>
                  <Textarea
                    id="ideals"
                    name="ideals"
                    rows={3}
                    value={formDataValues.ideals}
                    onChange={(e) => updateField("ideals", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bonds">Vínculos</Label>
                  <Textarea
                    id="bonds"
                    name="bonds"
                    rows={3}
                    value={formDataValues.bonds}
                    onChange={(e) => updateField("bonds", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="flaws">Defectos</Label>
                  <Textarea
                    id="flaws"
                    name="flaws"
                    rows={3}
                    value={formDataValues.flaws}
                    onChange={(e) => updateField("flaws", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aspecto Físico</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <Field
                  name="height"
                  label="Altura"
                  value={formDataValues.height}
                  onChange={(e) => updateField("height", e.target.value)}
                />
                <Field
                  name="weight"
                  label="Peso"
                  value={formDataValues.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                />
                <Field
                  name="eyes"
                  label="Ojos"
                  value={formDataValues.eyes}
                  onChange={(e) => updateField("eyes", e.target.value)}
                />
                <Field
                  name="skin"
                  label="Piel"
                  value={formDataValues.skin}
                  onChange={(e) => updateField("skin", e.target.value)}
                />
                <Field
                  name="hair"
                  label="Pelo"
                  value={formDataValues.hair}
                  onChange={(e) => updateField("hair", e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historia y Rasgos Especiales</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="featuresAndTraits">Rasgos y Cualidades</Label>
                  <Textarea
                    id="featuresAndTraits"
                    name="featuresAndTraits"
                    rows={4}
                    placeholder="Rasgos raciales, de clase y dotes..."
                    value={formDataValues.featuresAndTraits}
                    onChange={(e) =>
                      updateField("featuresAndTraits", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="backstory">
                    Historia del personaje (Backstory)
                  </Label>
                  <Textarea
                    id="backstory"
                    name="backstory"
                    rows={4}
                    value={formDataValues.backstory}
                    onChange={(e) => updateField("backstory", e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="alliesAndOrganizations">
                      Aliados y Organizaciones
                    </Label>
                    <Textarea
                      id="alliesAndOrganizations"
                      name="alliesAndOrganizations"
                      rows={3}
                      value={formDataValues.alliesAndOrganizations}
                      onChange={(e) =>
                        updateField("alliesAndOrganizations", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="treasure">Tesoro</Label>
                    <Textarea
                      id="treasure"
                      name="treasure"
                      rows={3}
                      value={formDataValues.treasure}
                      onChange={(e) => updateField("treasure", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ------------------------------------------------------------------ */}
          {/* TAB 4: ATAQUES Y EQUIPO                                            */}
          {/* ------------------------------------------------------------------ */}
          <TabsContent value="equipment" className="mt-4 flex flex-col gap-6" keepMounted>
            <Card>
              <CardHeader>
                <CardTitle>Monedas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <Field
                  name="gold"
                  label="Oro (PO)"
                  type="number"
                  min={0}
                  value={formDataValues.gold}
                  onChange={(e) => updateField("gold", e.target.value)}
                />
                <Field
                  name="silver"
                  label="Plata (PP)"
                  type="number"
                  min={0}
                  value={formDataValues.silver}
                  onChange={(e) => updateField("silver", e.target.value)}
                />
                <Field
                  name="copper"
                  label="Cobre (PC)"
                  type="number"
                  min={0}
                  value={formDataValues.copper}
                  onChange={(e) => updateField("copper", e.target.value)}
                />
                <Field
                  name="platinum"
                  label="Platino (PPT)"
                  type="number"
                  min={0}
                  value={formDataValues.platinum}
                  onChange={(e) => updateField("platinum", e.target.value)}
                />
                <Field
                  name="electrum"
                  label="Electro (PE)"
                  type="number"
                  min={0}
                  value={formDataValues.electrum}
                  onChange={(e) => updateField("electrum", e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SwordsIcon className="size-4 text-primary" /> Ataques (
                  {attacks.length})
                </CardTitle>
                <CardDescription>
                  Ataques con armas o conjuros de ataque.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {attacks.length > 0 ? (
                  <div className="divide-y rounded-md border">
                    {attacks.map((atk, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{atk.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Bono: {atk.bonus || "+0"} · Daño:{" "}
                            {atk.damage || "-"}
                          </span>
                        </div>
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => removeAttack(index)}
                        >
                          <Trash2Icon className="size-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay ataques añadidos aún.
                  </p>
                )}

                <div className="grid gap-2 rounded-lg border border-dashed p-3 sm:grid-cols-[1fr_5rem_1fr_auto]">
                  <Input
                    placeholder="Nombre (ej. Espada larga)"
                    value={newAttack.name}
                    onChange={(e) =>
                      setNewAttack({ ...newAttack, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Bono (+5)"
                    value={newAttack.bonus}
                    onChange={(e) =>
                      setNewAttack({ ...newAttack, bonus: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Daño (1d8+3 cortante)"
                    value={newAttack.damage}
                    onChange={(e) =>
                      setNewAttack({ ...newAttack, damage: e.target.value })
                    }
                  />
                  <Button type="button" size="sm" onClick={addAttack}>
                    <PlusIcon className="size-4" /> Añadir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageIcon className="size-4 text-primary" /> Inventario (
                  {items.length})
                </CardTitle>
                <CardDescription>
                  Objetos, equipo y pertenencias.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {items.length > 0 ? (
                  <div className="divide-y rounded-md border">
                    {items.map((it, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {it.name}{" "}
                            <span className="text-xs text-muted-foreground">
                              (x{it.quantity})
                            </span>
                          </span>
                          {it.description ? (
                            <span className="text-xs text-muted-foreground">
                              {it.description}
                            </span>
                          ) : null}
                        </div>
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2Icon className="size-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay objetos añadidos aún.
                  </p>
                )}

                <div className="grid gap-2 rounded-lg border border-dashed p-3 sm:grid-cols-[1fr_4rem_1fr_auto]">
                  <Input
                    placeholder="Nombre del objeto"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    min={1}
                    placeholder="Cant."
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Descripción u observaciones"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                  />
                  <Button type="button" size="sm" onClick={addItem}>
                    <PlusIcon className="size-4" /> Añadir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ------------------------------------------------------------------ */}
          {/* TAB 5: CONJUROS                                                    */}
          {/* ------------------------------------------------------------------ */}
          <TabsContent value="spells" className="mt-4 flex flex-col gap-6" keepMounted>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SparklesIcon className="size-4 text-primary" /> Aptitud
                  Mágica
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field
                  name="spellcastingClass"
                  label="Clase de lanzador"
                  placeholder="ej. Mago, Clérigo"
                  value={formDataValues.spellcastingClass}
                  onChange={(e) =>
                    updateField("spellcastingClass", e.target.value)
                  }
                />
                <div className="flex flex-col gap-2">
                  <Label htmlFor="spellcastingAbility">
                    Característica clave
                  </Label>
                  <select
                    id="spellcastingAbility"
                    name="spellcastingAbility"
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    value={formDataValues.spellcastingAbility}
                    onChange={(e) =>
                      updateField("spellcastingAbility", e.target.value)
                    }
                  >
                    <option value="">Ninguna / No lanzador</option>
                    {ABILITIES.map((ab) => (
                      <option key={ab} value={ab}>
                        {ab}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Conjuros ({spells.length})
                </CardTitle>
                <CardDescription>
                  Trucos y conjuros de nivel 1 al 9.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {spells.length > 0 ? (
                  <div className="divide-y rounded-md border">
                    {spells.map((sp, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {sp.name}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                              ({sp.level === 0 ? "Truco" : `Nivel ${sp.level}`})
                            </span>
                          </span>
                          {sp.description ? (
                            <span className="text-xs text-muted-foreground">
                              {sp.description}
                            </span>
                          ) : null}
                        </div>
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => removeSpell(index)}
                        >
                          <Trash2Icon className="size-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay conjuros añadidos aún.
                  </p>
                )}

                <div className="grid gap-2 rounded-lg border border-dashed p-3 sm:grid-cols-[1fr_4.5rem_1fr_auto]">
                  <Input
                    placeholder="Nombre del conjuro"
                    value={newSpell.name}
                    onChange={(e) =>
                      setNewSpell({ ...newSpell, name: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    min={0}
                    max={9}
                    placeholder="Nivel"
                    value={newSpell.level}
                    onChange={(e) =>
                      setNewSpell({ ...newSpell, level: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Descripción breve"
                    value={newSpell.description}
                    onChange={(e) =>
                      setNewSpell({ ...newSpell, description: e.target.value })
                    }
                  />
                  <Button type="button" size="sm" onClick={addSpell}>
                    <PlusIcon className="size-4" /> Añadir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {state?.error ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={pending || isParsing}>
            {pending ? "Guardando…" : "Guardar personaje"}
          </Button>
        </div>
      </div>
    </form>
  );
}
