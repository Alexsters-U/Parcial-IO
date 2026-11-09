"use client";

import {
  BookOpen,
  Building2,
  Coins,
  Dices,
  Flame,
  GraduationCap,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BankModal } from "@/components/BankModal";
import { BarrioBoard } from "@/components/BarrioBoard";
import { ChallengeModal } from "@/components/ChallengeModal";
import { CityMap } from "@/components/CityMap";
import { EventModal } from "@/components/EventModal";
import { FinishedScreen } from "@/components/FinishedScreen";
import { Logo } from "@/components/Logo";
import { PlayerCard } from "@/components/PlayerCard";
import { CheckpointEndModal, ResultModal } from "@/components/ResultModal";
import { DiceFace } from "@/components/art/DiceFace";
import {
  BARRIOS,
  EVENTS,
  TILES,
  barrioAt,
  nextBarrio,
} from "@/lib/game-data";
import {
  CHALLENGE_TILE_COUNT,
  DEMO_STUDENT,
  PHASE_HINT,
  initialGameState,
  type GameState,
  type RoundResult,
} from "@/lib/game-state";
import {
  checkAnswer,
  describeAnswer,
  generateCheckpointQuestions,
  generateQuestion,
} from "@/lib/questions";

const STORAGE_KEY = "materico-demo-v1";

export function GameClient() {
  const [game, setGame] = useState<GameState>(initialGameState);
  const [hydrated, setHydrated] = useState(false);
  const rollingRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GameState;
        if (parsed && typeof parsed.barrioIndex === "number" && parsed.phase) {
          if (parsed.phase === "rolling") parsed.phase = "awaiting_roll";
          if (parsed.phase === "challenge" && !parsed.question) {
            parsed.phase = "awaiting_roll";
          }
          if (parsed.phase === "result" && !parsed.result) {
            parsed.phase = "awaiting_roll";
          }
          if (parsed.phase === "event" && !parsed.event) {
            parsed.phase = "awaiting_roll";
          }
          // La hidratación desde localStorage ocurre una sola vez al montar.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setGame(parsed);
        }
      }
    } catch {
      // Si el almacenamiento local está corrupto, se ignora y arranca limpio.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    } catch {
      // La maqueta funciona aunque el navegador bloquee el almacenamiento.
    }
  }, [game, hydrated]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearInterval(timer));
    };
  }, []);

  useEffect(() => {
    if (!game.toast) return;
    const timer = window.setTimeout(
      () => setGame((current) => ({ ...current, toast: null })),
      3600
    );
    return () => window.clearTimeout(timer);
  }, [game.toast]);

  const resolveRoll = useCallback((value: number) => {
    setGame((current) => {
      const barrio = BARRIOS[current.barrioIndex];
      const from = current.position;
      const to = Math.min(from + value, TILES.length - 1);
      const tile = TILES[to];
      const base: GameState = {
        ...current,
        dice: value,
        position: to,
        lastRoll: { from, to },
        phase: "awaiting_roll",
      };

      if (tile.type === "challenge") {
        const question = generateQuestion(barrio, current.recentTemplates);
        return {
          ...base,
          phase: "challenge",
          question,
          answerContext: "tile",
        };
      }

      if (tile.type === "checkpoint") {
        const questions = generateCheckpointQuestions(barrio);
        return {
          ...base,
          phase: "challenge",
          question: questions[0],
          answerContext: "checkpoint",
          checkpoint: { step: 0, correct: 0, questions },
        };
      }

      if (tile.type === "bank") {
        return { ...base, phase: "bank" };
      }

      if (tile.type === "event") {
        const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        return { ...base, phase: "event", event };
      }

      return base;
    });
    rollingRef.current = false;
  }, []);

  function rollDice() {
    if (game.phase !== "awaiting_roll" || rollingRef.current) return;
    rollingRef.current = true;
    setGame((current) => ({
      ...current,
      phase: "rolling",
      turnStart: current.position,
      lastRoll: null,
      toast: null,
      turns: current.turns + 1,
    }));

    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks += 1;
      setGame((current) => ({
        ...current,
        dice: 1 + Math.floor(Math.random() * 4),
      }));
      if (ticks >= 8) {
        window.clearInterval(timer);
        timersRef.current = timersRef.current.filter((item) => item !== timer);
        resolveRoll(1 + Math.floor(Math.random() * 4));
      }
    }, 70);
    timersRef.current.push(timer);
  }

  const submitAnswer = useCallback(
    (raw: string | null, timedOut: boolean) => {
      setGame((current) => {
        if (current.phase !== "challenge" || !current.question) return current;
        const question = current.question;
        const correct = !timedOut && checkAnswer(question, raw);
        const isCheckpoint = current.answerContext === "checkpoint";
        const isBank = current.answerContext === "bank";
        const baseCoins =
          question.difficulty === 1 ? 10 : question.difficulty === 2 ? 20 : 35;
        const multiplier = 1 + 0.1 * Math.min(current.streak, 5);
        const reward = correct
          ? isBank
            ? 50
            : Math.round(baseCoins * multiplier)
          : 0;
        const streak = correct ? current.streak + 1 : 0;
        const property = correct && current.answerContext === "tile";
        const checkpoint =
          isCheckpoint && current.checkpoint
            ? {
                ...current.checkpoint,
                correct: current.checkpoint.correct + (correct ? 1 : 0),
              }
            : current.checkpoint;

        const result: RoundResult = {
          correct,
          timedOut,
          question,
          answerLabel: timedOut
            ? "Se agotó el tiempo"
            : describeAnswer(question, raw),
          coins: reward,
          streak,
          property,
          from: current.turnStart,
          to: current.position,
        };

        return {
          ...current,
          phase: "result",
          coins: current.coins + reward,
          streak,
          bestStreak: Math.max(current.bestStreak, streak),
          properties:
            property && !current.properties.includes(current.position)
              ? [...current.properties, current.position]
              : current.properties,
          result,
          checkpoint,
          recentTemplates: [
            ...current.recentTemplates,
            question.templateId,
          ].slice(-8),
          totalAnswers: current.totalAnswers + 1,
          totalCorrect: current.totalCorrect + (correct ? 1 : 0),
        };
      });
    },
    []
  );

  const continueResult = useCallback(() => {
    setGame((current) => {
      if (current.phase !== "result" || !current.result) return current;
      const result = current.result;

      if (current.answerContext === "checkpoint") {
        const checkpoint = current.checkpoint;
        if (!checkpoint) return current;
        if (checkpoint.step < 2) {
          const nextStep = checkpoint.step + 1;
          const planned = checkpoint.questions[nextStep];
          const question = generateQuestion(
            BARRIOS[current.barrioIndex],
            current.recentTemplates,
            planned.skill
          );
          return {
            ...current,
            phase: "challenge",
            question,
            result: null,
            checkpoint: {
              ...checkpoint,
              step: nextStep,
              questions: checkpoint.questions.map((item, index) =>
                index === nextStep ? question : item
              ),
            },
            answerContext: "checkpoint",
          };
        }
        const passed = checkpoint.correct >= 2;
        return {
          ...current,
          phase: "checkpoint_end",
          result: null,
          question: null,
          answerContext: null,
          checkpoint: { ...checkpoint, passed },
          coins: current.coins + (passed ? 50 : 0),
          completedBarrios: passed
            ? Math.max(current.completedBarrios, current.barrioIndex + 1)
            : current.completedBarrios,
        };
      }

      if (current.answerContext === "bank") {
        return {
          ...current,
          phase: "awaiting_roll",
          question: null,
          result: null,
          answerContext: null,
          toast: result.correct
            ? "+50 monedas del banco"
            : "Conservas tu casilla",
        };
      }

      if (current.answerContext === "tile") {
        if (!result.correct) {
          const back = Math.max(current.turnStart, 0);
          return {
            ...current,
            phase: "awaiting_roll",
            position: back,
            question: null,
            result: null,
            answerContext: null,
            toast: `Vuelves a la casilla ${back + 1}`,
          };
        }
        return {
          ...current,
          phase: "awaiting_roll",
          question: null,
          result: null,
          answerContext: null,
          toast: `+${result.coins} monedas`,
        };
      }

      return {
        ...current,
        phase: "awaiting_roll",
        question: null,
        result: null,
        answerContext: null,
      };
    });
  }, []);

  const continueCheckpointEnd = useCallback(() => {
    setGame((current) => {
      if (current.phase !== "checkpoint_end" || !current.checkpoint) {
        return current;
      }
      if (current.checkpoint.passed) {
        const nextIndex = current.barrioIndex + 1;
        if (nextIndex >= BARRIOS.length) {
          return {
            ...current,
            phase: "finished",
            completedBarrios: BARRIOS.length,
            checkpoint: null,
            question: null,
            result: null,
            answerContext: null,
          };
        }
        return {
          ...current,
          phase: "awaiting_roll",
          barrioIndex: nextIndex,
          position: 0,
          turnStart: 0,
          properties: [],
          checkpoint: null,
          question: null,
          result: null,
          answerContext: null,
          dice: null,
          lastRoll: null,
          recentTemplates: [],
          toast: `¡Bienvenido a ${BARRIOS[nextIndex].name}!`,
        };
      }
      return {
        ...current,
        phase: "awaiting_roll",
        position: 0,
        turnStart: 0,
        streak: 0,
        checkpoint: null,
        question: null,
        result: null,
        answerContext: null,
        dice: null,
        lastRoll: null,
        toast: "Vuelves a la entrada del barrio",
      };
    });
  }, []);

  function collectBank() {
    setGame((current) =>
      current.phase === "bank"
        ? {
            ...current,
            phase: "awaiting_roll",
            coins: current.coins + 25,
            toast: "+25 monedas del banco",
          }
        : current
    );
  }

  function doubleBank() {
    setGame((current) => {
      if (current.phase !== "bank") return current;
      const question = generateQuestion(
        BARRIOS[current.barrioIndex],
        current.recentTemplates
      );
      return {
        ...current,
        phase: "challenge",
        question,
        answerContext: "bank",
        toast: null,
      };
    });
  }

  function continueEvent() {
    setGame((current) => {
      if (current.phase !== "event" || !current.event) return current;
      const coins = Math.max(
        0,
        current.coins + (current.event.coins ?? 0)
      );
      const streak = current.event.streakReset ? 0 : current.streak;
      const toast =
        current.event.coins && current.event.coins !== 0
          ? current.event.coins > 0
            ? `+${current.event.coins} monedas`
            : `${current.event.coins} monedas`
          : current.event.streakReset
            ? "Racha reiniciada"
            : null;
      return {
        ...current,
        phase: "awaiting_roll",
        event: null,
        coins,
        streak,
        toast,
      };
    });
  }

  function resetDemo() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Sin almacenamiento local, basta con reiniciar el estado en memoria.
    }
    rollingRef.current = false;
    timersRef.current.forEach((timer) => window.clearInterval(timer));
    timersRef.current = [];
    setGame(initialGameState());
  }

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-primary"
          role="status"
          aria-label="Cargando la maqueta"
        />
      </div>
    );
  }

  if (game.phase === "finished") {
    return (
      <FinishedScreen
        coins={game.coins}
        bestStreak={game.bestStreak}
        totalCorrect={game.totalCorrect}
        totalAnswers={game.totalAnswers}
        onReset={resetDemo}
      />
    );
  }

  const barrio = barrioAt(game.barrioIndex);
  const upcomingBarrio = nextBarrio(game.barrioIndex);
  const propertiesCount = game.properties.length;

  return (
    <div className="min-h-screen bg-cream pb-8">
      <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo compact />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="chip chip-muted hidden sm:inline-flex">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              {DEMO_STUDENT.grade} · demo
            </span>
            <button
              type="button"
              onClick={resetDemo}
              className="btn btn-ghost px-3 text-xs sm:text-sm"
              aria-label="Reiniciar la demostración"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
            <Link className="btn btn-secondary px-3 text-xs sm:text-sm" href="/teacher">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Panel docente</span>
              <span className="sm:hidden">Docente</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-6">
        <CityMap
          key={game.barrioIndex}
          barrioIndex={game.barrioIndex}
          completedBarrios={game.completedBarrios}
        />

        <div className="mt-5 grid gap-5 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="hidden space-y-4 lg:block">
            <PlayerCard
              barrio={barrio}
              coins={game.coins}
              streak={game.streak}
              properties={propertiesCount}
            />
            <HowToPlay />
            <div className="rounded-2xl border border-[#F2B70555] bg-[#F2B70510] p-3 text-xs leading-relaxed text-[#6b4e00]">
              <strong className="font-display">Maqueta.</strong> El progreso se
              guarda en este navegador. El dado y la corrección son simulados;
              en el MVP serán autoritativos del servidor.
            </div>
          </aside>

          <section className="min-w-0">
            <div className="grid grid-cols-3 gap-2 lg:hidden">
              <MobileStat icon={Coins} label="Monedas" value={game.coins} />
              <MobileStat icon={Flame} label="Racha" value={game.streak} />
              <MobileStat
                icon={Building2}
                label="Propiedades"
                value={`${propertiesCount}/${CHALLENGE_TILE_COUNT}`}
              />
            </div>

            <div className="mt-3 lg:mt-0">
              <BarrioBoard
                barrio={barrio}
                barrioIndex={game.barrioIndex}
                position={game.position}
                turnStart={game.turnStart}
                properties={game.properties}
              />
            </div>

            <div
              className="sticky bottom-3 z-20 mt-4 rounded-2xl border border-line bg-paper p-3 shadow-[0_18px_40px_-30px_rgba(31,36,48,0.6)] sm:p-4"
              aria-live="polite"
            >
              <div className="flex items-center gap-3">
                <DiceFace
                  value={game.dice}
                  rolling={game.phase === "rolling"}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-extrabold">
                    Turno {game.turns}
                  </p>
                  <p className="text-xs leading-snug text-muted">
                    {PHASE_HINT[game.phase]}
                  </p>
                  {game.phase === "awaiting_roll" && game.lastRoll && (
                    <p className="mt-0.5 text-xs font-bold text-primary">
                      Dado {game.dice}: de la casilla {game.lastRoll.from + 1} a
                      la {game.lastRoll.to + 1}.
                    </p>
                  )}
                </div>
                <span className="chip chip-muted hidden sm:inline-flex">
                  Dado 1–4
                </span>
              </div>
              <button
                type="button"
                onClick={rollDice}
                disabled={game.phase !== "awaiting_roll"}
                className="btn btn-primary mt-3 w-full py-3 text-base"
              >
                <Dices className="h-5 w-5" aria-hidden="true" />
                {game.phase === "rolling"
                  ? "Lanzando..."
                  : game.phase === "awaiting_roll"
                    ? "Lanzar dado"
                    : "Resuelve el reto para continuar"}
              </button>
              <p className="mt-2 text-center text-[11px] text-muted">
                Maqueta: el dado y la calificación se simulan en el navegador.
                En el MVP los decide el servidor.
              </p>
            </div>
          </section>
        </div>
      </main>

      {game.phase === "challenge" && game.question && (
        <ChallengeModal
          key={game.question.id}
          question={game.question}
          barrio={barrio}
          context={game.answerContext ?? "tile"}
          checkpoint={game.checkpoint}
          onAnswer={submitAnswer}
        />
      )}

      {game.phase === "result" && game.result && game.question && (
        <ResultModal
          question={game.question}
          result={game.result}
          context={game.answerContext ?? "tile"}
          checkpoint={game.checkpoint}
          barrio={barrio}
          onContinue={continueResult}
        />
      )}

      {game.phase === "bank" && (
        <BankModal
          barrio={barrio}
          onCollect={collectBank}
          onDouble={doubleBank}
        />
      )}

      {game.phase === "event" && game.event && (
        <EventModal event={game.event} onContinue={continueEvent} />
      )}

      {game.phase === "checkpoint_end" && game.checkpoint && (
        <CheckpointEndModal
          passed={Boolean(game.checkpoint.passed)}
          barrio={barrio}
          nextBarrioName={upcomingBarrio?.name ?? null}
          onContinue={continueCheckpointEnd}
        />
      )}

      {game.toast && (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 sm:bottom-6"
          role="status"
          aria-live="polite"
        >
          <div className="animate-pop rounded-full bg-ink px-4 py-2 text-sm font-bold text-white shadow-lg">
            {game.toast}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Coins;
  label: string;
  value: string | number;
}) {
  return (
    <div className="card-flat px-2 py-2 text-center">
      <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted">
        <Icon className="h-3 w-3" aria-hidden="true" />
        {label}
      </span>
      <span className="font-display text-lg font-extrabold tabular-nums">
        {value}
      </span>
    </div>
  );
}

function HowToPlay() {
  const items = [
    {
      icon: Dices,
      title: "Lanza el dado",
      body: "Avanza de 1 a 4 casillas. La ficha se detiene en el punto de control.",
    },
    {
      icon: BookOpen,
      title: "Resuelve el reto",
      body: "Acierta y conservas el avance; falla y vuelves al inicio del turno.",
    },
    {
      icon: Trophy,
      title: "Cruza el control",
      body: "3 retos, aprueba 2 y desbloqueas el siguiente barrio.",
    },
  ];

  return (
    <section className="card p-4" aria-labelledby="how-title">
      <h2
        id="how-title"
        className="flex items-center gap-1.5 font-display text-sm font-extrabold"
      >
        <HelpCircle className="h-4 w-4 text-primary" aria-hidden="true" />
        Cómo se juega
      </h2>
      <ul className="mt-2.5 space-y-2.5">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={item.title} className="flex gap-2.5">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold">
                  {index + 1}. {item.title}
                </p>
                <p className="text-[11px] leading-snug text-muted">
                  {item.body}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-ink/[0.04] p-2 text-[11px] text-ink/60">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
        Las preguntas cambian de valores y de orden en cada partida.
      </p>
    </section>
  );
}
