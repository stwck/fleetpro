"use client";
import type { Vehicle } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";

export function VehiclesPage({ vehicles, onAdd, onEdit, onDelete }: {
  vehicles: Vehicle[]; onAdd: () => void; onEdit: (v: Vehicle) => void; onDelete: (id: number) => void;
}) {
  const { tr } = useLang();
  const statusLabel = (s: string) => s === "Active" ? tr.statusActive : s === "In Service" ? tr.statusInService : tr.statusInactive;
  const statusCls   = (s: string) => s === "Active" ? "s-active" : s === "In Service" ? "s-service" : "s-inactive";

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><p className="page-title">{tr.vehicles}</p><p className="page-sub">{tr.vehiclesSubtitle}</p></div>
        <button className="btn-primary" onClick={onAdd}>{tr.addVehicle}</button>
      </div>
      <div className="stat-grid" style={{ maxWidth: 520, marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-label">{tr.totalReports}</div><div className="stat-val c-blue">{vehicles.length}</div></div>
        <div className="stat-card"><div className="stat-label">{tr.statusActive}</div><div className="stat-val c-green">{vehicles.filter(v => v.status === "Active").length}</div></div>
        <div className="stat-card"><div className="stat-label">{tr.statusInService}</div><div className="stat-val c-amber">{vehicles.filter(v => v.status === "In Service").length}</div></div>
        <div className="stat-card"><div className="stat-label">{tr.statusInactive}</div><div className="stat-val c-red">{vehicles.filter(v => v.status === "Inactive").length}</div></div>
      </div>
      <div className="card">
        <div className="card-header"><h2>{tr.vehicleList}</h2></div>
        <div className="table-scroll">
          <table>
            <thead><tr>
              <th>{tr.carNumber}</th><th>{tr.model}</th><th>{tr.year}</th>
              <th>{tr.assignedDriver}</th><th>{tr.status}</th><th></th>
            </tr></thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr><td colSpan={6}><div className="empty"><div className="empty-icon">🚗</div><div className="empty-text">{tr.noVehicles}</div></div></td></tr>
              ) : vehicles.map(v => (
                <tr key={v.id}>
                  <td><span className="car-badge">{v.number}</span></td>
                  <td>{v.model || "—"}</td>
                  <td>{v.year || "—"}</td>
                  <td style={{ color: v.driver ? "var(--text)" : "var(--text3)" }}>{v.driver || tr.unassigned}</td>
                  <td><span className={`status-badge ${statusCls(v.status)}`}>{statusLabel(v.status)}</span></td>
                  <td><div className="action-btns">
                    <button className="btn-ghost btn-sm" onClick={() => onEdit(v)}>✏</button>
                    <button className="btn-red" onClick={() => onDelete(v.id)}>🗑</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
