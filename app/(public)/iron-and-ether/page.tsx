import { Card, CardContent } from "@/components/ui/card";
import { getSignedImageUrls } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";
import { CharacterListItem } from "@/modules/character";
import { CharacterCard } from "@/modules/character/components/character-card";
import { ScrollTextIcon } from "lucide-react";

async function characterList(): Promise<CharacterListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("characters")
    .select("id, name, race, class, level, imagePath:image_path")
    .eq("campaign", "iron-and-ether");
  if (error)
    throw new Error(`No se pudieron cargar los personajes: ${error.message}`);

  // Firmar N URLs con N llamadas sería un N+1 contra la API de Storage.
  const urls = await getSignedImageUrls(data.map((row) => row.imagePath));

  return data.map(({ imagePath, ...row }) => ({
    ...row,
    imageUrl: imagePath ? (urls.get(imagePath) ?? null) : null,
  }));
}

const IronAndEther = async () => {
  const characters = await characterList();
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Iron & Ether
        </h1>
      </div>
      {characters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-10">
            <ScrollTextIcon className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              Todavía no has pasado ninguna ficha. Empieza por la que tengas más
              a mano.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <li key={character.id}>
              <CharacterCard character={character} path={`/iron-and-ether/${character.id}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IronAndEther;
