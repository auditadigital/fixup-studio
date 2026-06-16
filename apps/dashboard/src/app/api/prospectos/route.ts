import { getProspectos } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET() {
  const prospectos = await getProspectos();
  return Response.json({ prospectos });
}
