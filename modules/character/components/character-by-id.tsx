"use client";
import {
  BackpackIcon,
  BookOpenIcon,
  CoinsIcon,
  FeatherIcon,
  NotebookPenIcon,
  ScrollTextIcon,
  SparklesIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteCharacterAction,
  deleteItemAction,
  deleteNoteAction,
  toggleItemEquippedAction,
  updateAppearanceAction,
  updateCurrencyAction,
  updateLoreAction,
  updatePersonalityAction,
} from "@/modules/character/actions";
import { AbilitiesSection } from "@/modules/character/components/abilities-section";
import { AddItemForm } from "@/modules/character/components/add-item-form";
import { AddNoteForm } from "@/modules/character/components/add-note-form";
import { AddSpellForm } from "@/modules/character/components/add-spell-form";
import { AttacksSection } from "@/modules/character/components/attacks-section";
import { CharacterPortrait } from "@/modules/character/components/character-portrait";
import { CombatSection } from "@/modules/character/components/combat-section";
import { IdentitySection } from "@/modules/character/components/identity-section";
import { ProficienciesSection } from "@/modules/character/components/proficiencies-section";
import { SpellcastingSection } from "@/modules/character/components/spellcasting-section";
import { SpellList } from "@/modules/character/components/spell-list";
import { SpellSlotsSection } from "@/modules/character/components/spell-slots-section";
import { TextSection } from "@/modules/character/components/text-section";
import { CURRENCIES } from "@/modules/character/rules";
import DownloadButton from "./download-button";

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function CharacterById({
  id,
  character,
}: {
  id: string;
  character: any;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              {character.name}
            </h1>
            {character.inspiration ? <Badge>Inspiración</Badge> : null}
          </div>
          <p className="text-muted-foreground">
            {[
              character.race,
              character.class,
              `Nivel ${character.level}`,
              character.alignment,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/character" />}
            nativeButton={false}
          >
            Volver
          </Button>
          <form action={deleteCharacterAction}>
            <input type="hidden" name="id" value={character.id} />
            <Button type="submit" variant="destructive" size="sm">
              <Trash2Icon /> Eliminar
            </Button>
          </form>
        </div>
      </div>

      {/* Las pestañas siguen las tres páginas de la hoja oficial, más las notas
           de sesión, que son cosa nuestra y no del papel. */}
      <Tabs defaultValue="sheet">
        <TabsList>
          <TabsTrigger value="sheet">
            <ScrollTextIcon /> Hoja
          </TabsTrigger>
          <TabsTrigger value="character">
            <UserRoundIcon /> Personaje
          </TabsTrigger>
          <TabsTrigger value="spells">
            <SparklesIcon /> Conjuros
          </TabsTrigger>
          <TabsTrigger value="notes">
            <NotebookPenIcon /> Notas{" "}
            {character.notes.length > 0 ? `(${character.notes.length})` : ""}
          </TabsTrigger>
        </TabsList>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="sheet">
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <div className="flex flex-col gap-6">
              <CharacterPortrait
                characterId={character.id}
                name={character.name}
                imageUrl={character.imageUrl}
              />

              <AbilitiesSection character={character} />
              <CombatSection character={character} />
              <TextSection
                title="Monedas"
                icon={CoinsIcon}
                characterId={character.id}
                action={updateCurrencyAction}
                columns={5}
                fields={CURRENCIES.map((currency) => ({
                  name: currency.field,
                  label: currency.short,
                  value: character[currency.field],
                  kind: "number" as const,
                }))}
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex justify-end items-center gap-2">
                <DownloadButton id={character.id} />
              </div>
              <IdentitySection character={character} />
              <ProficienciesSection character={character} />
              <AttacksSection
                characterId={character.id}
                attacks={character.attacks}
              />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BackpackIcon className="size-4 text-primary" />
                    Inventario{" "}
                    <span className="text-muted-foreground">
                      ({character.items.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {character.items.length > 0 ? (
                    <ul className="flex flex-col divide-y">
                      {character.items.map((item: any) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-3 py-2 text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={
                                item.equipped
                                  ? "font-medium"
                                  : "text-foreground"
                              }
                            >
                              {item.name}
                            </span>
                            {item.quantity > 1 ? (
                              <span className="text-muted-foreground">
                                ×{item.quantity}
                              </span>
                            ) : null}
                            {item.equipped ? (
                              <Badge variant="secondary">Equipado</Badge>
                            ) : null}
                          </span>

                          <span className="flex shrink-0 items-center gap-1">
                            <form action={toggleItemEquippedAction}>
                              <input type="hidden" name="id" value={item.id} />
                              <input
                                type="hidden"
                                name="characterId"
                                value={character.id}
                              />
                              <Button type="submit" variant="ghost" size="xs">
                                {item.equipped ? "Guardar" : "Equipar"}
                              </Button>
                            </form>
                            <form action={deleteItemAction}>
                              <input type="hidden" name="id" value={item.id} />
                              <input
                                type="hidden"
                                name="characterId"
                                value={character.id}
                              />
                              <Button type="submit" variant="ghost" size="xs">
                                Quitar
                              </Button>
                            </form>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      El inventario está vacío.
                    </p>
                  )}

                  <Separator />
                  <AddItemForm characterId={character.id} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="character">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-6">
              <TextSection
                title="Personalidad"
                icon={FeatherIcon}
                characterId={character.id}
                action={updatePersonalityAction}
                fields={[
                  {
                    name: "personalityTraits",
                    label: "Rasgos de personalidad",
                    value: character.personalityTraits,
                    kind: "textarea",
                  },
                  {
                    name: "ideals",
                    label: "Ideales",
                    value: character.ideals,
                    kind: "textarea",
                  },
                  {
                    name: "bonds",
                    label: "Vínculos",
                    value: character.bonds,
                    kind: "textarea",
                  },
                  {
                    name: "flaws",
                    label: "Defectos",
                    value: character.flaws,
                    kind: "textarea",
                  },
                ]}
              />

              <TextSection
                title="Aspecto"
                icon={UserRoundIcon}
                characterId={character.id}
                action={updateAppearanceAction}
                fields={[
                  { name: "height", label: "Altura", value: character.height },
                  { name: "weight", label: "Peso", value: character.weight },
                  { name: "eyes", label: "Ojos", value: character.eyes },
                  { name: "skin", label: "Piel", value: character.skin },
                  { name: "hair", label: "Pelo", value: character.hair },
                ]}
              />
            </div>

            <TextSection
              title="Trasfondo e historia"
              icon={BookOpenIcon}
              characterId={character.id}
              action={updateLoreAction}
              fields={[
                {
                  name: "featuresAndTraits",
                  label: "Rasgos y atributos",
                  value: character.featuresAndTraits,
                  kind: "textarea",
                  rows: 4,
                },
                {
                  name: "backstory",
                  label: "Historia del personaje",
                  value: character.backstory,
                  kind: "textarea",
                  rows: 6,
                },
                {
                  name: "organizationName",
                  label: "Organización",
                  value: character.organizationName,
                  wide: true,
                },
                {
                  name: "alliesAndOrganizations",
                  label: "Aliados y organizaciones",
                  value: character.alliesAndOrganizations,
                  kind: "textarea",
                  rows: 4,
                },
                {
                  name: "additionalFeatures",
                  label: "Rasgos y atributos adicionales",
                  value: character.additionalFeatures,
                  kind: "textarea",
                  rows: 4,
                },
                {
                  name: "treasure",
                  label: "Tesoro",
                  value: character.treasure,
                  kind: "textarea",
                  rows: 3,
                },
              ]}
            />
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="spells">
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <div className="flex flex-col gap-6">
              <SpellcastingSection character={character} />
              <SpellSlotsSection
                characterId={character.id}
                slots={character.spellSlots}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <SparklesIcon className="size-4 text-primary" />
                  Trucos y conjuros{" "}
                  <span className="text-muted-foreground">
                    ({character.spells.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <SpellList
                  characterId={character.id}
                  spells={character.spells}
                />
                <Separator />
                <AddSpellForm characterId={character.id} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <NotebookPenIcon className="size-4 text-primary" />
                Notas de sesión
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <AddNoteForm characterId={character.id} />
              <Separator />

              {character.notes.length > 0 ? (
                <ul className="flex flex-col gap-4">
                  {character.notes.map((note: any) => (
                    <li key={note.id} className="flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm whitespace-pre-wrap">
                          {note.body}
                        </p>
                        <form action={deleteNoteAction}>
                          <input type="hidden" name="id" value={note.id} />
                          <input
                            type="hidden"
                            name="characterId"
                            value={character.id}
                          />
                          <Button type="submit" variant="ghost" size="xs">
                            Borrar
                          </Button>
                        </form>
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {dateFormatter.format(note.createdAt)}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sin notas todavía.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
