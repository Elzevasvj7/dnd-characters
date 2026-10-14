import { CharacterDetail } from "./queries";

export function templateSheet(character: CharacterDetail) {
  return `
        <!doctype html>
        <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Hoja de personaje — Tailwind</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              * {
                box-sizing: border-box;
              }
              body {
                margin: 0;
                padding: 24px;
                background: #ddd;
                color: #111;
                font-family: Arial, Helvetica, sans-serif;
              }
              .sheet {
                position: relative;
                width: 794px;
                height: 1123px;
                background: #fff;
                overflow: hidden;
                page-break-after: always;
                break-after: page;
              }
              .sheet:last-child {
                page-break-after: auto;
                break-after: auto;
              }
              .handwriting {
                font-family: "Comic Sans MS", "Segoe Print", cursive;
                color: #0d48b8;
              }
              .no-export {
                display: none !important;
              }
              @media print {
                body {
                  padding: 0;
                  background: white;
                }
              }
            </style>
          </head>
          <body>
            <div id="character-sheet" class="flex flex-col items-center gap-6">
              <!-- PAGE 1 -->
              <section class="sheet p-10" id="page-1">
                <header class="flex mb-2.5 h-[10%]">
                  <div class="w-[215px]">
                    <div class="relative h-[52px]">
                      <div
                        class="absolute inset-x-0 top-0 h-[31px] border-b border-black pt-[5px] text-[13px] handwriting"
                        data-bind="name"
                      >
                        ${character.name}
                      </div>
                      <div class="absolute bottom-0 left-0 text-[9px] uppercase">
                        Nombre del personaje
                      </div>
                    </div>
                  </div>

                  <div
                    class="rounded-[17px] border-[1.5px] border-black bg-white px-3 py-[9px] flex-1"
                  >
                    <div class="grid grid-cols-3 gap-x-3">
                      <div class="relative">
                        <div
                          class="= inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                          data-bind="classLevel"
                        >
                          Mago 3
                        </div>
                        <div class="text-[9px] uppercase">Clase y nivel</div>
                      </div>
                      <div class="relative">
                        <div
                          class="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                          data-bind="background"
                        >
                          - Personalizado -
                        </div>
                        <div class="text-[9px] uppercase">Trasfondo</div>
                      </div>
                      <div class="relative">
                        <div
                          class="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                          data-bind="player"
                        >
                          Nando77
                        </div>
                        <div class="bottom-0 text-[9px] uppercase">Jugador</div>
                      </div>
                      <div class="relative">
                        <div
                          class="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                          data-bind="race"
                        >
                          Humano
                        </div>
                        <div class="text-[9px] uppercase">Especie</div>
                      </div>
                      <div class="relative">
                        <div
                          class="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                          data-bind="alignment"
                        >
                          Neutral bueno
                        </div>
                        <div class="text-[9px] uppercase">Alineamiento</div>
                      </div>
                      <div class="relative">
                        <div
                          class="inset-x-0 top-0 border-b border-black text-[12px] handwriting"
                          data-bind="xp"
                        >
                          &nbsp;
                        </div>
                        <div class="text-[9px] uppercase">Puntos de experiencia</div>
                      </div>
                    </div>
                  </div>
                </header>
                <main class="grid grid-cols-3 gap-x-[9px] h-[90%] overflow-hidden">
                  <div class="relative flex flex-col max-h-full overflow-hidden">
                    <div class="flex gap-[9px] mb-[9px]">
                      <div class="rounded-2xl bg-gray-200 p-[6px] h-full">
                        <div class="flex flex-col h-full">
                          <div
                            class="relative h-[75px] rounded-2xl border-[1.5px] border-black bg-white pt-3 text-center mb-3.5"
                          >
                            <div class="text-[8px] font-bold uppercase">Fuerza</div>
                            <div class="text-[19px] handwriting" data-bind="strMod">
                              0
                            </div>
                            <div
                              class="absolute -bottom-3 left-1/2 flex h-[34px] w-[34px] -translate-x-1/2 items-center justify-center rounded-full border-[1.5px] border-black bg-white text-[13px] handwriting"
                              data-bind="str"
                            >
                              11
                            </div>
                          </div>
                          <div
                            class="relative h-[75px] rounded-2xl border-[1.5px] border-black bg-white pt-3 text-center mb-3.5"
                          >
                            <div class="text-[8px] font-bold uppercase">Destreza</div>
                            <div class="text-[19px] handwriting" data-bind="dexMod">
                              +2
                            </div>
                            <div
                              class="absolute -bottom-3 left-1/2 flex h-[34px] w-[34px] -translate-x-1/2 items-center justify-center rounded-full border-[1.5px] border-black bg-white text-[13px] handwriting"
                              data-bind="dex"
                            >
                              14
                            </div>
                          </div>
                          <div
                            class="relative h-[75px] rounded-2xl border-[1.5px] border-black bg-white pt-3 text-center mb-3.5"
                          >
                            <div class="text-[8px] font-bold uppercase">
                              Constitución
                            </div>
                            <div class="text-[19px] handwriting" data-bind="conMod">
                              +4
                            </div>
                            <div
                              class="absolute -bottom-3 left-1/2 flex h-[34px] w-[34px] -translate-x-1/2 items-center justify-center rounded-full border-[1.5px] border-black bg-white text-[13px] handwriting"
                              data-bind="con"
                            >
                              19
                            </div>
                          </div>
                          <div
                            class="relative h-[75px] rounded-2xl border-[1.5px] border-black bg-white pt-3 text-center mb-3.5"
                          >
                            <div class="text-[8px] font-bold uppercase">
                              Inteligencia
                            </div>
                            <div class="text-[19px] handwriting" data-bind="intMod">
                              +4
                            </div>
                            <div
                              class="absolute -bottom-3 left-1/2 flex h-[34px] w-[34px] -translate-x-1/2 items-center justify-center rounded-full border-[1.5px] border-black bg-white text-[13px] handwriting"
                              data-bind="int"
                            >
                              19
                            </div>
                          </div>
                          <div
                            class="relative h-[75px] rounded-2xl border-[1.5px] border-black bg-white pt-3 text-center mb-3.5"
                          >
                            <div class="text-[8px] font-bold uppercase">Sabiduría</div>
                            <div class="text-[19px] handwriting" data-bind="wisMod">
                              +3
                            </div>
                            <div
                              class="absolute -bottom-3 left-1/2 flex h-[34px] w-[34px] -translate-x-1/2 items-center justify-center rounded-full border-[1.5px] border-black bg-white text-[13px] handwriting"
                              data-bind="wis"
                            >
                              17
                            </div>
                          </div>
                          <div
                            class="relative h-[75px] rounded-2xl border-[1.5px] border-black bg-white pt-3 text-center mb-3.5"
                          >
                            <div class="text-[8px] font-bold uppercase">Carisma</div>
                            <div class="text-[19px] handwriting" data-bind="chaMod">
                              +2
                            </div>
                            <div
                              class="absolute -bottom-3 left-1/2 flex h-[34px] w-[34px] -translate-x-1/2 items-center justify-center rounded-full border-[1.5px] border-black bg-white text-[13px] handwriting"
                              data-bind="cha"
                            >
                              14
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col gap-[9px] flex-1">
                        <div
                          class="relative rounded-2xl border-[1.5px] border-black bg-white px-2 pt-2 pb-5"
                        >
                          <div class="flex items-center text-[10px]">
                            <span
                              class="mr-1 h-[11px] w-[11px] rounded-full border-[1.5px] border-black"
                            ></span
                            >Fuerza<span class="ml-auto handwriting">0</span>
                          </div>
                          <div class="flex items-center text-[10px]">
                            <span
                              class="mr-1 h-[11px] w-[11px] rounded-full border-[1.5px] border-black"
                            ></span
                            >Destreza<span class="ml-auto handwriting">+2</span>
                          </div>
                          <div class="flex items-center text-[10px]">
                            <span
                              class="mr-1 h-[11px] w-[11px] rounded-full border-[1.5px] border-black"
                            ></span
                            >Constitución<span class="ml-auto handwriting">+4</span>
                          </div>
                          <div class="flex items-center text-[10px]">
                            <span
                              class="mr-1 h-[11px] w-[11px] rounded-full border-[1.5px] border-black bg-[#0d48b8] bg-clip-content p-[2px]"
                            ></span
                            >Inteligencia<span class="ml-auto handwriting">+6</span>
                          </div>
                          <div class="flex items-center text-[10px]">
                            <span
                              class="mr-1 h-[11px] w-[11px] rounded-full border-[1.5px] border-black bg-[#0d48b8] bg-clip-content p-[2px]"
                            ></span
                            >Sabiduría<span class="ml-auto handwriting">+5</span>
                          </div>
                          <div class="flex items-center text-[10px]">
                            <span
                              class="mr-1 h-[11px] w-[11px] rounded-full border-[1.5px] border-black"
                            ></span
                            >Carisma<span class="ml-auto handwriting">+2</span>
                          </div>
                          <div
                            class="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase"
                          >
                            Tiradas de salvación
                          </div>
                        </div>
                        <div
                          class="relative rounded-2xl border-[1.5px] border-black bg-white px-2 pt-2 pb-5 h-full"
                        >
                          <div class="space-y-1.5 text-[10px]">
                            <div class="flex items-center">
                              ○ Acrobacias <span class="ml-auto handwriting">+2</span>
                            </div>
                            <div class="flex items-center">
                              ○ Arcanos <span class="ml-auto handwriting">+4</span>
                            </div>
                            <div class="flex items-center">
                              ○ Atletismo <span class="ml-auto handwriting">0</span>
                            </div>
                            <div class="flex items-center">
                              ○ Engañar <span class="ml-auto handwriting">+2</span>
                            </div>
                            <div class="flex items-center">
                              ● Historia <span class="ml-auto handwriting">+6</span>
                            </div>
                            <div class="flex items-center">
                              ○ Interpretación
                              <span class="ml-auto handwriting">+2</span>
                            </div>
                            <div class="flex items-center">
                              ○ Intimidar <span class="ml-auto handwriting">+2</span>
                            </div>
                            <div class="flex items-center">
                              ● Investigación
                              <span class="ml-auto handwriting">+6</span>
                            </div>
                            <div class="flex items-center">
                              ○ Juego de Manos
                              <span class="ml-auto handwriting">+2</span>
                            </div>
                            <div class="flex items-center">
                              ○ Medicina <span class="ml-auto handwriting">+3</span>
                            </div>
                            <div class="flex items-center">
                              ○ Naturaleza <span class="ml-auto handwriting">+4</span>
                            </div>
                            <div class="flex items-center">
                              ○ Percepción <span class="ml-auto handwriting">+3</span>
                            </div>
                            <div class="flex items-center">
                              ○ Perspicacia <span class="ml-auto handwriting">+3</span>
                            </div>
                            <div class="flex items-center">
                              ○ Persuasión <span class="ml-auto handwriting">+2</span>
                            </div>
                            <div class="flex items-center">
                              ○ Religión <span class="ml-auto handwriting">+4</span>
                            </div>
                            <div class="flex items-center">
                              ○ Sigilo <span class="ml-auto handwriting">+2</span>
                            </div>
                            <div class="flex items-center">
                              ○ Supervivencia
                              <span class="ml-auto handwriting">+3</span>
                            </div>
                            <div class="flex items-center">
                              ○ Trato con Animales
                              <span class="ml-auto handwriting">+3</span>
                            </div>
                          </div>
                          <div
                            class="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase"
                          >
                            Habilidades
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col gap-[9px] flex-1">
                      <div class="flex h-[39px] items-center">
                        <div
                          class="flex h-[39px] w-[48px] items-center justify-center border-[1.5px] border-black text-[18px] handwriting"
                          data-bind="passivePerception"
                        >
                          13
                        </div>
                        <div
                          class="flex h-7 flex-1 items-center justify-center rounded-r-[14px] border-[1.5px] border-l-0 border-black text-[8px] font-bold uppercase"
                        >
                          Sabiduría (percepción) pasiva
                        </div>
                      </div>
                      <div
                        class="flex flex-col flex-1 items-center justify-start rounded-[14px] border-[1.5px] border-black text-[8px] font-bold uppercase p-2.5 w-full"
                      >
                        <div class="textarea-value" data-bind="proficiencies">
                          Competencias: - Ballesta ligera, Bastón, Daga, Dardo, Honda
                        </div>
                        <div class="label bottom-0 absolute pb-2">
                          Otras competencias e idiomas
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="relative flex flex-col">
                    <div
                      class="mb-[10px] grid h-[31px] grid-cols-[44px_1fr] items-center"
                    >
                      <div
                        class="flex h-[37px] items-center justify-center border-[1.5px] border-black text-[17px] handwriting"
                        data-bind="inspiration"
                      >
                        &nbsp;
                      </div>
                      <div
                        class="flex h-7 items-center justify-center rounded-r-2xl border-[1.5px] border-l-0 border-black text-[8px] font-bold uppercase"
                      >
                        Inspiración
                      </div>
                    </div>
                    <div
                      class="mb-[9px] grid h-[31px] grid-cols-[44px_1fr] items-center"
                    >
                      <div
                        class="flex h-[37px] items-center justify-center border-[1.5px] border-black text-[17px] handwriting"
                        data-bind="profBonus"
                      >
                        +2
                      </div>
                      <div
                        class="flex h-7 items-center justify-center rounded-r-2xl border-[1.5px] border-l-0 border-black text-[8px] font-bold uppercase"
                      >
                        Bonificador de competencia
                      </div>
                    </div>
                    <div class="mb-[9px] grid grid-cols-3 gap-[7px]">
                      <div
                        class="flex h-[65px] flex-col items-center justify-center rounded-[18px] border-[1.5px] border-black"
                      >
                        <span class="text-[17px] handwriting" data-bind="ac">12</span
                        ><span class="mt-[3px] text-[7px] font-bold uppercase">CA</span>
                      </div>
                      <div
                        class="flex h-[65px] flex-col items-center justify-center rounded-[18px] border-[1.5px] border-black"
                      >
                        <span class="text-[17px] handwriting" data-bind="initiative"
                          >+2</span
                        ><span class="mt-[3px] text-[7px] font-bold uppercase"
                          >Iniciativa</span
                        >
                      </div>
                      <div
                        class="flex h-[65px] flex-col items-center justify-center rounded-[18px] border-[1.5px] border-black"
                      >
                        <span class="text-[17px] handwriting" data-bind="speed">30</span
                        ><span
                          class="mt-[3px] text-center text-[7px] font-bold uppercase"
                          >Velocidad<br />(pies)</span
                        >
                      </div>
                    </div>
                    <div
                      class="mb-[9px] rounded-2xl border-[1.5px] p-[5px] bg-gray-200 flex flex-col gap-[5px]"
                    >
                      <div class="h-[65px] rounded-t-2xl border-[1.5px] border-black px-[10px] relative bg-white">
                        <div class="ml-0 text-[9px] text-gray-500">
                          Puntos de Golpe Máximos
                          <span class="handwriting" data-bind="maxHp">27</span>
                        </div>
                        <div
                          class="flex items-center justify-center text-[8px] text-center font-bold uppercase absolute bottom-0 left-0 right-0"
                        >
                          Puntos de golpe actuales
                        </div>
                      </div>
                      <div class="h-[65px] rounded-b-2xl border-[1.5px] border-black px-[10px] relative bg-white">
                        <div
                          class="flex items-center justify-center pb-[5px] text-[8px] text-center font-bold uppercase absolute bottom-0 left-0 right-0"
                        >
                          Puntos de golpe temporales
                        </div>
                      </div>
                    </div>
                    <div class="mb-[9px] grid grid-cols-2 gap-[7px]">
                      <div
                        class="flex h-[65px] flex-col items-center rounded-2xl border-[1.5px] border-black text-[8px] font-bold uppercase relative p-1.5"
                      >
                        <span
                          class="text-[17px] font-normal handwriting"
                          data-bind="hitDice"
                          >3d6</span
                        >
                        <div class="absolute bottom-0 left-0 right-0 text-center">
                          Dados de golpe
                        </div>
                      </div>
                      <div
                        class="flex h-[65px] flex-col items-center rounded-2xl border-[1.5px] border-black text-[8px] font-bold uppercase relative p-1.5"
                      >
                        <span class="text-[10px] font-normal handwriting"
                          >Éxitos ○○○<br />Fallos ○○○</span
                        >
                        <p class="absolute bottom-0 left-0 right-0 text-center w-full">
                          Salvaciones <br/> de muerte
                        </p>
                      </div>
                    </div>
                    <div
                      class="relative mb-[9px] h-[160px] rounded-2xl border-[1.5px] border-black px-[9px] pt-4"
                    >
                      <div class="grid grid-cols-[1fr_52px_1fr] text-center text-[7px]">
                        <span>NOMBRE</span><span>BONIF.</span><span>DAÑO/TIPO</span>
                      </div>
                      <div
                        class="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase"
                      >
                        Ataques y lanzamiento de conjuros
                      </div>
                    </div>
                    <div
                      class="relative h-auto rounded-2xl border-[1.5px] border-black px-[10px] pt-3 flex-1"
                    >
                      <div
                        class="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase"
                      >
                        Equipo
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col h-full gap-[5px]">
                    <div>
                      <div class="bg-gray-200 p-[6px] h-full rounded-2xl space-y-1.5">
                        <div
                          class="border-[1.5px] border-black rounded-t-[14px] bg-white p-2 text-[9px] h-[100px] relative"
                        >
                          <div class="handwriting" data-bind="personality">
                            No hay nada que me guste más que un buen misterio.
                          </div>
                          <div class="text-[9px] font-bold text-center uppercase absolute bottom-0 left-0 right-0">
                            Rasgos de personalidad
                          </div>
                        </div>
                        <div class="border-[1.5px] border-black bg-white p-2 text-[9px] h-[85px] relative">
                          <div class="handwriting" data-bind="ideals">
                            Lógica. Las emociones no deben nublar nuestro pensamiento
                            lógico. (Legal)
                          </div>
                          <div class="text-[9px] font-bold text-center uppercase absolute bottom-0 left-0 right-0">
                            Ideales
                          </div>
                        </div>
                        <div class="border-[1.5px] border-black bg-white p-2 text-[9px] h-[85px] relative">
                          <div class="handwriting" data-bind="bonds">
                            He estado buscando toda mi vida la respuesta a una pregunta
                            determinada.
                          </div>
                          <div class="text-[9px] font-bold text-center uppercase absolute bottom-0 left-0 right-0">
                            Vínculos
                          </div>
                        </div>
                        <div
                          class="border-[1.5px] border-black bg-white p-2 rounded-b-[14px] text-[9px] h-[85px] relative"
                        >
                          <div class="handwriting" data-bind="flaws">
                            Desenterrar un antiguo misterio bien vale el precio de una
                            civilización.
                          </div>
                          <div class="text-[9px] font-bold text-center uppercase absolute bottom-0 left-0 right-0">
                            Defectos
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="border-[1.5px] border-black bg-white p-[6px] rounded-2xl flex-1 relative"
                    >
                      <div class="handwriting text-[9px]" data-bind="features">
                        Mago nivel 3: - Copiar un conjuro en el libro - Erudito de la
                        evocación - Esculpir conjuros - Lanzamiento de conjuros -
                        Lanzamiento ritual - Recuperación arcana - Remplazar el libro
                      </div>
                      <div
                        class="text-[8px] font-bold uppercase bottom-[7px] absolute text-center left-0 right-0"
                      >
                        Rasgos y atributos
                      </div>
                    </div>
                  </div>
                </main>
              </section>

              <!-- PAGE 2: same fixed A4 canvas, with Tailwind utilities -->
              <section class="sheet" id="page-2">
                <header class="absolute left-[42px] right-[42px] top-[39px] h-[78px]">
                  <div class="absolute left-0 top-7 w-[215px]">
                    <div class="relative h-[52px]">
                      <div
                        class="absolute inset-x-0 top-0 h-[31px] border-b border-black pt-[5px] text-[13px] handwriting"
                        data-bind="name"
                      >
                        Klaus Moretti
                      </div>
                      <div class="absolute bottom-0 text-[9px] uppercase">
                        Nombre del personaje
                      </div>
                    </div>
                  </div>
                  <div
                    class="absolute left-[225px] right-0 top-0 h-[78px] rounded-[17px] border-[1.5px] border-black px-3 py-[7px]"
                  >
                    <div class="text-[10px] font-bold uppercase">Apariencia</div>
                    <div class="mt-1 text-[11px] handwriting" data-bind="appearance">
                      Joven humano de aspecto estudioso.
                    </div>
                  </div>
                </header>

                <main
                  class="absolute left-[42px] right-[42px] top-[141px] bottom-[30px] grid grid-cols-[298px_1fr] gap-x-[13px]"
                >
                  <div class="flex flex-col gap-3">
                    <div
                      class="relative h-[401px] rounded-2xl border-[1.5px] border-black p-1"
                    >
                      <div
                        class="flex h-[310px] items-center justify-center text-gray-400"
                      >
                        <div
                          class="flex h-[310px] w-[192px] items-center justify-center border border-dashed border-gray-400 text-[10px]"
                        >
                          Imagen del personaje
                        </div>
                      </div>
                      <div
                        class="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase"
                      >
                        Apariencia
                      </div>
                    </div>
                    <div
                      class="relative h-[779px] rounded-2xl border-[1.5px] border-black p-[10px] pb-[22px]"
                    >
                      <div
                        class="whitespace-pre-wrap text-[11px] leading-[1.08] handwriting"
                        data-bind="notes"
                      ></div>
                      <div
                        class="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase"
                      >
                        Notas adicionales
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-3">
                    <div
                      class="relative h-[150px] rounded-2xl border-[1.5px] border-black p-[10px] pb-[22px]"
                    >
                      <div
                        class="whitespace-pre-wrap text-[10px] leading-[1.15] handwriting"
                        data-bind="history"
                      ></div>
                      <div
                        class="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase"
                      >
                        Historia del personaje
                      </div>
                    </div>
                    <div
                      class="relative h-[920px] rounded-2xl border-[1.5px] border-black p-[10px] pb-[22px]"
                    >
                      <div
                        class="whitespace-pre-wrap text-[10px] leading-[1.15]"
                        data-bind="features"
                      ></div>
                      <div
                        class="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase"
                      >
                        Rasgos y atributos
                      </div>
                    </div>
                  </div>
                </main>
              </section>

              <!-- PAGE 3: SPELLS -->
              <section class="sheet" id="page-3">
                <header
                  class="absolute left-[42px] right-[42px] top-[39px] grid h-[105px] grid-cols-[1.4fr_1.2fr_.9fr_1fr] gap-2"
                >
                  <div
                    class="relative rounded-2xl border-[1.5px] border-black p-[9px] pb-5"
                  >
                    <div
                      class="flex h-12 items-center border-b border-black text-[15px] handwriting"
                      data-bind="spellcastingClass"
                    >
                      Mago
                    </div>
                    <div
                      class="absolute bottom-[6px] left-2 right-2 text-[7px] font-bold uppercase"
                    >
                      Clase lanzadora de conjuros
                    </div>
                  </div>
                  <div
                    class="relative rounded-2xl border-[1.5px] border-black p-[9px] pb-5"
                  >
                    <div
                      class="flex h-12 items-center border-b border-black text-[15px] handwriting"
                      data-bind="spellcastingAbility"
                    >
                      Inteligencia
                    </div>
                    <div
                      class="absolute bottom-[6px] left-2 right-2 text-[7px] font-bold uppercase"
                    >
                      Característica mágica
                    </div>
                  </div>
                  <div
                    class="relative rounded-2xl border-[1.5px] border-black p-[9px] pb-5"
                  >
                    <div
                      class="flex h-12 items-center border-b border-black text-[15px] handwriting"
                      data-bind="spellSaveDc"
                    >
                      14
                    </div>
                    <div
                      class="absolute bottom-[6px] left-2 right-2 text-center text-[7px] font-bold uppercase"
                    >
                      CD salvación conjuros
                    </div>
                  </div>
                  <div
                    class="relative rounded-2xl border-[1.5px] border-black p-[9px] pb-5"
                  >
                    <div
                      class="flex h-12 items-center border-b border-black text-[15px] handwriting"
                      data-bind="spellAttackBonus"
                    >
                      +6
                    </div>
                    <div
                      class="absolute bottom-[6px] left-2 right-2 text-center text-[7px] font-bold uppercase"
                    >
                      Bonif. ataque conjuros
                    </div>
                  </div>
                </header>

                <div
                  class="absolute left-[42px] right-[42px] top-[158px] grid h-[128px] grid-cols-9 gap-[5px]"
                >
                  <div
                    class="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center"
                  >
                    <div class="text-[7px] font-extrabold uppercase">Nivel 1</div>
                    <div
                      class="mt-[7px] h-[19px] text-[15px] handwriting"
                      data-bind="slot1"
                    >
                      4
                    </div>
                    <div class="mt-[5px] flex flex-wrap justify-center gap-[3px]">
                      ○ ○ ○ ○
                    </div>
                  </div>
                  <div
                    class="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center"
                  >
                    <div class="text-[7px] font-extrabold uppercase">Nivel 2</div>
                    <div
                      class="mt-[7px] h-[19px] text-[15px] handwriting"
                      data-bind="slot2"
                    >
                      2
                    </div>
                    <div class="mt-[5px] flex flex-wrap justify-center gap-[3px]">
                      ○ ○
                    </div>
                  </div>
                  <div
                    class="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center"
                  >
                    <div class="text-[7px] font-extrabold uppercase">Nivel 3</div>
                    <div
                      class="mt-[7px] h-[19px] text-[15px] handwriting"
                      data-bind="slot3"
                    >
                      —
                    </div>
                  </div>
                  <div
                    class="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center"
                  >
                    <div class="text-[7px] font-extrabold uppercase">Nivel 4</div>
                    <div class="mt-[7px] h-[19px] text-[15px] handwriting">—</div>
                  </div>
                  <div
                    class="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center"
                  >
                    <div class="text-[7px] font-extrabold uppercase">Nivel 5</div>
                    <div class="mt-[7px] h-[19px] text-[15px] handwriting">—</div>
                  </div>
                  <div
                    class="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center"
                  >
                    <div class="text-[7px] font-extrabold uppercase">Nivel 6</div>
                    <div class="mt-[7px] h-[19px] text-[15px] handwriting">—</div>
                  </div>
                  <div
                    class="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center"
                  >
                    <div class="text-[7px] font-extrabold uppercase">Nivel 7</div>
                    <div class="mt-[7px] h-[19px] text-[15px] handwriting">—</div>
                  </div>
                  <div
                    class="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center"
                  >
                    <div class="text-[7px] font-extrabold uppercase">Nivel 8</div>
                    <div class="mt-[7px] h-[19px] text-[15px] handwriting">—</div>
                  </div>
                  <div
                    class="relative rounded-[13px] border-[1.5px] border-black p-[7px_4px] text-center"
                  >
                    <div class="text-[7px] font-extrabold uppercase">Nivel 9</div>
                    <div class="mt-[7px] h-[19px] text-[15px] handwriting">—</div>
                  </div>
                </div>

                <main
                  class="absolute left-[42px] right-[42px] top-[304px] bottom-[30px] grid grid-cols-[215px_1fr] gap-[10px]"
                >
                  <div
                    class="relative overflow-hidden rounded-2xl border-[1.5px] border-black p-[12px_10px_22px]"
                  >
                    <div
                      class="mb-2 border-b border-black pb-1 text-[8px] font-extrabold uppercase"
                    >
                      Trucos
                    </div>
                    <div class="space-y-[4px] text-[8px]">
                      <div>○ <span class="font-bold">Rayo de fuego</span></div>
                      <div>○ <span class="font-bold">Luz</span></div>
                      <div>● <span class="font-bold">Prestidigitación</span></div>
                    </div>
                    <div
                      class="absolute bottom-[7px] left-0 right-0 text-center text-[8px] font-bold uppercase"
                    >
                      Trucos conocidos
                    </div>
                  </div>

                  <div class="grid min-h-0 grid-rows-9 gap-[7px]">
                    <div
                      class="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px]"
                    >
                      <div
                        class="mb-1 flex justify-between border-b border-black pb-1 text-[8px] font-extrabold uppercase"
                      >
                        Nivel 1 <span class="font-normal handwriting">4 espacios</span>
                      </div>
                      <div class="space-y-0 text-[7px]">
                        <div
                          class="grid grid-cols-[13px_1fr_45px_45px_48px] gap-1 border-b border-dotted border-gray-400 py-[2px]"
                        >
                          <span>●</span><span class="font-bold">Detectar magia</span
                          ><span class="text-center text-[6px]">1 acción</span
                          ><span class="text-center text-[6px]">30 pies</span
                          ><span class="text-center text-[6px]">Conc.</span>
                        </div>
                        <div
                          class="grid grid-cols-[13px_1fr_45px_45px_48px] gap-1 py-[2px]"
                        >
                          <span>○</span><span class="font-bold">Proyectil mágico</span
                          ><span class="text-center text-[6px]">1 acción</span
                          ><span class="text-center text-[6px]">120 pies</span
                          ><span class="text-center text-[6px]">Instant.</span>
                        </div>
                      </div>
                    </div>
                    <div
                      class="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px]"
                    >
                      <div
                        class="mb-1 border-b border-black pb-1 text-[8px] font-extrabold uppercase"
                      >
                        Nivel 2
                      </div>
                    </div>
                    <div
                      class="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px]"
                    >
                      <div
                        class="mb-1 border-b border-black pb-1 text-[8px] font-extrabold uppercase"
                      >
                        Nivel 3
                      </div>
                    </div>
                    <div
                      class="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px]"
                    >
                      <div
                        class="mb-1 border-b border-black pb-1 text-[8px] font-extrabold uppercase"
                      >
                        Nivel 4
                      </div>
                    </div>
                    <div
                      class="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px]"
                    >
                      <div
                        class="mb-1 border-b border-black pb-1 text-[8px] font-extrabold uppercase"
                      >
                        Nivel 5
                      </div>
                    </div>
                    <div
                      class="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px] text-[7px] text-gray-500 italic"
                    >
                      Nivel 6 — sin conjuros
                    </div>
                    <div
                      class="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px] text-[7px] text-gray-500 italic"
                    >
                      Nivel 7 — sin conjuros
                    </div>
                    <div
                      class="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px] text-[7px] text-gray-500 italic"
                    >
                      Nivel 8 — sin conjuros
                    </div>
                    <div
                      class="relative overflow-hidden rounded-[14px] border-[1.5px] border-black p-2 pb-[21px] text-[7px] text-gray-500 italic"
                    >
                      Nivel 9 — sin conjuros
                    </div>
                  </div>
                </main>
              </section>
            </div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/4.2.1/jspdf.umd.min.js"></script>
          </body>
        </html>
  `;
}
