"use client";
import type { Prospecto } from "@fixup/types";
import { Badge } from "@fixup/ui";

export function ProspectoCard({
  prospecto, onOpen, onDragStart, onDelete,
}: {
  prospecto: Prospecto;
  onOpen: (p: Prospecto) => void;
  onDragStart: (id: string) => void;
  onDelete: (p: Prospecto) => void;
}) {
  return (
    <article
      draggable
      role="button"
      tabIndex={0}
      onDragStart={() => onDragStart(prospecto.id)}
      onClick={() => onOpen(prospecto)}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen(prospecto); }}
      className="group relative cursor-pointer rounded-sm border border-line bg-surface p-3 hover:border-line-2"
    >
      <button
        type="button"
        aria-label="Delete"
        title="Delete"
        onClick={(e) => { e.stopPropagation(); onDelete(prospecto); }}
        onKeyDown={(e) => e.stopPropagation()}
        className="absolute right-1 top-1 hidden rounded-sm px-1.5 text-ink-soft hover:text-urgent group-hover:block"
      >
        ✕
      </button>
      <div className="pr-5 font-display text-sm text-ink">
        {prospecto["업체명"]}
        {prospecto["업체명_en"] ? <span className="font-sans text-ink-soft"> ({prospecto["업체명_en"]})</span> : null}
      </div>
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
