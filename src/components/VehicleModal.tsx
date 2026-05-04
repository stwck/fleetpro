"use client";
import { useState } from "react";
import type { Driver, Vehicle } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";
import s from "./Modal.module.css";

type Props = { drivers: Driver[]; edit?: Vehicle; onSave: (v: Omit<Vehicle, "id">) => void; onClose: () => void; };

export default function VehicleModal({ drivers, edit, onSave, onClose }: Props) {
  const { tr } = useLang();
  const [number, setNumber] = useState(edit?.number ?? "");
  const [model,  setModel]  = useState(edit?.model  ?? "");
  const [year,   setYear]   = useState<number|"">(edit?.year ?? "");
  const [status, setStatus] = useState<Vehicle["status"]>(edit?.status ?? "Active");
  const [driver, setDriver] = useState(edit?.driver ?? "");
  const [err,    setErr]    = useState("");

  const submit = () => {
    if (!number.trim()) { setErr(tr.carNumberRequired); return; }
    setErr("");
    onSave({ number: number.trim(), model: model.trim(), year: year ? Number(year) : null, status, driver });
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${s.modal} ${s.modalSm}`}>
        <div className={s.head}>
          <h2>{edit ? tr.editVehicleTitle : tr.addVehicleTitle}</h2>
          <button className="btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className={s.body}>
          {err && <p style={{ color: "var(--red)", marginBottom: 12, fontSize: 13 }}>{err}</p>}
          <div className={s.grid}>
            <div className={s.formGroup}>
              <label>{tr.carNumber}</label>
              <input value={number} onChange={e => setNumber(e.target.value)} placeholder="DXB-5678" />
            </div>
            <div className={s.formGroup}>
              <label>{tr.model}</label>
              <input value={model} onChange={e => setModel(e.target.value)} placeholder="Toyota Camry" />
            </div>
            <div className={s.formGroup}>
              <label>{tr.year}</label>
              <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} placeholder="2024" />
            </div>
            <div className={s.formGroup}>
              <label>{tr.status}</label>
              <select value={status} onChange={e => setStatus(e.target.value as Vehicle["status"])}>
                <option value="Active">{tr.statusActive}</option>
                <option value="Inactive">{tr.statusInactive}</option>
                <option value="In Service">{tr.statusInService}</option>
              </select>
            </div>
            <div className={`${s.formGroup} ${s.full}`}>
              <label>{tr.assignToDriver}</label>
              <select value={driver} onChange={e => setDriver(e.target.value)}>
                <option value="">{tr.unassigned}</option>
                {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className={s.foot}>
          <button className="btn-ghost" onClick={onClose}>{tr.cancel}</button>
          <button className="btn-primary" onClick={submit}>{tr.saveVehicle}</button>
        </div>
      </div>
    </div>
  );
}
