"use client";
import { useMemo, useRef, useState } from "react";
import type { Estado, Prospecto } from "@fixup/types";
import { PIPELINE_COLUMNS, columnForEstado } from "@fixup/types";
import { Metrics } from "./Metrics";
import { Toolbar } from "./Toolbar";
import { ProspectoCard } from "./ProspectoCard";
import { ProspectoDrawer } from "./ProspectoDrawer";
import { AddProspectoModal } from "./AddProspectoModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "@fixup/ui";
import { useFilters } from "@/lib/useFilters";

export function PipelineBoard({ initial }: { initial: Prospecto[] }) {
  const [prospectos, setProspectos] = useState<Prospecto[]>(initial);
  const [selected, setSelected] = useState<Prospecto | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [reloading, setReloading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Prospecto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { filters, setFilters } = useFilters();

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return prospectos.filter((p) => {
      if (filters.rubro && p.rubro !== filters.rubro) return false;
      if (filters.zona && p.zona !== filters.zona) return false;
      if (filters.estado && p.estado !== filters.estado) return false;
      if (q) {
        const hay = `${p["업체명"]} ${p.zona ?? ""} ${p.instagram ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [prospectos, filters]);

  async function reload() {
    setReloading(true);
    try {
      const res = await fetch("/api/prospectos", { cache: "no-store" });
      if (!res.ok) throw new Error(`reload failed: ${res.status}`);
      const data = (await res.json()) as { prospectos: Prospecto[] };
      setProspectos(data.prospectos);
    } catch {
      showToast("새로고침 실패");
    } finally {
      setReloading(false);
    }
  }

  async function moveTo(estado: Estado) {
    if (!dragId) return;
    const id = dragId;
    setDragId(null);
    let snapshot: Prospecto[] = [];
    setProspectos((cur) => {
      snapshot = cur;
      return cur.map((p) => (p.id === id ? { ...p, estado } : p));
    });
    try {
      const res = await fetch(`/api/prospectos/${id}/estado`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (res.status === 503) {
        showToast("적용됨 (뷰) — Supabase 전 영구저장 안 됨");
      } else if (!res.ok) {
        setProspectos(snapshot);
        showToast("변경 실패");
      }
    } catch {
      setProspectos(snapshot);
      showToast("변경 실패");
    }
  }

  async function doDelete() {
    const target = confirmDelete;
    if (!target) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/prospectos/${encodeURIComponent(target.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`${res.status}`);
      setProspectos((cur) => cur.filter((p) => p.id !== target.id));
      if (selected?.id === target.id) setSelected(null);
      setConfirmDelete(null);
      showToast(`${target["업체명"]} 삭제됨`);
    } catch {
      showToast("삭제 실패");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4 p-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">픽스업 파이프라인</h1>
        <Button onClick={() => setAdding(true)}>+ 프로스펙트 추가</Button>
      </header>

      <Metrics prospectos={prospectos} />
      <Toolbar
        prospectos={prospectos}
        filters={filters}
        setFilters={setFilters}
        onReload={reload}
        reloading={reloading}
      />

      <div className="flex gap-3 overflow-x-auto pb-2">
        {PIPELINE_COLUMNS.map((col) => {
          const cards = filtered.filter((p) => columnForEstado(p.estado).key === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => moveTo(col.dropTarget)}
              className="flex w-64 shrink-0 flex-col gap-2 rounded bg-bg-2 p-2"
            >
              <div className="flex items-center justify-between px-1">
                <span className="font-display text-sm text-ink">{col.label}</span>
                <span className="font-mono text-xs text-ink-soft">{cards.length}</span>
              </div>
              {cards.map((p) => (
                <ProspectoCard key={p.id} prospecto={p} onOpen={setSelected} onDragStart={setDragId} onDelete={setConfirmDelete} />
              ))}
            </div>
          );
        })}
      </div>

      <ProspectoDrawer prospecto={selected} onClose={() => setSelected(null)} onDelete={setConfirmDelete} />

      {adding ? (
        <AddProspectoModal
          onClose={() => setAdding(false)}
          onCreated={(p) => {
            setProspectos((cur) => [p, ...cur]);
            showToast(`${p["업체명"]} 추가됨`);
          }}
        />
      ) : null}

      {confirmDelete ? (
        <ConfirmDialog
          title="프로스펙트 삭제"
          message={`'${confirmDelete["업체명"]}' 프로스펙트를 삭제할까요? 되돌릴 수 없습니다.`}
          confirmLabel="삭제"
          busy={deleting}
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-sm bg-ink px-4 py-2 text-sm text-white">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
