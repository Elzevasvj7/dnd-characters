"use client";

import { useState } from "react";
import { ScrollTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updateIdentityAction } from "../actions";
import { Field } from "./field";
import { FormError, ReadRow, SectionCard } from "./section-card";
import { useFormAction } from "./use-form-action";

type Identity = {
  id: string;
  name: string;
  age: number | null;
  race: string | null;
  class: string | null;
  level: number;
  background: string | null;
  alignment: string | null;
  playerName: string | null;
  experiencePoints: number | null;
  inspiration: boolean;
  campaign: string | null;
};

export function IdentitySection({ character }: { character: Identity }) {
  const [editing, setEditing] = useState(false);
  const { state, pending, submit } = useFormAction(updateIdentityAction, () =>
    setEditing(false),
  );
  console.log("IdentitySection", character.campaign);
  return (
    <SectionCard
      title="Identidad"
      icon={ScrollTextIcon}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
    >
      {editing ? (
        <form action={submit} className="flex flex-col gap-4">
          <input type="hidden" name="characterId" value={character.id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="name"
              label="Nombre"
              required
              maxLength={80}
              defaultValue={character.name}
            />
            <Field
              name="playerName"
              label="Nombre del jugador"
              maxLength={80}
              defaultValue={character.playerName ?? ""}
            />
            <Field
              name="race"
              label="Raza"
              maxLength={60}
              defaultValue={character.race ?? ""}
            />
            <Field
              name="class"
              label="Clase"
              maxLength={60}
              defaultValue={character.class ?? ""}
            />
            <Field
              name="level"
              label="Nivel"
              type="number"
              min={1}
              max={20}
              defaultValue={character.level}
            />
            <Field
              name="experiencePoints"
              label="Puntos de experiencia"
              type="number"
              min={0}
              defaultValue={character.experiencePoints ?? ""}
            />
            <Field
              name="alignment"
              label="Alineamiento"
              maxLength={40}
              defaultValue={character.alignment ?? ""}
            />
            <Field
              name="age"
              label="Edad"
              type="number"
              min={0}
              defaultValue={character.age ?? ""}
            />
            <div className="sm:col-span-2">
              <Field
                name="background"
                label="Trasfondo"
                maxLength={120}
                defaultValue={character.background ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="campaign">Campaña</Label>
              <select
                id="campaign"
                name="campaign"
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                defaultValue={character.campaign ?? ""}
              >
                <option value="">Ninguna</option>
                <option value="iron-and-ether">Iron and Ether</option>
              </select>
            </div>
          </div>

          <Label className="flex items-center gap-2 font-normal">
            <Checkbox
              name="inspiration"
              defaultChecked={character.inspiration}
            />
            Inspiración
          </Label>

          <FormError state={state} />

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-2">
          <ReadRow label="Nombre" value={character.name} />
          <ReadRow label="Jugador" value={character.playerName} />
          <ReadRow label="Raza" value={character.race} />
          <ReadRow label="Clase" value={character.class} />
          <ReadRow label="Nivel" value={character.level} />
          <ReadRow label="Experiencia" value={character.experiencePoints} />
          <ReadRow label="Alineamiento" value={character.alignment} />
          <ReadRow label="Edad" value={character.age} />
          <ReadRow label="Trasfondo" value={character.background} />
          <ReadRow
            label="Inspiración"
            value={character.inspiration ? "Sí" : "No"}
          />
          <ReadRow label="Campaña" value={character.campaign} />
        </div>
      )}
    </SectionCard>
  );
}
