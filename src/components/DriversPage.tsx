"use client";
import type { Driver } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";

export function DriversPage({ drivers, onAdd, onEdit, onDelete }: {
  drivers: Driver[]; onAdd: () => void; onEdit: (d: Driver) => void; onDelete: (id: number) => void;
}) {
  const { tr } = useLang();
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><p className="page-title">{tr.drivers}</p><p className="page-sub">{tr.driversSubtitle}</p></div>
        <button className="btn-primary" onClick={onAdd}>{tr.addDriver}</button>
      </div>
      <div className="card">
        <div className="card-header"><h2>{tr.driverList}</h2></div>
        <div className="table-scroll">
          <table>
            <thead><tr>
              <th>{tr.driverName}</th><th>{tr.arabicName}</th><th>{tr.carNumber}</th>
              <th>{tr.phone}</th><th>{tr.status}</th><th></th>
            </tr></thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr><td colSpan={6}><div className="empty"><div className="empty-icon">👤</div><div className="empty-text">{tr.noDrivers}</div></div></td></tr>
              ) : drivers.map(d => {
                const initials = d.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
                return (
                  <tr key={d.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bluebg)", color: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                        <strong>{d.name}</strong>
                      </div>
                    </td>
                    <td style={{ direction: "rtl", color: "var(--purple)" }}>{d.arabic}</td>
                    <td><span className="car-badge">{d.car || "—"}</span></td>
                    <td style={{ color: "var(--text2)" }}>{d.phone || "—"}</td>
                    <td><span className={`status-badge ${d.status === "Active" ? "s-excellent" : "s-inactive"}`}>{d.status === "Active" ? tr.statusActive : tr.statusInactive}</span></td>
                    <td><div className="action-btns">
                      <button className="btn-ghost btn-sm" onClick={() => onEdit(d)}>✏</button>
                      <button className="btn-red" onClick={() => onDelete(d.id)}>🗑</button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
