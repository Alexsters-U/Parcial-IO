"use client";

import {
  AlertTriangle,
  ArrowRight,
  Coins,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { EventArt } from "@/components/art/EventArt";
import type { EventCard } from "@/lib/game-data";

export function EventModal({
  event,
  onContinue,
}: {
  event: EventCard;
  onContinue: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => buttonRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, []);

  const tone =
    event.tone === "good"
      ? { bg: "#06764714", color: "var(--color-success)", label: "Buena noticia" }
      : event.tone === "bad"
        ? { bg: "#B4231814", color: "var(--color-danger)", label: "Mala noticia" }
        : { bg: "#0F7B5F14", color: "var(--color-primary)", label: "Evento" };

  return (
    <div className="overlay">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-title"
        className="modal-card"
      >
        <div className="px-4 py-8 text-center sm:px-8">
          <span
            className="mx-auto grid h-24 w-32 place-items-center rounded-3xl"
            style={{ backgroundColor: tone.bg }}
          >
            <EventArt eventId={event.id} className="h-20 w-28" />
          </span>
          <span className="chip mt-3" style={{ backgroundColor: tone.bg, color: tone.color }}>
            {tone.label}
          </span>
          <h2 id="event-title" className="mt-3 font-display text-2xl font-extrabold">
            {event.title}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
            {event.description}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {event.coins !== undefined && event.coins !== 0 && (
              <span className={event.coins > 0 ? "chip chip-coin" : "chip chip-danger"}>
                <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                {event.coins > 0 ? "+" : ""}
                {event.coins} monedas
              </span>
            )}
            {event.streakReset && (
              <span className="chip chip-danger">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                Racha a 0
              </span>
            )}
          </div>

          <button
            ref={buttonRef}
            type="button"
            onClick={onContinue}
            className="btn btn-primary mt-6 w-full px-6 py-3 sm:w-auto"
          >
            Continuar
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
