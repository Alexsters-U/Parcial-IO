"use client";

import { Check, Flag, Lock, Map as MapIcon, MapPin } from "lucide-react";
import { useState } from "react";
import { BarrioIcon } from "@/components/BarrioIcon";
import { CityMapArt, MAP_NODES } from "@/components/art/CityMapArt";
import { PlayerToken } from "@/components/art/PlayerToken";
import { BARRIOS, SKILL_LABEL } from "@/lib/game-data";

type MapState = "completed" | "current" | "locked";

function mapState(
  index: number,
  barrioIndex: number,
  completedBarrios: number
): MapState {
  if (index < completedBarrios) return "completed";
  if (index === barrioIndex) return "current";
  return "locked";
}

export function CityMap({
  barrioIndex,
  completedBarrios,
}: {
  barrioIndex: number;
  completedBarrios: number;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const selected = picked ?? barrioIndex;

  const currentBarrio = BARRIOS[barrioIndex];
  const selectedBarrio = BARRIOS[selected];
  const selectedState = mapState(selected, barrioIndex, completedBarrios);
  const nextBarrio = BARRIOS[barrioIndex + 1] ?? null;

  return (
    <section className="card overflow-hidden" aria-labelledby="city-map-title">
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 pt-4 sm:px-5">
        <div>
          <span className="chip chip-muted">
            <MapIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Recorrido
          </span>
          <h2
            id="city-map-title"
            className="mt-2 font-display text-lg font-extrabold leading-tight sm:text-xl"
          >
            Mapa de la ciudad
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Toca un barrio para ver su temario y su estado en la ruta.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip chip-coin">{completedBarrios}/6 barrios</span>
          <span
            className="chip text-white"
            style={{ backgroundColor: currentBarrio.color }}
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {currentBarrio.shortName}
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="min-w-0">
          <div className="overflow-x-auto rounded-2xl border border-line bg-[#FBF1DE]">
            <div
              className="relative min-w-[38rem] sm:min-w-0"
              style={{ aspectRatio: "900 / 340" }}
            >
              <CityMapArt
                barrioIndex={barrioIndex}
                completedBarrios={completedBarrios}
                selectedIndex={selected}
              />

              {/* Ficha del jugador en el barrio actual */}
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${((MAP_NODES[barrioIndex].x - 36) / 900) * 100}%`,
                  top: `${((MAP_NODES[barrioIndex].y + 26) / 340) * 100}%`,
                }}
              >
                <PlayerToken
                  color={currentBarrio.color}
                  className="token-bob h-10 w-10 drop-shadow-[0_6px_8px_rgba(31,36,48,0.35)]"
                  label={`Tu ficha está en ${currentBarrio.name}`}
                />
              </div>

              {BARRIOS.map((barrio, index) => {
                const state = mapState(index, barrioIndex, completedBarrios);
                const isSelected = index === selected;
                const node = MAP_NODES[index];
                const stateLabel =
                  state === "completed"
                    ? "completado"
                    : state === "current"
                      ? "estás aquí"
                      : "bloqueado";
                return (
                  <button
                    key={barrio.id}
                    type="button"
                    onClick={() => setPicked(index)}
                    aria-pressed={isSelected}
                    aria-current={state === "current" ? "step" : undefined}
                    aria-label={`${barrio.name}: ${stateLabel}. ${barrio.temario}`}
                    className="absolute z-20 -translate-x-1/2 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
                    style={{
                      left: `${(node.x / 900) * 100}%`,
                      top: `${((node.y + 40) / 340) * 100}%`,
                    }}
                  >
                    <span
                      className="flex min-h-8 items-center gap-1 rounded-full border-2 bg-paper/95 px-2 py-1 text-[10px] font-extrabold shadow-sm backdrop-blur transition hover:shadow-md"
                      style={{
                        borderColor: isSelected
                          ? barrio.color
                          : state === "current"
                            ? `${barrio.color}99`
                            : "var(--color-line)",
                        backgroundColor: isSelected
                          ? `${barrio.color}12`
                          : undefined,
                        color:
                          state === "locked" ? "#6B7280" : "var(--color-ink)",
                      }}
                    >
                      <span
                        className="grid h-4 w-4 flex-none place-items-center rounded-full text-[9px] font-extrabold text-white"
                        style={{
                          backgroundColor:
                            state === "completed"
                              ? "#067647"
                              : state === "current"
                                ? barrio.color
                                : "#9AA0AA",
                        }}
                      >
                        {state === "completed" ? (
                          <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                        ) : state === "locked" ? (
                          <Lock className="h-2 w-2" strokeWidth={3} aria-hidden="true" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="whitespace-nowrap">{barrio.shortName}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden="true" />
              Completado
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: currentBarrio.color }}
                aria-hidden="true"
              />
              Estás aquí
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-line" aria-hidden="true" />
              Bloqueado
            </span>
            <span className="ml-auto font-semibold text-ink/50 sm:hidden">
              Desliza el mapa →
            </span>
          </div>
        </div>

        <aside
          className="flex flex-col rounded-2xl border p-3.5"
          aria-live="polite"
          style={{
            borderColor: `${selectedBarrio.color}44`,
            backgroundColor: `${selectedBarrio.color}08`,
          }}
        >
          <div className="flex items-start gap-2.5">
            <span
              className="grid h-10 w-10 flex-none place-items-center rounded-xl"
              style={{
                backgroundColor: `${selectedBarrio.color}16`,
                color: selectedBarrio.color,
              }}
            >
              <BarrioIcon iconKey={selectedBarrio.iconKey} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-sm font-extrabold leading-tight">
                {selectedBarrio.name}
              </h3>
              <p className="text-[11px] font-semibold text-muted">
                Barrio {selected + 1} de 6 · {selectedBarrio.grade}
              </p>
            </div>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-ink/70">
            {selectedBarrio.temario}
          </p>

          <div className="mt-2 flex flex-wrap gap-1">
            {selectedBarrio.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-semibold text-ink/65"
              >
                {SKILL_LABEL[skill] ?? skill}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex items-center gap-1.5">
            {selectedState === "completed" && (
              <span className="chip chip-success">
                <Check className="h-3 w-3" aria-hidden="true" />
                Completado
              </span>
            )}
            {selectedState === "current" && (
              <span
                className="chip text-white"
                style={{ backgroundColor: selectedBarrio.color }}
              >
                <MapPin className="h-3 w-3" aria-hidden="true" />
                Estás aquí
              </span>
            )}
            {selectedState === "locked" && (
              <span className="chip chip-muted">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Bloqueado
              </span>
            )}
            <span className="chip chip-muted">{selectedBarrio.difficulty}</span>
          </div>

          <p className="mt-2 text-[11px] leading-snug text-ink/70">
            {selectedState === "completed" ? (
              <>
                <strong className="font-display">Barrio superado.</strong> Puedes
                repasar sus retos cuando quieras.
              </>
            ) : selectedState === "current" ? (
              <>
                <strong className="font-display">Tu turno.</strong> Lanza el dado
                y avanza por las casillas de {selectedBarrio.shortName}.
              </>
            ) : (
              <>
                <strong className="font-display">Todavía bloqueado.</strong> Se
                desbloquea al superar el punto de control de{" "}
                {BARRIOS[selected - 1]?.name ?? "el barrio anterior"}.
              </>
            )}
          </p>

          <div className="mt-4 border-t border-line/80 pt-3 lg:mt-auto">
            <div className="flex items-center justify-between text-[11px] font-bold text-muted">
              <span>Progreso de la ciudad</span>
              <span className="tabular-nums text-ink/70">
                {completedBarrios}/6
              </span>
            </div>
            <div className="mt-1.5 flex gap-1" aria-hidden="true">
              {BARRIOS.map((b, index) => (
                <span
                  key={b.id}
                  className="h-1.5 flex-1 rounded-full"
                  style={{
                    backgroundColor:
                      index < completedBarrios
                        ? "#067647"
                        : index === barrioIndex
                          ? b.color
                          : "var(--color-line)",
                  }}
                />
              ))}
            </div>
            <p className="mt-2.5 flex items-start gap-1.5 rounded-xl bg-white/70 px-2.5 py-2 text-[11px] leading-snug text-ink/70">
              <Flag
                className="mt-0.5 h-3.5 w-3.5 flex-none text-muted"
                aria-hidden="true"
              />
              <span>
                {nextBarrio ? (
                  <>
                    <strong className="font-display text-ink">
                      Siguiente parada:
                    </strong>{" "}
                    {nextBarrio.name}
                  </>
                ) : (
                  <>
                    <strong className="font-display text-ink">
                      Última parada:
                    </strong>{" "}
                    el punto de control final.
                  </>
                )}
              </span>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
