"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "../schemas";

/**
 * Input de retrato con vista previa, para usar dentro de un `<form>`.
 *
 * El fichero sigue viajando en el propio input (`name`), igual que un
 * `<input type="file">` normal: la vista previa es solo una object URL local.
 * La validación de aquí es para avisar pronto; la de verdad está en la action
 * y en el bucket.
 */
export function PortraitPicker({
  name = "image",
  className,
}: {
  name?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cada vista previa nueva libera la anterior, y la última se libera al salir.
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  // React vacía los inputs no controlados del formulario cuando termina la
  // action. Sin esto la vista previa seguiría enseñando una imagen que ya no
  // está en el input y que, por tanto, no se enviaría.
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const clear = () => setPreview(null);
    form.addEventListener("reset", clear);
    return () => form.removeEventListener("reset", clear);
  }, []);

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
  }

  function onFileChange(file: File | undefined) {
    setError(null);
    if (!file) return setPreview(null);

    if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      clear();
      return setError("Formato no admitido: usa JPG, PNG o WebP");
    }
    if (file.size > MAX_IMAGE_BYTES) {
      clear();
      return setError("La imagen supera los 4 MB");
    }
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={preview ? "Cambiar retrato" : "Elegir retrato"}
        className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl border bg-muted transition-colors outline-none hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {preview ? (
          // Object URL local: `next/image` no aporta nada aquí.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full flex-col items-center justify-center gap-1 p-2 text-center text-xs text-muted-foreground">
            <ImageIcon className="size-7" />
            Retrato
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => onFileChange(event.target.files?.[0])}
      />

      {preview ? (
        <Button type="button" variant="ghost" size="xs" onClick={clear}>
          Quitar
        </Button>
      ) : (
        <p className="text-center text-[0.7rem] text-muted-foreground">
          JPG, PNG o WebP · 4 MB
        </p>
      )}

      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
