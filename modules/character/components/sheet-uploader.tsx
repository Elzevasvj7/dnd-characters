"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileTextIcon,
  Loader2Icon,
  ScanTextIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
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
import { MAX_SHEET_FILES } from "../schemas";

const ACCEPTED_SHEET_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

/** Una foto de móvil ronda los 3-6 MB; un PDF escaneado, más. */
const MAX_SHEET_BYTES = 15 * 1024 * 1024;

type SheetFile = {
  file: File;
  /** Object URL para previsualizar sin subir nada. Hay que liberarla al quitar. */
  url: string;
};

type SheetUploaderProps = {
  onParse?: (files: File[]) => Promise<void>;
  isParsing?: boolean;
  parseError?: string | null;
};

/**
 * Bloque del alta: subir la hoja de papel (foto o PDF) para que el OCR
 * rellene los campos del formulario. Rellenar a mano sigue siendo posible, y
 * lo que saque el OCR se podrá corregir antes de guardar.
 *
 * Se pueden enviar hasta MAX_SHEET_FILES archivos a la vez. Si en los
 * documentos aparecen varios personajes, el OCR se queda con uno solo.
 */
export function SheetUploader({
  onParse,
  isParsing = false,
  parseError = null,
}: SheetUploaderProps) {
  const [sheets, setSheets] = useState<SheetFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewedPdf, setPreviewedPdf] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mantener una referencia actualizada para liberar las object URLs al salir.
  const sheetsRef = useRef(sheets);
  useEffect(() => {
    sheetsRef.current = sheets;
  }, [sheets]);

  useEffect(
    () => () => {
      sheetsRef.current.forEach((s) => URL.revokeObjectURL(s.url));
    },
    [],
  );

  function handleFileSelected(files: FileList | null) {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validar tipo y tamaño de cada archivo de uno en uno para dar feedback preciso.
    for (const file of fileArray) {
      if (!(ACCEPTED_SHEET_TYPES as readonly string[]).includes(file.type)) {
        setError(
          `${file.name}: formato no admitido. Usa JPG, PNG, WebP o PDF`,
        );
        return;
      }
      if (file.size > MAX_SHEET_BYTES) {
        setError(`${file.name}: supera el tamaño máximo permito (15 MB)`);
        return;
      }
    }

    const total = sheets.length + fileArray.length;
    if (total > MAX_SHEET_FILES) {
      setError(
        `Máximo ${MAX_SHEET_FILES} archivos: ya tienes ${sheets.length} y has intentado añadir ${fileArray.length}.`,
      );
      return;
    }

    setError(null);

    const newSheets = fileArray.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    // Si todavía no se ha seleccionado ningún PDF para previsualizar,
    // usar el primero que aparezca en los archivos recién añadidos.
    if (!previewedPdf) {
      const firstPdf = newSheets.find(
        (s) => s.file.type === "application/pdf",
      );
      if (firstPdf) setPreviewedPdf(firstPdf.url);
    }

    setSheets((prev) => [...prev, ...newSheets]);
  }

  function removeSheet(index: number) {
    setSheets((prev) => {
      const sheet = prev[index];
      URL.revokeObjectURL(sheet.url);
      if (sheet.url === previewedPdf) {
        const nextPdf = prev
          .filter((_, i) => i !== index)
          .find((s) => s.file.type === "application/pdf");
        setPreviewedPdf(nextPdf?.url ?? null);
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  function openPicker() {
    inputRef.current?.click();
  }

  function handleParseClick() {
    if (onParse && sheets.length > 0) {
      onParse(sheets.map((s) => s.file));
    }
  }

  const activeError = error || parseError;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rellenar desde tu hoja</CardTitle>
        <CardDescription>
          Opcional. Sube fotos o el PDF de tu hoja de personaje para que la IA
          de Gemini extraiga los datos y rellene el formulario
          automáticamente. Puedes enviar hasta {MAX_SHEET_FILES} archivos a la
          vez; si aparecen varios personajes, se quedará con uno solo.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Zona de arrastre — siempre visible para poder añadir más archivos. */}
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
            handleFileSelected(event.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50",
            dragging && "border-primary bg-muted/50",
            sheets.length > 0 && "py-4",
          )}
        >
          <UploadIcon className="size-8 text-muted-foreground" />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">
              {sheets.length > 0
                ? "Añadir más archivos"
                : "Arrastra aquí la hoja o pulsa para elegirla"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP o PDF · hasta 15 MB · máx. {MAX_SHEET_FILES}{" "}
              archivos
            </p>
            {sheets.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {sheets.length} de {MAX_SHEET_FILES} archivos
              </p>
            ) : null}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_SHEET_TYPES.join(",")}
            multiple
            className="sr-only"
            onChange={(event) => {
              handleFileSelected(event.target.files);
              event.target.value = "";
            }}
            disabled={isParsing}
          />
        </div>

        {/* Lista de archivos añadidos */}
        {sheets.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sheets.map((sheet, index) => (
              <div
                key={sheet.url}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {sheet.file.type === "application/pdf" ? (
                    <FileTextIcon className="size-8 shrink-0 text-muted-foreground" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sheet.url}
                      alt=""
                      className="size-10 rounded border object-cover shrink-0"
                    />
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <p className="truncate text-sm font-medium">
                      {sheet.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(sheet.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  {sheet.file.type === "application/pdf" ? (
                    <Button
                      type="button"
                      size="xs"
                      variant={
                        previewedPdf === sheet.url ? "default" : "outline"
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        setPreviewedPdf(sheet.url);
                      }}
                      disabled={isParsing}
                    >
                      {previewedPdf === sheet.url
                        ? "Vista activa"
                        : "Vista previa"}
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="secondary"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeSheet(index);
                    }}
                    aria-label="Quitar archivo"
                    disabled={isParsing}
                  >
                    <XIcon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Previsualización del PDF seleccionado — solo uno a la vez. */}
        {previewedPdf ? (
          <figure className="flex flex-col gap-2">
            <iframe
              src={previewedPdf}
              title="Vista previa del PDF seleccionado"
              className="h-[40vh] w-full rounded-md border"
            />
          </figure>
        ) : null}

        {activeError ? (
          <p className="text-sm text-destructive" role="alert">
            {activeError}
          </p>
        ) : null}
      </CardContent>

      {sheets.length > 0 ? (
        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Presiona el botón para extraer automáticamente los datos con la IA
            de Gemini.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={handleParseClick}
            disabled={isParsing || sheets.length === 0}
          >
            {isParsing ? (
              <>
                <Loader2Icon className="animate-spin" /> Leyendo con Gemini…
              </>
            ) : (
              <>
                <ScanTextIcon /> Rellenar formulario
              </>
            )}
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
