import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CharacterForm } from "@/modules/character/components/character-form";

export const metadata = { title: "Nuevo personaje" };

export default function CreateCharacterPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Nuevo personaje
        </h1>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/character" />}
          nativeButton={false}
        >
          Cancelar
        </Button>
      </div>
      <CharacterForm />
    </div>
  );
}
