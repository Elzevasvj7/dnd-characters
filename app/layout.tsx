import type { Metadata } from "next";
import { Cinzel, EB_Garamond } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Cinzel son capitales romanas: es lo más cerca que hay en Google Fonts de los
// titulares del Manual del Jugador sin pagar licencias.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

// EB Garamond es la misma familia de garaldas que usa el cuerpo del manual.
// Ojo: compone pequeño, por eso globals.css sube la escala de texto.
const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Fichas D&D",
    template: "%s · Fichas D&D",
  },
  description: "Tus hojas de personaje, centralizadas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${garamond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
