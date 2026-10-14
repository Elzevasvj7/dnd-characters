"use client";
import { Button } from "@/components/ui/button";
import React, {
  startTransition,
  useActionState,
  useRef,
  useState,
  useTransition,
} from "react";
import { CharacterDetail, getCharacterDownload } from "../queries";
import { CharacterSheet } from "./character-sheet";
import { templateSheet } from "../template-sheet";

function stripColorFunctions(css: string): string {
  return css.replace(/\b(?:lab|lch|oklab|oklch|rgb|rgba)\s*\([^)]*\)/gi, "");
}

function computeModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function computeProficiencyBonus(level: number): number {
  return 2 + Math.floor((Math.max(level, 1) - 1) / 4);
}

export default function DownloadButton({ id }: { id: string }) {
  const [downloading, setDownloading] = useState(false);

  const [transitionState, startTransitionGet] = useTransition();
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const sheetContainerRef = useRef<HTMLDivElement>(null);
  const startDownload = () => {
    startTransition(async () => {
      const data = await getCharacterDownload(id);
      if(data){
        setCharacter(data);
      }
    });
  };
  const download = async () => {
    setDownloading(true);
    let container: HTMLDivElement | null = null;
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      if (!character) {
        throw new Error("No hay personaje para generar el PDF");
      }

      // 2. Computar valores derivados
      const modifiers = {
        strMod: computeModifier(character.strength),
        dexMod: computeModifier(character.dexterity),
        conMod: computeModifier(character.constitution),
        intMod: computeModifier(character.intelligence),
        wisMod: computeModifier(character.wisdom),
        chaMod: computeModifier(character.charisma),
        profBonus:
          character.proficiencyBonusOverride ??
          computeProficiencyBonus(character.level),
        initiative:
          character.initiativeOverride ?? computeModifier(character.dexterity),
        // Passive Perception simplificada: 10 + modificador de sabedoria se proficiente
        // Para o PDF básico, usamos apenas o modificador
        passivePerception: 10 + computeModifier(character.wisdom),
      };

      // 3. Preparar dados para a plantilla
      const templateData: Record<string, any> = {
        // PAGE 1 - Dados básicos
        name: character.name,
        classLevel: `${character.class} ${character.level}`,
        background: character.background || "- Personalizado -",
        player: character.playerName || "Jugador",
        race: character.race || "Humano",
        alignment: character.alignment || "Neutral bueno",
        xp:
          character.experiencePoints !== undefined &&
          character.experiencePoints !== null
            ? character.experiencePoints
            : "&nbsp;",
        // Ability scores and modifiers
        strMod: modifiers.strMod,
        str: character.strength,
        dexMod: modifiers.dexMod,
        dex: character.dexterity,
        conMod: modifiers.conMod,
        con: character.constitution,
        intMod: modifiers.intMod,
        int: character.intelligence,
        wisMod: modifiers.wisMod,
        wis: character.wisdom,
        chaMod: modifiers.chaMod,
        cha: character.charisma,
        inspiration: character.inspiration || "",
        profBonus: modifiers.profBonus,
        ac: character.armorClass,
        initiative: modifiers.initiative,
        speed: character.speed,
        maxHp: character.maxHp,
        hitDice: character.hitDice || "1d6",
        // Passive perception
        passivePerception: modifiers.passivePerception,
        // Spellcasting (page 3 basics)
        spellcastingClass: character.spellcastingClass || "Mago",
        spellcastingAbility: character.spellcastingAbility || "Inteligencia",
        spellSaveDc:
          character.spellSaveDcOverride ??
          8 + modifiers.profBonus + computeModifier(character.intelligence),
        spellAttackBonus:
          character.spellAttackBonusOverride ??
          modifiers.profBonus + computeModifier(character.intelligence),
        // Spell slots (placeholder para agora)
        slot1: "-",
        slot2: "-",
        slot3: "-",
        slot4: "-",
        slot5: "-",
        slot6: "-",
        slot7: "-",
        slot8: "-",
        slot9: "-",
        spellLevel1Slots: "-",
        spellLevel2Slots: "-",
        // cantripNotes:
        //   character.cantripNotes ||
        //   "Los trucos no consumen espacios de conjuro.",
        // PAGE 1 additional fields
        personality:
          character.personalityTraits ||
          "No hay nada que me guste más que un buen misterio.",
        ideals:
          character.ideals ||
          "Lógica. Las emociones no deben nublar nuestro pensamiento lógico. (Legal)",
        bonds:
          character.bonds ||
          "He estado buscando toda mi vida la respuesta a una pregunta determinada.",
        flaws:
          character.flaws ||
          "Desenterrar un antiguo misterio bien vale el precio de una civilización.",
        proficiencies: character.otherProficiencies || "Competencias:",
        features: character.featuresAndTraits || "Mago nivel 3:",
        // PAGE 2 fields
        notes: character.notes?.length > 0 ? character.notes[0].body : "",
        history: character.backstory || "",
        featureDetails: character.featuresAndTraits || "",
        // Image
        characterImage: character.imageUrl || "",
      };

      // 4. Criar contêiner oculto e injetar a plantilla
      container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "794px";
      document.body.appendChild(container);

      const parser = new DOMParser();
      const doc = parser.parseFromString(
        await (await fetch("/character-sheet-template-tailwind.html")).text(),
        "text/html",
      );

      // 5. Injetar estilos (com limpeza de funções de cor)
      const style = document.createElement("style");
      const rawCss = Array.from(doc.querySelectorAll("style"))
        .map((el) => el.textContent ?? "")
        .join("\n");
      style.textContent = stripColorFunctions(rawCss);
      container.appendChild(style);

      // 6. Injetar o character sheet
      const sheet = doc.querySelector("#character-sheet");
      if (sheet) {
        container.appendChild(sheet);
      }

      // 7. Mapear dados para os elementos data-bind
      const binds = container.querySelectorAll("[data-bind]");
      binds.forEach((el: any) => {
        const key = el.dataset.bind;
        if (templateData[key] !== undefined && templateData[key] !== null) {
          let value = templateData[key];

          // Formatação especial para alguns campos
          switch (key) {
            case "strMod":
            case "dexMod":
            case "conMod":
            case "intMod":
            case "wisMod":
            case "chaMod":
              value = `${value >= 0 ? "+" : ""}${value}`;
              break;
            case "profBonus":
              value = value >= 0 ? `+${value}` : String(value);
              break;
            case "initiative":
              value = value >= 0 ? `+${value}` : String(value);
              break;
            case "ac":
            case "maxHp":
            case "speed":
            case "passivePerception":
            case "hitDice":
              // Números já formatados
              break;
          }

          // Se o elemento tiver classe 'hand', aplicar classe CSS (já está no HTML)
          // Caso contrário, definir textContent diretamente
          if (el.classList.contains("hand") || el.className.includes("hand")) {
            // Elementos com classe hand já têm estilo de fonte no CSS
            (el as HTMLElement).textContent = String(value);
          } else {
            (el as HTMLElement).textContent = String(value);
          }
        }
      });

      // 9. Aguardar fontes e renderização
      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 100));

      // 10. Capturar cada página .sheet individualmente com html2canvas
      const pages = container.querySelectorAll(".sheet");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          windowWidth: 794,
          windowHeight: 1123,
        });

        const image = canvas.toDataURL("image/png");

        if (i > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(image, "PNG", 0, 0, 210, 297, undefined, "FAST");
      }

      // 11. Salvar PDF
      pdf.save("personaje-hoja.pdf");
    } catch (error) {
      console.error(error);
    } finally {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      setDownloading(false);
    }
  };
  const downloadFromRef = async () => {
    setDownloading(true);

    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      if (!character) {
        throw new Error("No hay personaje para generar el PDF");
      }

      const sheetContainer = sheetContainerRef.current;

      if (!sheetContainer) {
        throw new Error("No se encontró el contenedor de la hoja");
      }

      // Buscar las páginas directamente en el componente React.
      // NO movemos el elemento fuera del árbol de React.
      const pages = Array.from(
        sheetContainer.querySelectorAll<HTMLElement>(".sheet"),
      );

      console.log("Páginas encontradas:", pages.length);

      if (pages.length === 0) {
        throw new Error("No se encontraron elementos .sheet");
      }

      // Esperar a que las fuentes estén listas.
      await document.fonts.ready;

      // Esperar un frame para asegurarnos de que React terminó
      // de pintar los elementos.
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      // Esperar un poco más para imágenes/layout.
      await new Promise((resolve) => setTimeout(resolve, 300));

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        console.log(`Capturando página ${i + 1}/${pages.length}`);

        // Asegurarnos de que la página realmente tenga dimensiones.
        const rect = page.getBoundingClientRect();

        console.log("Dimensiones:", {
          width: rect.width,
          height: rect.height,
        });

        if (rect.width === 0 || rect.height === 0) {
          throw new Error(
            `La página ${i + 1} tiene dimensiones 0x0. ` +
              `Probablemente está oculta con display:none.`,
          );
        }

        const canvas = await html2canvas(page, {
          scale: 2,

          backgroundColor: "#ffffff",

          useCORS: true,

          logging: false,

          // Importante: usamos el viewport real del navegador.
          windowWidth: document.documentElement.clientWidth,
          windowHeight: document.documentElement.clientHeight,

          // Permite que html2canvas capture contenido fuera
          // del viewport.
          scrollX: 0,
          scrollY: 0,

          imageTimeout: 15000,
        });

        console.log("Canvas:", {
          width: canvas.width,
          height: canvas.height,
        });

        if (canvas.width === 0 || canvas.height === 0) {
          throw new Error(
            `html2canvas generó un canvas vacío para la página ${i + 1}`,
          );
        }

        /*
         * Usamos JPEG en lugar de PNG.
         *
         * Esto evita el error "wrong PNG signature" de jsPDF
         * y para una hoja de personaje funciona perfectamente.
         */
        const image = canvas.toDataURL("image/jpeg", 0.95);

        if (!image || !image.startsWith("data:image/jpeg")) {
          throw new Error(
            `La imagen generada para la página ${i + 1} no es un JPEG válido`,
          );
        }

        if (i > 0) {
          pdf.addPage("a4", "portrait");
        }

        pdf.addImage(image, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      }

      pdf.save(`${character.name || "personaje"}-hoja.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
    } finally {
      setDownloading(false);
    }
  };
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={startDownload}
        aria-label="Descargar"
      >
        Preparar hoja de personaje
      </Button>
      {character && (
        <Button
          variant="outline"
          size="sm"
          onClick={downloadFromRef}
          aria-label="Descargar"
        >
          Descargar hoja de personaje
        </Button>
      )}
      <div ref={sheetContainerRef} className="fixed left-[-9999px] top-0 w-[794px] h-[1123px]">
        {character && <CharacterSheet character={character} />}
      </div>
    </>
  );
}
