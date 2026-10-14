import { CharacterSheet } from "@/modules/character/components/character-sheet";
import { getCharacter } from "@/modules/character/queries";
import { notFound } from "next/navigation";
import React from "react";

const SheetPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // `getCharacter` filtra por propietario: si el id es de otro usuario devuelve
  // null y aquí se convierte en un 404, que no revela si el recurso existe.
  const character = await getCharacter(id);
  if (!character) notFound();
  return (
    <div>
      <CharacterSheet character={character} />
    </div>
  );
};

export default SheetPage;
