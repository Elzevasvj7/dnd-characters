import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CharacterListItem } from "../types";

export function CharacterCard({ character, path }: { character: CharacterListItem, path?: string }) {
  return (
    <Link href={path || `/character/${character.id}`} className="group block">
      <Card className="overflow-hidden py-0 transition-colors group-hover:border-ring">
        <div className="relative aspect-[4/3] w-full bg-muted">
          {character.imageUrl ? (
            <Image
              src={character.imageUrl}
              alt={character.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">
              {character.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <CardContent className="flex flex-col gap-2 py-4">
          <div className="flex items-start justify-between gap-2">
            <span className="font-medium">{character.name}</span>
            <Badge variant="secondary">Nv. {character.level}</Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            {[character.race, character.class].filter(Boolean).join(" · ") ||
              "Sin raza ni clase"}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
