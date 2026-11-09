import { Coins } from "lucide-react";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
      title="MateRico, ir al inicio"
    >
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-[0_10px_20px_-12px_rgba(15,123,95,0.9)]">
        <Coins className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink">
        MateRico
        {!compact && (
          <span className="ml-2 rounded-full border border-line bg-white/70 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-muted">
            maqueta
          </span>
        )}
      </span>
    </Link>
  );
}
