import type { EventCard, TileType } from "./game-data";
import type { Question } from "./questions";

export type Phase =
  | "awaiting_roll"
  | "rolling"
  | "challenge"
  | "result"
  | "bank"
  | "event"
  | "checkpoint_end"
  | "finished";

export type AnswerContext = "tile" | "checkpoint" | "bank";

export interface CheckpointState {
  step: number;
  correct: number;
  questions: Question[];
  passed?: boolean;
}

export interface RoundResult {
  correct: boolean;
  timedOut: boolean;
  question: Question;
  answerLabel: string;
  coins: number;
  streak: number;
  property: boolean;
  from: number;
  to: number;
}

export interface GameState {
  barrioIndex: number;
  position: number;
  turnStart: number;
  turns: number;
  coins: number;
  streak: number;
  bestStreak: number;
  properties: number[];
  completedBarrios: number;
  phase: Phase;
  dice: number | null;
  question: Question | null;
  answerContext: AnswerContext | null;
  result: RoundResult | null;
  checkpoint: CheckpointState | null;
  event: EventCard | null;
  lastRoll: { from: number; to: number } | null;
  toast: string | null;
  recentTemplates: string[];
  totalAnswers: number;
  totalCorrect: number;
}

export const DEMO_STUDENT = {
  name: "Laura M.",
  grade: "10.°B",
  avatar: "LM",
};

export function initialGameState(): GameState {
  return {
    barrioIndex: 0,
    position: 0,
    turnStart: 0,
    turns: 0,
    coins: 0,
    streak: 0,
    bestStreak: 0,
    properties: [],
    completedBarrios: 0,
    phase: "awaiting_roll",
    dice: null,
    question: null,
    answerContext: null,
    result: null,
    checkpoint: null,
    event: null,
    lastRoll: null,
    toast: null,
    recentTemplates: [],
    totalAnswers: 0,
    totalCorrect: 0,
  };
}

export const CHALLENGE_TILE_COUNT = 7;

export const PHASE_HINT: Record<Phase, string> = {
  awaiting_roll: "El dado va de 1 a 4. En el MVP lo genera el servidor.",
  rolling: "Lanzando el dado...",
  challenge: "Resuelve el reto para continuar el turno.",
  result: "Revisa la explicación antes de continuar.",
  bank: "Decide si cobras la bonificación o arriesgas el doble o nada.",
  event: "Lee la tarjeta del evento y continúa.",
  checkpoint_end: "El punto de control decide si pasas de barrio.",
  finished: "¡Completaste la ciudad!",
};

export function tileColor(type: TileType): string {
  switch (type) {
    case "bank":
      return "#F2B705";
    case "event":
      return "#BE185D";
    case "checkpoint":
      return "#0E7490";
    default:
      return "#0F7B5F";
  }
}
