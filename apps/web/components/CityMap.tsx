import { Check, Lock } from "lucide-react";
import { BarrioIcon } from "@/components/BarrioIcon";
import { BARRIOS } from "@/lib/game-data";

export function CityMap({
  barrioIndex,
  completedBarrios,
}: {
  barrioIndex: number;
  completedBarrios: number;
}) {
  return (
    <section className="card p-4" aria-labelledby="city-map-title">
      <div className="flex items-center justify-between">
        <h2 id="city-map-title" className="font-display text-sm font-extrabold">
          La ciudad
        </h2>
        <span className="chip chip-muted">{completedBarrios}/6</span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(completedBarrios / 6) * 100}%` }}
        />
      </div>

      <ol className="mt-3 space-y-1">
        {BARRIOS.map((barrio, index) => {
          const completed = index < completedBarrios;
          const current = index === barrioIndex && !completed;
          const locked = !completed && !current;
          return (
            <li
              key={barrio.id}
              className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 ${
                current ? "bg-ink/[0.045]" : ""
              }`}
              aria-current={current ? "step" : undefined}
            >
              <span
                className="grid h-7 w-7 flex-none place-items-center rounded-lg"
                style={{
                  backgroundColor: completed || current ? `${barrio.color}18` : "rgba(31,36,48,0.05)",
                  color: completed || current ? barrio.color : "#9aa0aa",
                }}
              >
                <BarrioIcon iconKey={barrio.iconKey} className="h-4 w-4" />
              </span>
              <span
                className={`min-w-0 flex-1 truncate text-xs font-bold ${
                  locked ? "text-ink/40" : "text-ink"
                }`}
              >
                {barrio.shortName}
              </span>
              {completed && (
                <Check className="h-4 w-4 flex-none text-success" aria-label="Completado" />
              )}
              {current && (
                <span
                  className="chip flex-none text-white"
                  style={{ backgroundColor: barrio.color }}
                >
                  Ahora
                </span>
              )}
              {locked && (
                <Lock className="h-3.5 w-3.5 flex-none text-ink/25" aria-label="Bloqueado" />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
