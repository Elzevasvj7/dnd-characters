"use client";

import { useState } from "react";
import { SwordsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { addAttackAction, deleteAttackAction } from "../actions";
import { Field } from "./field";
import { FormError } from "./section-card";
import { useFormAction } from "./use-form-action";

type Attack = {
  id: string;
  name: string;
  bonus: string | null;
  damage: string | null;
};

export function AttacksSection({
  characterId,
  attacks,
}: {
  characterId: string;
  attacks: Attack[];
}) {
  const [formKey, setFormKey] = useState(0);
  const { state, pending, submit } = useFormAction(addAttackAction, () =>
    setFormKey((key) => key + 1),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <SwordsIcon className="size-4 text-primary" />
          Ataques{" "}
          <span className="text-muted-foreground">({attacks.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {attacks.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th className="pb-1 font-medium">Nombre</th>
                <th className="pb-1 font-medium">Bonif.</th>
                <th className="pb-1 font-medium">Daño / tipo</th>
                <th className="sr-only">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {attacks.map((attack) => (
                <tr key={attack.id}>
                  <td className="py-2 font-medium">{attack.name}</td>
                  <td className="py-2 tabular-nums">{attack.bonus ?? "—"}</td>
                  <td className="py-2 text-muted-foreground">
                    {attack.damage ?? "—"}
                  </td>
                  <td className="py-2 text-right">
                    <form action={deleteAttackAction}>
                      <input type="hidden" name="id" value={attack.id} />
                      <input
                        type="hidden"
                        name="characterId"
                        value={characterId}
                      />
                      <Button type="submit" variant="ghost" size="xs">
                        Quitar
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin ataques apuntados.
          </p>
        )}

        <Separator />

        <form key={formKey} action={submit} className="flex flex-col gap-3">
          <input type="hidden" name="characterId" value={characterId} />
          <div className="grid gap-3 sm:grid-cols-[2fr_auto_2fr]">
            <Field name="name" label="Nombre" required maxLength={120} />
            <Field
              name="bonus"
              label="Bonificador"
              maxLength={30}
              placeholder="+5"
              className="w-24"
            />
            <Field
              name="damage"
              label="Daño / tipo"
              maxLength={60}
              placeholder="1d8+3 cortante"
            />
          </div>

          <FormError state={state} />

          <div className="flex justify-end">
            <Button type="submit" size="sm" variant="outline" disabled={pending}>
              {pending ? "Añadiendo…" : "Añadir ataque"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
