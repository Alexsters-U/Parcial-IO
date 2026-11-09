import {
  ArrowRight,
  Coins,
  Flame,
  GraduationCap,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export function FinishedScreen({
  coins,
  bestStreak,
  totalCorrect,
  totalAnswers,
  onReset,
}: {
  coins: number;
  bestStreak: number;
  totalCorrect: number;
  totalAnswers: number;
  onReset: () => void;
}) {
  const accuracy =
    totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      <div className="soft-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-coin/20 blur-3xl"
        aria-hidden="true"
      />
      <header className="relative z-10 border-b border-line bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo compact />
          <Link className="btn btn-secondary text-sm" href="/teacher">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Panel docente
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-coin/20 text-[#6b4e00]">
          <Trophy className="h-11 w-11" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight">
          ¡Completaste la ciudad!
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-ink/70">
          Recorriste los seis barrios, superaste los puntos de control y
          construiste tu capital. Esta es la celebración que verá el estudiante
          al terminar la campaña.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Coins, value: coins, label: "monedas" },
            { icon: Flame, value: bestStreak, label: "mejor racha" },
            { icon: Target, value: `${accuracy}%`, label: "aciertos" },
            { icon: Trophy, value: totalCorrect, label: "retos correctos" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="card p-4 text-center">
                <Icon className="mx-auto h-5 w-5 text-primary" aria-hidden="true" />
                <dt className="sr-only">{item.label}</dt>
                <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums">
                  {item.value}
                </dd>
                <p className="text-[11px] font-semibold text-muted">{item.label}</p>
              </div>
            );
          })}
        </dl>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onReset} className="btn btn-primary px-6 py-3">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Volver a jugar
          </button>
          <Link className="btn btn-secondary px-5 py-3" href="/teacher">
            Ver el reporte del curso
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted">
          Maqueta: el progreso se guarda en este navegador con fines de
          demostración. En el MVP vivirá en PostgreSQL y será autoritativo del
          servidor.
        </p>
      </main>
    </div>
  );
}
