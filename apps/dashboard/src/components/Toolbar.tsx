"use client";
import type { Estado, Prospecto } from "@fixup/types";
import { ESTADO_LABELS } from "@fixup/types";
import { Button } from "@fixup/ui";
import type { Filters } from "@/lib/useFilters";

function uniq(values: (string | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v)))].sort();
}

export function Toolbar({
  prospectos, filters, setFilters, onReload, reloading,
}: {
  prospectos: Prospecto[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  onReload: () => void;
  reloading: boolean;
}) {
  const rubros = uniq(prospectos.map((p) => p.rubro));
  const zonas = uniq(prospectos.map((p) => p.zona));
  const estados = Object.keys(ESTADO_LABELS) as Estado[];

  const select = "rounded-sm border border-line-2 bg-surface px-2 py-1.5 text-sm text-ink";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className={`${select} min-w-48`}
        placeholder="Search (name / area / IG)"
        value={filters.query}
        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
      />
      <select className={select} value={filters.rubro}
              onChange={(e) => setFilters({ ...filters, rubro: e.target.value })}>
        <option value="">All industries</option>
        {rubros.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <select className={select} value={filters.zona}
              onChange={(e) => setFilters({ ...filters, zona: e.target.value })}>
        <option value="">All areas</option>
        {zonas.map((z) => <option key={z} value={z}>{z}</option>)}
      </select>
      <select className={select} value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value as Estado | "" })}>
        <option value="">All statuses</option>
        {estados.map((s) => <option key={s} value={s}>{ESTADO_LABELS[s]}</option>)}
      </select>
      <Button variant="secondary" onClick={onReload} disabled={reloading}>
        {reloading ? "..." : "↻ Reload"}
      </Button>
    </div>
  );
}
