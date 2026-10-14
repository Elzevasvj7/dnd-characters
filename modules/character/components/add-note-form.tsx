"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addNoteAction } from "../actions";
import { FormError } from "./section-card";
import { useFormAction } from "./use-form-action";

export function AddNoteForm({ characterId }: { characterId: string }) {
  // Remontar por `key` en vez de `form.reset()`: mismo patrón que el resto de
  // formularios del módulo, y no hace falta arrastrar un ref.
  const [formKey, setFormKey] = useState(0);
  const { state, pending, submit } = useFormAction(addNoteAction, () =>
    setFormKey((key) => key + 1),
  );

  return (
    <form key={formKey} action={submit} className="flex flex-col gap-3">
      <input type="hidden" name="characterId" value={characterId} />
      <Textarea
        name="body"
        rows={3}
        required
        maxLength={5000}
        placeholder="Qué pasó en la sesión, pistas, deudas, nombres…"
      />

      <FormError state={state} />

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Guardando…" : "Añadir nota"}
        </Button>
      </div>
    </form>
  );
}
