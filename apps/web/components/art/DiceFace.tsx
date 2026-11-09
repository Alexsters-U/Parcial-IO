const PIPS: Record<number, Array<[number, number]>> = {
  1: [[32, 32]],
  2: [
    [19, 19],
    [45, 45],
  ],
  3: [
    [19, 19],
    [32, 32],
    [45, 45],
  ],
  4: [
    [19, 19],
    [45, 19],
    [19, 45],
    [45, 45],
  ],
};

export function DiceFace({
  value,
  rolling = false,
  className,
}: {
  value: number | null;
  rolling?: boolean;
  className?: string;
}) {
  return (
    <div className={`dice-wrap ${rolling ? "dice-tumble" : ""} ${className ?? ""}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="2" y="2" width="60" height="60" rx="15" fill="#FFFDF8" />
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="15"
          fill="none"
          stroke="#E2D5BD"
          strokeWidth="2.5"
        />
        <path
          d="M9 47c0 5 9 9 23 9s23-4 23-9"
          fill="none"
          stroke="#EFE3CB"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {value && PIPS[value]
          ? PIPS[value].map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <circle cx={x} cy={y + 1} r="5.6" fill="#0F7B5F" opacity="0.16" />
                <circle cx={x} cy={y} r="5.4" fill="#1F2430" />
                <circle cx={x - 1.4} cy={y - 1.6} r="1.4" fill="#FFF8EC" opacity="0.45" />
              </g>
            ))
          : (
            <text
              x="32"
              y="41"
              textAnchor="middle"
              fontSize="24"
              fontWeight="800"
              fill="#1F2430"
              fontFamily="ui-rounded, 'Segoe UI', system-ui, sans-serif"
            >
              ?
            </text>
          )}
      </svg>
    </div>
  );
}
