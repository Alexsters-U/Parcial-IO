// Datos ficticios del panel docente de la MAQUETA.
// En el MVP saldrán de PostgreSQL y de la API de reportes.

export interface StudentRow {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  barrio: string;
  position: number;
  coins: number;
  accuracy: number;
  streak: number;
  lastActive: string;
  status: "al dia" | "atrasado" | "inactivo";
  flags: string[];
}

export const MOCK_STUDENTS: StudentRow[] = [
  {
    id: "s-01",
    name: "Laura Martínez",
    avatar: "LM",
    grade: "10.°B",
    barrio: "Centro Financiero",
    position: 6,
    coins: 340,
    accuracy: 78,
    streak: 4,
    lastActive: "Hace 2 min",
    status: "al dia",
    flags: [],
  },
  {
    id: "s-02",
    name: "Santiago Rojas",
    avatar: "SR",
    grade: "10.°B",
    barrio: "Centro Financiero",
    position: 9,
    coins: 410,
    accuracy: 83,
    streak: 6,
    lastActive: "Hace 5 min",
    status: "al dia",
    flags: [],
  },
  {
    id: "s-03",
    name: "Valentina Gómez",
    avatar: "VG",
    grade: "10.°B",
    barrio: "Avenida de las Funciones",
    position: 4,
    coins: 260,
    accuracy: 61,
    streak: 1,
    lastActive: "Hace 18 min",
    status: "al dia",
    flags: [],
  },
  {
    id: "s-04",
    name: "Andrés Pérez",
    avatar: "AP",
    grade: "10.°B",
    barrio: "Centro Financiero",
    position: 2,
    coins: 90,
    accuracy: 42,
    streak: 0,
    lastActive: "Hace 1 día",
    status: "atrasado",
    flags: ["3 fallos seguidos en porcentajes"],
  },
  {
    id: "s-05",
    name: "Mariana Cárdenas",
    avatar: "MC",
    grade: "10.°B",
    barrio: "Barrio Trigonométrico",
    position: 7,
    coins: 595,
    accuracy: 88,
    streak: 9,
    lastActive: "Hace 9 min",
    status: "al dia",
    flags: [],
  },
  {
    id: "s-06",
    name: "Diego Herrera",
    avatar: "DH",
    grade: "10.°B",
    barrio: "Centro Financiero",
    position: 5,
    coins: 180,
    accuracy: 55,
    streak: 2,
    lastActive: "Hace 3 horas",
    status: "al dia",
    flags: [],
  },
  {
    id: "s-07",
    name: "Sofía Lozano",
    avatar: "SL",
    grade: "10.°B",
    barrio: "Centro Financiero",
    position: 0,
    coins: 0,
    accuracy: 0,
    streak: 0,
    lastActive: "Hace 4 días",
    status: "inactivo",
    flags: ["Sin actividad en el curso"],
  },
  {
    id: "s-08",
    name: "Juan David Castro",
    avatar: "JC",
    grade: "10.°B",
    barrio: "Avenida de las Funciones",
    position: 8,
    coins: 470,
    accuracy: 74,
    streak: 3,
    lastActive: "Hace 12 min",
    status: "al dia",
    flags: [],
  },
  {
    id: "s-09",
    name: "Camila Restrepo",
    avatar: "CR",
    grade: "10.°B",
    barrio: "Centro Financiero",
    position: 3,
    coins: 140,
    accuracy: 49,
    streak: 0,
    lastActive: "Hace 2 días",
    status: "atrasado",
    flags: [],
  },
  {
    id: "s-10",
    name: "Sebastián Ortiz",
    avatar: "SO",
    grade: "10.°B",
    barrio: "Barrio Trigonométrico",
    position: 6,
    coins: 520,
    accuracy: 91,
    streak: 7,
    lastActive: "Hace 6 min",
    status: "al dia",
    flags: ["Respondió 4 retos en menos de 3 s"],
  },
];

export interface SkillRow {
  code: string;
  label: string;
  barrio: string;
  mastery: number;
  attempts: number;
}

export const MOCK_SKILLS: SkillRow[] = [
  { code: "FIN-ICO", label: "Interés compuesto", barrio: "Centro", mastery: 78, attempts: 148 },
  { code: "FIN-POR", label: "Porcentajes y descuentos", barrio: "Centro", mastery: 64, attempts: 172 },
  { code: "REA-INT", label: "Intervalos y desigualdades", barrio: "Centro", mastery: 57, attempts: 96 },
  { code: "FUN-LIN", label: "Función lineal y pendiente", barrio: "Funciones", mastery: 71, attempts: 88 },
  { code: "FUN-CUA", label: "Función cuadrática y vértice", barrio: "Funciones", mastery: 48, attempts: 64 },
  { code: "FUN-EXP", label: "Crecimiento exponencial", barrio: "Funciones", mastery: 69, attempts: 42 },
  { code: "TRI-RAZ", label: "Razones trigonométricas", barrio: "Trigonometría", mastery: 44, attempts: 31 },
  { code: "PRO-BAS", label: "Probabilidad clásica", barrio: "Azar", mastery: 82, attempts: 27 },
];

export interface AnomalyRow {
  id: string;
  student: string;
  signal: string;
  detail: string;
  severity: "alta" | "media" | "baja";
  time: string;
}

export const MOCK_ANOMALIES: AnomalyRow[] = [
  {
    id: "a-01",
    student: "Sebastián Ortiz",
    signal: "Respuestas demasiado rápidas",
    detail: "4 retos numéricos respondidos en menos de 3 s con acierto.",
    severity: "alta",
    time: "Hace 6 min",
  },
  {
    id: "a-02",
    student: "Andrés Pérez",
    signal: "Patrón de ensayo y error",
    detail: "12 envíos en 3 minutos; 11 incorrectos en la misma habilidad.",
    severity: "media",
    time: "Hace 1 día",
  },
  {
    id: "a-03",
    student: "Sofía Lozano",
    signal: "Inactividad",
    detail: "Sin eventos de juego en 4 días, con matrícula activa.",
    severity: "baja",
    time: "Hace 4 días",
  },
];

export const COURSE = {
  name: "Matemáticas 10.°B",
  code: "MAT10B-2026",
  teacher: "Prof. Yamith Ardila",
  period: "Periodo 4 · 2026",
  students: 32,
  activeToday: 24,
  avgAccuracy: 68,
  avgCoins: 312,
};

export const WEEKLY_ACTIVITY = [
  { day: "Lun", answers: 64, correct: 41 },
  { day: "Mar", answers: 88, correct: 59 },
  { day: "Mié", answers: 72, correct: 47 },
  { day: "Jue", answers: 96, correct: 68 },
  { day: "Vie", answers: 120, correct: 84 },
  { day: "Sáb", answers: 38, correct: 29 },
  { day: "Dom", answers: 21, correct: 17 },
];

export const BARRIO_DISTRIBUTION = [
  { name: "Centro Financiero", value: 14, color: "#0F7B5F" },
  { name: "Avenida de las Funciones", value: 8, color: "#2563EB" },
  { name: "Barrio Trigonométrico", value: 4, color: "#7C3AED" },
  { name: "Plaza Cartesiana", value: 2, color: "#C2410C" },
  { name: "Mercado del Azar", value: 1, color: "#BE185D" },
  { name: "Torre del Cálculo", value: 0, color: "#0E7490" },
];
