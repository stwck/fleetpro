"use client";
import { useState } from "react";
import type { Driver, Replacement } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";
import s from "./Modal.module.css";

type Props = { drivers: Driver[]; onSave: (r: Omit<Replacement, "id">) => void; onClose: () => void; };

export default function ReplacementModal({ drivers, onSave, onClose }: Props) {
  const { tr } = useLang();
  const today = new Date().toISOString().split("T")[0];
  const [date,       setDate]       = useState(today);
  const [driver,     setDriver]     = useState("");
  const [oldCar,     setOldCar]     = useState("");
  const [newCar,     setNewCar]     = useState("");
  const [reason,     setReason]     = useState("Accident");
  const [remarks,    setRemarks]    = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [err,        setErr]        = useState("");

  const onDriverChange = (name: string) => {
    setDriver(name);
    const d = drivers.find(x => x.name === name);
    if (d?.car) setOldCar(d.car);
  };

  const submit = () => {
    if (!date || !driver || !oldCar || !newCar) { setErr(tr.allFieldsRequired); return; }
    setErr("");
    onSave({ date, driver, old_car: oldCar, new_car: newCar, reason, remarks, approved_by: approvedBy });
  };

  const REASONS = [
    { val: "Accident",          label: tr.accident },
    { val: "Showroom Service",  label: tr.showroomService },
    { val: "Maintenance",       label: tr.maintenance },
    { val: "Temporary Change",  label: tr.temporaryChange },
  ];

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${s.modal} ${s.modalSm}`} style={{ maxWidth: 520 }}>
        <div className={s.head}>
          <h2>{tr.carReplacementEntry}</h2>
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
                <option value="">{tr.selectDriverDot}</option>
                {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div className={s.formGroup}>
              <label>{tr.oldCar}</label>
              <input value={oldCar} onChange={e => setOldCar(e.target.value)} placeholder={tr.currentCar} />
            </div>
            <div className={s.formGroup}>
              <label>{tr.newCar}</label>
              <input value={newCar} onChange={e => setNewCar(e.target.value)} placeholder={tr.replacementCar} />
            </div>
            <div className={s.formGroup}>
              <label>{tr.reason}</label>
              <select value={reason} onChange={e => setReason(e.target.value)}>
                {REASONS.map(r => <option key={r.val} value={r.val}>{r.label}</option>)}
              </select>
            </div>
            <div className={s.formGroup}>
              <label>{tr.approvedBy}</label>
              <input value={approvedBy} onChange={e => setApprovedBy(e.target.value)} placeholder={tr.managerName} />
            </div>
            <div className={`${s.formGroup} ${s.full}`}>
              <label>{tr.remarks}</label>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder={tr.additionalNotes} />
            </div>
          </div>
        </div>
        <div className={s.foot}>
          <button className="btn-ghost" onClick={onClose}>{tr.cancel}</button>
          <button className="btn-primary" onClick={submit}>{tr.saveAndUpdate}</button>
        </div>
      </div>
    </div>
  );
}
