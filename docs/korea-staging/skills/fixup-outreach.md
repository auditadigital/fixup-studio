---
name: fixup-outreach
description: "Procesa un CSV de prospectos coreanos y prepara el outreach por Instagram DM: corre la mini-auditoría por prospecto, genera el DM coreano personalizado (anclado en la observación real) + la imagen del reporte para adjuntar, y taggea el CSV. NO auto-envía (envío manual, uno a uno). Triggers: 'procesar CSV', 'preparar campaña', 'outreach de [archivo].csv', 'preparar DMs'."
---

# Outreach Outbound desde CSV — Instagram DM (Fixup Studio / 픽스업 스튜디오)

Adaptación de `campana-csv` de LATAM. En vez de crear borradores de Gmail, prepara **paquetes de Instagram DM** listos para envío **manual**. Respeta la decisión legal/marca (ver `Korea/captacion-canales-corea.md`).

**Reglas fundamentales:**
- **NO auto-enviar.** Esta skill PREPARA; el envío es manual, uno a uno (정보통신망법 + reglas de Instagram). Nada de bots ni (광고) masivo.
- Un subagente por prospecto, en paralelo, para preparar.
- Personalización real: cada DM se ancla en la `관찰메모` del CSV. Nada de copy idéntico masivo.
- Solo taggear el CSV. No tocar `prospectos.json` desde el subagente (lo hace el orquestador al final, opcional).
- Skip si no hay `인스타그램` ni `네이버플레이스` → al summary.
- No reprocesar filas donde `DM준비일자` ya tiene valor.

---

## Paso 1 — Leer CSV y filtrar

El usuario indica el CSV (ej: `Korea/Prospectos/prospectos-NUEVOS-KR-2026-06-16.csv`).
Leé cada fila (columnas en coreano): `업체명`, `업종`, `지역`, `인스타그램`, `네이버플레이스`, `카카오채널`, `관찰메모`, `DM준비일자` (si existe).

**Filas a procesar:** (`인스타그램` o `네이버플레이스` no vacío) AND (`DM준비일자` vacío).
Filas sin canal → lista de skips.

---

## Paso 2 — IDs y paths por fila
- `id` = slug kebab-case del 업체명 (romanizado).
- `fecha-corta` = hoy `YY-MM-DD`.
- `output_dir` = `clientes/[id]/[fecha-corta]`.

---

## Paso 3 — Despachar subagentes en paralelo (preparación)

Por cada prospecto, un subagente con este prompt (reemplazar `[...]`):

```
Sos un agente de preparación de outreach. Procesás UN prospecto local coreano. NO enviás nada.

DATOS:
- 업체명:      [업체명]
- 업종:        [업종]
- 인스타그램:  [인스타그램]
- 네이버플레이스:[네이버플레이스]
- 관찰메모:    [관찰메모]
- id:         [id]
- output_dir: [output_dir]

━━━ PASO A — MINI-AUDITORÍA ━━━
Read: .claude/skills/fixup-mini-auditoria.md
Ejecutá el protocolo para este negocio usando como input el 네이버플레이스 + 인스타그램 (WebFetch lo público).
Si falta evidencia de un canal, dejá ese factor sin puntuar y marcá "needs_screenshot" (no inventes).
Diferencias en modo batch:
  - NO actualizar prospectos.json
  - NO ejecutar `open`
  - SÍ generar mini-auditoria-[id].html y exportarlo a PNG (mini-auditoria-[id].png)

━━━ PASO B — DM PERSONALIZADO (coreano) ━━━
Construí el DM inicial anclado en la `관찰메모` real, usando la plantilla de Korea/captacion-canales-corea.md:

  안녕하세요, [업체명] 사장님 😊
  [관찰메모 기반 한 줄 — 예: "인스타 사진 분위기가 정말 좋아서 연락드려요"].

  저희는 동네 가게의 네이버·인스타그램·카카오톡을 솔직하게 점검해드리는 '픽스업 스튜디오'예요.
  혹시 괜찮으시면 [업체명]의 온라인 노출 상태를 무료로 간단히 진단해서 보내드려도 될까요?
  부담 갖지 마시고 편하게 보시라고 드리는 거예요.

  원치 않으시면 편하게 말씀해 주세요. 좋은 하루 되세요!

Guardá el texto en [output_dir]/dm-[id].txt

━━━ PASO C — GUARDAR RESULTADO ━━━
mkdir -p [output_dir]
Guardá [output_dir]/outreach-result.json:
{
  "업체명": "[업체명]", "id": "[id]", "인스타그램": "[인스타그램]",
  "status": "ready" | "needs_screenshot" | "mini_error",
  "score_mini": [N o null],
  "png": "mini-auditoria-[id].png",
  "dm": "dm-[id].txt",
  "timestamp": "[ISO]"
}

Respondé UNA LÍNEA:
  DONE: [업체명] | [status] | score=[N] | @[인스타그램]
```

---

## Paso 4 — Recolectar resultados
Leé cada `[output_dir]/outreach-result.json`. Tabla en memoria: 업체명, instagram, score_mini, status.

---

## Paso 5 — Tagear CSV
Para cada fila con `status` ∈ {`ready`,`needs_screenshot`}: agregá/actualizá columna `DM준비일자` con el timestamp (y `DM상태`). Guardá el CSV con Write (mismo path).
Si no existía la columna, agregala al header y a todas las filas.

---

## Paso 6 — Resumen + cola de envío manual

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📩 CAMPAÑA DE DM PREPARADA (envío MANUAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Listos para enviar:        N
📸 Necesitan screenshot:      N
⏭  Skipeados (sin canal):     N
❌ Errores:                    N
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cola de envío (manual, uno a uno):
| 업체명 | @instagram | score | adjuntar | DM |
| ...   | ...        | ...   | mini-auditoria-[id].png | dm-[id].txt |

⚠ Reglas de envío: manual, no de noche (21–08h), respetar negativas, no reinsistir.
   Tras enviar cada uno: 'Actualizá [업체명] a mini-enviada'.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

> Esta skill PREPARA. El envío lo hacés vos/tu esposa a mano, lo que mantiene el outreach legal, humano y de marca. Ver `Korea/captacion-canales-corea.md`.
