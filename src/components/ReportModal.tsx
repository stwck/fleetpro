"use client";
import { useState } from "react";
import type { Driver, Report } from "@/lib/supabase";
import { toArabic } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";
import s from "./Modal.module.css";

function Odometer({ value }: { value: number }) {
  const str = String(Math.max(0, Math.floor(value))).padStart(6, "0");
  return (
    <div className={s.odoDisplay}>
      {str.split("").map((d, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          {i === str.length - 1 && <span className={s.odoSep}>.</span>}
          <span className={s.odoDigit}>{d}</span>
        </span>
      ))}
    </div>
  );
}

type Props = {
  drivers: Driver[];
  edit?: Report;
  onSave: (data: Omit<Report, "id">) => void;
  onClose: () => void;
};

export default function ReportModal({ drivers, edit, onSave, onClose }: Props) {
  const { tr } = useLang();
  const today = new Date().toISOString().split("T")[0];
  const [date,     setDate]     = useState(edit?.date        ?? today);
  const [driver,   setDriver]   = useState(edit?.driver      ?? "");
  const [arabic,   setArabic]   = useState(edit?.arabic      ?? "");
  const [car,      setCar]      = useState(edit?.car         ?? "");
  const [startKm,  setStartKm]  = useState(edit?.start_km    ?? 0);
  const [endKm,    setEndKm]    = useState(edit?.end_km      ?? 0);
  const [wash,     setWash]     = useState<"Yes"|"No">(edit?.wash ?? "No");
  const [appOrd,   setApp]      = useState(edit?.app_orders  ?? 0);
  const [waOrd,    setWa]       = useState(edit?.wa_orders   ?? 0);
  const [err,      setErr]      = useState("");

  const total   = appOrd + waOrd;
  const km      = Math.max(0, endKm - startKm);
  const status  = total >= 40 ? "Excellent" : total >= 20 ? "Good" : "Average";
  const sCls    = status === "Excellent" ? "s-excellent" : status === "Good" ? "s-good" : "s-average";
  const sLabel  = status === "Excellent" ? tr.statusExcellent : status === "Good" ? tr.statusGood : tr.statusAverage;

  const onDriverChange = (name: string) => {
    setDriver(name);
    const d = drivers.find(x => x.name === name);
    const ar = d?.arabic ?? toArabic(name);
    setArabic(ar);
    if (d?.car) setCar(d.car);
  };

  const submit = () => {
    if (!date || !driver || !car) { setErr(tr.requiredFields); return; }
    if (endKm < startKm)          { setErr(tr.endKmError);     return; }
    setErr("");
    onSave({ date, driver, arabic, car, start_km: startKm, end_km: endKm, wash, app_orders: appOrd, wa_orders: waOrd });
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.head}>
          <h2>{edit ? tr.editReportTitle : tr.addReportTitle}</h2>
          <button className="btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className={s.body}>
          {err && <p style={{ color: "var(--red)", marginBottom: 12, fontSize: 13 }}>{err}</p>}
          <div className={s.grid}>

            <div className={s.formGroup}>
              <label>{tr.date}</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>

            <div className={s.formGroup}>
              <label>{tr.driverName}</label>
              <select value={driver} onChange={e => onDriverChange(e.target.value)}>
                <option value="">{tr.selectDriver}</option>
                {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>

            <div className={s.formGroup}>
              <label>{tr.arabicName}</label>
              <div className={s.arabicPreview}>{arabic || "—"}</div>
            </div>

            <div className={s.formGroup}>
              <label>{tr.carNumber}</label>
              <input value={car} onChange={e => setCar(e.target.value)} placeholder="DXB-1234" />
            </div>

            <div className={s.formGroup}>
              <label>{tr.startKm}</label>
              <input type="number" value={startKm || ""} min={0}
                onChange={e => setStartKm(Number(e.target.value) || 0)} placeholder="0" />
              <Odometer value={startKm} />
            </div>

            <div className={s.formGroup}>
              <label>{tr.endKm}</label>
              <input type="number" value={endKm || ""} min={0}
                onChange={e => setEndKm(Number(e.target.value) || 0)} placeholder="0" />
              <Odometer value={endKm} />
            </div>

            <div className={`${s.formGroup} ${s.full}`}>
              <label>{tr.totalKmLabel} <span className={s.kmDiff}>{km} km</span></label>
            </div>

            <div className={s.formGroup}>
              <label>{tr.carWash}</label>
              <select value={wash} onChange={e => setWash(e.target.value as "Yes"|"No")}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className={s.formGroup}>
              <label>{tr.appOrders}</label>
              <input type="number" min={0} value={appOrd || ""}
                onChange={e => setApp(Number(e.target.value) || 0)} placeholder="0" />
            </div>

            <div className={s.formGroup}>
              <label>{tr.waOrders}</label>
              <input type="number" min={0} value={waOrd || ""}
                onChange={e => setWa(Number(e.target.value) || 0)} placeholder="0" />
            </div>

            <div className={s.formGroup}>
              <label>{tr.totalOrdersAndStatus}</label>
              <div className={s.statusRow}>
                <span className={s.totalNum}>{total}</span>
                <span className={`status-badge ${sCls}`}>{sLabel}</span>
              </div>
            </div>

          </div>
        </div>
        <div className={s.foot}>
          <button className="btn-ghost" onClick={onClose}>{tr.cancel}</button>
          <button className="btn-primary" onClick={submit}>{tr.saveReport}</button>
        </div>
      </div>
    </div>
  );
}
