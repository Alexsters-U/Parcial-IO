"use client";

import {
  ArrowRight,
  Check,
  CircleCheck,
  CircleX,
  Coins,
  Flame,
  Lightbulb,
  TimerOff,
  Trophy,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { MathText } from "@/components/MathText";
import type { Barrio } from "@/lib/game-data";
import type {
  AnswerContext,
  CheckpointState,
  RoundResult,
} from "@/lib/game-state";
import type { Question } from "@/lib/questions";

export function ResultModal({
  question,
  result,
  context,
  checkpoint,
  barrio,
  onContinue,
}: {
  question: Question;
  result: RoundResult;
  context: AnswerContext;
  checkpoint: CheckpointState | null;
  barrio: Barrio;
  onContinue: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => buttonRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, []);

  const isLastCheckpoint =
    context === "checkpoint" && checkpoint !== null && checkpoint.step >= 2;

  const title = result.correct
    ? "¡Correcto!"
    : result.timedOut
      ? "Tiempo agotado"
      : "Incorrecto";

  let subtitle = "";
  if (context === "tile") {
    subtitle = result.correct
      ? "Conservas tu casilla y sumas monedas."
      : `Serás devuelto a la casilla ${result.from + 1}, el inicio de este turno.`;
  } else if (context === "checkpoint") {
    subtitle = result.correct
      ? `Acierto para el punto de control: ${checkpoint?.correct ?? 0} de 3.`
      : "Este reto no suma. El punto de control continúa: necesitas 2 de 3.";
  } else {
    subtitle = result.correct
      ? "¡Doble o nada! Ganas 50 monedas."
      : "No ganas la apuesta, pero conservas tu casilla.";
  }

  let buttonLabel = "Continuar";
  if (context === "checkpoint") {
    buttonLabel = isLastCheckpoint
      ? "Ver resultado del punto de control"
      : "Siguiente reto";
  } else if (context === "tile" && !result.correct) {
    buttonLabel = `Entendido, volver a la casilla ${result.from + 1}`;
  }

  const tone = result.correct ? "success" : "danger";
  const toneColor = result.correct ? "var(--color-success)" : "var(--color-danger)";

  return (
    <div className="overlay">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        aria-describedby="result-subtitle"
        className="modal-card"
      >
        <p className="sr-only" aria-live="assertive">
          {title}. {subtitle}
        </p>

        <div className="px-4 py-6 sm:px-7">
          <div className="flex items-start gap-4">
            <span
              className="grid h-14 w-14 flex-none place-items-center rounded-2xl"
              style={{
                backgroundColor: `${tone === "success" ? "#067647" : "#B42318"}14`,
                color: toneColor,
              }}
            >
              {result.correct ? (
                <CircleCheck className="h-8 w-8" aria-hidden="true" />
              ) : result.timedOut ? (
                <TimerOff className="h-8 w-8" aria-hidden="true" />
              ) : (
                <CircleX className="h-8 w-8" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="result-title"
                  className="font-display text-2xl font-extrabold leading-tight"
                  style={{ color: toneColor }}
                >
                  {title}
                </h2>
                <span
                  className="chip"
                  style={{
                    backgroundColor: `${barrio.color}14`,
                    color: barrio.color,
                    borderColor: `${barrio.color}33`,
                  }}
                >
                  {barrio.shortName}
                </span>
              </div>
              <p id="result-subtitle" className="mt-1 text-sm text-ink/70">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {result.coins > 0 && (
              <span className="chip chip-coin">
                <Coins className="h-3.5 w-3.5" aria-hidden="true" />+
                {result.coins} monedas
              </span>
            )}
            {result.correct && (
              <span className="chip chip-success">
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                Racha {result.streak}
              </span>
            )}
            {result.property && (
              <span className="chip chip-success">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Propiedad adquirida
              </span>
            )}
            {result.timedOut && (
              <span className="chip chip-danger">
                <TimerOff className="h-3.5 w-3.5" aria-hidden="true" />
                Sin tiempo
              </span>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">
              Respuesta correcta
            </p>
            <p className="mt-1 font-display text-lg font-extrabold text-primary">
              <MathText text={question.correctLabel} />
            </p>
            {!result.correct && (
              <p className="mt-1 text-xs text-muted">
                Tu respuesta: <MathText text={result.answerLabel} />
              </p>
            )}
          </div>

          <div className="mt-3 rounded-2xl border border-[#F2B70555] bg-[#F2B70512] p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#6b4e00]">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
              Por qué
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink/80">
              <MathText text={question.explanation} />
            </p>
          </div>

          <div className="mt-5 flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">
              {context === "checkpoint"
                ? "Los 3 retos se emiten uno por uno, igual que en el MVP."
                : "La explicación aparece solo cuando el reto está cerrado."}
            </p>
            <button
              ref={buttonRef}
              type="button"
              onClick={onContinue}
              className="btn btn-primary px-6 py-3"
            >
              {buttonLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function CheckpointEndModal({
  passed,
  barrio,
  nextBarrioName,
  onContinue,
}: {
  passed: boolean;
  barrio: Barrio;
  nextBarrioName: string | null;
  onContinue: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => buttonRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="overlay">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkpoint-title"
        className="modal-card"
      >
        <div className="px-4 py-8 text-center sm:px-8">
          <span
            className="mx-auto grid h-16 w-16 place-items-center rounded-3xl"
            style={{
              backgroundColor: passed ? "#06764714" : "#B4231814",
              color: passed ? "var(--color-success)" : "var(--color-danger)",
            }}
          >
            {passed ? (
              <Trophy className="h-9 w-9" aria-hidden="true" />
            ) : (
              <CircleX className="h-9 w-9" aria-hidden="true" />
            )}
          </span>
          <h2
            id="checkpoint-title"
            className="mt-4 font-display text-2xl font-extrabold"
          >
            {passed ? "¡Punto de control superado!" : "Punto de control no superado"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
            {passed
              ? `Apruebas ${barrio.name} con 2 de 3 aciertos. Ganas 50 monedas y desbloqueas ${
                  nextBarrioName ?? "el final de la ciudad"
                }.`
              : `Vuelves a la entrada de ${barrio.name}. En el MVP, el próximo reto sería de tu habilidad más débil para ayudarte a recuperarte.`}
          </p>

          {passed && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="chip chip-coin">
                <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                +50 monedas
              </span>
              <span className="chip chip-success">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                Insignia del barrio
              </span>
            </div>
          )}

          <button
            ref={buttonRef}
            type="button"
            onClick={onContinue}
            className="btn btn-primary mt-6 w-full px-6 py-3 sm:w-auto"
          >
            {passed
              ? nextBarrioName
                ? `Entrar a ${nextBarrioName}`
                : "Ver mi resultado final"
              : "Reintentar el barrio"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
