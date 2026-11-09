const CREAM = "#FFF8EC";
const COIN = "#F2B705";

/** Insignia de barrio: escudo con el emblema temático. */
export function BadgeArt({
  iconKey,
  color,
  earned = true,
  className,
  label,
}: {
  iconKey: string;
  color: string;
  earned?: boolean;
  className?: string;
  label?: string;
}) {
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };
  const fill = earned ? color : "#B9B2A5";

  return (
    <svg viewBox="0 0 72 82" className={className} {...a11y}>
      <path
        d="M36 3 65 14v26c0 16-12 28-29 36C19 68 7 56 7 40V14Z"
        fill={fill}
        stroke={earned ? "#FFF8EC" : "#D8D2C7"}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M36 11 58 20v19c0 12-9 22-22 29-13-7-22-17-22-29V20Z"
        fill={CREAM}
        opacity={earned ? 0.16 : 0.3}
      />
      <circle cx="36" cy="37" r="17" fill={CREAM} opacity={earned ? 0.95 : 0.6} />
      <Emblem iconKey={iconKey} color={earned ? color : "#8A8276"} />
      <circle cx="36" cy="15.5" r="4.5" fill={earned ? COIN : "#CFC8BC"} />
      <path
        d="M36 12.4l.9 2 2.2.3-1.6 1.5.4 2.1-1.9-1-1.9 1 .4-2.1-1.6-1.5 2.2-.3Z"
        fill="#7A5A00"
        opacity={earned ? 1 : 0.4}
      />
    </svg>
  );
}

function Emblem({ iconKey, color }: { iconKey: string; color: string }) {
  switch (iconKey) {
    case "curve":
      return (
        <path
          d="M23 45c5 0 6-14 13-14s7 10 13 10"
          fill="none"
          stroke={color}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      );
    case "triangle":
      return (
        <path
          d="M36 23 24 48h24Z"
          fill="none"
          stroke={color}
          strokeWidth="3.4"
          strokeLinejoin="round"
        />
      );
    case "grid":
      return (
        <g fill={color}>
          <rect x="24" y="27" width="9" height="9" rx="1.5" />
          <rect x="36" y="27" width="9" height="9" rx="1.5" opacity="0.55" />
          <rect x="24" y="39" width="9" height="9" rx="1.5" opacity="0.55" />
          <rect x="36" y="39" width="9" height="9" rx="1.5" />
        </g>
      );
    case "dice":
      return (
        <g fill={color}>
          <rect x="25" y="26" width="22" height="22" rx="5" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="31" cy="32" r="2.2" />
          <circle cx="41" cy="32" r="2.2" />
          <circle cx="31" cy="42" r="2.2" />
          <circle cx="41" cy="42" r="2.2" />
        </g>
      );
    case "tangent":
      return (
        <g>
          <path d="M24 46 46 25" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
          <path
            d="M23 42c7 0 8-11 16-11"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      );
    default:
      return (
        <g fill={color}>
          <rect x="24" y="38" width="7" height="10" rx="1.5" />
          <rect x="33" y="29" width="7" height="19" rx="1.5" />
          <rect x="42" y="34" width="7" height="14" rx="1.5" opacity="0.6" />
        </g>
      );
  }
}
