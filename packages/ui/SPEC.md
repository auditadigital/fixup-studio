# packages/ui — Design system compartido

Materializa el **Fixup Studio - Style Guide** como tokens + componentes reutilizables por landing y dashboard. Fuente: `Korea/Fixup Studio - Style Guide (standalone).html` y `Korea/fixup-reports/assets/shared.css`.

## Tokens (tema claro)

```
--bg #FBF8F2 · --bg-2 #F4EEE3 · --surface #FFFFFF · --cream #F0E9DB · --sand #E8DCC9
--ink #2A2520 · --ink-2 #5C544A · --ink-soft #8C8175 · --line #EAE1D2 · --line-2 #DFD4C0
--coral #D85A40 · --coral-600 #BE4733 · --coral-press #A53C2A · --coral-tint #FBEAE4
--naver #2E9E5B · --insta #D24A8B (grad: #F7A04A→#D24A8B→#8A4FBF) · --kakao #F4C20D
--good #3E9E5B · --warn #E0A52E · --urgent #D8492F  (+ tints)
--radius 18px · --radius-sm 12px
```
Tema oscuro disponible en el style guide (mismos nombres de token). Empezar con claro.

## Tipografía
- Display / marca: **Jua**
- Texto: **Noto Sans KR**
- Mono / cifras: **Space Mono**
(Google Fonts.)

## Qué exporta
- `tokens.css` (variables) o config Tailwind (`tailwind-preset.ts`) con estos colores/fuentes.
- Componentes base: `Button` (coral primario / secundario / ghost), `Card`, `Pill` (semáforo), `PlanCard`, `ScoreRing`, `Badge`, `FunnelSteps` (Naver→Insta→Kakao).
- Helpers de semáforo: `scoreColor(n)` → good/warn/urgent.

> Reusar la lógica visual de `Korea/fixup-reports/assets/shared.css` (ya alineada al style guide) como referencia de componentes.
