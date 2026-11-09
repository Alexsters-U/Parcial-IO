// Banco de plantillas paramétricas de la MAQUETA.
// Cada plantilla sortea valores en el navegador. En el MVP el sorteo ocurrirá
// solo en el servidor con semilla secreta (ver "Motor de preguntas" en la bóveda).

import type { Barrio } from "./game-data";
import { BARRIOS } from "./game-data";

export type AnswerType = "single_choice" | "numeric" | "fraction";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  templateId: string;
  barrioId: string;
  skill: string;
  difficulty: 1 | 2 | 3;
  answerType: AnswerType;
  stem: string;
  hint?: string;
  options?: QuestionOption[];
  correctOptionId?: string;
  correctValue?: number;
  tolerance?: number;
  correctFraction?: [number, number];
  correctLabel: string;
  explanation: string;
  timeLimitSec: number;
  issuedAt: number;
  expiresAt: number;
}

// ---------- Utilidades ----------

const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(values: T[]): T =>
  values[Math.floor(Math.random() * values.length)];

const money = (value: number) => Math.round(value).toLocaleString("es-CO");

const dec = (value: number, digits = 2) =>
  value.toFixed(digits).replace(".", ",");

const opaqueId = () =>
  `op_${Math.random().toString(36).slice(2, 8)}`;

function shuffle<T>(values: T[]): T[] {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function fractionLabel(numerator: number, denominator: number) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

function combination(n: number, k: number) {
  let result = 1;
  for (let i = 1; i <= k; i += 1) {
    result = (result * (n - k + i)) / i;
  }
  return Math.round(result);
}

function signed(value: number) {
  return value >= 0 ? `+ ${value}` : `- ${Math.abs(value)}`;
}

function linearLabel(m: number, b: number) {
  const mPart = m === 1 ? "x" : m === -1 ? "-x" : `${m}x`;
  const bPart = b === 0 ? "" : b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`;
  return `$${mPart}${bPart}$`;
}

function quadraticLabel(a: number, b: number, c: number) {
  const aPart = a === 1 ? "x^2" : a === -1 ? "-x^2" : `${a}x^2`;
  const bAbs = Math.abs(b) === 1 ? "" : `${Math.abs(b)}`;
  const bPart =
    b === 0 ? "" : b > 0 ? ` + ${bAbs}x` : ` - ${bAbs}x`;
  const cPart = c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
  return `$${aPart}${bPart}${cPart}$`;
}

function shiftedParabola(a: number, h: number, k: number) {
  const aPart = a === 1 ? "" : a === -1 ? "-" : `${a}`;
  const hPart = h === 0 ? "x" : h > 0 ? `(x - ${h})` : `(x + ${Math.abs(h)})`;
  const kPart = k === 0 ? "" : k > 0 ? ` + ${k}` : ` - ${Math.abs(k)}`;
  return `${aPart}${hPart}^2${kPart}`;
}

interface CommonInput {
  templateId: string;
  barrioId: string;
  skill: string;
  difficulty: 1 | 2 | 3;
  stem: string;
  explanation: string;
  timeLimitSec: number;
  hint?: string;
}

function singleChoice(
  input: CommonInput & { correct: string; distractors: string[] }
): Omit<Question, "id" | "issuedAt" | "expiresAt"> {
  const unique = [input.correct, ...input.distractors].filter(
    (label, index, all) => all.indexOf(label) === index
  );
  if (unique.length < 4) unique.push("Ninguna de las anteriores");
  const labels = shuffle(unique).slice(0, 4);
  const options = labels.map((label) => ({ id: opaqueId(), label }));
  const correct = options.find((option) => option.label === input.correct);
  return {
    templateId: input.templateId,
    barrioId: input.barrioId,
    skill: input.skill,
    difficulty: input.difficulty,
    answerType: "single_choice",
    stem: input.stem,
    hint: input.hint,
    options,
    correctOptionId: correct?.id,
    correctLabel: input.correct,
    explanation: input.explanation,
    timeLimitSec: input.timeLimitSec,
  };
}

function numeric(
  input: CommonInput & {
    value: number;
    tolerance: number;
    correctLabel: string;
  }
): Omit<Question, "id" | "issuedAt" | "expiresAt"> {
  return {
    templateId: input.templateId,
    barrioId: input.barrioId,
    skill: input.skill,
    difficulty: input.difficulty,
    answerType: "numeric",
    stem: input.stem,
    hint: input.hint,
    correctValue: input.value,
    tolerance: input.tolerance,
    correctLabel: input.correctLabel,
    explanation: input.explanation,
    timeLimitSec: input.timeLimitSec,
  };
}

function fraction(
  input: CommonInput & {
    numerator: number;
    denominator: number;
    correctLabel?: string;
  }
): Omit<Question, "id" | "issuedAt" | "expiresAt"> {
  return {
    templateId: input.templateId,
    barrioId: input.barrioId,
    skill: input.skill,
    difficulty: input.difficulty,
    answerType: "fraction",
    stem: input.stem,
    hint: input.hint,
    correctFraction: [input.numerator, input.denominator],
    correctLabel:
      input.correctLabel ?? fractionLabel(input.numerator, input.denominator),
    explanation: input.explanation,
    timeLimitSec: input.timeLimitSec,
  };
}

// ---------- Plantillas por barrio ----------

function cfCompound() {
  const capital = rnd(5, 15) * 100_000;
  const rate = pick([4, 5, 6, 8, 9, 10]);
  const years = rnd(2, 5);
  const value = Math.round(capital * Math.pow(1 + rate / 100, years));
  return numeric({
    templateId: "FIN-ICO-001",
    barrioId: "centro-financiero",
    skill: "FIN-ICO",
    difficulty: 2,
    stem: `Ana deposita $${money(capital)}$ pesos al $${rate}\\%$ de interés compuesto anual. ¿Cuánto tendrá al cabo de $${years}$ años? Redondea al peso.`,
    hint: "En interés compuesto, los intereses también generan intereses.",
    value,
    tolerance: 1,
    correctLabel: `$${money(value)}$ pesos`,
    explanation: `Se aplica $C(1+r)^n$: $${money(capital)}\\left(1+\\frac{${rate}}{100}\\right)^{${years}} \\approx ${money(value)}$ pesos. No es lo mismo que el interés simple.`,
    timeLimitSec: 90,
  });
}

function cfDiscount() {
  const price = rnd(8, 25) * 10_000;
  const discount = pick([10, 15, 20, 25, 30]);
  const finalPrice = price * (1 - discount / 100);
  return singleChoice({
    templateId: "FIN-POR-001",
    barrioId: "centro-financiero",
    skill: "FIN-POR",
    difficulty: 1,
    stem: `Una chaqueta cuesta $${money(price)}$ pesos y tiene un descuento del $${discount}\\%$. ¿Cuál es el precio final?`,
    correct: `$${money(finalPrice)}$`,
    distractors: [
      `$${money((price * discount) / 100)}$`,
      `$${money(price * (1 + discount / 100))}$`,
      `$${money(price - discount)}$`,
    ],
    explanation: `El descuento es $${discount}\\%$ del precio: $${money(price)} \\cdot (1-\\frac{${discount}}{100}) = ${money(finalPrice)}$ pesos. Restar ${discount} pesos sería restar el porcentaje como si fuera dinero.`,
    timeLimitSec: 60,
  });
}

function cfInequality() {
  const a = rnd(2, 4);
  const k = rnd(-4, 5);
  const b = rnd(1, 9);
  const c = a * k + b;
  return singleChoice({
    templateId: "REA-INT-001",
    barrioId: "centro-financiero",
    skill: "REA-INT",
    difficulty: 2,
    stem: `Resuelve la inecuación $${a}x ${signed(b)} \\le ${c}$.`,
    correct: `$(-\\infty, ${k}]$`,
    distractors: [
      `$(-\\infty, ${k})$`,
      `$[${k}, \\infty)$`,
      `$(${k}, \\infty)$`,
    ],
    explanation: `Restamos ${b}: $${a}x \\le ${c - b}$. Dividimos entre ${a}, que es positivo, así que el sentido no cambia: $x \\le ${k}$. Por eso el intervalo es $(-\\infty, ${k}]$.`,
    timeLimitSec: 75,
  });
}

function funSlope() {
  const x1 = rnd(-4, 2);
  const dx = pick([2, 3, 4]);
  const x2 = x1 + dx;
  const y1 = rnd(-4, 4);
  const slope = pick([-3, -2, -1, 1, 2, 3]);
  const y2 = y1 + slope * dx;
  return numeric({
    templateId: "FUN-LIN-001",
    barrioId: "avenida-funciones",
    skill: "FUN-LIN",
    difficulty: 1,
    stem: `¿Cuál es la pendiente de la recta que pasa por $(${x1}, ${y1})$ y $(${x2}, ${y2})$?`,
    value: slope,
    tolerance: 0.001,
    correctLabel: `${slope}`,
    explanation: `$m = \\frac{y_2-y_1}{x_2-x_1} = \\frac{${y2}-(${y1})}{${x2}-(${x1})} = \\frac{${y2 - y1}}{${x2 - x1}} = ${slope}$.`,
    timeLimitSec: 60,
  });
}

function funLineEquation() {
  const m = pick([-3, -2, -1, 1, 2, 3]);
  let b = pick([-5, -4, -3, -2, 2, 3, 4, 5]);
  if (b === m) b = -b;
  const x1 = pick([-2, -1, 0, 1, 2]);
  const x2 = x1 + pick([1, 2]);
  const y1 = m * x1 + b;
  const y2 = m * x2 + b;
  return singleChoice({
    templateId: "FUN-LIN-002",
    barrioId: "avenida-funciones",
    skill: "FUN-LIN",
    difficulty: 2,
    stem: `¿Cuál ecuación representa la recta que pasa por $(${x1}, ${y1})$ y $(${x2}, ${y2})$?`,
    correct: linearLabel(m, b),
    distractors: [
      linearLabel(-m, b),
      linearLabel(m, -b),
      linearLabel(b, m),
    ],
    explanation: `La pendiente es $m=\\frac{${y2}-(${y1})}{${x2}-(${x1})}=${m}$. Con el punto $(${x1}, ${y1})$: $b = y - mx = ${y1} - (${m})(${x1}) = ${b}$. Por eso la recta es $y=${m}x${b > 0 ? `+${b}` : `${b}`}$.`,
    timeLimitSec: 80,
  });
}

function funVertex() {
  const a = pick([1, 2, -1, -2]);
  const h = pick([-3, -2, -1, 1, 2, 3]);
  let k = pick([-4, -3, -2, 1, 2, 3, 4]);
  if (k === h) k = -k;
  return singleChoice({
    templateId: "FUN-CUA-001",
    barrioId: "avenida-funciones",
    skill: "FUN-CUA",
    difficulty: 2,
    stem: `¿Cuál es el vértice de la parábola $y = ${shiftedParabola(a, h, k)}$?`,
    correct: `$(${h}, ${k})$`,
    distractors: [`$(${-h}, ${k})$`, `$(${h}, ${-k})$`, `$(${k}, ${h})$`],
    explanation: `La forma $y=a(x-h)^2+k$ muestra el vértice en $(h,k)$. Aquí $h=${h}$ y $k=${k}$, así que el vértice es $(${h}, ${k})$.`,
    timeLimitSec: 60,
  });
}

function funExponential() {
  const initial = pick([200, 400, 500, 800, 1000]);
  const period = pick([2, 3, 4]);
  const factor = pick([2, 3]);
  const periods = rnd(1, 3);
  const years = period * periods;
  const value = initial * Math.pow(factor, periods);
  return numeric({
    templateId: "FUN-EXP-001",
    barrioId: "avenida-funciones",
    skill: "FUN-EXP",
    difficulty: 2,
    stem: `Una población de ${initial} individuos ${factor === 2 ? "se duplica" : "se triplica"} cada ${period} años. ¿Cuántos individuos habrá en ${years} años?`,
    value,
    tolerance: 0.5,
    correctLabel: `${money(value)} individuos`,
    explanation: `En ${years} años hay ${periods} periodos de ${period} años. La población es $${initial} \\cdot ${factor}^{${periods}} = ${money(value)}$ individuos.`,
    timeLimitSec: 75,
  });
}

function triHeight() {
  const angle = pick([30, 45, 60]);
  const shadow = pick([8, 10, 12, 15, 20]);
  const height = Number((shadow * Math.tan((angle * Math.PI) / 180)).toFixed(2));
  return numeric({
    templateId: "TRI-RAZ-001",
    barrioId: "barrio-trigonometrico",
    skill: "TRI-RAZ",
    difficulty: 2,
    stem: `Un poste proyecta una sombra de $${shadow}$ m cuando el ángulo de elevación del sol es $${angle}^\\circ$. ¿Cuál es la altura del poste? Escribe dos decimales.`,
    value: height,
    tolerance: 0.06,
    correctLabel: `${dec(height)} m`,
    explanation: `$\\tan(${angle}^\\circ) = \\frac{\\text{altura}}{${shadow}}$, entonces altura $= ${shadow}\\cdot\\tan(${angle}^\\circ) \\approx ${dec(height)}$ m.`,
    timeLimitSec: 90,
  });
}

function triLawOfSines() {
  const angleA = pick([30, 45, 60]);
  let angleB = pick([30, 45, 60]);
  if (angleB === angleA) angleB = angleA === 60 ? 30 : 60;
  const sideA = pick([6, 8, 10, 12]);
  const sideB = Number(
    (
      (sideA * Math.sin((angleB * Math.PI) / 180)) /
      Math.sin((angleA * Math.PI) / 180)
    ).toFixed(2)
  );
  return numeric({
    templateId: "TRI-LSC-001",
    barrioId: "barrio-trigonometrico",
    skill: "TRI-LSC",
    difficulty: 2,
    stem: `En un triángulo, $A=${angleA}^\\circ$, $a=${sideA}$ y $B=${angleB}^\\circ$. Halla el lado $b$ con dos decimales.`,
    value: sideB,
    tolerance: 0.06,
    correctLabel: `${dec(sideB)}`,
    explanation: `Por la ley de senos, $\\frac{a}{\\sin A}=\\frac{b}{\\sin B}$. Entonces $b=${sideA}\\cdot\\frac{\\sin ${angleB}^\\circ}{\\sin ${angleA}^\\circ}\\approx ${dec(sideB)}$.`,
    timeLimitSec: 90,
  });
}

function triPeriod() {
  const amplitude = pick([2, 3, 4, 5]);
  const frequency = pick([2, 3, 4]);
  const period = 360 / frequency;
  return numeric({
    templateId: "TRI-PER-001",
    barrioId: "barrio-trigonometrico",
    skill: "TRI-PER",
    difficulty: 1,
    stem: `Para $y = ${amplitude}\\sin(${frequency}x)$ con $x$ en grados, ¿cuál es el periodo?`,
    value: period,
    tolerance: 0.01,
    correctLabel: `${period}°`,
    explanation: `El periodo de $\\sin(Bx)$ es $\\frac{360^\\circ}{|B|}$. Con $B=${frequency}$: $\\frac{360}{${frequency}}=${period}^\\circ$. La amplitud ${amplitude} no cambia el periodo.`,
    timeLimitSec: 60,
  });
}

function triIdentity() {
  return singleChoice({
    templateId: "TRI-IDE-001",
    barrioId: "barrio-trigonometrico",
    skill: "TRI-IDE",
    difficulty: 1,
    stem: "¿Cuál expresión es equivalente a $1-\\sin^2 x$?",
    correct: "$\\cos^2 x$",
    distractors: ["$\\sin^2 x$", "$\\tan^2 x$", "$1-\\cos^2 x$"],
    explanation:
      "De la identidad pitagórica $\\sin^2 x+\\cos^2 x=1$ se despeja $1-\\sin^2 x=\\cos^2 x$.",
    timeLimitSec: 45,
  });
}

function geoDistance() {
  const triples: Array<[number, number]> = [
    [3, 4],
    [5, 12],
    [8, 15],
    [6, 8],
    [9, 12],
    [7, 24],
  ];
  const [dx, dy] = pick(triples);
  const signX = pick([-1, 1]);
  const signY = pick([-1, 1]);
  const x1 = rnd(-5, 3);
  const y1 = rnd(-5, 3);
  const x2 = x1 + signX * dx;
  const y2 = y1 + signY * dy;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return numeric({
    templateId: "GEO-DIS-001",
    barrioId: "plaza-cartesiana",
    skill: "GEO-DIS",
    difficulty: 1,
    stem: `¿Cuál es la distancia entre $(${x1}, ${y1})$ y $(${x2}, ${y2})$?`,
    value: distance,
    tolerance: 0.001,
    correctLabel: `${distance}`,
    explanation: `$d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}=\\sqrt{(${x2 - x1})^2+(${y2 - y1})^2}=\\sqrt{${dx * dx}+${dy * dy}}=${distance}$.`,
    timeLimitSec: 75,
  });
}

function geoMidpoint() {
  const x1 = rnd(-6, 6);
  const y1 = rnd(-6, 6);
  const dx = pick([2, 4, 6]);
  const dy = pick([2, 4, 6]);
  const x2 = x1 + dx;
  const y2 = y1 + dy;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return singleChoice({
    templateId: "GEO-REC-001",
    barrioId: "plaza-cartesiana",
    skill: "GEO-REC",
    difficulty: 1,
    stem: `¿Cuál es el punto medio entre $(${x1}, ${y1})$ y $(${x2}, ${y2})$?`,
    correct: `$(${mx}, ${my})$`,
    distractors: [`$(${my}, ${mx})$`, `$(${-mx}, ${my})$`, `$(${mx}, ${-my})$`],
    explanation: `El punto medio es $\\left(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2}\\right)=\\left(\\frac{${x1}+${x2}}{2},\\frac{${y1}+${y2}}{2}\\right)=(${mx}, ${my})$.`,
    timeLimitSec: 60,
  });
}

function geoConic() {
  const conics = [
    { equation: "\\frac{x^2}{9}+\\frac{y^2}{4}=1", label: "Elipse" },
    { equation: "y^2=4x", label: "Parábola" },
    { equation: "x^2-y^2=1", label: "Hipérbola" },
    { equation: "x^2+y^2=25", label: "Circunferencia" },
  ];
  const correct = pick(conics);
  const others = conics
    .filter((conic) => conic.label !== correct.label)
    .map((conic) => conic.label);
  return singleChoice({
    templateId: "GEO-CON-001",
    barrioId: "plaza-cartesiana",
    skill: "GEO-CON",
    difficulty: 2,
    stem: `¿Qué tipo de cónica representa la ecuación $${correct.equation}$?`,
    correct: correct.label,
    distractors: others,
    explanation: `La ecuación $${correct.equation}$ corresponde a una ${correct.label.toLowerCase()}. Se reconoce por la forma de sus términos cuadráticos y por los signos.`,
    timeLimitSec: 60,
  });
}

function geoPolar() {
  const radius = pick([2, 4, 5, 10]);
  const angle = pick([0, 90, 180, 270]);
  const x = Math.round(radius * Math.cos((angle * Math.PI) / 180));
  const y = Math.round(radius * Math.sin((angle * Math.PI) / 180));
  return singleChoice({
    templateId: "GEO-POL-001",
    barrioId: "plaza-cartesiana",
    skill: "GEO-POL",
    difficulty: 2,
    stem: `El punto polar $(r=${radius}, \\theta=${angle}^\\circ)$ corresponde a...`,
    correct: `$(${x}, ${y})$`,
    distractors: [`$(${y}, ${x})$`, `$(${radius}, ${angle})$`, `$(${-x}, ${-y})$`],
    explanation: `$x=r\\cos\\theta=${radius}\\cos ${angle}^\\circ=${x}$ y $y=r\\sin\\theta=${radius}\\sin ${angle}^\\circ=${y}$. Así se obtiene $(${x}, ${y})$.`,
    timeLimitSec: 60,
  });
}

function estMean() {
  const values = Array.from({ length: 5 }, () => rnd(2, 20));
  const sum = values.reduce((total, value) => total + value, 0);
  const mean = sum / values.length;
  return numeric({
    templateId: "EST-TEN-001",
    barrioId: "mercado-azar",
    skill: "EST-TEN",
    difficulty: 1,
    stem: `Las edades de cinco estudiantes son ${values
      .slice(0, 4)
      .join(", ")} y ${values[4]}. ¿Cuál es la media?`,
    value: mean,
    tolerance: 0.01,
    correctLabel: dec(mean),
    explanation: `La media es la suma dividida entre la cantidad de datos: $\\frac{${values.join("+")}}{5}=\\frac{${sum}}{5}=${dec(mean)}$.`,
    timeLimitSec: 60,
  });
}

function proBasic() {
  const red = rnd(2, 6);
  const blue = rnd(2, 6);
  const total = red + blue;
  return fraction({
    templateId: "PRO-BAS-001",
    barrioId: "mercado-azar",
    skill: "PRO-BAS",
    difficulty: 1,
    stem: `Una bolsa tiene ${red} bolas rojas y ${blue} bolas azules. ¿Cuál es la probabilidad de sacar una bola roja? Escribe la fracción irreducible (por ejemplo 3/8) o su decimal.`,
    numerator: red,
    denominator: total,
    explanation: `Hay ${red} casos favorables de ${total} casos posibles. La probabilidad es $\\frac{${red}}{${total}}=${fractionLabel(red, total)}$.`,
    timeLimitSec: 60,
  });
}

function estCombinations() {
  const n = rnd(5, 8);
  const k = pick([2, 3]);
  const value = combination(n, k);
  return numeric({
    templateId: "EST-CNT-001",
    barrioId: "mercado-azar",
    skill: "EST-CNT",
    difficulty: 2,
    stem: `¿De cuántas maneras se pueden elegir ${k} estudiantes de un grupo de ${n}, sin importar el orden?`,
    value,
    tolerance: 0.5,
    correctLabel: `${value} maneras`,
    explanation: `Es una combinación: $\\binom{${n}}{${k}}=\\frac{${n}!}{${k}!\\,(${n}-${k})!}=${value}$. El orden no importa, por eso no se usa una permutación.`,
    timeLimitSec: 75,
  });
}

function proConditional() {
  const glasses = rnd(6, 10);
  const noGlasses = rnd(6, 10);
  const sportGlasses = rnd(2, Math.min(4, glasses - 1));
  const sportNoGlasses = rnd(1, Math.min(3, noGlasses - 1));
  const totalSport = sportGlasses + sportNoGlasses;
  return singleChoice({
    templateId: "PRO-CON-001",
    barrioId: "mercado-azar",
    skill: "PRO-CON",
    difficulty: 3,
    stem: `En un curso, ${glasses} estudiantes usan gafas y ${noGlasses} no. De los que usan gafas, ${sportGlasses} practican deporte; de los que no usan gafas, ${sportNoGlasses} practican deporte. Si se elige un estudiante que practica deporte, ¿cuál es la probabilidad de que use gafas?`,
    correct: `$\\frac{${fractionLabel(sportGlasses, totalSport).split("/")[0]}}{${fractionLabel(sportGlasses, totalSport).split("/")[1]}}$`,
    distractors: [
      `$\\frac{${fractionLabel(sportNoGlasses, totalSport).split("/")[0]}}{${fractionLabel(sportNoGlasses, totalSport).split("/")[1]}}$`,
      `$\\frac{${fractionLabel(sportGlasses, glasses).split("/")[0]}}{${fractionLabel(sportGlasses, glasses).split("/")[1]}}$`,
      `$\\frac{${fractionLabel(sportGlasses, glasses + noGlasses).split("/")[0]}}{${fractionLabel(sportGlasses, glasses + noGlasses).split("/")[1]}}$`,
    ],
    explanation: `El espacio muestral se restringe a quienes practican deporte: ${sportGlasses}+${sportNoGlasses}=${totalSport}. De ellos, ${sportGlasses} usan gafas. Entonces $P(\\text{gafas}\\mid\\text{deporte})=\\frac{${sportGlasses}}{${totalSport}}=${fractionLabel(sportGlasses, totalSport)}$.`,
    timeLimitSec: 90,
  });
}

function calDerivative() {
  const a = rnd(2, 4);
  const b = pick([-5, -4, -3, -2, 2, 3, 4, 5]);
  const c = pick([-5, -4, -3, -2, 2, 3, 4, 5]);
  const x0 = rnd(-2, 3);
  const value = 2 * a * x0 + b;
  return numeric({
    templateId: "CAL-DER-001",
    barrioId: "torre-calculo",
    skill: "CAL-DER",
    difficulty: 2,
    stem: `Si $f(x) = ${quadraticLabel(a, b, c).replace(/^\$|\$$/g, "")}$, ¿cuál es el valor de $f'(${x0})$?`,
    value,
    tolerance: 0.001,
    correctLabel: `${value}`,
    explanation: `La derivada es $f'(x)=2ax+b=${2 * a}x${signed(b)}$. Evaluando en $x=${x0}$: $f'(${x0})=${2 * a}(${x0})${signed(b)}=${value}$.`,
    timeLimitSec: 75,
  });
}

function calLimit() {
  const a = rnd(2, 5);
  const value = 2 * a;
  return numeric({
    templateId: "CAL-LIM-001",
    barrioId: "torre-calculo",
    skill: "CAL-LIM",
    difficulty: 2,
    stem: `Calcula $\\lim_{x \\to ${a}} \\frac{x^2-${a * a}}{x-${a}}$.`,
    value,
    tolerance: 0.001,
    correctLabel: `${value}`,
    explanation: `Factorizamos la diferencia de cuadrados: $x^2-${a * a}=(x-${a})(x+${a})$. Al cancelar $x-${a}$ queda $x+${a}$, y al evaluar en $x=${a}$ se obtiene $${a}+${a}=${value}$.`,
    timeLimitSec: 75,
  });
}

function calSequence() {
  const first = rnd(2, 10);
  const difference = rnd(2, 6);
  const n = rnd(5, 12);
  const value = first + (n - 1) * difference;
  return numeric({
    templateId: "CAL-SUC-001",
    barrioId: "torre-calculo",
    skill: "CAL-SUC",
    difficulty: 1,
    stem: `Una sucesión aritmética empieza en $a_1=${first}$ y aumenta de ${difference} en ${difference}. ¿Cuál es el término $a_{${n}}$?`,
    value,
    tolerance: 0.001,
    correctLabel: `${value}`,
    explanation: `El término general es $a_n=a_1+(n-1)d=${first}+(${n}-1)(${difference})=${value}$.`,
    timeLimitSec: 60,
  });
}

// ---------- Registro de plantillas ----------

interface TemplateDefinition {
  id: string;
  barrioId: string;
  build: () => Omit<Question, "id" | "issuedAt" | "expiresAt">;
}

const TEMPLATES: TemplateDefinition[] = [
  { id: "FIN-ICO-001", barrioId: "centro-financiero", build: cfCompound },
  { id: "FIN-POR-001", barrioId: "centro-financiero", build: cfDiscount },
  { id: "REA-INT-001", barrioId: "centro-financiero", build: cfInequality },
  { id: "FUN-LIN-001", barrioId: "avenida-funciones", build: funSlope },
  { id: "FUN-LIN-002", barrioId: "avenida-funciones", build: funLineEquation },
  { id: "FUN-CUA-001", barrioId: "avenida-funciones", build: funVertex },
  { id: "FUN-EXP-001", barrioId: "avenida-funciones", build: funExponential },
  { id: "TRI-RAZ-001", barrioId: "barrio-trigonometrico", build: triHeight },
  { id: "TRI-LSC-001", barrioId: "barrio-trigonometrico", build: triLawOfSines },
  { id: "TRI-PER-001", barrioId: "barrio-trigonometrico", build: triPeriod },
  { id: "TRI-IDE-001", barrioId: "barrio-trigonometrico", build: triIdentity },
  { id: "GEO-DIS-001", barrioId: "plaza-cartesiana", build: geoDistance },
  { id: "GEO-REC-001", barrioId: "plaza-cartesiana", build: geoMidpoint },
  { id: "GEO-CON-001", barrioId: "plaza-cartesiana", build: geoConic },
  { id: "GEO-POL-001", barrioId: "plaza-cartesiana", build: geoPolar },
  { id: "EST-TEN-001", barrioId: "mercado-azar", build: estMean },
  { id: "PRO-BAS-001", barrioId: "mercado-azar", build: proBasic },
  { id: "EST-CNT-001", barrioId: "mercado-azar", build: estCombinations },
  { id: "PRO-CON-001", barrioId: "mercado-azar", build: proConditional },
  { id: "CAL-DER-001", barrioId: "torre-calculo", build: calDerivative },
  { id: "CAL-LIM-001", barrioId: "torre-calculo", build: calLimit },
  { id: "CAL-SUC-001", barrioId: "torre-calculo", build: calSequence },
];

let issueCounter = 0;
const nowMs = () => Date.now();

export function generateQuestion(
  barrio: Barrio,
  recentTemplateIds: string[] = [],
  skill?: string
): Question {
  let pool = TEMPLATES.filter((template) => template.barrioId === barrio.id);
  if (skill) {
    const bySkill = pool.filter((template) => {
      const built = template.build();
      return built.skill === skill;
    });
    if (bySkill.length > 0) pool = bySkill;
  }
  const fresh = pool.filter(
    (template) => !recentTemplateIds.includes(template.id)
  );
  const chosen = pick(fresh.length > 0 ? fresh : pool);
  const base = chosen.build();
  const issuedAt = nowMs();
  issueCounter += 1;
  return {
    ...base,
    id: `ch_${issuedAt.toString(36)}_${issueCounter}`,
    issuedAt,
    expiresAt: issuedAt + base.timeLimitSec * 1000,
  };
}

export function generateCheckpointQuestions(barrio: Barrio): Question[] {
  const defs = TEMPLATES.filter((template) => template.barrioId === barrio.id);
  const skills = Array.from(
    new Set(defs.map((template) => template.build().skill))
  );
  const selectedSkills = shuffle(skills).slice(0, 3);
  while (selectedSkills.length < 3) {
    selectedSkills.push(skills[selectedSkills.length % skills.length]);
  }
  const recent: string[] = [];
  return selectedSkills.map((skill) => {
    const question = generateQuestion(barrio, recent, skill);
    recent.push(question.templateId);
    return question;
  });
}

// ---------- Verificación ----------

export function parseNumber(raw: string): number | null {
  let value = raw.trim().replace(/\s|\u00a0/g, "");
  if (!value) return null;
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");
  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      value = value.replace(/\./g, "").replace(",", ".");
    } else {
      value = value.replace(/,/g, "");
    }
  } else if (lastComma >= 0) {
    value = value.replace(",", ".");
  } else if (lastDot >= 0) {
    const parts = value.split(".");
    if (parts.length > 2) value = parts.join("");
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function checkAnswer(question: Question, raw: string | null): boolean {
  if (raw === null) return false;
  if (question.answerType === "single_choice") {
    return raw === question.correctOptionId;
  }
  if (question.answerType === "numeric") {
    const value = parseNumber(raw);
    if (value === null || question.correctValue === undefined) return false;
    return Math.abs(value - question.correctValue) <= (question.tolerance ?? 0);
  }
  if (question.answerType === "fraction") {
    if (!question.correctFraction) return false;
    const [numerator, denominator] = question.correctFraction;
    let value = parseNumber(raw);
    if (value === null && raw.includes("/")) {
      const [top, bottom] = raw.split("/");
      const parsedTop = parseNumber(top);
      const parsedBottom = parseNumber(bottom);
      if (parsedTop !== null && parsedBottom !== null && parsedBottom !== 0) {
        value = parsedTop / parsedBottom;
      }
    }
    if (value === null) return false;
    return Math.abs(value - numerator / denominator) < 1e-9;
  }
  return false;
}

export function describeAnswer(question: Question, raw: string | null): string {
  if (raw === null) return "Sin respuesta";
  if (question.answerType === "single_choice") {
    return (
      question.options?.find((option) => option.id === raw)?.label ??
      "Opción no válida"
    );
  }
  return raw;
}

export const QUESTION_COUNT = TEMPLATES.length;
export const BARRIO_COUNT = BARRIOS.length;
