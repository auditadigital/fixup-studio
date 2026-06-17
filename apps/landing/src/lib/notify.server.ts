import "server-only";
import type { Lead } from "@fixup/types";

// Aviso a la operadora de un lead nuevo. Best-effort: NUNCA lanza ni rechaza
// (la persistencia ya es la fuente de la verdad; el aviso es accesorio).
//
// Canales (server env, Vercel):
//   KAKAO_WEBHOOK_URL  → POST JSON al webhook
//   NOTIFY_EMAIL       → destino (sin transport SMTP en el MVP: se loguea estructurado)
//
// `failed` = el insert en DB falló → red de seguridad: avisar igual para no perder el lead.
export async function notifyOperator(
  lead: Lead,
  opts: { failed?: boolean } = {},
): Promise<void> {
  const prefix = opts.failed ? "⚠️ 저장 실패(수동 처리 필요) · " : "";
  const text =
    `${prefix}새 리드: ${lead["업체명"]} / ${lead.nombre} / ${lead.telefono ?? "-"}` +
    (lead.instagram ? ` / IG:${lead.instagram}` : "") +
    (lead.naver_place ? ` / Naver:${lead.naver_place}` : "");

  const tasks: Promise<unknown>[] = [];

  const kakao = process.env.KAKAO_WEBHOOK_URL;
  if (kakao) {
    tasks.push(
      fetch(kakao, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, lead }),
      }),
    );
  }

  const email = process.env.NOTIFY_EMAIL;
  if (email) {
    // MVP sin SMTP: log estructurado (un worker/integración puede recogerlo).
    console.info(JSON.stringify({ kind: "notify-email", to: email, text, lead }));
  }

  if (!kakao && !email) {
    console.info(JSON.stringify({ kind: "notify-fallback", text, lead }));
  }

  // allSettled → un canal caído no tumba al otro ni propaga error.
  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === "rejected") console.error("notify_channel_failed", r.reason);
  }
}
