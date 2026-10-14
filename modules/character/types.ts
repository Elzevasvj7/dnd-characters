export type CharacterListItem = {
  id: string;
  name: string;
  race: string | null;
  class: string | null;
  level: number;
  imageUrl: string | null;
};

/**
 * Estado que devuelven las actions a `useActionState`.
 *
 * `ok: true` en vez de devolver `null` en el caso bueno: los formularios
 * necesitan distinguir "todavía no has enviado nada" de "se guardó", y ambos
 * serían `null`. Además cada envío devuelve un objeto nuevo, así que el efecto
 * que cierra el modo edición se dispara también al guardar dos veces seguidas.
 */
export type FormState = { error?: string; ok?: boolean } | null;
