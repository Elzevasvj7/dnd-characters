import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { ABILITIES, SKILLS } from "./rules";
import { MAX_SHEET_FILES, SPELL_SCHOOLS } from "./schemas";

export const parsedAttackSchema = z.object({
  name: z.string(),
  bonus: z.string().optional().default(""),
  damage: z.string().optional().default(""),
});

export const parsedItemSchema = z.object({
  name: z.string(),
  quantity: z.coerce.number().int().min(1).optional().default(1),
  weight: z.coerce.number().min(0).optional(),
  description: z.string().optional().default(""),
});

export const parsedSpellSchema = z.object({
  name: z.string(),
  level: z.coerce.number().int().min(0).max(9).optional().default(0),
  school: z.enum(SPELL_SCHOOLS).optional(),
  castingTime: z.string().optional().default(""),
  range: z.string().optional().default(""),
  duration: z.string().optional().default(""),
  components: z.string().optional().default(""),
  concentration: z.boolean().optional().default(false),
  ritual: z.boolean().optional().default(false),
  description: z.string().optional().default(""),
});

export const parsedSheetSchema = z.object({
  // Identidad
  name: z.string().optional(),
  race: z.string().optional(),
  class: z.string().optional(),
  level: z.coerce.number().int().min(1).max(20).optional(),
  age: z.coerce.number().int().min(0).optional(),
  background: z.string().optional(),
  alignment: z.string().optional(),
  playerName: z.string().optional(),
  experiencePoints: z.coerce.number().int().min(0).optional(),
  inspiration: z.boolean().optional().default(false),

  // Puntuaciones de característica
  strength: z.coerce.number().int().min(1).max(30).optional(),
  dexterity: z.coerce.number().int().min(1).max(30).optional(),
  constitution: z.coerce.number().int().min(1).max(30).optional(),
  intelligence: z.coerce.number().int().min(1).max(30).optional(),
  wisdom: z.coerce.number().int().min(1).max(30).optional(),
  charisma: z.coerce.number().int().min(1).max(30).optional(),

  // Combate
  maxHp: z.coerce.number().int().min(0).optional(),
  currentHp: z.coerce.number().int().min(0).optional(),
  temporaryHp: z.coerce.number().int().min(0).optional(),
  armorClass: z.coerce.number().int().min(0).optional(),
  speed: z.coerce.number().int().min(0).optional(),
  hitDice: z.string().optional(),

  // Competencias
  saveProficiencies: z.array(z.enum(ABILITIES)).optional().default([]),
  skillProficiencies: z.array(z.enum(SKILLS)).optional().default([]),
  skillExpertise: z.array(z.enum(SKILLS)).optional().default([]),
  otherProficiencies: z.string().optional(),

  // Personalidad
  personalityTraits: z.string().optional(),
  ideals: z.string().optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),

  // Aspecto Físico
  height: z.string().optional(),
  weight: z.string().optional(),
  eyes: z.string().optional(),
  skin: z.string().optional(),
  hair: z.string().optional(),

  // Historia y Rasgos
  backstory: z.string().optional(),
  alliesAndOrganizations: z.string().optional(),
  organizationName: z.string().optional(),
  featuresAndTraits: z.string().optional(),
  additionalFeatures: z.string().optional(),
  treasure: z.string().optional(),

  // Monedas
  platinum: z.coerce.number().int().min(0).optional(),
  gold: z.coerce.number().int().min(0).optional(),
  electrum: z.coerce.number().int().min(0).optional(),
  silver: z.coerce.number().int().min(0).optional(),
  copper: z.coerce.number().int().min(0).optional(),

  // Lanzamiento de Conjuros
  spellcastingClass: z.string().optional(),
  spellcastingAbility: z.enum(ABILITIES).optional(),

  // Listas
  attacks: z.array(parsedAttackSchema).optional().default([]),
  items: z.array(parsedItemSchema).optional().default([]),
  spells: z.array(parsedSpellSchema).optional().default([]),
});

export type ParsedSheetData = z.infer<typeof parsedSheetSchema>;

/**
 * Campos que el esquema espera como arrays. Cualquier otro campo que venga como
 * array (el modelo lo devuelve así al procesar varias imágenes a la vez) se
 * reduce al primer elemento.
 */
const ARRAY_RESPONSE_KEYS = new Set([
  "attacks",
  "items",
  "spells",
  "saveProficiencies",
  "skillProficiencies",
  "skillExpertise",
]);

/**
 * Normaliza la respuesta de Gemini: si un campo escalar (string, number, boolean,
 * enum) llega como array —cosa que ocurre cuando procesa varias imágenes a la vez—
 * toma el primer elemento. Deja intactos los arrays que realmente esperamos.
 */
function normalizeGeminiResponse(data: unknown): unknown {
  if (typeof data !== "object" || data === null) return data;
  if (Array.isArray(data)) return data;

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && !ARRAY_RESPONSE_KEYS.has(key)) {
      result[key] = normalizeGeminiResponse(value[0]);
    } else if (Array.isArray(value)) {
      result[key] = value.map(normalizeGeminiResponse);
    } else {
      result[key] = normalizeGeminiResponse(value);
    }
  }
  return result;
}

const SYSTEM_PROMPT = `
Eres un asistente experto en Dungeons & Dragons 5ª Edición (D&D 5e).
Tu tarea es realizar OCR exhaustivo sobre la imagen o documento PDF proporcionado que corresponde a una hoja de personaje oficial o manuscrita de D&D 5e.

Extrae con la mayor precisión posible TODOS los campos presentes en formato JSON estructurado:

1. CABECERA E IDENTIDAD:
- "name": Nombre del personaje.
- "race": Raza (Humano, Elfo, Enano, etc.).
- "class": Clase principal.
- "level": Nivel (1 al 20).
- "age": Edad.
- "background": Trasfondo (Acólito, Soldado, etc.).
- "alignment": Alineamiento (Caótico Bueno, etc.).
- "playerName": Nombre del jugador.
- "experiencePoints": Puntos de experiencia (XP).
- "inspiration": Booleano (true si está marcado el checkbox de inspiración).

2. CARACTERÍSTICAS Y BONOS:
- "strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma": Puntuaciones totales de característica (1 a 30).

3. COMBATE:
- "maxHp": Puntos de golpe máximos.
- "currentHp": Puntos de golpe actuales.
- "temporaryHp": Puntos de golpe temporales.
- "armorClass": Clase de Armadura (CA).
- "speed": Velocidad.
- "hitDice": Dados de golpe (p. ej. "1d8", "3d10").

4. COMPETENCIAS Y LENGUAJES:
- "saveProficiencies": Lista de competencias en Salvación ("STRENGTH", "DEXTERITY", "CONSTITUTION", "INTELLIGENCE", "WISDOM", "CHARISMA").
- "skillProficiencies": Lista de habilidades competentes (casilla marcada):
  "ACROBATICS", "ATHLETICS", "ARCANA", "DECEPTION", "HISTORY", "PERFORMANCE", "INTIMIDATION", "INVESTIGATION", "SLEIGHT_OF_HAND", "MEDICINE", "NATURE", "PERCEPTION", "INSIGHT", "PERSUASION", "RELIGION", "STEALTH", "SURVIVAL", "ANIMAL_HANDLING".
- "skillExpertise": Lista de habilidades con pericia / expertise (doble marca).
- "otherProficiencies": Texto de otras competencias, armas, armaduras, herramientas e idiomas.

5. PERSONALIDAD Y ASPECTO:
- "personalityTraits": Rasgos de personalidad.
- "ideals": Ideales.
- "bonds": Vínculos.
- "flaws": Defectos.
- "height": Altura.
- "weight": Peso.
- "eyes": Ojos.
- "skin": Piel.
- "hair": Pelo.

6. HISTORIA Y CUALIDADES:
- "backstory": Historia del personaje.
- "alliesAndOrganizations": Aliados y organizaciones.
- "organizationName": Nombre del símbolo u organización.
- "featuresAndTraits": Rasgos y cualidades (Features & Traits).
- "additionalFeatures": Rasgos y cualidades adicionales.
- "treasure": Tesoro.

7. MONEDAS Y EQUIPO:
- "platinum", "gold", "electrum", "silver", "copper": Cantidad de monedas de cada tipo (números).
- "attacks": Array de ataques o conjuros de ataque: [{"name": string, "bonus": string, "damage": string}].
- "items": Array de objetos del inventario o equipo: [{"name": string, "quantity": number, "weight": number, "description": string}].

8. LANZAMIENTO DE CONJUROS Y LISTA DE CONJUROS:
- "spellcastingClass": Clase de lanzador de conjuros.
- "spellcastingAbility": Característica de lanzamiento ("STRENGTH", "DEXTERITY", "CONSTITUTION", "INTELLIGENCE", "WISDOM", "CHARISMA").
- "spells": Array de conjuros conocidos/preparados:
  [{"name": string, "level": number (0 para trucos, 1-9), "school": "EVOCATION" | "ABJURATION" | "CONJURATION" | "DIVINATION" | "ENCHANTMENT" | "ILLUSION" | "NECROMANCY" | "TRANSMUTATION", "castingTime": string, "range": string, "duration": string, "components": string, "concentration": boolean, "ritual": boolean, "description": string}].

Si algún campo o sección no está presente en el documento, omítelo.

IMPORTANTE: Los documentos proporcionados pueden ser varias páginas de la misma hoja de
personaje (por ejemplo, la portada y la segunda página). Trata todas las páginas como un
único personaje y combina la información de todas ellas en un solo objeto JSON. Solo si
en los documentos aparecen claramente varios personajes distintos, elige ÚNICAMENTE UNO
y devuelve sus datos.

Responde ÚNICAMENTE con el objeto JSON estructurado sin formato markdown adicional.
`;

export async function parseCharacterSheetWithGemini(
  files: File[],
): Promise<ParsedSheetData> {
  if (!files.length) {
    throw new Error("No se ha adjuntado ninguna hoja de personaje");
  }
  if (files.length > MAX_SHEET_FILES) {
    throw new Error(
      `Demasiados archivos: el máximo permitido es ${MAX_SHEET_FILES}`,
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No se ha configurado la variable de entorno GEMINI_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });

  const fileParts = await Promise.all(
    files.map(async (file) => {
      const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
      return { inlineData: { mimeType: file.type, data: base64 } };
    }),
  );

  const preferredModel = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();

  let lastError: unknown;
  let rawResponseText: string | null = null;


  try {
    const response = await ai.models.generateContent({
      model: preferredModel,
      contents: [...fileParts, SYSTEM_PROMPT],
      config: {
        responseMimeType: "application/json",
        temperature: 0,
      },
    });

    if (response.text) {
      rawResponseText = response.text;
    }
  } catch (err) {
    lastError = err;
  }

  if (!rawResponseText) {
    throw (
      lastError ||
      new Error("No se pudo obtener respuesta de ningún modelo de Gemini")
    );
  }

  let jsonObject: unknown;
  try {
    jsonObject = JSON.parse(rawResponseText);
  } catch {
    throw new Error("La respuesta de Gemini no es un JSON válido");
  }

  const normalized = normalizeGeminiResponse(jsonObject);

  const parsed = parsedSheetSchema.safeParse(normalized);
  if (!parsed.success) {
    throw new Error(`Error en el formato de los datos: ${parsed.error.issues[0].message}`);
  }

  return parsed.data;
}
