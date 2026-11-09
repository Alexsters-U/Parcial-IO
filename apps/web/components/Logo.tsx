import { LogoMark } from "@/components/art/LogoMark";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
      title="MateRico, ir al inicio"
    >
      <LogoMark className="h-10 w-10 drop-shadow-[0_8px_16px_rgba(15,123,95,0.25)]" />
      <span className="font-display text-xl font-extrabold tracking-tight">
        <span className="text-ink">Mate</span>
        <span className="text-primary">Rico</span>
        {!compact && (
          <span className="ml-2 rounded-full border border-line bg-white/70 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-muted">
            maqueta
          </span>
        )}
      </span>
    </Link>
  );
}
