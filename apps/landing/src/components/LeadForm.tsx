"use client";
import * as React from "react";
import { Icon } from "@/components/icons";
import { zLead } from "@/lib/leads";
import { BIZ } from "@/lib/content";

export function LeadForm() {
  const [nombre, setNombre] = React.useState("");
  const [업체명, set업체명] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [rubro, setRubro] = React.useState<string>(BIZ[0]);
  const [link, setLink] = React.useState("");
  const [mensaje, setMensaje] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});
  const [sent, setSent] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const [toastVisible, setToastVisible] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    // Give browser a frame to mount the element before toggling .show
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setToastVisible(true));
    });
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = setTimeout(() => setToast(""), 300);
    }, 2500);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      nombre: nombre.trim(),
      업체명: 업체명.trim(),
      rubro: rubro.trim(),
      telefono: telefono.trim(),
      naver_place: link.trim() || undefined,
      mensaje: mensaje.trim() || undefined,
    };

    const parsed = zLead.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const newErrors: Record<string, boolean> = {};
      if (fieldErrors.nombre?.length) newErrors.nombre = true;
      if (fieldErrors["업체명"]?.length) newErrors["업체명"] = true;
      if (fieldErrors.telefono?.length) newErrors.telefono = true;
      setErrors(newErrors);
      showToast("입력을 확인해 주세요");
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        setSent(true);
      } else {
        showToast("잠시 후 다시 시도해 주세요");
        setSubmitting(false);
      }
    } catch {
      showToast("잠시 후 다시 시도해 주세요");
      setSubmitting(false);
    }
  }

  return (
    <div className="form-card">
      {sent ? (
        <div className="form-success">
          <span className="ck">{Icon.check({ width: 30, height: 30 })}</span>
          <h4>신청이 접수됐어요!</h4>
          <p>담당자가 1영업일 안에 카카오톡 또는 전화로 연락드릴게요. 감사합니다 🙏</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="ft jua">무료 진단 신청하기</div>
          <p className="fsub">1분이면 충분해요. 진단 결과는 무료로 보내드립니다.</p>

          {/* 사장님 성함 */}
          <div className={`field${errors.nombre ? " err" : ""}`}>
            <label htmlFor="lf-nombre">
              사장님 성함 <span className="rq">*</span>
            </label>
            <input
              id="lf-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="홍길동"
              aria-invalid={errors.nombre ? true : undefined}
            />
            <div className="em" role="alert">성함을 입력해 주세요.</div>
          </div>

          {/* 업체명 */}
          <div className={`field${errors["업체명"] ? " err" : ""}`}>
            <label htmlFor="lf-bizname">
              업체명 <span className="rq">*</span>
            </label>
            <input
              id="lf-bizname"
              type="text"
              value={업체명}
              onChange={(e) => set업체명(e.target.value)}
              placeholder="강남 OO 클리닉"
              aria-invalid={errors["업체명"] ? true : undefined}
            />
            <div className="em" role="alert">업체명을 입력해 주세요.</div>
          </div>

          {/* 연락처 */}
          <div className={`field${errors.telefono ? " err" : ""}`}>
            <label htmlFor="lf-telefono">
              연락처 <span className="rq">*</span>
            </label>
            <input
              id="lf-telefono"
              type="text"
              inputMode="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="010-1234-5678"
              aria-invalid={errors.telefono ? true : undefined}
            />
            <div className="em" role="alert">올바른 연락처를 입력해 주세요.</div>
          </div>

          {/* 업종 */}
          <div className="field">
            <label>업종</label>
            <div className="chips-in">
              {BIZ.map((b) => (
                <button
                  key={b}
                  type="button"
                  className="chip-r"
                  data-on={rubro === b ? "1" : "0"}
                  onClick={() => setRubro(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Instagram / 네이버 플레이스 (선택) */}
          <div className="field">
            <label htmlFor="lf-link">Instagram / 네이버 플레이스 (선택)</label>
            <input
              id="lf-link"
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="@handle 또는 네이버 플레이스 링크"
            />
          </div>

          {/* 가게 주소 또는 메시지 (선택) */}
          <div className="field">
            <label htmlFor="lf-mensaje">가게 주소 또는 메시지 (선택)</label>
            <textarea
              id="lf-mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="가게 이름·지역만 적어주셔도 됩니다."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={submitting}
          >
            무료 진단 받기 <span className="ar">→</span>
          </button>
          <p className="form-fine">
            신청 시 개인정보는 진단·상담 목적에만 사용되며, 광고 수신과 무관합니다.
          </p>
        </form>
      )}

      {toast && (
        <div className={`toast${toastVisible ? " show" : ""}`}>{toast}</div>
      )}
    </div>
  );
}
