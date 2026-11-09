/**
 * Ficha del estudiante: una pieza de tablero con la inicial del jugador.
 * Se usa en el mapa y en la casilla actual del tablero.
 */
export function PlayerToken({
  color = "#0F7B5F",
  initial = "L",
  className,
  label,
}: {
  color?: string;
  initial?: string;
  className?: string;
  label?: string;
}) {
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <svg viewBox="0 0 48 56" className={className} {...a11y}>
      <ellipse cx="24" cy="51" rx="14" ry="4" fill="#1F2430" opacity="0.18" />
      <ellipse cx="24" cy="47" rx="14" ry="5" fill={color} />
      <path d="M14 46c0-12 4-17 10-20 6 3 10 8 10 20Z" fill={color} />
      <path d="M18 44c0-9 2-13 6-16v18Z" fill="#FFF8EC" opacity="0.22" />
      <circle cx="24" cy="17" r="11" fill="#FFF8EC" stroke={color} strokeWidth="3.5" />
      <text
        x="24"
        y="21.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fill={color}
        fontFamily="ui-rounded, 'Segoe UI', system-ui, sans-serif"
      >
        {initial}
      </text>
      <circle cx="24" cy="39" r="4.2" fill="#F2B705" stroke="#D89F04" strokeWidth="1.2" />
      <path
        d="M24 36.6l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3Z"
        fill="#7A5A00"
      />
    </svg>
  );
}
