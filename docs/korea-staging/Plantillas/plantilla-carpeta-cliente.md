# Plantilla de carpeta-cliente — Fixup Studio / 픽스업 스튜디오

Estructura estándar para cada cliente. Al dar de alta uno nuevo, copiar esta estructura dentro de `Korea/Clientes/` renombrando la carpeta como `[YYYY]-[nombre-negocio]` (ej: `2026-cafe-seoul`).

> Interno = español/operativo. Lo que va al cliente (auditoría, reportes, posts) = **coreano**.

## Estructura de subcarpetas

```
[YYYY]-[nombre-negocio]/
├── 00_info/                  ← ficha del cliente, contrato, accesos
│   ├── ficha-cliente.md       (datos, rubro, plan, contacto, tono de voz)
│   ├── accesos.md             (qué cuentas gestionamos — SIN contraseñas en claro)
│   └── contrato/              (사업자등록증 del cliente, acuerdo, facturas)
├── 01_auditoria/             ← el 진단 inicial
│   ├── screenshots/           (capturas de Naver/Instagram/Kakao que pasa Nacho)
│   ├── [negocio]_진단.xlsx     (copia de Korea/Plantillas/픽스업스튜디오_진단_템플릿.xlsx)
│   └── [negocio]_진단_리포트.pdf (reporte final en coreano para entregar)
├── 02_contenido/             ← lo que producimos cada mes
│   ├── calendario/            (copia del calendario mensual de contenido)
│   ├── blog/                  (posts SEO en coreano — 1 archivo por post)
│   └── instagram/             (copy + notas de cada pieza)
├── 03_reportes/              ← reportes mensuales de resultados
│   └── [YYYY-MM]_리포트.pdf
├── 04_metricas/              ← datos crudos que deja Nacho/esposa para el reporte
│   └── [YYYY-MM]_metricas.md  (Naver Place, reseñas, Kakao, link-in-bio, IG)
└── 05_assets/                ← logos, fotos, gráficos del cliente
```

## Archivo base: `00_info/ficha-cliente.md`

```markdown
# Ficha de cliente — [업체명]

- **업체명 (negocio):**
- **업종 (rubro):**           # 에스테틱 / 카페 / 식당 / 미용실 / 치과 ...
- **위치 (zona):**
- **사장님 (contacto):**       # nombre + Kakao/teléfono
- **Plan contratado:**         # 진단 / 기본 / 성장 / 프리미엄
- **Fecha de alta:**
- **Estado:**                  # prospecto / auditoría / activo / pausado

## Canales que gestionamos
- Naver Place:                 # URL
- Naver Blog:
- Instagram:                   # @handle
- Kakao Channel:

## Tono de voz (para contenido en coreano)
- **Estilo:**                  # 친근함 / 전문적 / 고급스러움 ...
- **Tratamiento:**             # 존댓말 / 반말 친근체
- **Hacer:**                   # palabras/temas que SÍ
- **Evitar:**                  # palabras/temas que NO
- **Referencias:**             # cuentas que le gustan al cliente

## Objetivos del cliente
- (qué quiere lograr — más reservas, más단골, abrir local nuevo, etc.)
```

## Convenciones

Nombrar todo lo del cliente con prefijo de fecha `YYYY-MM` para que ordene cronológicamente. Reportes y posts siempre en coreano. La auditoría se trabaja sobre una **copia** de la plantilla maestra (`Korea/Plantillas/픽스업스튜디오_진단_템플릿.xlsx`) — nunca editar la plantilla original. Nunca guardar contraseñas en texto plano en `accesos.md`; anotar solo qué se gestiona y dónde está la credencial (gestor de contraseñas).
