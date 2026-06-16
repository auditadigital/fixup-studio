import { getProspectos } from "@/lib/repo";

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
