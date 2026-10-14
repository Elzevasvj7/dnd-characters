"use client";

import { useState, useTransition } from "react";
import type { FormState } from "../types";

/**
 * Alternativa a `useActionState` para formularios que tienen que reaccionar al
 * éxito (cerrar el modo edición, vaciarse).
 *
 * Con `useActionState` la única forma de enterarse de que fue bien es observar
 * el estado desde un `useEffect` y llamar a `setState` dentro; eso son renders
 * en cascada y React lo desaconseja explícitamente. Aquí invocamos la action a
 * mano dentro de una transición, así que el "qué hago al terminar" es la
 * continuación natural de un evento y no una sincronización a posteriori.
 *
 * A cambio se pierde el envío sin JavaScript, pero estos formularios ya
 * dependen de JS para el botón de editar, así que no había nada que perder.
 */
export function useFormAction(
  action: (prev: FormState, formData: FormData) => Promise<FormState>,
  onSuccess?: () => void,
) {
  const [state, setState] = useState<FormState>(null);
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await action(null, formData);
      setState(result);
      if (result?.ok) onSuccess?.();
    });
  }

  return { state, pending, submit };
}
