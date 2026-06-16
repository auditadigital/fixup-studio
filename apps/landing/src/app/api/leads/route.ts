import { NextResponse } from "next/server";
import { zLead } from "@/lib/leads";
import { getLeadStore } from "@/lib/leadStore.server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }
  const parsed = zLead.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation", issues: parsed.error.flatten() }, { status: 400 });
  const lead = { ...parsed.data, creado: new Date().toISOString() };
  try {
    const { id } = await getLeadStore().save(lead);
    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch (e) {
    console.error("lead_save_failed", e);
    return NextResponse.json({ error: "store_failed" }, { status: 500 });
  }
}
