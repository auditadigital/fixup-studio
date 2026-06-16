export type Estado =
  | "nuevo" | "contactado" | "mini-lista" | "mini-enviada"
  | "propuesta-enviada" | "negociacion" | "cerrado" | "perdido";

export type Rubro =
  | "에스테틱/피부과" | "미용실" | "카페" | "식당"
  | "필라테스/헬스장" | "치과" | string;

export type Plan = "기본" | "성장" | "프리미엄";

export interface Scores {
  global?: number;
  naver?: number;
  instagram?: number;
  kakao?: number;
  compra?: number;
}

export interface Prospecto {
  id: string;
  업체명: string;
  rubro: Rubro;
  zona?: string;
  instagram?: string;
  naver_place?: string;
  kakao?: string;
  telefono?: string;
  estado: Estado;
  observacion?: string;
  scores_mini?: number;
  scores?: Scores;
  plan_recomendado?: Plan;
  precio_propuesto?: number;
  monto_cerrado?: number;
  fecha_contacto?: string;
  fecha_mini?: string;
  fecha_completa?: string;
  fecha_propuesta?: string;
  reportes?: { label: string; url: string }[];
}

export interface Lead {
  nombre: string;
  업체명: string;
  rubro: Rubro;
  telefono?: string;
  instagram?: string;
  naver_place?: string;
  mensaje?: string;
  creado: string;
}

export * from "./pipeline.js";
