"use client";

import {
  BookOpen,
  Check,
  DoorOpen,
  Flag,
  Landmark,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef } from "react";
import type { Barrio, TileType } from "@/lib/game-data";
import { TILE_DESCRIPTION, TILE_LABEL, TILES } from "@/lib/game-data";

const TILE_ICON: Record<TileType, typeof BookOpen> = {
  entry: DoorOpen,
  challenge: BookOpen,
  bank: Landmark,
  event: Sparkles,
  checkpoint: Flag,
};

export function Board({
  barrio,
  position,
  turnStart,
  properties,
}: {
  barrio: Barrio;
  position: number;
  turnStart: number;
  properties: number[];
}) {
  const currentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    currentRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
  }, [position, barrio.id]);

  return (
    <ol className="mt-1" aria-label={`Tablero de ${barrio.name}`}>
      {TILES.map((tile, index) => {
        const Icon = TILE_ICON[tile.type];
        const isCurrent = index === position;
        const acquired =
          tile.type === "challenge" && properties.includes(index);
        const passed = index < position;
        const isTurnStart = index === turnStart && turnStart !== position;
        const last = index === TILES.length - 1;

        return (
          <li
            key={tile.index}
            ref={isCurrent ? currentRef : undefined}
            className="flex items-stretch gap-2.5"
          >
            <div className="flex w-5 flex-none flex-col items-center">
              <span
                className={`mt-5 h-2.5 w-2.5 flex-none rounded-full ${
                  isCurrent || acquired || passed ? "" : "bg-line"
                }`}
                style={{
                  backgroundColor:
                    isCurrent || acquired || passed
                      ? barrio.color
                      : undefined,
                }}
                aria-hidden="true"
              />
              {!last && (
                <span
                  className="my-1 w-0.5 flex-1 rounded-full"
                  style={{
                    backgroundColor:
                      passed || acquired
                        ? `${barrio.color}80`
                        : "var(--color-line)",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>

            <div
              className={`tile mb-2 ${isCurrent ? "tile-current" : ""} ${
                acquired ? "tile-acquired" : ""
              }`}
              style={{ "--barrio": barrio.color } as React.CSSProperties}
            >
              <span className="tile-icon">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-display text-sm font-extrabold leading-tight">
                    {TILE_LABEL[tile.type]}
                  </p>
                  {isCurrent && (
                    <span
                      className="chip text-white"
                      style={{ backgroundColor: barrio.color }}
                    >
                      Tú
                    </span>
                  )}
                  {isTurnStart && (
                    <span className="chip chip-muted">inicio del turno</span>
                  )}
                  {acquired && (
                    <span className="chip chip-success">
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Propiedad
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs leading-snug text-ink/70">
                  {TILE_DESCRIPTION[tile.type]}
                </p>
              </div>

              <span
                className="ml-auto flex-none font-display text-xs font-extrabold tabular-nums text-ink/70"
                aria-label={`Casilla ${index + 1} de ${TILES.length}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
