"use client";

import { ArrowRight, Coins, Dices, Landmark } from "lucide-react";
import { useEffect, useRef } from "react";
import { CoinIcon } from "@/components/art/CoinIcon";
import type { Barrio } from "@/lib/game-data";

export function BankModal({
  barrio,
  onCollect,
  onDouble,
}: {
  barrio: Barrio;
  onCollect: () => void;
  onDouble: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => buttonRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="overlay">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-title"
        className="modal-card"
      >
        <div className="px-4 py-7 sm:px-7">
          <div className="flex items-start gap-4">
            <span
              className="grid h-14 w-14 flex-none place-items-center rounded-2xl"
              style={{
                backgroundColor: "#F2B70522",
                color: "#6b4e00",
              }}
            >
              <Landmark className="h-8 w-8" aria-hidden="true" />
            </span>
            <div>
              <h2 id="bank-title" className="font-display text-2xl font-extrabold">
                Banco del barrio
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">
                Caíste en una casilla de bonificación de {barrio.name}. Puedes
                cobrar una suma segura o arriesgarte a duplicarla resolviendo un
                reto.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                Opción segura
              </p>
              <p className="mt-2 flex items-center gap-1.5 font-display text-2xl font-extrabold">
                <CoinIcon className="h-6 w-6" />
                +25 monedas
              </p>
              <p className="mt-1 text-xs text-muted">
                Sin riesgo. Las monedas solo compran elementos cosméticos.
              </p>
              <button
                ref={buttonRef}
                type="button"
                onClick={onCollect}
                className="btn btn-coin mt-3 w-full"
              >
                Cobrar 25 monedas
              </button>
            </div>

            <div className="rounded-2xl border-2 border-primary/30 bg-primary/[0.04] p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                <Dices className="h-3.5 w-3.5" aria-hidden="true" />
                Doble o nada
              </p>
              <p className="mt-2 flex items-center gap-1.5 font-display text-2xl font-extrabold">
                <CoinIcon className="h-6 w-6" />
                +50 monedas
              </p>
              <p className="mt-1 text-xs text-muted">
                Aciertas el reto y ganas 50. Fallas y no ganas nada, pero
                conservas tu casilla.
              </p>
              <button
                type="button"
                onClick={onDouble}
                className="btn btn-primary mt-3 w-full"
              >
                Arriesgar un reto
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
