import { BarrioLandmark } from "@/components/art/BarrioScene";
import { BARRIOS } from "@/lib/game-data";

export const MAP_VIEWBOX = { width: 900, height: 340 };

/** Posición de cada barrio dentro del viewBox del mapa. */
export const MAP_NODES = [
  { x: 75, y: 250 },
  { x: 205, y: 162 },
  { x: 350, y: 252 },
  { x: 498, y: 152 },
  { x: 638, y: 242 },
  { x: 808, y: 118 },
];

const ROUTE_SEGMENTS = [
  "M75 250C112 222 160 180 205 162",
  "M205 162C255 146 302 210 350 252",
  "M350 252C392 292 444 192 498 152",
  "M498 152C548 120 588 204 638 242",
  "M638 242C690 280 748 162 808 118",
];

export function CityMapArt({
  barrioIndex,
  completedBarrios,
  selectedIndex = -1,
}: {
  barrioIndex: number;
  completedBarrios: number;
  selectedIndex?: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="map-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF9EF" />
          <stop offset="100%" stopColor="#FBF0DC" />
        </linearGradient>
      </defs>

      <rect width="900" height="340" fill="url(#map-sky)" />

      {/* Bloques lejanos */}
      <g fill="#1F2430" opacity="0.045">
        <rect x="28" y="58" width="74" height="44" rx="8" />
        <rect x="112" y="72" width="52" height="30" rx="7" />
        <rect x="612" y="48" width="66" height="38" rx="8" />
        <rect x="690" y="64" width="44" height="24" rx="6" />
      </g>

      {/* Parques */}
      <g fill="#DDE9CF" opacity="0.75">
        <ellipse cx="130" cy="280" rx="92" ry="38" />
        <ellipse cx="420" cy="286" rx="105" ry="40" />
        <ellipse cx="720" cy="272" rx="96" ry="34" />
        <ellipse cx="330" cy="110" rx="70" ry="26" />
      </g>

      {/* Río */}
      <path
        d="M0 304c120-18 210 20 330 4s210-20 330 0 170 2 240-6v38H0Z"
        fill="#CFE8EA"
      />
      <path
        d="M0 304c120-18 210 20 330 4s210-20 330 0 170 2 240-6"
        fill="none"
        stroke="#A9D4DA"
        strokeWidth="3"
      />
      {[
        [90, 318],
        [300, 314],
        [520, 318],
        [740, 310],
      ].map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x} ${y}q7-5 14 0t14 0`}
          fill="none"
          stroke="#FFFDF8"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.75"
        />
      ))}

      {/* Nubes */}
      <g fill="#FFFDF8" opacity="0.9">
        <rect x="58" y="28" width="34" height="11" rx="5.5" />
        <rect x="70" y="21" width="24" height="13" rx="6.5" />
        <rect x="430" y="38" width="28" height="10" rx="5" />
        <rect x="440" y="32" width="19" height="12" rx="6" />
        <rect x="736" y="32" width="30" height="10" rx="5" />
      </g>

      <text
        x="28"
        y="30"
        fill="#B08A50"
        fontSize="11"
        fontWeight="800"
        letterSpacing="3"
        fontFamily="ui-rounded, 'Segoe UI', system-ui, sans-serif"
      >
        DISTRITO MATEMÁTICO
      </text>

      {/* Camino base */}
      <g fill="none" strokeLinecap="round">
        {ROUTE_SEGMENTS.map((d) => (
          <g key={d}>
            <path d={d} stroke="#E3D2B4" strokeWidth="17" />
            <path d={d} stroke="#FBF1DE" strokeWidth="9" />
          </g>
        ))}
      </g>

      {/* Tramos recorridos */}
      <g fill="none" strokeLinecap="round">
        {ROUTE_SEGMENTS.map((d, index) =>
          index < completedBarrios ? (
            <path key={`done-${d}`} d={d} stroke={BARRIOS[index].color} strokeWidth="5.5" />
          ) : null
        )}
        {barrioIndex < BARRIOS.length - 1 &&
          completedBarrios <= barrioIndex && (
            <path
              d={ROUTE_SEGMENTS[barrioIndex]}
              stroke={BARRIOS[barrioIndex].color}
              strokeWidth="4"
              strokeDasharray="3 11"
              className="map-route-active"
              opacity="0.8"
            />
          )}
      </g>

      {/* Árboles y detalles */}
      {[
        [172, 292, 1],
        [258, 110, 0.8],
        [412, 300, 0.9],
        [560, 110, 0.75],
        [720, 300, 0.85],
        [846, 250, 0.7],
        [880, 286, 0.9],
      ].map(([x, y, scale], index) => (
        <g key={index} transform={`translate(${x} ${y}) scale(${scale})`}>
          <rect x="-1.5" y="0" width="3" height="10" rx="1.5" fill="#8A6A45" />
          <circle cx="0" cy="-4" r="7" fill="#6BAE7B" />
          <circle cx="-2.5" cy="-2" r="4" fill="#4C8F5F" opacity="0.3" />
        </g>
      ))}

      {/* Islas de barrio */}
      {BARRIOS.map((barrio, index) => {
        const { x, y } = MAP_NODES[index];
        const completed = index < completedBarrios;
        const current = index === barrioIndex && !completed;
        const selected = index === selectedIndex;
        return (
          <g key={barrio.id}>
            <ellipse cx={x} cy={y + 31} rx="54" ry="13" fill="#1F2430" opacity="0.09" />
            <ellipse
              cx={x}
              cy={y + 22}
              rx="52"
              ry="20"
              fill={completed ? "#06764718" : `${barrio.color}22`}
              stroke={current ? barrio.color : `${barrio.color}55`}
              strokeWidth={current ? 3 : 2}
            />
            <g
              transform={`translate(${x - 43} ${y - 60}) scale(0.72)`}
              opacity={completed || current ? 1 : 0.5}
            >
              <BarrioLandmark iconKey={barrio.iconKey} color={barrio.color} />
            </g>

            {current && (
              <ellipse
                cx={x}
                cy={y + 22}
                rx="61"
                ry="27"
                fill="none"
                stroke={barrio.color}
                strokeWidth="3"
                className="map-node-ring"
              />
            )}
            {selected && (
              <ellipse
                cx={x}
                cy={y + 22}
                rx="64"
                ry="29"
                fill="none"
                stroke={barrio.color}
                strokeWidth="3.5"
                strokeDasharray="2 7"
                opacity="0.5"
              />
            )}
          </g>
        );
      })}

      {/* Brújula */}
      <g transform="translate(854 42)" opacity="0.8">
        <circle r="18" fill="#FFFDF8" stroke="#E3D2B4" strokeWidth="2" />
        <path d="M0-12 4 2 0-1-4 2Z" fill="#0F7B5F" />
        <path d="M0 12 4 2 0 5-4 2Z" fill="#C7B291" />
        <text
          x="0"
          y="-22"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fill="#8A7A63"
          fontFamily="ui-rounded, 'Segoe UI', system-ui, sans-serif"
        >
          N
        </text>
      </g>
    </svg>
  );
}
