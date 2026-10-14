/**
 * Dados. Separado de `rules.ts` porque aquello son funciones puras y esto no:
 * cada llamada da un resultado distinto.
 */

/** Un dado de `sides` caras. */
export function rollDie(sides: number): number {
  const [value] = crypto.getRandomValues(new Uint32Array(1));
  return (value % sides) + 1;
}

export type AbilityRoll = {
  /** Los cuatro dados, en el orden en que salieron. */
  dice: number[];
  /** Posición en `dice` del dado descartado (el más bajo). */
  droppedIndex: number;
  /** Suma de los tres más altos. */
  total: number;
};

/** El método clásico: 4d6 y se descarta el más bajo. */
export function rollAbilityScore(): AbilityRoll {
  const dice = Array.from({ length: 4 }, () => rollDie(6));
  const lowest = Math.min(...dice);
  const droppedIndex = dice.indexOf(lowest);
  const total = dice.reduce((sum, die) => sum + die, 0) - lowest;
  return { dice, droppedIndex, total };
}

/** Una tirada por característica: seis. */
export function rollAbilityScores(): AbilityRoll[] {
  return Array.from({ length: 6 }, rollAbilityScore);
}
