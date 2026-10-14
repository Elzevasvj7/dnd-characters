"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addSpellAction } from "../actions";
import {
  SPELL_LEVELS,
  SPELL_SCHOOLS,
  SPELL_SCHOOL_LABELS,
  spellLevelLabel,
} from "../schemas";
import { Field } from "./field";
import { FormError } from "./section-card";
import { useFormAction } from "./use-form-action";

const LEVEL_ITEMS = SPELL_LEVELS.map((level) => ({
  label: spellLevelLabel(level),
  value: String(level),
}));

const SCHOOL_ITEMS = SPELL_SCHOOLS.map((school) => ({
  label: SPELL_SCHOOL_LABELS[school],
  value: school,
}));

export function AddSpellForm({ characterId }: { characterId: string }) {
  // El Select y el Checkbox de Base UI no son controles nativos, así que
  // `form.reset()` no los limpia. Remontar el formulario cambiando su `key` sí,
  // y de paso limpia los inputs normales sin tener que llevar un ref.
  const [formKey, setFormKey] = useState(0);
  const { state, pending, submit } = useFormAction(addSpellAction, () =>
    setFormKey((key) => key + 1),
  );

  return (
    <form key={formKey} action={submit} className="flex flex-col gap-4">
      <input type="hidden" name="characterId" value={characterId} />

      <Field name="name" label="Nombre" required maxLength={120} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="level">Nivel</Label>
          <Select name="level" defaultValue="0" items={LEVEL_ITEMS}>
            <SelectTrigger id="level" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVEL_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="school">Escuela</Label>
          <Select name="school" items={SCHOOL_ITEMS}>
            <SelectTrigger id="school" className="w-full">
              <SelectValue placeholder="Sin especificar" />
            </SelectTrigger>
            <SelectContent>
              {SCHOOL_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          name="castingTime"
          label="Tiempo de lanzamiento"
          maxLength={60}
          placeholder="1 acción"
        />
        <Field name="range" label="Alcance" maxLength={60} placeholder="18 m" />
        <Field
          name="duration"
          label="Duración"
          maxLength={60}
          placeholder="Instantáneo"
        />
        <Field
          name="components"
          label="Componentes"
          maxLength={60}
          placeholder="V, S, M"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <Label className="flex items-center gap-2 font-normal">
          <Checkbox name="concentration" />
          Concentración
        </Label>
        <Label className="flex items-center gap-2 font-normal">
          <Checkbox name="ritual" />
          Ritual
        </Label>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          maxLength={2000}
          placeholder="Efecto, daño, tirada de salvación…"
        />
      </div>

      <FormError state={state} />

      <div className="flex justify-end">
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          {pending ? "Añadiendo…" : "Añadir conjuro"}
        </Button>
      </div>
    </form>
  );
}
