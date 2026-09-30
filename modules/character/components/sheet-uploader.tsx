"use client";

import { useEffect, useRef, useState } from "react";
import { FileTextIcon, ScanTextIcon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ACCEPTED_SHEET_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

/** Una foto de móvil ronda los 3-6 MB; un PDF escaneado de tres páginas, más. */
const MAX_SHEET_BYTES = 15 * 1024 * 1024;

type SheetPage = {
  id: string;
  file: File;
  /** Object URL para previsualizar sin subir nada. Hay que liberarla al quitar. */
  url: string;
};

/**
 * Primer bloque del alta: subir la hoja de papel (fotos o PDF) para que el OCR
 * rellene los campos del formulario. Rellenar a mano sigue siendo posible, y
 * lo que saque el OCR se podrá corregir antes de guardar.
 *
 * De momento solo es la UI: nada sale del navegador (las vistas previas son
 * object URLs locales) y el botón de rellenar está desactivado. La hoja
 * oficial tiene tres páginas (datos, trasfondo, conjuros), por eso se admiten
 * varias.
 *
 * Vive dentro del `<form>` del alta, así que el input de fichero no lleva
 * `name`: estas imágenes no deben viajar con el envío del personaje.
 */
export function SheetUploader() {
  const [pages, setPages] = useState<SheetPage[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Liberar las object URLs al salir de la página. Se lee de un ref porque el
  // cleanup solo corre al desmontar y vería la lista del primer render.
  const pagesRef = useRef(pages);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);
  useEffect(
    () => () => {
      for (const page of pagesRef.current) URL.revokeObjectURL(page.url);
    },
    [],
  );

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const accepted: SheetPage[] = [];
    const rejected: string[] = [];
    for (const file of Array.from(files)) {
      if (!(ACCEPTED_SHEET_TYPES as readonly string[]).includes(file.type)) {
        rejected.push(`${file.name}: formato no admitido`);
      } else if (file.size > MAX_SHEET_BYTES) {
        rejected.push(`${file.name}: supera los 15 MB`);
      } else {
        accepted.push({
          id: crypto.randomUUID(),
          file,
          url: URL.createObjectURL(file),
        });
      }
    }

    setError(rejected.length > 0 ? rejected.join(" · ") : null);
    if (accepted.length === 0) return;
    setPages([...pages, ...accepted]);
    setActiveId(accepted[0].id);
  }

  function removePage(id: string) {
    const page = pages.find((p) => p.id === id);
    if (page) URL.revokeObjectURL(page.url);
    const rest = pages.filter((p) => p.id !== id);
    setPages(rest);
    if (activeId === id) setActiveId(rest[0]?.id ?? null);
  }

  const active = pages.find((p) => p.id === activeId) ?? null;
  const empty = pages.length === 0;
  const openPicker = () => inputRef.current?.click();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rellenar desde tu hoja</CardTitle>
        <CardDescription>
          Opcional. Sube fotos (una por página, de frente y con buena luz) o el
          PDF de tu hoja, y los datos pasarán a los campos de abajo para que
          los revises. Si lo prefieres, rellénalos a mano.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed px-4 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50",
            empty ? "flex-col py-8 text-center" : "py-3",
            dragging && "border-primary bg-muted/50",
          )}
        >
          <UploadIcon
            className={cn(
              "shrink-0 text-muted-foreground",
              empty ? "size-8" : "size-5",
            )}
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">
              {empty
                ? "Arrastra aquí la hoja o pulsa para elegirla"
                : "Añadir otra página"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP o PDF · hasta 15 MB cada uno
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_SHEET_TYPES.join(",")}
            className="sr-only"
            onChange={(event) => {
              addFiles(event.target.files);
              // Para poder volver a elegir el mismo fichero tras quitarlo.
              event.target.value = "";
            }}
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {!empty ? (
          <ul className="flex gap-3 overflow-x-auto pt-2 pb-1">
            {pages.map((page, index) => (
              <li key={page.id} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveId(page.id)}
                  aria-pressed={page.id === activeId}
                  aria-label={`Ver página ${index + 1}: ${page.file.name}`}
                  className={cn(
                    "flex h-24 w-[4.25rem] flex-col items-center justify-center overflow-hidden rounded-md border bg-muted transition-shadow",
                    page.id === activeId && "ring-2 ring-primary",
                  )}
                >
                  {page.file.type === "application/pdf" ? (
                    <>
                      <FileTextIcon className="size-7 text-muted-foreground" />
                      <span className="mt-1 text-[0.65rem] text-muted-foreground">
                        PDF
                      </span>
                    </>
                  ) : (
                    // Object URL local: `next/image` no aporta nada aquí.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={page.url}
                      alt=""
                      className="size-full object-cover"
                    />
                  )}
                </button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="secondary"
                  onClick={() => removePage(page.id)}
                  aria-label={`Quitar ${page.file.name}`}
                  className="absolute -top-2 -right-2 rounded-full shadow"
                >
                  <XIcon />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}

        {active ? (
          <figure className="flex flex-col gap-2">
            {active.file.type === "application/pdf" ? (
              <iframe
                src={active.url}
                title={`Vista previa de ${active.file.name}`}
                className="h-[60vh] w-full rounded-md border"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.url}
                alt={`Vista previa de ${active.file.name}`}
                className="mx-auto max-h-[60vh] w-auto rounded-md border"
              />
            )}
            <figcaption className="truncate text-xs text-muted-foreground">
              {active.file.name} ·{" "}
              {(active.file.size / 1024 / 1024).toFixed(1)} MB
            </figcaption>
          </figure>
        ) : null}
      </CardContent>

      {!empty ? (
        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            La lectura automática (OCR) llega en el siguiente paso. Por ahora
            solo se previsualiza: no se sube nada.
          </p>
          <Button type="button" size="sm" disabled>
            <ScanTextIcon /> Rellenar formulario
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
