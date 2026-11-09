const CREAM = "#FFF8EC";
const COIN = "#F2B705";
const COIN_DARK = "#D89F04";
const DANGER = "#B42318";

/** Ilustración plana de las tarjetas de evento. */
export function EventArt({
  eventId,
  className,
  label,
}: {
  eventId: string;
  className?: string;
  label?: string;
}) {
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <svg viewBox="0 0 120 80" className={className} {...a11y}>
      <circle cx="60" cy="40" r="38" fill="#FFFDF8" opacity="0.65" />
      {eventId === "subsidio" && <Bus />}
      {eventId === "inflacion" && <Inflation />}
      {eventId === "auditoria" && <Audit />}
      {eventId === "feria" && <Fair />}
    </svg>
  );
}

function Bus() {
  return (
    <g>
      <rect x="20" y="24" width="80" height="36" rx="9" fill="#0F7B5F" />
      <rect x="26" y="30" width="28" height="15" rx="3" fill={CREAM} />
      <rect x="58" y="30" width="20" height="15" rx="3" fill={CREAM} opacity="0.85" />
      <rect x="82" y="30" width="12" height="15" rx="3" fill={CREAM} opacity="0.7" />
      <rect x="26" y="50" width="68" height="4" rx="2" fill="#0B5C46" />
      <circle cx="38" cy="62" r="7" fill="#1F2430" />
      <circle cx="38" cy="62" r="2.6" fill="#FFFDF8" />
      <circle cx="84" cy="62" r="7" fill="#1F2430" />
      <circle cx="84" cy="62" r="2.6" fill="#FFFDF8" />
      <rect x="62" y="16" width="34" height="11" rx="5.5" fill="#F2B705" />
      <text
        x="79"
        y="24.5"
        textAnchor="middle"
        fontSize="7"
        fontWeight="800"
        fill="#6B4E00"
        fontFamily="ui-rounded, 'Segoe UI', system-ui, sans-serif"
      >
        BONO
      </text>
    </g>
  );
}

function Inflation() {
  return (
    <g>
      <g transform="rotate(-8 58 42)">
        <path
          d="M24 30h48l16 16-20 20-44-6Z"
          fill="#FFFDF8"
          stroke={DANGER}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="76" cy="41" r="3.4" fill={DANGER} />
        <path d="M38 46h24" stroke={DANGER} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <path d="M40 54h15" stroke={DANGER} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
        <path
          d="M55 42l10-10M65 32h-7M65 32v7"
          stroke={DANGER}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <circle cx="92" cy="22" r="9" fill={COIN} stroke={COIN_DARK} strokeWidth="2" />
      <path d="M92 17v10M89 20h6M89 24h6" stroke="#7A5A00" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Audit() {
  return (
    <g>
      <rect x="34" y="14" width="46" height="56" rx="6" fill={CREAM} stroke="#D8C6A6" strokeWidth="2.5" />
      <rect x="42" y="24" width="30" height="3.5" rx="1.75" fill="#0F7B5F" opacity="0.65" />
      <rect x="42" y="33" width="26" height="3.5" rx="1.75" fill="#0F7B5F" opacity="0.45" />
      <rect x="42" y="42" width="22" height="3.5" rx="1.75" fill="#0F7B5F" opacity="0.35" />
      <rect x="42" y="51" width="14" height="3.5" rx="1.75" fill="#0F7B5F" opacity="0.25" />
      <circle cx="73" cy="48" r="15" fill="none" stroke="#BE185D" strokeWidth="4" />
      <path d="M84 59 94 69" stroke="#BE185D" strokeWidth="5" strokeLinecap="round" />
      <circle cx="73" cy="48" r="10" fill="#BE185D" opacity="0.1" />
    </g>
  );
}

function Fair() {
  return (
    <g>
      <rect x="24" y="40" width="72" height="34" rx="5" fill={CREAM} stroke="#D8C6A6" strokeWidth="2.5" />
      <path d="M18 42 30 18h60l12 24Z" fill="#BE185D" />
      {[
        "M40 18 46 42h10L50 18Z",
        "M62 18 68 42h10L72 18Z",
      ].map((d) => (
        <path key={d} d={d} fill={CREAM} opacity="0.85" />
      ))}
      {[20, 33, 46, 59, 72, 85, 98].map((x) => (
        <circle key={x} cx={x} cy="42" r="5.5" fill="#BE185D" />
      ))}
      <rect x="54" y="54" width="14" height="20" rx="2" fill="#0B5C46" />
      <rect x="32" y="52" width="12" height="10" rx="2" fill={COIN} />
      <rect x="82" y="52" width="10" height="9" rx="2" fill="#6BAE7B" />
      <path d="M14 22q46 10 92 0" fill="none" stroke="#D8C6A6" strokeWidth="2" />
      {[30, 52, 74, 94].map((x, index) => (
        <path
          key={x}
          d={`M${x} 24l5 9 5-9Z`}
          fill={index % 2 === 0 ? COIN : "#0F7B5F"}
        />
      ))}
      <circle cx="24" cy="18" r="2.6" fill={COIN} />
      <circle cx="100" cy="14" r="2.2" fill="#2563EB" />
    </g>
  );
}
