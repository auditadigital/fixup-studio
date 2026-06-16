# packages/types — Tipos compartidos

Tipos TypeScript que comparten landing, dashboard y (conceptualmente) el engine. Fuente de verdad de la forma de los datos en `data/prospectos.json`.

## Tipos

```ts
export type Estado =
  | "nuevo" | "contactado" | "mini-lista" | "mini-enviada"
  | "propuesta-enviada" | "negociacion" | "cerrado" | "perdido";

export type Rubro =
  | "에스테틱/피부과" | "미용실" | "카페" | "식당"
  | "필라테스/헬스장" | "치과" | string;

export type Plan = "기본" | "성장" | "프리미엄";

export interface Scores {
  global?: number;      // 0-100
  naver?: number;
  instagram?: number;
  kakao?: number;
  compra?: number;      // 구매까지의 길
}

export interface Prospecto {
  id: string;                 // slug
  업체명: string;             // nombre del negocio
  rubro: Rubro;
  zona?: string;              // 서울 강남구 …
  instagram?: string;         // handle sin @
  naver_place?: string;       // URL
  kakao?: string;
  telefono?: string;
  estado: Estado;
  observacion?: string;       // 관찰메모
  scores_mini?: number;       // score de la mini (0-100)
  scores?: Scores;            // 완전 진단
  plan_recomendado?: Plan;
  precio_propuesto?: number;  // ₩
  monto_cerrado?: number;     // ₩
  fecha_contacto?: string;    // YYYY-MM-DD
  fecha_mini?: string;
  fecha_completa?: string;
  fecha_propuesta?: string;
  reportes?: { label: string; url: string }[];  // links a reportes/PDF (los escribe el engine)
}

// Lead que crea la landing (se convierte en Prospecto estado "nuevo")
export interface Lead {
  nombre: string;
  업체명: string;
  rubro: Rubro;
  telefono?: string;
  instagram?: string;
  naver_place?: string;
  mensaje?: string;
  creado: string;             // ISO
}
```

> Mantener estos tipos en sync con las columnas del CSV (`Korea/Prospectos/MASTER-prospectos-KR.csv`) y con lo que escriben las skills del engine.
