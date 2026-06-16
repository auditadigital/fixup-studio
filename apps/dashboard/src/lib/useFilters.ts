"use client";
import { useEffect, useRef, useState } from "react";
import type { Estado } from "@fixup/types";

export interface Filters {
  rubro: string;
  zona: string;
  estado: Estado | "";
  query: string;
}

const KEY = "fixup.dashboard.filters";
const DEFAULTS: Filters = { rubro: "", zona: "", estado: "", query: "" };

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFilters({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Filters>) });
    } catch {
      /* ignore corrupt prefs */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(filters));
    } catch {
      /* storage unavailable */
    }
  }, [filters]);

  return { filters, setFilters };
}
