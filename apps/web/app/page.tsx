import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Coins,
  Dices,
  DoorOpen,
  Flag,
  GraduationCap,
  Landmark,
  Lock,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { BarrioIcon } from "@/components/BarrioIcon";
import { Logo } from "@/components/Logo";
import { MathText } from "@/components/MathText";
import { BARRIOS } from "@/lib/game-data";

const PREVIEW_TILES = [
  { icon: DoorOpen, label: "Entrada", detail: "Inicio del barrio", state: "done" },
  { icon: BookOpen, label: "Reto", detail: "Interés compuesto", state: "current" },
  { icon: Landmark, label: "Banco", detail: "Bonificación", state: "next" },
  { icon: Sparkles, label: "Evento", detail: "Tarjeta sorpresa", state: "next" },
  { icon: Flag, label: "Punto de control", detail: "3 retos · aprueba 2", state: "next" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Secciones">
            <a className="btn btn-ghost text-sm" href="#idea">
              La idea
            </a>
            <a className="btn btn-ghost text-sm" href="#barrios">
              Barrios
            </a>
            <Link className="btn btn-ghost text-sm" href="/teacher">
              Panel docente
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link className="btn btn-secondary hidden text-sm sm:inline-flex" href="/teacher">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              Docente
            </Link>
            <Link className="btn btn-primary text-sm" href="/play">
              Jugar demo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="soft-grid absolute inset-0 opacity-70" aria-hidden="true" />
          <div
            className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-coin/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <div className="animate-pop">
              <span className="chip chip-success">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Maqueta de avance · Investigación de Operaciones
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Una ciudad que se construye{" "}
                <span className="relative whitespace-nowrap text-primary">
                  con matemáticas
                  <svg
                    className="absolute -bottom-2 left-0 h-3 w-full text-coin"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 9C45 3 120 1 198 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                .
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
                MateRico es un juego de tablero para estudiantes de{" "}
                <strong>10.° y 11.°</strong>. Recorres barrios, resuelves retos
                que cambian en cada partida y conquistas puntos de control.
                Acierta y avanzas; falla y vuelves al inicio del turno.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link className="btn btn-primary px-6 py-3 text-base" href="/play">
                  <Dices className="h-5 w-5" aria-hidden="true" />
                  Jugar la demo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  className="btn btn-secondary px-5 py-3 text-base"
                  href="/teacher"
                >
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  Ver panel docente
                </Link>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                {[
                  { value: "6", label: "barrios temáticos" },
                  { value: "22", label: "plantillas paramétricas" },
                  { value: "3", label: "tipos de respuesta" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-line bg-white/70 px-3 py-3 text-center"
                  >
                    <dt className="font-display text-2xl font-extrabold text-ink">
                      {item.value}
                    </dt>
                    <dd className="text-xs font-semibold text-muted">
                      {item.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Vista previa del tablero */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="card float-card relative z-10 overflow-hidden p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0F7B5F]/12 text-[#0F7B5F]">
                      <BarrioIcon iconKey="building" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-extrabold leading-tight">
                        Centro Financiero
                      </p>
                      <p className="text-[11px] font-semibold text-muted">
                        Barrio 1 · Fácil
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="chip chip-coin">
                      <Coins className="h-3.5 w-3.5" aria-hidden="true" /> 340
                    </span>
                    <span className="chip chip-danger">
                      <Timer className="h-3.5 w-3.5" aria-hidden="true" /> 3
                    </span>
                  </div>
                </div>

                <ol className="mt-4 space-y-1.5" aria-label="Vista previa del tablero">
                  {PREVIEW_TILES.map((tile, index) => {
                    const Icon = tile.icon;
                    const current = tile.state === "current";
                    return (
                      <li key={tile.label} className="flex items-center gap-2.5">
                        <div className="flex h-9 w-4 flex-col items-center">
                          <span
                            className={`mt-3 h-2 w-2 rounded-full ${
                              current || tile.state === "done"
                                ? "bg-[#0F7B5F]"
                                : "bg-line"
                            }`}
                          />
                          {index < PREVIEW_TILES.length - 1 && (
                            <span className="w-0.5 flex-1 rounded-full bg-line" />
                          )}
                        </div>
                        <div
                          className={`flex flex-1 items-center gap-2.5 rounded-xl border px-2.5 py-2 ${
                            current
                              ? "border-[#0F7B5F] bg-[#0F7B5F]/7 shadow-[0_0_0_3px_#0F7B5F1f]"
                              : "border-line bg-white"
                          }`}
                        >
                          <span
                            className={`grid h-7 w-7 place-items-center rounded-lg ${
                              current
                                ? "bg-[#0F7B5F] text-white"
                                : "bg-ink/5 text-ink/60"
                            }`}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold">{tile.label}</p>
                            <p className="truncate text-[10px] text-ink/70">
                              {tile.detail}
                            </p>
                          </div>
                          {current && (
                            <span className="chip bg-[#0F7B5F] text-white">
                              Tú
                            </span>
                          )}
                          {tile.state === "done" && (
                            <Check className="h-4 w-4 text-success" aria-hidden="true" />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <button
                  type="button"
                  className="btn btn-primary mt-4 w-full"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Dices className="h-5 w-5" />
                  Lanzar dado
                </button>
              </div>

              {/* Tarjeta flotante de reto */}
              <div className="card absolute -bottom-8 -right-2 z-20 hidden w-64 rotate-1 p-3.5 sm:block lg:-right-6">
                <div className="flex items-center justify-between">
                  <span className="chip chip-muted">
                    <BookOpen className="h-3 w-3" aria-hidden="true" />
                    Reto
                  </span>
                  <span className="chip chip-coin">+22 monedas</span>
                </div>
                <p className="mt-2.5 text-[13px] font-semibold leading-snug">
                  <MathText text="Ana deposita $850.000$ al $9\%$ anual compuesto. ¿Cuánto tendrá en $4$ años?" />
                </p>
                <div className="mt-2 space-y-1">
                  {["$1.156.000$", "$1.199.844$", "$349.844$"].map(
                    (option, index) => (
                      <div
                        key={option}
                        className={`flex items-center gap-2 rounded-lg border px-2 py-1 text-[11px] ${
                          index === 1
                            ? "border-primary bg-primary/10 font-bold text-primary-dark"
                            : "border-line bg-white text-ink/70"
                        }`}
                      >
                        <span className="grid h-4 w-4 place-items-center rounded bg-ink/5 text-[9px] font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <MathText text={option} />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* La idea */}
        <section id="idea" className="border-t border-line bg-white/50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="max-w-2xl">
              <span className="chip chip-muted">Qué resuelve</span>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Aprender matemáticas se parece más a jugar que a memorizar.
              </h2>
              <p className="mt-3 text-ink/70">
                La maqueta ya muestra el bucle completo: lanzas el dado, caes en
                una casilla, resuelves un reto con temporizador y ves la
                explicación. Si fallas, retrocedes; si aciertas, conservas el
                avance.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Dices,
                  title: "Servidor autoritativo",
                  body: "En el MVP el dado, el movimiento y la calificación los decide el servidor. La maqueta lo simula para poder enseñar la experiencia sin infraestructura.",
                },
                {
                  icon: ShieldCheck,
                  title: "Preguntas que no se memorizan",
                  body: "Plantillas paramétricas: cambian los valores, el contexto y el orden de las opciones. La misma plantilla rara vez produce el mismo enunciado.",
                },
                {
                  icon: Trophy,
                  title: "Progreso visible",
                  body: "Monedas, racha, propiedades del barrio y puntos de control. El docente ve el avance por habilidad y las señales de comportamiento anómalo.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="card p-5">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-extrabold">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                      {item.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Barrios */}
        <section id="barrios" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="chip chip-muted">La ciudad</span>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Seis barrios, seis temarios
                </h2>
                <p className="mt-2 max-w-2xl text-ink/70">
                  Cada barrio tiene un color, un ícono y un nombre: nunca solo
                  color. El docente habilita los barrios que correspondan a su
                  curso.
                </p>
              </div>
              <Link className="btn btn-secondary" href="/play">
                Recorrer la ciudad
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BARRIOS.map((barrio, index) => (
                <article
                  key={barrio.id}
                  className="card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ backgroundColor: barrio.color }}
                    aria-hidden="true"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-2xl"
                      style={{
                        backgroundColor: `${barrio.color}16`,
                        color: barrio.color,
                      }}
                    >
                      <BarrioIcon iconKey={barrio.iconKey} className="h-6 w-6" />
                    </span>
                    <span className="chip chip-muted">
                      {index + 1} / 6 · {barrio.grade}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-extrabold">
                    {barrio.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/65">
                    {barrio.temario}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className="chip"
                      style={{
                        backgroundColor: `${barrio.color}14`,
                        color: barrio.color,
                        borderColor: `${barrio.color}33`,
                      }}
                    >
                      {barrio.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-ink/70">
                      {index === 0 ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          Jugable en la maqueta
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                          Se desbloquea al avanzar
                        </>
                      )}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Nota de alcance */}
        <section className="border-t border-line bg-white/50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-coin/20 text-[#6b4e00]">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-extrabold">
                    Esto es una maqueta, no el MVP todavía.
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink/70">
                    Los datos, el dado y la calificación se simulan en el
                    navegador para enseñar la experiencia. El MVP tendrá
                    servidor autoritativo, PostgreSQL, Redis, sesiones y todas
                    las reglas de la bóveda. Úsala para validar la dirección
                    visual y el flujo antes de invertir en infraestructura.
                  </p>
                </div>
              </div>
              <Link className="btn btn-primary flex-none" href="/play">
                Probar el flujo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-center text-xs text-muted sm:flex-row sm:px-6 sm:text-left">
          <p>
            <strong className="text-ink">MateRico</strong> · Maqueta de avance ·
            Investigación de Operaciones · Ingeniería en Sistemas
          </p>
          <p>
            Contenido alineado con DBA 10.°–11.° y Saber 11 · Datos ficticios
          </p>
        </div>
      </footer>
    </div>
  );
}
