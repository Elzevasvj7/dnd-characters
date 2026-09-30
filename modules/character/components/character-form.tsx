"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createCharacterAction } from "../actions";
import {
  AbilityScoresBuilder,
  INITIAL_ABILITY_ROWS,
  abilityRowsToScores,
} from "./ability-scores-builder";
import { Field } from "./field";
import { PortraitPicker } from "./portrait-picker";
import { ProficiencyFields } from "./proficiency-fields";
import { SheetUploader } from "./sheet-uploader";

const NO_PROFICIENCIES = {
  proficiencyBonusOverride: null,
  saveProficiencies: [],
  skillProficiencies: [],
  skillExpertise: [],
};

export function CharacterForm() {
  const [state, action, pending] = useActionState(createCharacterAction, null);
  // El nivel y las características se vigilan porque de ellos salen los bonos
  // de salvaciones y habilidades que se ven más abajo mientras rellenas.
  const [level, setLevel] = useState(1);
  const [abilityRows, setAbilityRows] = useState(INITIAL_ABILITY_ROWS);

  return (
    // Dos columnas en pantallas anchas: la hoja a la izquierda, fija mientras
    // rellenas, y los campos a la derecha, para poder copiar mirando la foto.
    <form
      action={action}
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
        <SheetUploader />
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identidad</CardTitle>
            <CardDescription>
              Lo que tengas en la cabecera de la hoja.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <PortraitPicker className="mx-auto w-32 sm:mx-0" />

            <div className="grid content-start gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field name="name" label="Nombre" required maxLength={80} />
              </div>
              <Field name="race" label="Raza" maxLength={60} />
              <Field name="class" label="Clase" maxLength={60} />
              <Field
                name="level"
                label="Nivel"
                type="number"
                min={1}
                max={20}
                defaultValue={1}
                onChange={(event) => {
                  const value = Number.parseInt(event.target.value, 10);
                  if (value >= 1 && value <= 20) setLevel(value);
                }}
              />
              <Field name="age" label="Edad" type="number" min={0} />
              <Field name="background" label="Trasfondo" maxLength={120} />
              <Field name="alignment" label="Alineamiento" maxLength={40} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
            <CardDescription>
              Lo que se guarda es el total: base más los bonos de raza o clase
              (por ejemplo, +1 a todas si eres humano).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AbilityScoresBuilder rows={abilityRows} onChange={setAbilityRows} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competencias</CardTitle>
            <CardDescription>
              Salvaciones y habilidades de tu clase y tu trasfondo. Los bonos se
              calculan con las características de arriba.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProficiencyFields
              scores={abilityRowsToScores(abilityRows)}
              level={level}
              defaults={NO_PROFICIENCIES}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Combate</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field name="maxHp" label="PG máximos" type="number" min={0} />
            <Field name="currentHp" label="PG actuales" type="number" />
            <Field name="armorClass" label="CA" type="number" min={0} />
            <Field name="speed" label="Velocidad" type="number" min={0} />
          </CardContent>
        </Card>

        {state?.error ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar personaje"}
          </Button>
        </div>
      </div>
    </form>
  );
}
