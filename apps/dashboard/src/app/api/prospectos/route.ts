import { revalidatePath } from "next/cache";
import { getProspectos, repo, zProspectoCreate } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const prospectos = await getProspectos();
    return Response.json({ prospectos });
  } catch (err) {
    console.error("list prospectos failed", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}

// Alta manual de un prospecto (estado 'nuevo'). Protegido por el Basic-auth del middleware.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = zProspectoCreate.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "validation", issues: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const prospecto = await repo.create(parsed.data);
    revalidatePath("/");
    return Response.json({ prospecto }, { status: 201 });
  } catch (err) {
    console.error("create prospecto failed", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
