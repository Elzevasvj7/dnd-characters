"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Par etiqueta + input. El `id` sale del `name`, así que el `htmlFor` siempre
 * apunta al campo correcto sin tener que acordarse de pasarlo.
 */
export function Field({
  name,
  label,
  type = "text",
  ...props
}: {
  name: string;
  label: string;
  type?: string;
} & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} {...props} />
    </div>
  );
}
