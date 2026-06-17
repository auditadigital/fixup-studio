# Captación en Corea — canales y skill de outreach (Fixup Studio)

Decisión de cómo prospectar en frío en Corea, base legal, y spec para adaptar la skill `campana-csv` de LATAM.

## Decisión

**Canal primario: Instagram DM personalizado (uno a uno, manual).**
**Secundario: Naver / teléfono / visita** para negocios fuertes en Naver pero flojos en Instagram.
**Introducción siempre vía la mini-auditoría gratis** — no se prospecta vendiendo, se prospecta regalando un diagnóstico honesto.

## Base legal (por qué NO hacemos blasting)

Ley aplicable: **정보통신망법 (Network Act)**.
- Toda **publicidad** por medios electrónicos (email, SMS, KakaoTalk 친구톡) exige **opt-in previo y explícito**, con **(광고)** en el asunto, identidad del emisor, opt-out gratis y dirección física. Renovación cada 2 años; noche (21–08h) con permiso aparte.
- La excepción B2B de consentimiento implícito aplica solo a **clientes con transacción previa** (6 meses), no a prospectos en frío.
- **알림톡** llega sin channel-add pero solo para mensajes **informativos con plantilla aprobada** (no venta). **친구톡** es publicitario pero requiere opt-in (ser amigo del canal). → Ninguno sirve para captar en frío; son para **operar clientes ya activos** (Fase 3).

**Qué NO hacer:** email/SMS/Kakao masivo a prospectos; bots de DM automatizados; mensajes de noche; insistir tras un "no".

**Qué SÍ:** DMs personalizados manuales de bajo volumen, anclados en una observación real, ofreciendo valor gratis; llamadas/visitas; respetar cualquier negativa al instante.

## Cómo adapta la skill (`fixup-outreach`, ex `campana-csv`)

Reusa el motor de LATAM ("procesar CSV de prospectos → generar mensaje → taggear estado en el pipeline"), cambiando el output:

**Input:** CSV de prospectos con, idealmente: `nombre_negocio`, `rubro`, `zona`, `instagram`, `naver_place`, `telefono`, `observacion` (algo real del perfil).

**Output por prospecto:**
1. **DM de Instagram personalizado en coreano**, anclado en la `observacion` real + oferta de mini-auditoría gratis. Para **envío manual** (no automatizado).
2. Si no hay Instagram pero sí Naver/teléfono → **guión de llamada/visita en coreano**.
3. Marca el estado en el pipeline (`prospectos.json`): `nuevo → contactado → mini-enviada → propuesta-enviada → …`.

**Reglas de la skill:** un mensaje por prospecto (no copy-paste idéntico masivo), tono cálido y honesto, sin (광고) porque es una introducción personal y no un anuncio masivo, y siempre con salida amable ("원치 않으시면 편하게 말씀해 주세요").

## Plantillas de mensaje (coreano — borradores, validar con esposa)

> Son borradores. Tu esposa ajusta tono/naturalidad antes de usar.

**DM inicial (Instagram):**
```
안녕하세요, [업체명] 사장님 😊
[관찰 한 줄 — 예: 인스타 사진 분위기가 정말 좋아서 연락드려요 / 시그니처 메뉴가 눈에 띄어서요].

저희는 동네 가게의 네이버·인스타그램·카카오톡을 솔직하게 점검해드리는 '픽스업 스튜디오'예요.
혹시 괜찮으시면 [업체명]의 온라인 노출 상태를 무료로 간단히 진단해서 보내드려도 될까요?
부담 갖지 마시고 편하게 보시라고 드리는 거예요.

원치 않으시면 편하게 말씀해 주세요. 좋은 하루 되세요!
```

**Follow-up (al enviar la mini-auditoría):**
```
[업체명] 사장님, 약속드린 무료 진단 보내드려요 📋
지금 잘 되고 있는 점과, 매출로 이어질 수 있는데 놓치고 있는 부분 몇 가지를 정리했어요.
보시고 궁금한 점 있으시면 편하게 물어보세요. 도움이 되었으면 좋겠습니다!
```

**Guión de llamada / Naver TalkTalk (negocios fuertes en Naver):**
```
안녕하세요, [업체명]이시죠? 저는 동네 가게 온라인 마케팅을 돕는 픽스업 스튜디오의 [이름]입니다.
사장님 가게 네이버·인스타를 보고 연락드렸어요. 무료로 간단한 진단을 정리해서 보내드리고 있는데,
받아보실 수 있게 연락처(카카오/인스타) 하나 알려주실 수 있을까요?
```

## Checklist de cumplimiento (antes de cada tanda)

- [ ] Mensajes personalizados, no idénticos en masa.
- [ ] Volumen bajo, envío manual (sin bots).
- [ ] Nada de (광고) electrónico masivo; es una introducción de valor.
- [ ] No mensajear de noche (21–08h).
- [ ] Respetar cualquier negativa de inmediato; no reinsistir.
- [ ] La oferta es la **mini-auditoría gratis**, no una venta directa.
