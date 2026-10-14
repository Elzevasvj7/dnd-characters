
import { notFound } from "next/navigation";

import { getCharacter } from "@/modules/character/queries";
import CharacterById from "@/modules/character/components/character-by-id";
export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // `getCharacter` filtra por propietario: si el id es de otro usuario devuelve
  // null y aquí se convierte en un 404, que no revela si el recurso existe.
  const character = await getCharacter(id);
  if (!character) notFound();

  return <CharacterById id={id} character={character} />;
}
