"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "../types";
import { FormError, SectionCard } from "./section-card";
import { useFormAction } from "./use-form-action";

export type SectionField = {
  name: string;
  label: string;
  value: string | number | null;
  kind?: "text" | "number" | "textarea";
  rows?: number;
  /** Ocupa toda la fila en la rejilla de edición. */
  wide?: boolean;
};

/**
 * Sección editable genérica para bloques que solo son campos de texto o número.
 *
 * Personalidad, aspecto, trasfondo y monedas son cuatro tarjetas idénticas
 * salvo por la lista de campos, así que van todas por aquí. Las que tienen
 * controles propios (competencias, lanzamiento de conjuros) sí son componentes
 * aparte, porque su interfaz no se parece a un formulario de texto.
 */
export function TextSection({
  title,
  icon,
  characterId,
  action,
  fields,
  columns = 2,
  emptyLabel = "Sin rellenar.",
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  characterId: string;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  fields: SectionField[];
  columns?: 2 | 3 | 5;
  emptyLabel?: string;
}) {
  const [editing, setEditing] = useState(false);
  const { state, pending, submit } = useFormAction(action, () =>
    setEditing(false),
  );

  const gridClass =
    columns === 5
      ? "grid grid-cols-2 gap-3 sm:grid-cols-5"
      : columns === 3
        ? "grid grid-cols-2 gap-3 sm:grid-cols-3"
        : "grid gap-4 sm:grid-cols-2";

  const filled = fields.filter(
    (field) => field.value !== null && field.value !== "",
  );

  return (
    <SectionCard
      title={title}
      icon={icon}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
    >
      {editing ? (
        <form action={submit} className="flex flex-col gap-4">
          <input type="hidden" name="characterId" value={characterId} />

          <div className={gridClass}>
            {fields.map((field) => (
              <div
                key={field.name}
                className={`flex flex-col gap-2 ${
                  field.wide || field.kind === "textarea"
                    ? "sm:col-span-full"
                    : ""
                }`}
              >
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.kind === "textarea" ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={field.rows ?? 3}
                    defaultValue={field.value ?? ""}
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.kind === "number" ? "number" : "text"}
                    min={field.kind === "number" ? 0 : undefined}
                    defaultValue={field.value ?? ""}
                  />
                )}
              </div>
            ))}
          </div>

          <FormError state={state} />

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </form>
      ) : filled.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : columns === 5 ? (
        <div className="grid grid-cols-5 gap-2 text-center">
          {fields.map((field) => (
            <div key={field.name} className="rounded-lg border py-2">
              <div className="text-[0.7rem] text-muted-foreground">
                {field.label}
              </div>
              <div className="font-semibold">{field.value ?? 0}</div>
            </div>
          ))}
        </div>
      ) : (
        <dl className="flex flex-col gap-3">
          {filled.map((field) => (
            <div key={field.name} className="flex flex-col gap-0.5">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                {field.label}
              </dt>
              <dd className="text-sm whitespace-pre-wrap">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </SectionCard>
  );
}
