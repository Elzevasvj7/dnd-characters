"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeImageAction, updateImageAction } from "../actions";
import { ACCEPTED_IMAGE_TYPES } from "../schemas";
import { FormError } from "./section-card";
import { useFormAction } from "./use-form-action";

export function CharacterPortrait({
  characterId,
  name,
  imageUrl,
}: {
  characterId: string;
  name: string;
  imageUrl: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const { state, pending, submit } = useFormAction(updateImageAction, () =>
    setEditing(false),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="300px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl text-muted-foreground">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {editing ? (
        <form action={submit} className="flex flex-col gap-3">
          <input type="hidden" name="characterId" value={characterId} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="image" className="text-xs">
              JPG, PNG o WebP, hasta 4 MB
            </Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              required
              className="cursor-pointer"
            />
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
              {pending ? "Subiendo…" : "Guardar"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            {imageUrl ? "Cambiar retrato" : "Añadir retrato"}
          </Button>

          {imageUrl ? (
            <form action={removeImageAction}>
              <input type="hidden" name="characterId" value={characterId} />
              <Button type="submit" variant="ghost" size="sm">
                Quitar
              </Button>
            </form>
          ) : null}
        </div>
      )}
    </div>
  );
}
