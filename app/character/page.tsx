import { PlusIcon, ScrollTextIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CharacterCard } from "@/modules/character/components/character-card";
import { listMyCharacters } from "@/modules/character/queries";

export const metadata = { title: "Mis personajes" };

export default async function CharacterListPage() {
  // Sin fetch y sin route handler: el Server Component llama al módulo, y el
  // módulo consulta Postgres. Nos ahorramos el salto HTTP entero.
  const characters = await listMyCharacters();

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Mis personajes
        </h1>
        <Button render={<Link href="/character/create" />} nativeButton={false}>
          <PlusIcon /> Nuevo personaje
        </Button>
      </div>

      {characters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-10">
            <ScrollTextIcon className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              Todavía no has pasado ninguna ficha. Empieza por la que tengas más
              a mano.
            </p>
            <Button
              variant="outline"
              render={<Link href="/character/create" />}
              nativeButton={false}
            >
              Crear el primero
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <li key={character.id}>
              <CharacterCard character={character} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
