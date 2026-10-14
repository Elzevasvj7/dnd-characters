"use client";

import { useState } from "react";
import { FlameIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { adjustSpellSlotAction, setSpellSlotAction } from "../actions";
import { FormError } from "./section-card";
import { useFormAction } from "./use-form-action";

type Slot = {
  id: string;
  level: number;
  total: number;
  expended: number;
};

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function SpellSlotsSection({
  characterId,
  slots,
}: {
  characterId: string;
  slots: Slot[];
}) {
  const [editing, setEditing] = useState(false);
  const { state, pending, submit } = useFormAction(setSpellSlotAction, () =>
    setEditing(false),
  );

  const byLevel = new Map(slots.map((slot) => [slot.level, slot]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FlameIcon className="size-4 text-primary" />
          Espacios de conjuro
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sin espacios configurados.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {slots.map((slot) => {
              const available = slot.total - slot.expended;
              return (
                <li key={slot.id} className="flex items-center gap-3">
                  <span className="w-16 text-sm text-muted-foreground">
                    Nivel {slot.level}
                  </span>

                  {/* Un círculo por espacio, como en la hoja de papel. */}
                  <span className="flex flex-1 flex-wrap gap-1">
                    {Array.from({ length: slot.total }, (_, index) => (
                      <span
                        key={index}
                        className={`size-3.5 rounded-full border ${
                          index < available
                            ? "border-primary bg-primary"
                            : "border-input"
                        }`}
                        aria-hidden
                      />
                    ))}
                  </span>

                  <span className="text-xs tabular-nums text-muted-foreground">
                    {available}/{slot.total}
                  </span>

                  <span className="flex items-center gap-1">
                    <form action={adjustSpellSlotAction}>
                      <input type="hidden" name="id" value={slot.id} />
                      <input
                        type="hidden"
                        name="characterId"
                        value={characterId}
                      />
                      <input type="hidden" name="delta" value="1" />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="xs"
                        disabled={available === 0}
                      >
                        Gastar
                      </Button>
                    </form>
                    <form action={adjustSpellSlotAction}>
                      <input type="hidden" name="id" value={slot.id} />
                      <input
                        type="hidden"
                        name="characterId"
                        value={characterId}
                      />
                      <input type="hidden" name="delta" value="-1" />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="xs"
                        disabled={slot.expended === 0}
                      >
                        Recuperar
                      </Button>
                    </form>
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <Separator />

        {editing ? (
          <form action={submit} className="flex flex-col gap-3">
            <input type="hidden" name="characterId" value={characterId} />
            <p className="text-xs text-muted-foreground">
              Total a 0 elimina el nivel: un nivel sin espacios no es
              &ldquo;cero espacios&rdquo;, es que todavía no lo tienes.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="slot-level">Nivel</Label>
                <select
                  id="slot-level"
                  name="level"
                  defaultValue="1"
                  className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      Nivel {level}
                      {byLevel.has(level) ? " ·" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="slot-total">Total</Label>
                <Input
                  id="slot-total"
                  name="total"
                  type="number"
                  min={0}
                  max={20}
                  defaultValue={0}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="slot-expended">Gastados</Label>
                <Input
                  id="slot-expended"
                  name="expended"
                  type="number"
                  min={0}
                  max={20}
                  defaultValue={0}
                />
              </div>
            </div>

            <FormError state={state} />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditing(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? "Guardando…" : "Guardar nivel"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
            >
              Configurar espacios
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
