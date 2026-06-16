import { repo } from "@/lib/repo";
import type { Estado } from "@fixup/types";

export const dynamic = "force-dynamic";

const VALID: Estado[] = [
  "nuevo", "contactado", "mini-lista", "mini-enviada",
  "propuesta-enviada", "negociacion", "cerrado", "perdido",
];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await req.json()) as { estado?: string };
  if (!body.estado || !VALID.includes(body.estado as Estado)) {
    return Response.json({ error: "invalid estado" }, { status: 400 });
  }
  try {
    const updated = await repo.updateEstado(id, body.estado as Estado);
    return Response.json({ persisted: true, prospecto: updated });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES") {
      return Response.json(
        { persisted: false, message: "Read-only filesystem — no persiste hasta Supabase" },
        { status: 503 },
      );
    }
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
