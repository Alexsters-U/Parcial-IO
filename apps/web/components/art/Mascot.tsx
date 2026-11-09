const SKIN = "#E8B48C";
const SKIN_SHADE = "#D89A72";
const HAIR = "#2E241C";
const JACKET = "#0F7B5F";
const JACKET_DARK = "#0B5C46";
const COIN = "#F2B705";
const COIN_DARK = "#D89F04";

export type MascotExpression =
  | "neutral"
  | "thinking"
  | "happy"
  | "sad"
  | "timeout"
  | "trophy";

/**
 * Rico, la mascota de MateRico. Joven emprendedor dibujado en flat vectorial.
 * Se usa de forma decorativa junto a textos que ya explican el estado; por eso
 * solo expone un nombre accesible cuando se pasa `label`.
 */
export function Mascot({
  expression = "neutral",
  className,
  label,
}: {
  expression?: MascotExpression;
  className?: string;
  label?: string;
}) {
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <svg viewBox="0 0 120 120" className={className} {...a11y}>
      {/* Hombros y chaqueta */}
      <path d="M18 120c0-23 17-32 42-32s42 9 42 32Z" fill={JACKET} />
      <path d="M44 90 60 110 52 120H34Z" fill={JACKET_DARK} />
      <path d="M76 90 60 110 68 120h18Z" fill={JACKET_DARK} />
      <path d="M52 89 60 103 68 89Z" fill="#FFF8EC" />
      <path
        d="M50 88c3 4 7 7 10 10 3-3 7-6 10-10"
        fill="none"
        stroke="#E7DCC8"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Moneda en la solapa */}
      <circle cx="80" cy="104" r="7" fill={COIN} stroke={COIN_DARK} strokeWidth="1.6" />
      <path
        d="M80 99.5l1.4 3 3.1.4-2.3 2.1.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.1 3.1-.4Z"
        fill="#7A5A00"
      />

      {/* Cuello y cabeza */}
      <rect x="51" y="76" width="18" height="18" rx="8" fill={SKIN_SHADE} />
      <circle cx="32.5" cy="60" r="5.5" fill={SKIN} />
      <circle cx="87.5" cy="60" r="5.5" fill={SKIN} />
      <ellipse cx="60" cy="58" rx="27" ry="29" fill={SKIN} />

      {/* Pelo */}
      <path
        d="M32 54C31 32 44 21 60 21s29 11 28 33c-3-8-9-13-17-15-9-2-23-1-33 7-2 3-4 5-6 8Z"
        fill={HAIR}
      />
      <path
        d="M38 40c8-12 24-16 37-10-6-4-16-6-24-3-6 2-10 7-13 13Z"
        fill="#4A3A2C"
      />

      {/* Mejillas */}
      <circle cx="42" cy="68" r="4.6" fill="#E8836B" opacity="0.22" />
      <circle cx="78" cy="68" r="4.6" fill="#E8836B" opacity="0.22" />

      {expression === "happy" && (
        <>
          <path d="M45 57q5-6 10 0" fill="none" stroke={HAIR} strokeWidth="3" strokeLinecap="round" />
          <path d="M65 57q5-6 10 0" fill="none" stroke={HAIR} strokeWidth="3" strokeLinecap="round" />
          <path d="M49 69q11 14 22 0Z" fill="#7A3B2E" />
          <Sparkle x={99} y={37} r={5} fill={COIN} />
          <Sparkle x={22} y={45} r={3.6} fill={JACKET} />
        </>
      )}

      {expression === "trophy" && (
        <>
          <Sparkle x={49.5} y={58} r={6.5} fill={COIN} />
          <Sparkle x={70.5} y={58} r={6.5} fill={COIN} />
          <path d="M49 69q11 14 22 0Z" fill="#7A3B2E" />
          <circle cx="99" cy="30" r="3" fill={COIN} />
          <circle cx="107" cy="46" r="2.4" fill="#BE185D" />
          <circle cx="18" cy="34" r="2.6" fill="#2563EB" />
          <circle cx="26" cy="22" r="2.2" fill={JACKET} />
          <path d="M14 58l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill={COIN} opacity="0.85" />
        </>
      )}

      {expression === "sad" && (
        <>
          <ellipse cx="50" cy="59" rx="2.8" ry="3.4" fill={HAIR} />
          <ellipse cx="70" cy="59" rx="2.8" ry="3.4" fill={HAIR} />
          <path d="M43 54 54 50" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M77 54 66 50" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M52 77q8-6 16 0" fill="none" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M89 36c4 6 5 9 2 12s-7 0-6-4Z" fill="#7FB6E8" />
        </>
      )}

      {expression === "timeout" && (
        <>
          <ellipse cx="50" cy="58" rx="4" ry="4.6" fill={HAIR} />
          <ellipse cx="70" cy="58" rx="4" ry="4.6" fill={HAIR} />
          <circle cx="51.4" cy="56.6" r="1.1" fill="#FFF8EC" />
          <circle cx="71.4" cy="56.6" r="1.1" fill="#FFF8EC" />
          <path d="M44 48 55 47" stroke={HAIR} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M65 47 76 48" stroke={HAIR} strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="60" cy="75" rx="4" ry="5" fill="#7A3B2E" />
          <circle cx="98" cy="28" r="10" fill="#FFFDF8" stroke="#B42318" strokeWidth="2.4" />
          <path d="M98 22v6l4 2" stroke="#B42318" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M90 18l-3-4M106 18l3-4" stroke="#B42318" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}

      {expression === "thinking" && (
        <>
          <ellipse cx="50" cy="59" rx="2.8" ry="3.4" fill={HAIR} />
          <ellipse cx="70" cy="59" rx="2.8" ry="3.4" fill={HAIR} />
          <path d="M43 49 54 51" stroke={HAIR} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M66 47 77 51" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M55 74q5 3 10 0" fill="none" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="100" cy="22" r="12" fill="#FFFDF8" stroke="#E7DCC8" strokeWidth="2" />
          <text
            x="100"
            y="27.5"
            textAnchor="middle"
            fontSize="16"
            fontWeight="800"
            fill="#0F7B5F"
            fontFamily="ui-rounded, 'Segoe UI', system-ui, sans-serif"
          >
            ?
          </text>
          <circle cx="87" cy="34" r="2.2" fill="#FFFDF8" stroke="#E7DCC8" strokeWidth="1.4" />
        </>
      )}

      {expression === "neutral" && (
        <>
          <ellipse cx="50" cy="59" rx="2.8" ry="3.4" fill={HAIR} />
          <ellipse cx="70" cy="59" rx="2.8" ry="3.4" fill={HAIR} />
          <path d="M44 51 55 51" stroke={HAIR} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M65 51 76 51" stroke={HAIR} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M54 73q6 4 12 0" fill="none" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function Sparkle({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return (
    <path
      d={`M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z`}
      fill={fill}
    />
  );
}
