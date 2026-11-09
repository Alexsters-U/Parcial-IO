"use client";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Coins,
  Download,
  Flame,
  GraduationCap,
  MapPin,
  Search,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import {
  BARRIO_DISTRIBUTION,
  COURSE,
  MOCK_ANOMALIES,
  MOCK_SKILLS,
  MOCK_STUDENTS,
  WEEKLY_ACTIVITY,
  type StudentRow,
} from "@/lib/teacher-data";

const STATUS_STYLE: Record<StudentRow["status"], string> = {
  "al dia": "chip-success",
  atrasado: "chip-coin",
  inactivo: "chip-danger",
};

const STATUS_LABEL: Record<StudentRow["status"], string> = {
  "al dia": "Al día",
  atrasado: "Atrasado",
  inactivo: "Inactivo",
};

const FILTERS: Array<{ value: "todos" | StudentRow["status"]; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "al dia", label: "Al día" },
  { value: "atrasado", label: "Atrasados" },
  { value: "inactivo", label: "Inactivos" },
];

const SEVERITY_STYLE = {
  alta: "chip-danger",
  media: "chip-coin",
  baja: "chip-muted",
} as const;

const MAX_ANSWERS = Math.max(...WEEKLY_ACTIVITY.map((day) => day.answers));

export function TeacherDashboard() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | StudentRow["status"]>(
    "todos"
  );

  const students = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return MOCK_STUDENTS.filter((student) => {
      const matchesQuery =
        normalized.length === 0 ||
        student.name.toLowerCase().includes(normalized);
      const matchesStatus =
        statusFilter === "todos" || student.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const skillsSorted = [...MOCK_SKILLS].sort(
    (a, b) => a.mastery - b.mastery
  );

  return (
    <div className="min-h-screen bg-cream pb-10">
      <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Link className="btn btn-secondary text-sm" href="/play">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Volver al juego</span>
              <span className="sm:hidden">Juego</span>
            </Link>
            <button
              type="button"
              className="btn btn-primary text-sm"
              aria-describedby="export-note"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Exportar CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="chip chip-success">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              Panel docente · maqueta
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {COURSE.name}
            </h1>
            <p className="mt-1 text-sm text-ink/70">
              {COURSE.teacher} · {COURSE.period} · Código del curso{" "}
              <span className="rounded-md bg-ink/5 px-1.5 py-0.5 font-mono text-xs font-bold text-ink">
                {COURSE.code}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="chip chip-muted">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {COURSE.students} estudiantes
            </span>
            <span className="chip chip-coin">
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
              {COURSE.activeToday} activos hoy
            </span>
          </div>
        </div>

        <p id="export-note" className="sr-only">
          La exportación estará disponible en el MVP; aquí es solo visual.
        </p>

        {/* KPIs */}
        <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              icon: Users,
              label: "Estudiantes activos",
              value: `${COURSE.activeToday}/${COURSE.students}`,
              hint: "Jugaron al menos un reto hoy",
            },
            {
              icon: Target,
              label: "Aciertos del curso",
              value: `${COURSE.avgAccuracy}%`,
              hint: "Promedio de los últimos 7 días",
            },
            {
              icon: Coins,
              label: "Monedas promedio",
              value: COURSE.avgCoins,
              hint: "Sin impacto en la nota",
            },
            {
              icon: ShieldAlert,
              label: "Señales de anomalía",
              value: MOCK_ANOMALIES.length,
              hint: "Para revisar, nunca sanción automática",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="card p-4">
                <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums">
                  {item.value}
                  <span className="mt-0.5 block font-body text-[11px] font-normal leading-snug text-muted">
                    {item.hint}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* Actividad semanal */}
          <section className="card p-5" aria-labelledby="activity-title">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="activity-title"
                  className="font-display text-lg font-extrabold"
                >
                  Actividad de la semana
                </h2>
                <p className="text-xs text-muted">
                  Retos enviados y aciertos por día. Datos ficticios.
                </p>
              </div>
              <span className="chip chip-success">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                +18 % vs. semana anterior
              </span>
            </div>

            <div className="mt-5 flex items-end justify-between gap-2 sm:gap-3">
              {WEEKLY_ACTIVITY.map((day) => {
                const totalHeight = (day.answers / MAX_ANSWERS) * 100;
                const correctHeight = (day.correct / MAX_ANSWERS) * 100;
                return (
                  <div
                    key={day.day}
                    className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                  >
                    <span className="font-display text-[11px] font-extrabold tabular-nums text-ink/70">
                      {day.answers}
                    </span>
                    <div
                      className="relative flex h-32 w-full max-w-[42px] items-end justify-center overflow-hidden rounded-lg bg-primary/10"
                      role="img"
                      aria-label={`${day.day}: ${day.answers} retos, ${day.correct} correctos`}
                    >
                      <div
                        className="w-full rounded-lg bg-primary/25"
                        style={{ height: `${totalHeight}%` }}
                      />
                      <div
                        className="absolute bottom-0 w-full rounded-lg bg-primary"
                        style={{ height: `${correctHeight}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-muted">
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-primary" aria-hidden="true" />
                Aciertos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-primary/25" aria-hidden="true" />
                Total de envíos
              </span>
            </div>
          </section>

          {/* Dominio por habilidad */}
          <section className="card p-5" aria-labelledby="skills-title">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2
                  id="skills-title"
                  className="font-display text-lg font-extrabold"
                >
                  Dominio por habilidad
                </h2>
                <p className="text-xs text-muted">
                  Ordenado de menor a mayor dominio del curso.
                </p>
              </div>
              <span className="chip chip-muted">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Saber 11
              </span>
            </div>

            <ul className="mt-3 space-y-3">
              {skillsSorted.map((skill) => {
                const low = skill.mastery < 55;
                return (
                  <li key={skill.code}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="min-w-0 truncate text-xs font-bold">
                        {skill.label}
                      </span>
                      <span
                        className={`font-display text-xs font-extrabold tabular-nums ${
                          low ? "text-danger" : "text-ink"
                        }`}
                      >
                        {skill.mastery}%
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="bar flex-1">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${skill.mastery}%`,
                            backgroundColor: low ? "#B42318" : "#0F7B5F",
                          }}
                        />
                      </div>
                      <span className="w-16 flex-none text-right text-[10px] font-semibold text-muted">
                        {skill.attempts} retos
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 flex items-start gap-1.5 rounded-xl bg-[#F2B70512] p-2.5 text-[11px] leading-snug text-[#6b4e00]">
              <AlertTriangle
                className="mt-0.5 h-3.5 w-3.5 flex-none"
                aria-hidden="true"
              />
              Las habilidades bajo 55 % se sugieren para la próxima clase de
              refuerzo. El docente decide; la plataforma no asigna notas.
            </p>
          </section>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          {/* Distribución por barrio */}
          <section className="card p-5" aria-labelledby="barrios-title">
            <h2 id="barrios-title" className="font-display text-lg font-extrabold">
              Dónde está el curso
            </h2>
            <p className="text-xs text-muted">
              Estudiantes por barrio del tablero.
            </p>
            <ul className="mt-4 space-y-3">
              {BARRIO_DISTRIBUTION.map((barrio) => (
                <li key={barrio.name}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-xs font-bold">
                      <span
                        className="h-2.5 w-2.5 flex-none rounded-full"
                        style={{ backgroundColor: barrio.color }}
                        aria-hidden="true"
                      />
                      {barrio.name}
                    </span>
                    <span className="font-display text-xs font-extrabold tabular-nums">
                      {barrio.value}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/[0.07]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${
                          (barrio.value / Math.max(1, COURSE.students)) * 100
                        }%`,
                        backgroundColor: barrio.color,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-muted">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              El barrio se desbloquea al superar el punto de control anterior.
            </p>
          </section>

          {/* Anomalías */}
          <section className="card p-5" aria-labelledby="anomalies-title">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2
                  id="anomalies-title"
                  className="font-display text-lg font-extrabold"
                >
                  Señales para revisar
                </h2>
                <p className="text-xs text-muted">
                  Detectan patrones, no prueban trampa. El docente decide.
                </p>
              </div>
              <span className="chip chip-muted">Anti-trampa</span>
            </div>

            <ul className="mt-3 divide-y divide-line">
              {MOCK_ANOMALIES.map((anomaly) => (
                <li key={anomaly.id} className="flex gap-3 py-3 first:pt-1">
                  <span className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-xl bg-[#B4231812] text-danger">
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold">{anomaly.student}</p>
                      <span className={`chip ${SEVERITY_STYLE[anomaly.severity]}`}>
                        {anomaly.severity}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {anomaly.time}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-semibold text-ink/80">
                      {anomaly.signal}
                    </p>
                    <p className="text-[11px] leading-snug text-muted">
                      {anomaly.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Tabla de estudiantes */}
        <section className="card mt-5 overflow-hidden" aria-labelledby="students-title">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
            <div>
              <h2
                id="students-title"
                className="font-display text-lg font-extrabold"
              >
                Estudiantes del curso
              </h2>
              <p className="text-xs text-muted">
                {students.length} de {MOCK_STUDENTS.length} visibles con los
                filtros actuales.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative">
                <span className="sr-only">Buscar estudiante por nombre</span>
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar estudiante"
                  className="w-48 rounded-xl border border-line bg-white py-2 pl-8 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 sm:w-56"
                />
              </label>
              <div
                className="flex items-center gap-1 rounded-xl border border-line bg-white p-1"
                role="group"
                aria-label="Filtrar por estado"
              >
                {FILTERS.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setStatusFilter(filter.value)}
                      aria-pressed={statusFilter === filter.value}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        statusFilter === filter.value
                          ? "bg-primary text-white"
                          : "text-ink/70 hover:bg-ink/5"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <caption className="sr-only">
                Progreso de los estudiantes del curso, con barrio, posición,
                monedas, aciertos y última actividad.
              </caption>
              <thead>
                <tr className="border-b border-line bg-ink/[0.02] text-[11px] uppercase tracking-wide text-muted">
                  <th scope="col" className="px-4 py-2.5 font-bold sm:px-5">
                    Estudiante
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-bold">
                    Barrio / casilla
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-bold">
                    Aciertos
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-bold">
                    Monedas
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-bold">
                    Racha
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-bold">
                    Última actividad
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-right font-bold sm:px-5">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-line/70 text-sm last:border-0 hover:bg-white/60"
                  >
                    <th scope="row" className="px-4 py-2.5 text-left font-normal sm:px-5">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-ink text-[11px] font-extrabold text-white">
                          {student.avatar}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold">
                            {student.name}
                          </p>
                          <p className="text-[10px] text-muted">{student.grade}</p>
                          {student.flags.length > 0 && (
                            <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-danger">
                              <AlertTriangle
                                className="h-3 w-3 flex-none"
                                aria-hidden="true"
                              />
                              {student.flags[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    </th>
                    <td className="px-3 py-2.5">
                      <p className="text-xs font-semibold">{student.barrio}</p>
                      <p className="text-[10px] text-muted">
                        Casilla {student.position + 1} de 10
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-8 font-display text-xs font-extrabold tabular-nums">
                          {student.accuracy}%
                        </span>
                        <div className="bar w-16">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${student.accuracy}%`,
                              backgroundColor:
                                student.accuracy < 55 ? "#B42318" : "#0F7B5F",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums">
                        <Coins
                          className="h-3.5 w-3.5 text-[#b8860b]"
                          aria-hidden="true"
                        />
                        {student.coins}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums">
                        <Flame
                          className="h-3.5 w-3.5 text-[#C2410C]"
                          aria-hidden="true"
                        />
                        {student.streak}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted">
                      {student.lastActive}
                    </td>
                    <td className="px-4 py-2.5 text-right sm:px-5">
                      <span className={`chip ${STATUS_STYLE[student.status]}`}>
                        {student.status === "al dia" ? (
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <Clock className="h-3 w-3" aria-hidden="true" />
                        )}
                        {STATUS_LABEL[student.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center">
                      <p className="font-display text-sm font-extrabold">
                        No hay estudiantes con esos filtros.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          setStatusFilter("todos");
                        }}
                        className="btn btn-secondary mt-3 text-xs"
                      >
                        Limpiar filtros
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-5 rounded-2xl border border-[#F2B70555] bg-[#F2B70510] p-4 text-xs leading-relaxed text-[#6b4e00]">
          <strong className="font-display">Maqueta.</strong> Todos los nombres,
          métricas y señales son ficticios. En el MVP el docente verá datos
          reales de PostgreSQL, con autorización por curso y sin exponer
          respuestas de retos abiertos. Las anomalías se muestran como apoyo a
          la decisión, nunca como sanción automática.
        </div>
      </main>
    </div>
  );
}
