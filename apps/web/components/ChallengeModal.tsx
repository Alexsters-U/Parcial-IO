"use client";

import { Send, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MathText } from "@/components/MathText";
import type { Barrio } from "@/lib/game-data";
import { SKILL_LABEL } from "@/lib/game-data";
import type { AnswerContext, CheckpointState } from "@/lib/game-state";
import type { Question } from "@/lib/questions";

const LETTERS = ["A", "B", "C", "D"];
const DIFFICULTY_LABEL: Record<number, string> = {
  1: "Fácil",
  2: "Media",
  3: "Difícil",
};

export function ChallengeModal({
  question,
  barrio,
  context,
  checkpoint,
  onAnswer,
}: {
  question: Question;
  barrio: Barrio;
  context: AnswerContext;
  checkpoint: CheckpointState | null;
  onAnswer: (raw: string | null, timedOut: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.ceil((question.expiresAt - Date.now()) / 1000))
  );
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const answeredRef = useRef(false);
  const announcedRef = useRef<Set<number>>(new Set());
  const firstControlRef = useRef<HTMLInputElement | null>(null);
  const onAnswerRef = useRef(onAnswer);

  useEffect(() => {
    onAnswerRef.current = onAnswer;
  }, [onAnswer]);

  useEffect(() => {
    const update = () => {
      const next = Math.max(
        0,
        Math.ceil((question.expiresAt - Date.now()) / 1000)
      );
      setRemaining(next);
      if (
        (next === 30 || next === 10) &&
        !announcedRef.current.has(next)
      ) {
        announcedRef.current.add(next);
        setAnnouncement(`Quedan ${next} segundos`);
      }
      if (next <= 0 && !answeredRef.current) {
        answeredRef.current = true;
        onAnswerRef.current(null, true);
      }
    };

    update();
    const timer = window.setInterval(update, 500);
    const focusTimer = window.setTimeout(
      () => firstControlRef.current?.focus(),
      120
    );

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(focusTimer);
    };
  }, [question.id, question.expiresAt]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeLabel = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const percent = Math.max(
    0,
    Math.min(100, (remaining / question.timeLimitSec) * 100)
  );
  const critical = remaining <= 15;

  const canSubmit =
    question.answerType === "single_choice"
      ? selected !== null
      : text.trim().length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || answeredRef.current) return;
    answeredRef.current = true;
    onAnswer(question.answerType === "single_choice" ? selected : text, false);
  }

  const skill = SKILL_LABEL[question.skill] ?? question.skill;

  return (
    <div className="overlay">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-title"
        aria-describedby="challenge-stem"
        className="modal-card"
        style={{ "--barrio": barrio.color } as React.CSSProperties}
      >
        <header className="sticky top-0 z-10 border-b border-line bg-paper/95 px-4 pb-3 pt-4 backdrop-blur sm:px-6">
          <h2 id="challenge-title" className="sr-only">
            Reto de {skill}
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="chip text-white"
                style={{ backgroundColor: barrio.color }}
              >
                {barrio.shortName}
              </span>
              <span className="chip chip-muted">{skill}</span>
              <span className="chip chip-muted">
                Dificultad {DIFFICULTY_LABEL[question.difficulty].toLowerCase()}
              </span>
            </div>
            <div
              className={`flex items-center gap-1.5 font-display text-sm font-extrabold tabular-nums ${
                critical ? "text-danger" : "text-ink"
              }`}
              role="timer"
              aria-label={`Tiempo restante ${timeLabel}`}
            >
              <Timer className="h-4 w-4" aria-hidden="true" />
              {timeLabel}
            </div>
          </div>
          <div className="bar mt-2.5">
            <div
              className="bar-fill"
              style={{
                width: `${percent}%`,
                backgroundColor: critical ? "var(--color-danger)" : barrio.color,
              }}
            />
          </div>
          {context === "checkpoint" && checkpoint && (
            <p className="mt-2 text-xs font-bold text-ink/70">
              Punto de control · reto {checkpoint.step + 1} de 3 ·{" "}
              <span className="text-primary">
                {checkpoint.correct} acierto
                {checkpoint.correct === 1 ? "" : "s"}
              </span>{" "}
              (necesitas 2)
            </p>
          )}
          {context === "bank" && (
            <p className="mt-2 text-xs font-bold text-[#6b4e00]">
              Banco · doble o nada: si aciertas ganas 50 monedas; si fallas, no
              pierdes la casilla.
            </p>
          )}
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-6">
          <div className="rounded-2xl border border-line bg-white/70 p-4">
            <p
              id="challenge-stem"
              className="text-[1.05rem] font-semibold leading-relaxed text-ink sm:text-lg"
            >
              <MathText text={question.stem} />
            </p>
            {question.hint && (
              <p className="mt-2 text-sm text-muted">{question.hint}</p>
            )}
          </div>

          <div className="mt-5">
            {question.answerType === "single_choice" && question.options && (
              <fieldset>
                <legend className="mb-2 text-sm font-bold">
                  Elige una respuesta
                </legend>
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <label
                      key={option.id}
                      className={`option ${
                        selected === option.id ? "option-selected" : ""
                      }`}
                    >
                      <input
                        ref={index === 0 ? firstControlRef : undefined}
                        type="radio"
                        name="answer"
                        value={option.id}
                        checked={selected === option.id}
                        onChange={() => setSelected(option.id)}
                        className="sr-only"
                      />
                      <span className="option-letter" aria-hidden="true">
                        {LETTERS[index]}
                      </span>
                      <span className="min-w-0 flex-1 text-[0.95rem]">
                        <MathText text={option.label} />
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {question.answerType === "numeric" && (
              <div>
                <label
                  htmlFor="numeric-answer"
                  className="mb-1.5 block text-sm font-bold"
                >
                  Tu respuesta
                </label>
                <input
                  ref={firstControlRef}
                  id="numeric-answer"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Ej. 1199842 o 1.199.842"
                  className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 font-display text-xl font-extrabold tabular-nums outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                  aria-describedby="numeric-help"
                />
                <p id="numeric-help" className="mt-1.5 text-xs text-muted">
                  Usa coma o punto para los decimales. En Colombia la coma es el
                  separador decimal.
                </p>
              </div>
            )}

            {question.answerType === "fraction" && (
              <div>
                <label
                  htmlFor="fraction-answer"
                  className="mb-1.5 block text-sm font-bold"
                >
                  Tu respuesta
                </label>
                <input
                  ref={firstControlRef}
                  id="fraction-answer"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Ej. 3/8 o 0,375"
                  className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 font-display text-xl font-extrabold tabular-nums outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                  aria-describedby="fraction-help"
                />
                <p id="fraction-help" className="mt-1.5 text-xs text-muted">
                  Escribe la fracción irreducible (3/8) o su valor decimal
                  (0,375). Las dos formas son válidas.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">
              Solo tienes un intento. El temporizador corre con la hora del
              servidor en el MVP; aquí se simula.
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary px-6 py-3"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Responder
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
