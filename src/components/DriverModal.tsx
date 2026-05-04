"use client";
import { useState } from "react";
import type { Driver } from "@/lib/supabase";
import { toArabic } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";
import s from "./Modal.module.css";

type Props = { edit?: Driver; onSave: (d: Omit<Driver, "id">) => void; onClose: () => void; };

export default function DriverModal({ edit, onSave, onClose }: Props) {
  const { tr } = useLang();
  const [name,   setName]   = useState(edit?.name   ?? "");
  const [arabic, setArabic] = useState(edit?.arabic ?? "");
  const [car,    setCar]    = useState(edit?.car     ?? "");
  const [phone,  setPhone]  = useState(edit?.phone   ?? "");
  const [status, setStatus] = useState<"Active"|"Inactive">(edit?.status ?? "Active");
  const [err,    setErr]    = useState("");

  const onNameChange = (v: string) => {
    setName(v);
    const ar = toArabic(v);
    setArabic(ar);
  };

  const submit = () => {
    if (!name.trim()) { setErr(tr.driverNameRequired); return; }
    setErr("");
    onSave({ name: name.trim(), arabic: arabic.trim() || toArabic(name), car: car.trim(), phone: phone.trim(), status });
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${s.modal} ${s.modalSm}`}>
        <div className={s.head}>
          <h2>{edit ? tr.editDriverTitle : tr.addDriverTitle}</h2>
          <button className="btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className={s.body}>
          {err && <p style={{ color: "var(--red)", marginBottom: 12, fontSize: 13 }}>{err}</p>}
          <div className={s.grid}>
            <div className={`${s.formGroup} ${s.full}`}>
              <label>{tr.driverName}</label>
              <input value={name} onChange={e => onNameChange(e.target.value)} placeholder="Ahmed Hassan" />
            </div>
            <div className={`${s.formGroup} ${s.full}`}>
              <label>{tr.arabicNameAuto}</label>
              <div className={s.arabicPreview}>{arabic || "—"}</div>
              <input value={arabic} onChange={e => setArabic(e.target.value)}
                placeholder={tr.editableArabic} style={{ direction: "rtl", marginTop: 6 }} />
            </div>
            <div className={s.formGroup}>
              <label>{tr.assignToCar}</label>
              <input value={car} onChange={e => setCar(e.target.value)} placeholder="DXB-1234" />
            </div>
            <div className={s.formGroup}>
              <label>{tr.phone}</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971…" />
            </div>
            <div className={`${s.formGroup} ${s.full}`}>
              <label>{tr.status}</label>
              <select value={status} onChange={e => setStatus(e.target.value as "Active"|"Inactive")}>
                <option value="Active">{tr.statusActive}</option>
                <option value="Inactive">{tr.statusInactive}</option>
              </select>
            </div>
          </div>
        </div>
        <div className={s.foot}>
          <button className="btn-ghost" onClick={onClose}>{tr.cancel}</button>
          <button className="btn-primary" onClick={submit}>{tr.saveDriver}</button>
        </div>
      </div>
    </div>
  );
}
