"use client";
import type { Prospecto } from "@fixup/types";
import { Badge } from "@fixup/ui";

export function ProspectoCard({
  prospecto, onOpen, onDragStart,
}: {
  prospecto: Prospecto;
  onOpen: (p: Prospecto) => void;
  onDragStart: (id: string) => void;
}) {
  return (
    <article
      draggable
      role="button"
      tabIndex={0}
      onDragStart={() => onDragStart(prospecto.id)}
      onClick={() => onOpen(prospecto)}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen(prospecto); }}
      className="cursor-pointer rounded-sm border border-line bg-surface p-3 hover:border-line-2"
    >
      <div className="font-display text-sm text-ink">{prospecto["업체명"]}</div>
      <div className="mt-1 flex flex-wrap items-center gap-1">
        <Badge>{prospecto.rubro}</Badge>
        {prospecto.zona ? <Badge>{prospecto.zona}</Badge> : null}
      </div>
      {prospecto.scores_mini != null ? (
        <div className="mt-2 font-mono text-xs text-ink-soft">mini {prospecto.scores_mini}</div>
      ) : null}
    </article>
  );
}
