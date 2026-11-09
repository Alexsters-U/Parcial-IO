import type { Metadata } from "next";
import { GameClient } from "./GameClient";

export const metadata: Metadata = {
  title: "Jugar · MateRico",
  description:
    "Demo jugable de MateRico: dado, retos con temporizador, banco, eventos y puntos de control.",
};

export default function PlayPage() {
  return <GameClient />;
}
