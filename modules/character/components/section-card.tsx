"use client";

import { PencilIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FormState } from "../types";

export function SectionCard({
  title,
  icon: Icon,
  editing,
  onToggleEdit,
  children,
}: {
  title: string;
  /** El componente, no el elemento: la tarjeta decide el tamaño y el color. */
  icon?: React.ComponentType<{ className?: string }>;
  editing: boolean;
  onToggleEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {Icon ? <Icon className="size-4 text-primary" /> : null}
          {title}
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="xs" onClick={onToggleEdit}>
            {editing ? (
              <>
                <XIcon /> Cancelar
              </>
            ) : (
              <>
                <PencilIcon /> Editar
              </>
            )}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/** Fila etiqueta/valor de las vistas de lectura. */
export function ReadRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">
        {value === null || value === undefined || value === "" ? (
          <span className="font-normal text-muted-foreground">—</span>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

export function FormError({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <p className="text-sm text-destructive" role="alert">
      {state.error}
    </p>
  );
}
