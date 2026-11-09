"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  DoorOpen,
  Flag,
  Landmark,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BarrioScene } from "@/components/art/BarrioScene";
import { PlayerToken } from "@/components/art/PlayerToken";
import {
  BARRIOS,
  TILE_DESCRIPTION,
  TILE_LABEL,
  TILES,
  type Barrio,
  type TileType,
} from "@/lib/game-data";
import { CHALLENGE_TILE_COUNT } from "@/lib/game-state";

const TILE_ICON: Record<TileType, typeof BookOpen> = {
  entry: DoorOpen,
  challenge: BookOpen,
  bank: Landmark,
  event: Sparkles,
  checkpoint: Flag,
};

const TILE_SHORT: Record<TileType, string> = {
  entry: "Entrada",
  challenge: "Reto",
  bank: "Banco",
  event: "Evento",
  checkpoint: "Control",
};

/** Posición de cada casilla en la cuadrícula 7 × 5 del tablero. */
const TILE_POS = [
  { col: 1, row: 5 },
  { col: 1, row: 4 },
  { col: 1, row: 3 },
  { col: 1, row: 2 },
  { col: 2, row: 1 },
  { col: 4, row: 1 },
  { col: 6, row: 1 },
  { col: 7, row: 2 },
  { col: 7, row: 3 },
  { col: 7, row: 5 },
];

const ROUTE_SEGMENTS = [
  "M50 450V350",
  "M50 350V250",
  "M50 250V150",
  "M50 150Q50 50 150 50",
  "M150 50H350",
  "M350 50H550",
  "M550 50Q650 50 650 150",
  "M650 150V250",
  "M650 250V450",
];

function tileAccent(type: TileType, barrioColor: string) {
  switch (type) {
    case "bank":
      return "#D89F04";
    case "event":
      return "#BE185D";
    case "checkpoint":
      return "#0E7490";
    case "entry":
      return "#6B7280";
    default:
      return barrioColor;
  }
}

export function BarrioBoard({
  barrio,
  barrioIndex,
  position,
  turnStart,
  properties,
}: {
  barrio: Barrio;
  barrioIndex: number;
  position: number;
  turnStart: number;
  properties: number[];
}) {
  const [selected, setSelected] = useState(position);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(position);

    const container = scrollRef.current;
    const tile = currentRef.current;
    if (!container || !tile) return;
    if (container.scrollWidth <= container.clientWidth + 4) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const box = container.getBoundingClientRect();
    const tileBox = tile.getBoundingClientRect();
    const delta = tileBox.left - box.left - (box.width - tileBox.width) / 2;
    container.scrollTo({
      left: container.scrollLeft + delta,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [position, barrio.id]);

  const currentTile = TILES[position];
  const selectedTile = TILES[selected];
  const selectedAccent = tileAccent(selectedTile.type, barrio.color);
  const nextBarrio = BARRIOS[barrioIndex + 1] ?? null;

  const selectedStateLabel =
    selected === position
      ? "Aquí estás"
      : properties.includes(selected) && selectedTile.type === "challenge"
        ? "Propiedad"
        : selected < position
          ? "Superada"
          : "Por jugar";

  return (
    <section className="card overflow-hidden" aria-labelledby="board-title">
      <div className="flex flex-wrap items-start gap-3 p-4 sm:p-5">
        <span
          className="grid h-12 w-12 flex-none place-items-center rounded-2xl"
          style={{
            backgroundColor: `${barrio.color}14`,
            color: barrio.color,
          }}
        >
          <Landmark className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <h1
              id="board-title"
              className="font-display text-xl font-extrabold leading-tight sm:text-2xl"
            >
              {barrio.name}
            </h1>
            <span
              className="chip"
              style={{
                backgroundColor: `${barrio.color}14`,
                color: barrio.color,
                borderColor: `${barrio.color}33`,
              }}
            >
              Barrio {barrioIndex + 1} de 6
            </span>
            <span className="chip chip-muted">{barrio.grade}</span>
            <span
              className="chip"
              style={{
                backgroundColor: `${barrio.color}0F`,
                color: barrio.color,
                borderColor: `${barrio.color}2A`,
              }}
            >
              {barrio.difficulty}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            {barrio.temario}
          </p>
          <div className="mt-2.5 flex items-center gap-2.5">
            <div className="bar flex-1">
              <div
                className="bar-fill"
                style={{
                  width: `${(properties.length / CHALLENGE_TILE_COUNT) * 100}%`,
                  backgroundColor: barrio.color,
                }}
              />
            </div>
            <span className="flex-none text-[11px] font-bold text-muted">
              {properties.length}/{CHALLENGE_TILE_COUNT} propiedades
            </span>
          </div>
        </div>
      </div>

      <p className="px-3 pb-1 text-[11px] font-semibold text-muted sm:hidden">
        Desliza para recorrer el tablero →
      </p>

      <div
        ref={scrollRef}
        className="overflow-x-auto px-2 pb-1 sm:px-3"
        role="group"
        aria-label="Tablero del barrio"
        tabIndex={0}
      >
        <div className="relative mx-auto min-w-[42rem] sm:min-w-0">
          <div
            className="relative grid grid-cols-7 grid-rows-5 gap-1.5 sm:gap-2"
            style={{ aspectRatio: "7 / 5" }}
          >
            {/* Ruta del tablero */}
            <svg
              viewBox="0 0 700 500"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 z-0 h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M50 450V150Q50 50 150 50H550Q650 50 650 150V450"
                fill="none"
                stroke="#E6D6B9"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="1 11"
              />
              {ROUTE_SEGMENTS.map((d, index) =>
                index < position ? (
                  <path
                    key={`done-${d}`}
                    d={d}
                    fill="none"
                    stroke={barrio.color}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                ) : null
              )}
              {position < TILES.length - 1 && (
                <path
                  d={ROUTE_SEGMENTS[position]}
                  fill="none"
                  stroke={barrio.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="3 10"
                  className="map-route-active"
                  opacity="0.7"
                />
              )}
            </svg>

            {/* Plaza central */}
            <div
              className="relative z-0 overflow-hidden rounded-[24px] border-2 border-line bg-paper"
              style={{ gridColumn: "2 / 7", gridRow: "2 / 5" }}
            >
              <BarrioScene
                iconKey={barrio.iconKey}
                color={barrio.color}
                className="h-full w-full"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-ink/90 via-ink/45 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 sm:left-3 sm:top-3">
                <span className="chip bg-paper/90 text-ink">
                  Casilla {position + 1}/{TILES.length}
                </span>
                <span className="chip chip-coin">
                  {properties.length}/{CHALLENGE_TILE_COUNT}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/70">
                  Plaza de {barrio.shortName}
                </p>
                <p className="mt-0.5 font-display text-base font-extrabold leading-tight text-white sm:text-lg">
                  {TILE_LABEL[currentTile.type]}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-white/85 sm:text-[11px]">
                  {TILE_DESCRIPTION[currentTile.type]}
                </p>
              </div>
            </div>

            {/* Salida al siguiente barrio */}
            <div
              className="relative z-10 flex min-w-0 items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-line bg-white/60 px-2.5 py-1.5"
              style={{ gridColumn: "2 / 7", gridRow: "5 / 6" }}
            >
              <span
                className="flex-none rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white"
                style={{ backgroundColor: nextBarrio?.color ?? barrio.color }}
              >
                Salida
              </span>
              <ArrowRight className="h-3.5 w-3.5 flex-none text-muted" aria-hidden="true" />
              <span className="truncate text-[11px] font-bold text-ink/70">
                {nextBarrio
                  ? `Siguiente: ${nextBarrio.name}`
                  : "Final de la ciudad"}
              </span>
              <span className="ml-auto hidden flex-none text-[10px] font-semibold text-muted sm:block">
                {nextBarrio ? `Barrio ${barrioIndex + 2}/6` : "6/6"}
              </span>
            </div>

            {/* Casillas */}
            {TILES.map((tile, index) => {
              const Icon = TILE_ICON[tile.type];
              const accent = tileAccent(tile.type, barrio.color);
              const isCurrent = index === position;
              const acquired =
                tile.type === "challenge" && properties.includes(index);
              const isTurnStart = index === turnStart && turnStart !== position;
              const isSelected = index === selected;
              const stateText = isCurrent
                ? "Estás aquí"
                : acquired
                  ? "Propiedad"
                  : isTurnStart
                    ? "Inicio del turno"
                    : index < position
                      ? "Superada"
                      : "Por jugar";

              return (
                <button
                  key={tile.index}
                  ref={isCurrent ? currentRef : undefined}
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-pressed={isSelected}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Casilla ${index + 1} de ${TILES.length}: ${
                    TILE_LABEL[tile.type]
                  }. ${stateText}. ${TILE_DESCRIPTION[tile.type]}`}
                  className="relative z-10 flex min-w-0 flex-col justify-between rounded-2xl border-2 bg-paper p-1.5 pb-2 pt-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 sm:p-2 sm:pt-2.5"
                  style={{
                    gridColumnStart: TILE_POS[index].col,
                    gridRowStart: TILE_POS[index].row,
                    borderColor: isCurrent
                      ? barrio.color
                      : acquired
                        ? "#06764766"
                        : isSelected
                          ? `${barrio.color}66`
                          : "var(--color-line)",
                    borderTopWidth: "5px",
                    borderTopColor: accent,
                    backgroundColor: isCurrent
                      ? `${barrio.color}10`
                      : acquired
                        ? "#06764708"
                        : undefined,
                    boxShadow: isCurrent
                      ? `0 0 0 3px ${barrio.color}2E`
                      : undefined,
                  }}
                >
                  <span
                    className="grid h-7 w-7 flex-none place-items-center rounded-lg sm:h-8 sm:w-8"
                    style={{ backgroundColor: `${accent}16`, color: accent }}
                  >
                    <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden="true" />
                  </span>

                  <span className="mt-1 block truncate text-[11px] font-extrabold leading-tight sm:text-xs">
                    {TILE_SHORT[tile.type]}
                  </span>
                  <span
                    className="block truncate text-[9px] font-semibold leading-tight sm:text-[10px]"
                    style={{ color: isCurrent ? barrio.color : "#6B7280" }}
                  >
                    {stateText}
                  </span>

                  {acquired && (
                    <span className="absolute bottom-1 right-1 grid h-4 w-4 place-items-center rounded-full bg-success text-white">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                  )}

                  {isCurrent && (
                    <PlayerToken
                      color={barrio.color}
                      className="token-bob pointer-events-none absolute -right-1.5 -top-3 h-9 w-9 drop-shadow-[0_6px_6px_rgba(31,36,48,0.28)]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 sm:px-4 sm:pb-4" aria-live="polite">
        <div className="flex items-start gap-2.5 rounded-2xl border border-line bg-white/70 p-3">
          <span
            className="grid h-8 w-8 flex-none place-items-center rounded-lg"
            style={{
              backgroundColor: `${selectedAccent}18`,
              color: selectedAccent,
            }}
          >
            {(() => {
              const Icon = TILE_ICON[selectedTile.type];
              return <Icon className="h-4 w-4" aria-hidden="true" />;
            })()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-display text-sm font-extrabold">
                Casilla {selected + 1}: {TILE_LABEL[selectedTile.type]}
              </p>
              <span
                className="chip"
                style={
                  selected === position
                    ? {
                        backgroundColor: `${barrio.color}14`,
                        color: barrio.color,
                        borderColor: `${barrio.color}33`,
                      }
                    : undefined
                }
              >
                {selectedStateLabel}
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-snug text-ink/65">
              {TILE_DESCRIPTION[selectedTile.type]}
            </p>
          </div>
          {selected !== position && (
            <button
              type="button"
              onClick={() => setSelected(position)}
              className="btn btn-ghost flex-none px-2.5 py-1.5 text-[11px]"
            >
              Mi casilla
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
