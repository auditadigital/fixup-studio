"use client";
import { useState } from "react";
import type { Prospecto } from "@fixup/types";
import { Button } from "@fixup/ui";

const FIELDS: { key: string; label: string; required?: boolean; placeholder?: string }[] = [
  { key: "업체명", label: "Business name (KR)", required: true, placeholder: "강남 OO 클리닉" },
  { key: "업체명_en", label: "Business name (EN)", placeholder: "e.g. Gangnam OO Clinic" },
  { key: "rubro", label: "Industry", placeholder: "에스테틱/피부과" },
  { key: "zona", label: "Area", placeholder: "서울 강남구" },
  { key: "telefono", label: "Phone", placeholder: "02-555-1010" },
  { key: "instagram", label: "Instagram", placeholder: "handle (without @)" },
  { key: "naver_place", label: "Naver Place", placeholder: "https://..." },
  { key: "kakao", label: "Kakao", placeholder: "channel id" },
  { key: "decisor", label: "Contact person", placeholder: "name" },
];

export function AddProspectoModal({
  onClose, onCreated,
}: {
  onClose: () => void;
  onCreated: (p: Prospecto) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setValues((cur) => ({ ...cur, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!values["업체명"]?.trim()) {
      setError("Please enter a business name.");
      return;
    }
    // payload: solo claves no vacías
    const payload: Record<string, string> = {};
    for (const { key } of FIELDS) {
      const v = values[key]?.trim();
      if (v) payload[key] = v;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/prospectos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const { prospecto } = (await res.json()) as { prospecto: Prospecto };
      onCreated(prospecto);
      onClose();
    } catch {
      setError("Save failed. Please try again.");
      setSubmitting(false);
    }
  }

  const input = "w-full rounded-sm border border-line-2 bg-surface px-2 py-1.5 text-sm text-ink";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="mt-12 w-full max-w-md space-y-3 rounded-lg border border-line bg-bg p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">Add prospect</h2>
          <Button variant="ghost" type="button" onClick={onClose}>✕</Button>
        </div>

        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-xs font-medium text-ink-2">
              {f.label}{f.required ? <span className="text-coral"> *</span> : null}
            </span>
            <input
              className={input}
              value={values[f.key] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => set(f.key, e.target.value)}
            />
          </label>
        ))}

        {error ? <p className="text-xs text-urgent">{error}</p> : null}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "..." : "Add"}</Button>
        </div>
      </form>
    </div>
  );
}
