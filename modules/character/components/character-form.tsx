"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ABILITIES, ABILITY_FIELD, ABILITY_LABELS } from "../rules";
import { ACCEPTED_IMAGE_TYPES } from "../schemas";
import { createCharacterAction } from "../actions";
import { Field } from "./field";

export function CharacterForm() {
  const [state, action, pending] = useActionState(createCharacterAction, null);

  return (
    <form action={action} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Identidad</CardTitle>
          <CardDescription>
            Lo que tengas en la cabecera de la hoja.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Nombre" required maxLength={80} />
          <Field name="age" label="Edad" type="number" min={0} />
          <Field name="race" label="Raza" maxLength={60} />
          <Field name="class" label="Clase" maxLength={60} />
          <Field
            name="level"
            label="Nivel"
            type="number"
            min={1}
            max={20}
            defaultValue={1}
          />
          <Field name="alignment" label="Alineamiento" maxLength={40} />
          <div className="sm:col-span-2">
            <Field name="background" label="Trasfondo" maxLength={120} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {ABILITIES.map((ability) => (
            <Field
              key={ability}
              name={ABILITY_FIELD[ability]}
              label={ABILITY_LABELS[ability]}
              type="number"
              min={1}
              max={30}
              defaultValue={10}
            />
          ))}
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

      <Card>
        <CardHeader>
          <CardTitle>Retrato</CardTitle>
          <CardDescription>
            JPG, PNG o WebP, hasta 4 MB. Opcional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            id="image"
            name="image"
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="cursor-pointer"
          />
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
    </form>
  );
}
