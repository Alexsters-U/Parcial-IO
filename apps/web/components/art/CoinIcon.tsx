export function CoinIcon({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <svg viewBox="0 0 32 32" className={className} {...a11y}>
      <circle cx="16" cy="17" r="14" fill="#D89F04" />
      <circle cx="16" cy="15" r="14" fill="#F2B705" />
      <circle cx="16" cy="15" r="10.5" fill="#FFD75E" />
      <path
        d="M16 8l2 4.2 4.6.7-3.3 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.3-3.2 4.6-.7Z"
        fill="#A97A00"
      />
      <path
        d="M7 9.5c1.6-3.3 5-5.3 9-5.3"
        fill="none"
        stroke="#FFF8EC"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}
