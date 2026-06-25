"use client";
import type { Prospecto } from "@fixup/types";
import { Badge } from "@fixup/ui";

/** ISO → fecha corta (ej. "Jun 26"). Vacío si no hay fecha o es inválida. */
function shortDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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
      <div className="mt-2 flex items-center justify-between font-mono text-xs text-ink-soft">
        {prospecto.scores_mini != null ? <span>mini {prospecto.scores_mini}</span> : <span />}
        {shortDate(prospecto.updated_at) ? (
          <span title="Last modified">{shortDate(prospecto.updated_at)}</span>
        ) : null}
      </div>
    </article>
  );
}
