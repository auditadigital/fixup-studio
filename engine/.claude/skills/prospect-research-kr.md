---
name: prospect-research-kr
description: "Investiga y agrega prospectos B2B nuevos (PyMEs locales coreanas) a un CSV maestro, manteniendo un formato fijo orientado a outreach por Instagram DM + Naver, y deduplicando contra empresas ya investigadas. Usar cuando el usuario pida 'buscar prospectos', 'ampliar el CSV', 'sumar leads', 'research de clientes', 'más empresas para outbound' en Corea. Optimizado para SMBs/PyMEs locales coreanas (에스테틱/피부과, 미용실, 카페/식당, 필라테스/헬스장, 치과). NO para enterprise ni grandes franquicias."
---

# Prospect Research Corea (Fixup Studio / 픽스업 스튜디오)

Adaptación coreana de `prospect-research-ar`. Investiga PyMEs locales coreanas y las agrega a un CSV maestro, con un **ángulo/observación real** por prospecto que alimenta el DM personalizado de `fixup-outreach`.

**Regla de oro:** datos de contacto REALES o vacíos. Nunca inventados.
**Outreach objetivo:** Instagram DM (primario) + Naver/teléfono (secundario). Por eso el campo crítico es **인스타그램** + una **관찰메모** específica.

---

## El formato (13 columnas — fijo, headers y valores en coreano)

```
업체명,업종,지역,인스타그램,네이버플레이스,카카오채널,전화번호,담당자,규모,디지털점수,활성채널,관찰메모,추가일자
```

- **업체명** — nombre del negocio (coreano).
- **업종** — `에스테틱/피부과` · `미용실` · `카페` · `식당` · `필라테스/헬스장` · `치과` …
- **지역** — ciudad + 구/동 (ej: `서울 강남구`, `부산 해운대구`). Hiperlocal.
- **인스타그램** — @handle real (campo crítico para el DM). Vacío si no tiene.
- **네이버플레이스** — URL del Place. Vacío si no tiene.
- **카카오채널** — canal de Kakao si tiene. Vacío si no.
- **전화번호** — real o vacío (sin placeholders tipo `010-0000-0000`).
- **담당자** — `원장`/`사장`/`대표` + nombre si se conoce. Vacío si no.
- **규모** — `1인` / `소형` / `중형`.
- **디지털점수** — 0–100. **낮을수록 기회가 큼** (presencia floja = mejor prospecto).
- **활성채널** — `네이버` · `인스타` · `둘다` · `인스타만` · `없음`.
- **관찰메모** — 1 frase específica y real para anclar el DM (ej: `인스타 피드 톤은 좋은데 예약 링크가 없음`). NO genérico.
- **추가일자** — `YYYY-MM-DD` de hoy.

Master por defecto: `engine/prospectos/MASTER-prospectos-KR.csv` (relativo a `engine/`: `prospectos/MASTER-prospectos-KR.csv`).

---

## Workflow

### 1. Encontrar el master
Buscá `MASTER-prospectos-KR.csv` en `engine/prospectos/`. Si no existe, crealo solo con el header (avisando).

### 2. Cargar y deduplicar
Leé el master. Normalizá nombres (lowercase, sin espacios) e instagram handles (sin @). Guardá los sets para dedup.

### 3. Clarificar con AskUserQuestion (máx 4)
- **Rubro(s):** ¿el mismo (arranque: 에스테틱/피부과) u otros?
- **Zona(s):** ¿qué ciudad/구? (mezclar zonas arruina la segmentación hiperlocal).
- **Volumen:** ¿cuántos por rubro?
- **Profundidad de la observación:** detallada por prospecto (recomendado).

### 4. Subagentes en paralelo (uno por rubro/zona)
Cada subagente busca con WebSearch/WebFetch en Naver e Instagram negocios reales de ese rubro/zona. Para cada uno extrae lo público y construye la `관찰메모`. Reglas anti-duplicado (pasale la lista del Paso 2). Devuelve filas CSV.

### 5. Consolidar y normalizar (inline con Bash/python)
- `인스타그램`: sin `@`, sin URL completa (solo handle).
- `전화번호`: blanquear placeholders (termina en `0000`, dígito repetido 5+).
- `활성채널`: derivar de qué canales tiene.
- `관찰메모`: máx ~120 chars, específica.
- `추가일자`: fecha de hoy.

### 6. Dedup
Descartá si `업체명` normalizado o `인스타그램` coinciden con el master. Reportá cuántos y por qué.

### 7. Escribir dos archivos
1. `engine/prospectos/prospectos-NUEVOS-KR-<fecha>.csv` (solo nuevos — input de `fixup-outreach`).
2. `engine/prospectos/MASTER-prospectos-KR.csv` actualizado (append).

### 8. Reportar
Total y por rubro, distribución por zona, 3–5 highlights (observación más jugosa o score más bajo = más urgencia), y advertencias (datos inferidos, sin instagram, dudosos).

---

## Reglas no negociables
1. **Contacto REAL o vacío.** Si no viste el `인스타그램`/`전화번호` con tus ojos en Naver/Instagram/directorio, va vacío.
2. **Target = PyME local, NUNCA grandes franquicias.** Excluí cadenas grandes (ej. cafés: 스타벅스/이디야/투썸; estética: cadenas nacionales de 피부과). El target es el negocio de barrio con marca local y presencia digital floja.
3. **Geografía:** respetá la zona pedida. Si encontrás algo bueno fuera, mencionalo en el reporte, no lo metas al CSV.
4. **Calidad > cantidad.** Mejor 20 sólidos con observación accionable que 50 inflados.
5. **`관찰메모` específica y honesta** — es lo que hace que el DM no sea spam. Algo real de SU perfil.

## Cuando NO usar
- Enterprise / grandes cadenas. · Enriquecer datos de empresas ya conocidas. · Leads B2C.
