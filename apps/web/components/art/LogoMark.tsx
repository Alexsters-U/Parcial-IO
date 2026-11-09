export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="MateRico"
    >
      <rect width="48" height="48" rx="14" fill="#0F7B5F" />
      <circle cx="24" cy="25" r="13" fill="#F2B705" />
      <circle
        cx="24"
        cy="25"
        r="13"
        fill="none"
        stroke="#D89F04"
        strokeWidth="1.6"
      />
      <path
        d="M15 33V27h4.5v6M20.5 33V22h5.5v11M27 33v-4.5h5V33"
        fill="#0B5C46"
      />
      <path
        d="M14.5 21.5l5.5-4.5 4.5 3 6.5-6"
        fill="none"
        stroke="#FFF8EC"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 14h4v4"
        fill="none"
        stroke="#FFF8EC"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="25" r="13" fill="none" stroke="#FFF8EC" strokeOpacity="0.35" />
    </svg>
  );
}
