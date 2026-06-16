import { getProspectos } from "@/lib/repo";
import { PipelineBoard } from "@/components/PipelineBoard";

export const dynamic = "force-dynamic";

export default async function Page() {
  const prospectos = await getProspectos();
  return <PipelineBoard initial={prospectos} />;
}
