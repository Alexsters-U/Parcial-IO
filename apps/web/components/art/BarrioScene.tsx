import type { BarrioIconKey } from "@/components/BarrioIcon";

const DARK = "#0B5C46";
const CREAM = "#FFF8EC";
const COIN = "#F2B705";
const COIN_DARK = "#D89F04";
const GROUND = "#E9DCC3";
const TREE = "#6BAE7B";
const TREE_DARK = "#4C8F5F";

/**
 * Silueta vectorial de cada barrio. Se dibuja en una caja de 120 × 120 con la
 * base en y≈108 para poder reutilizarse en el mapa y en las tarjetas.
 */
export function BarrioLandmark({
  iconKey,
  color,
}: {
  iconKey: BarrioIconKey | string;
  color: string;
}) {
  switch (iconKey) {
    case "curve":
      return <CurveLandmark color={color} />;
    case "triangle":
      return <TriangleLandmark color={color} />;
    case "grid":
      return <GridLandmark color={color} />;
    case "dice":
      return <DiceLandmark color={color} />;
    case "tangent":
      return <TangentLandmark color={color} />;
    default:
      return <BuildingLandmark color={color} />;
  }
}

function Shadow() {
  return <ellipse cx="60" cy="108" rx="46" ry="6" fill="#1F2430" opacity="0.12" />;
}

function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-1.5" y="0" width="3" height="9" rx="1.5" fill="#8A6A45" />
      <circle cx="0" cy="-3" r="6" fill={TREE} />
      <circle cx="-2.5" cy="-1.5" r="3.5" fill={TREE_DARK} opacity="0.35" />
    </g>
  );
}

function BuildingLandmark({ color }: { color: string }) {
  return (
    <g>
      <Shadow />
      <rect x="8" y="102" width="104" height="8" rx="4" fill={GROUND} />

      {/* Torre izquierda */}
      <rect x="18" y="56" width="24" height="48" rx="3" fill={color} />
      <rect x="16" y="51" width="28" height="7" rx="2" fill={DARK} />
      {[62, 72, 82].map((y) => (
        <g key={y}>
          <rect x="23" y={y} width="4.5" height="5" rx="1" fill={CREAM} opacity="0.9" />
          <rect x="32" y={y} width="4.5" height="5" rx="1" fill={CREAM} opacity="0.9" />
        </g>
      ))}
      <rect x="21" y="93" width="18" height="3" rx="1.5" fill={COIN} />

      {/* Torre central */}
      <rect x="46" y="27" width="30" height="77" rx="3" fill={DARK} />
      <rect x="43" y="22" width="36" height="7" rx="2" fill={color} />
      <path d="M61 22V10" stroke={DARK} strokeWidth="2" />
      <path d="M61 10l11 3-11 4Z" fill={COIN} />
      {[35, 47, 59, 71, 83].map((y) => (
        <g key={y}>
          <rect x="52" y={y} width="5" height="6" rx="1" fill={CREAM} opacity="0.88" />
          <rect x="63" y={y} width="5" height="6" rx="1" fill={CREAM} opacity="0.88" />
        </g>
      ))}

      {/* Torre derecha */}
      <rect x="80" y="68" width="22" height="36" rx="3" fill={color} opacity="0.82" />
      <rect x="78" y="63" width="26" height="6" rx="2" fill={DARK} />
      {[73, 83].map((y) => (
        <g key={y}>
          <rect x="85" y={y} width="4" height="4" rx="1" fill={CREAM} opacity="0.9" />
          <rect x="93" y={y} width="4" height="4" rx="1" fill={CREAM} opacity="0.9" />
        </g>
      ))}

      <Tree x={12} y={104} scale={0.85} />
      <Tree x={108} y={104} scale={0.75} />
    </g>
  );
}

function CurveLandmark({ color }: { color: string }) {
  return (
    <g>
      <Shadow />
      <rect x="10" y="100" width="100" height="9" rx="4" fill={GROUND} />
      <rect x="46" y="88" width="28" height="15" rx="3" fill="#D8C6A6" />
      <rect x="41" y="83" width="38" height="7" rx="3" fill="#C7B291" />
      <path
        d="M22 89C36 89 40 44 60 33c15-8 25 6 39-3"
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M22 89C36 89 40 44 60 33c15-8 25 6 39-3"
        fill="none"
        stroke={CREAM}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="99" cy="30" r="6.5" fill={COIN} stroke={COIN_DARK} strokeWidth="2" />
      {[
        [31, 68],
        [52, 44],
        [78, 34],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill={CREAM} opacity="0.85" />
      ))}
      <Tree x={12} y={101} scale={0.8} />
      <Tree x={108} y={101} scale={0.72} />
    </g>
  );
}

function TriangleLandmark({ color }: { color: string }) {
  return (
    <g>
      <Shadow />
      <rect x="8" y="101" width="104" height="8" rx="4" fill={GROUND} />
      <path
        d="M60 15 12 101h96Z"
        fill={`${color}1F`}
        stroke={color}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M60 45 34 94h52Z" fill={color} opacity="0.18" />
      <circle cx="60" cy="15" r="7" fill={COIN} stroke={COIN_DARK} strokeWidth="2" />
      <circle cx="98" cy="26" r="8" fill={COIN} opacity="0.95" />
      {[
        [98, 12, 98, 8],
        [98, 40, 98, 44],
        [84, 26, 80, 26],
        [112, 26, 116, 26],
      ].map(([x1, y1, x2, y2], index) => (
        <path
          key={index}
          d={`M${x1} ${y1}L${x2} ${y2}`}
          stroke={COIN_DARK}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      ))}
      <Tree x={16} y={102} scale={0.7} />
    </g>
  );
}

function GridLandmark({ color }: { color: string }) {
  return (
    <g>
      <Shadow />
      <rect x="8" y="100" width="104" height="9" rx="4" fill={GROUND} />
      <path
        d="M18 98 42 58h36l24 40Z"
        fill={CREAM}
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[68, 78, 88].map((y, index) => (
        <path
          key={y}
          d={`M${24 + index * 5} ${y}H${96 - index * 5}`}
          stroke={color}
          strokeWidth="2.4"
          opacity="0.3"
        />
      ))}
      {[
        [48, 58, 32, 98],
        [60, 58, 60, 98],
        [72, 58, 88, 98],
      ].map(([x1, y1, x2, y2], index) => (
        <path
          key={index}
          d={`M${x1} ${y1}L${x2} ${y2}`}
          stroke={color}
          strokeWidth="2.2"
          opacity="0.24"
        />
      ))}

      {/* Obelisco */}
      <rect x="54" y="30" width="12" height="42" rx="2" fill={color} />
      <path d="M52 30 60 12l8 18Z" fill={COIN} stroke={COIN_DARK} strokeWidth="1.6" />
      <rect x="48" y="72" width="24" height="6" rx="3" fill={DARK} />
      <circle cx="60" cy="45" r="3.2" fill={CREAM} opacity="0.9" />
      <Tree x={14} y={102} scale={0.72} />
      <Tree x={106} y={102} scale={0.66} />
    </g>
  );
}

function DiceLandmark({ color }: { color: string }) {
  return (
    <g>
      <Shadow />
      <rect x="8" y="100" width="104" height="9" rx="4" fill={GROUND} />

      {/* Puesto del mercado */}
      <rect x="22" y="62" width="76" height="42" rx="6" fill={CREAM} stroke="#D8C6A6" strokeWidth="3" />
      <path d="M16 64 28 36h64l12 28Z" fill={color} />
      {[
        "M40 36 48 64h12L52 36Z",
        "M64 36 72 64h12L76 36Z",
      ].map((d, index) => (
        <path key={index} d={d} fill={CREAM} opacity="0.85" />
      ))}
      {[22, 34, 46, 58, 70, 82, 94].map((x) => (
        <circle key={x} cx={x} cy="64" r="6" fill={color} />
      ))}
      <rect x="54" y="82" width="14" height="22" rx="2" fill={DARK} />
      <rect x="28" y="92" width="10" height="10" rx="2" fill={COIN} />
      <rect x="40" y="95" width="8" height="7" rx="2" fill="#D8C6A6" />

      {/* Dado flotante */}
      <g transform="rotate(-8 82 24)">
        <rect x="68" y="10" width="28" height="28" rx="7" fill={CREAM} stroke={color} strokeWidth="3" />
        {[
          [75, 17],
          [89, 17],
          [75, 31],
          [89, 31],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill={color} />
        ))}
      </g>

      <path d="M8 28q52 12 104 0" fill="none" stroke="#D8C6A6" strokeWidth="2" />
      {[24, 44, 64, 84].map((x, index) => (
        <path
          key={x}
          d={`M${x} 31l6 10 6-10Z`}
          fill={index % 2 === 0 ? COIN : color}
          opacity="0.9"
        />
      ))}
      <Tree x={10} y={102} scale={0.7} />
    </g>
  );
}

function TangentLandmark({ color }: { color: string }) {
  return (
    <g>
      <Shadow />
      <rect x="8" y="100" width="104" height="9" rx="4" fill={GROUND} />

      {/* Torre */}
      <path d="M46 101 50 30h20l4 71Z" fill={color} />
      <path d="M47 30 60 10l13 20Z" fill={DARK} />
      <rect x="38" y="99" width="44" height="8" rx="3" fill={DARK} />
      {[60, 78].map((y) => (
        <rect key={y} x="44" y={y} width="32" height="4" rx="2" fill={DARK} />
      ))}
      {[64, 82].map((y) => (
        <g key={y}>
          <rect x="53" y={y} width="4" height="7" rx="1" fill={CREAM} opacity="0.9" />
          <rect x="63" y={y} width="4" height="7" rx="1" fill={CREAM} opacity="0.9" />
        </g>
      ))}

      {/* Reloj */}
      <circle cx="60" cy="42" r="10" fill={CREAM} stroke={DARK} strokeWidth="3" />
      <path d="M60 36v6l4 2.5" stroke={DARK} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Recta tangente */}
      <path d="M30 35 92 14" stroke={COIN} strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="24.5" r="3.6" fill={COIN_DARK} />
      <Tree x={14} y={102} scale={0.72} />
    </g>
  );
}

/**
 * Escena completa de un barrio: cielo, colinas, suelo y su monumento.
 * Pensada para banners de tarjetas y para el centro del tablero.
 */
export function BarrioScene({
  iconKey,
  color,
  className,
  label,
}: {
  iconKey: BarrioIconKey | string;
  color: string;
  className?: string;
  label?: string;
}) {
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <svg
      viewBox="0 0 200 130"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      {...a11y}
    >
      <rect width="200" height="130" fill={`${color}10`} />
      <circle cx="168" cy="24" r="10" fill={COIN} opacity="0.92" />
      <path d="M0 96c30-18 62-14 90-2 30 12 62-12 110-4v40H0Z" fill={`${color}1A`} />
      <rect y="104" width="200" height="26" fill="#EFE3CB" />

      {/* Nubes */}
      <g fill={CREAM} opacity="0.85">
        <rect x="24" y="20" width="26" height="9" rx="4.5" />
        <rect x="34" y="14" width="18" height="11" rx="5.5" />
        <rect x="126" y="42" width="22" height="8" rx="4" />
        <rect x="134" y="36" width="15" height="10" rx="5" />
      </g>

      {/* Camino */}
      <path d="M0 114h200" stroke="#E4D6BE" strokeWidth="3" strokeDasharray="8 10" />

      <g transform="translate(40 5) scale(0.96)">
        <BarrioLandmark iconKey={iconKey} color={color} />
      </g>

      <Tree x={16} y={116} scale={1.1} />
      <Tree x={188} y={117} scale={0.95} />
    </svg>
  );
}
