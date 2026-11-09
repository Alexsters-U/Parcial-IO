import { Building2, Coins, Flame, Star } from "lucide-react";
import type { Barrio } from "@/lib/game-data";
import { CHALLENGE_TILE_COUNT, DEMO_STUDENT } from "@/lib/game-state";

export function PlayerCard({
  barrio,
  coins,
  streak,
  properties,
}: {
  barrio: Barrio;
  coins: number;
  streak: number;
  properties: number;
}) {
  return (
    <section className="card overflow-hidden" aria-label="Perfil del estudiante">
      <div
        className="h-14 w-full"
        style={{
          background: `linear-gradient(120deg, ${barrio.color}, ${barrio.color}aa 55%, #F2B705 160%)`,
        }}
        aria-hidden="true"
      />
      <div className="px-4 pb-4">
        <div className="-mt-7 flex items-end justify-between gap-2">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border-4 border-paper bg-ink font-display text-lg font-extrabold text-white shadow">
            {DEMO_STUDENT.avatar}
          </span>
          <span className="chip chip-coin mb-1">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            Estudiante demo
          </span>
        </div>
        <h2 className="mt-2 font-display text-lg font-extrabold leading-tight">
          {DEMO_STUDENT.name}
        </h2>
        <p className="text-xs font-semibold text-muted">
          {DEMO_STUDENT.grade} · {barrio.name}
        </p>

        <dl className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-line bg-white px-2 py-2 text-center">
            <dt className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted">
              <Coins className="h-3 w-3" aria-hidden="true" /> Monedas
            </dt>
            <dd className="font-display text-lg font-extrabold tabular-nums">
              {coins}
            </dd>
          </div>
          <div className="rounded-xl border border-line bg-white px-2 py-2 text-center">
            <dt className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted">
              <Flame className="h-3 w-3" aria-hidden="true" /> Racha
            </dt>
            <dd className="font-display text-lg font-extrabold tabular-nums">
              {streak}
            </dd>
          </div>
          <div className="rounded-xl border border-line bg-white px-2 py-2 text-center">
            <dt className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted">
              <Building2 className="h-3 w-3" aria-hidden="true" /> Barrio
            </dt>
            <dd className="font-display text-lg font-extrabold tabular-nums">
              {properties}/{CHALLENGE_TILE_COUNT}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
