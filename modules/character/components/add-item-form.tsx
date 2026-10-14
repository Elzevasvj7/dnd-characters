"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addItemAction } from "../actions";
import { Field } from "./field";
import { FormError } from "./section-card";
import { useFormAction } from "./use-form-action";

export function AddItemForm({ characterId }: { characterId: string }) {
  const [formKey, setFormKey] = useState(0);
  const { state, pending, submit } = useFormAction(addItemAction, () =>
    setFormKey((key) => key + 1),
  );

  return (
    <form key={formKey} action={submit} className="flex flex-col gap-3">
      <input type="hidden" name="characterId" value={characterId} />

      <div className="grid gap-3 sm:grid-cols-[2fr_auto_auto]">
        <Field name="name" label="Objeto" required maxLength={120} />
        <Field
          name="quantity"
          label="Cantidad"
          type="number"
          min={1}
          defaultValue={1}
          className="w-24"
        />
        <Field
          name="weight"
          label="Peso"
          type="number"
          min={0}
          step="0.1"
          className="w-24"
        />
      </div>

      <FormError state={state} />

      <div className="flex justify-end">
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          {pending ? "Añadiendo…" : "Añadir objeto"}
        </Button>
      </div>
    </form>
  );
}
