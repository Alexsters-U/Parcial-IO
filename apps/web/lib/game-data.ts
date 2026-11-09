// Datos ficticios de la MAQUETA. En el MVP esta información vendrá de PostgreSQL.
// La composición de cada barrio sigue la documentación:
// [Entrada] → R → R → Banco → R → R → Evento → R → R → [Punto de control]

export type TileType = "entry" | "challenge" | "bank" | "event" | "checkpoint";

export interface Barrio {
  id: string;
  name: string;
  shortName: string;
  temario: string;
  grade: string;
  difficulty: string;
  color: string;
  iconKey: "building" | "curve" | "triangle" | "grid" | "dice" | "tangent";
  skills: string[];
}

export interface Tile {
  index: number;
  type: TileType;
}

export const BARRIOS: Barrio[] = [
  {
    id: "centro-financiero",
    name: "Centro Financiero",
    shortName: "Centro",
    temario: "Números reales, intervalos, porcentajes, interés simple y compuesto",
    grade: "10.°",
    difficulty: "Fácil",
    color: "#0F7B5F",
    iconKey: "building",
    skills: ["FIN-ICO", "FIN-POR", "REA-INT"],
  },
  {
    id: "avenida-funciones",
    name: "Avenida de las Funciones",
    shortName: "Funciones",
    temario: "Lineales, cuadráticas y exponenciales; pendiente, vértice y crecimiento",
    grade: "10.°–11.°",
    difficulty: "Fácil–media",
    color: "#2563EB",
    iconKey: "curve",
    skills: ["FUN-LIN", "FUN-CUA", "FUN-EXP"],
  },
  {
    id: "barrio-trigonometrico",
    name: "Barrio Trigonométrico",
    shortName: "Trigonometría",
    temario: "Razones trigonométricas, ley de senos, periodo e identidades",
    grade: "10.°",
    difficulty: "Media",
    color: "#7C3AED",
    iconKey: "triangle",
    skills: ["TRI-RAZ", "TRI-LSC", "TRI-PER", "TRI-IDE"],
  },
  {
    id: "plaza-cartesiana",
    name: "Plaza Cartesiana",
    shortName: "Cartesiana",
    temario: "Distancia, punto medio, cónicas, transformaciones y polares",
    grade: "10.°–11.°",
    difficulty: "Media",
    color: "#C2410C",
    iconKey: "grid",
    skills: ["GEO-DIS", "GEO-REC", "GEO-CON", "GEO-POL"],
  },
  {
    id: "mercado-azar",
    name: "Mercado del Azar",
    shortName: "Azar",
    temario: "Tendencia central, conteo, probabilidad y probabilidad condicional",
    grade: "10.°–11.°",
    difficulty: "Media–difícil",
    color: "#BE185D",
    iconKey: "dice",
    skills: ["EST-TEN", "PRO-BAS", "EST-CNT", "PRO-CON"],
  },
  {
    id: "torre-calculo",
    name: "Torre del Cálculo",
    shortName: "Cálculo",
    temario: "Sucesiones, límites y derivada como razón de cambio",
    grade: "11.°",
    difficulty: "Difícil",
    color: "#0E7490",
    iconKey: "tangent",
    skills: ["CAL-DER", "CAL-LIM", "CAL-SUC"],
  },
];

export const TILES: Tile[] = [
  { index: 0, type: "entry" },
  { index: 1, type: "challenge" },
  { index: 2, type: "challenge" },
  { index: 3, type: "bank" },
  { index: 4, type: "challenge" },
  { index: 5, type: "challenge" },
  { index: 6, type: "event" },
  { index: 7, type: "challenge" },
  { index: 8, type: "challenge" },
  { index: 9, type: "checkpoint" },
];

export const TILE_LABEL: Record<TileType, string> = {
  entry: "Entrada del barrio",
  challenge: "Reto",
  bank: "Banco",
  event: "Evento",
  checkpoint: "Punto de control",
};

export const TILE_DESCRIPTION: Record<TileType, string> = {
  entry: "Aquí empiezas cada vez que llegas al barrio.",
  challenge: "Resuelve un reto del temario. Si aciertas, conservas la casilla.",
  bank: "Bonificación de 25 monedas o reto de doble o nada.",
  event: "Tarjeta sorteada: subsidio, inflación o auditoría.",
  checkpoint: "3 retos, aprueba 2 y pasas al siguiente barrio.",
};

export const SKILL_LABEL: Record<string, string> = {
  "FIN-ICO": "Interés compuesto",
  "FIN-POR": "Porcentajes y descuentos",
  "REA-INT": "Intervalos y desigualdades",
  "FUN-LIN": "Función lineal y pendiente",
  "FUN-CUA": "Función cuadrática y vértice",
  "FUN-EXP": "Crecimiento exponencial",
  "TRI-RAZ": "Razones trigonométricas",
  "TRI-LSC": "Ley de senos",
  "TRI-PER": "Periodo de funciones",
  "TRI-IDE": "Identidades trigonométricas",
  "GEO-DIS": "Distancia entre puntos",
  "GEO-REC": "Punto medio y recta",
  "GEO-CON": "Cónicas",
  "GEO-POL": "Coordenadas polares",
  "EST-TEN": "Tendencia central",
  "PRO-BAS": "Probabilidad clásica",
  "EST-CNT": "Conteo y combinaciones",
  "PRO-CON": "Probabilidad condicional",
  "CAL-DER": "Derivada en un punto",
  "CAL-LIM": "Límites",
  "CAL-SUC": "Sucesiones aritméticas",
};

export interface EventCard {
  id: string;
  title: string;
  description: string;
  tone: "good" | "bad" | "neutral";
  coins?: number;
  streakReset?: boolean;
}

export const EVENTS: EventCard[] = [
  {
    id: "subsidio",
    title: "Subsidio de transporte",
    description:
      "El municipio entrega un bono para movilizarse por la ciudad. Ganas 15 monedas.",
    tone: "good",
    coins: 15,
  },
  {
    id: "inflacion",
    title: "Inflación en el mercado",
    description:
      "Los precios subieron este mes. Pierdes 10 monedas, pero nunca quedas en negativo.",
    tone: "bad",
    coins: -10,
  },
  {
    id: "auditoria",
    title: "Auditoría sorpresa",
    description:
      "Revisan tus cuentas y encuentras un error en el registro. Pierdes la racha actual.",
    tone: "bad",
    streakReset: true,
  },
  {
    id: "feria",
    title: "Feria del barrio",
    description:
      "Vendiste tus productos en la feria del barrio. Ganas 25 monedas.",
    tone: "good",
    coins: 25,
  },
];

export function barrioAt(index: number): Barrio {
  return BARRIOS[Math.min(Math.max(index, 0), BARRIOS.length - 1)];
}

export function nextBarrio(index: number): Barrio | null {
  return index + 1 < BARRIOS.length ? BARRIOS[index + 1] : null;
}
