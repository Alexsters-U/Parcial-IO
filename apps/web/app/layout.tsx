import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Baloo_2 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  variable: "--font-atkinson",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MateRico · Maqueta de avance",
  description:
    "Maqueta funcional de MateRico: una ciudad que se construye con matemáticas. Datos ficticios para demostración.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO">
      <body className={`${baloo.variable} ${atkinson.variable}`}>
        {children}
      </body>
    </html>
  );
}
