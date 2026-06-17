import { NextResponse } from "next/server";
import { zLead } from "@/lib/leads";
import { notifyOperator } from "@/lib/notify.server";
import { createStore } from "@fixup/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = zLead.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", issues: parsed.error.flatten() }, { status: 400 });
  }

  const lead = { ...parsed.data, creado: new Date().toISOString() };

  // 1. Persistir en Supabase (estado 'nuevo') — fuente de la verdad.
  let prospecto;
  try {
    prospecto = await createStore().appendLead(lead);
  } catch (e) {
    console.error("lead_insert_failed", e);
    // Red de seguridad: el insert falló → avisar igual para no perder el lead.
    try {
      await notifyOperator(lead, { failed: true });
    } catch (ne) {
      console.error("notify_failed", ne);
    }
    return NextResponse.json({ error: "store_failed" }, { status: 500 });
  }

  // 2. Notificar a la operadora. El lead ya quedó guardado → un fallo aquí NO falla la request.
  try {
    await notifyOperator(lead);
  } catch (e) {
    console.error("notify_failed", e);
  }

  return NextResponse.json({ ok: true, id: prospecto.id }, { status: 200 });
}
