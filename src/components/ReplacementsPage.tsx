"use client";
import type { Replacement } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";

export function ReplacementsPage({ replacements, onAdd, onDelete }: {
  replacements: Replacement[]; onAdd: () => void; onDelete: (id: number) => void;
}) {
  const { tr } = useLang();

  const reasonLabel = (r: string) => {
    if (r === "Accident")          return tr.accident;
    if (r === "Showroom Service")  return tr.showroomService;
    if (r === "Maintenance")       return tr.maintenance;
    return tr.temporaryChange;
  };
  const reasonCls = (r: string) => {
    if (r === "Accident")         return "r-accident";
    if (r === "Showroom Service") return "r-showroom";
    if (r === "Maintenance")      return "r-maintenance";
    return "r-temp";
  };

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    // @ts-ignore
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Vehicle Replacement History", 14, 14);
    // @ts-ignore
    autoTable(doc, {
      startY: 22,
      head: [[tr.date, tr.driverName, tr.oldCar, tr.newCar, tr.reason, tr.approvedBy, tr.remarks]],
      body: replacements.map(r => [r.date, r.driver, r.old_car, r.new_car, r.reason, r.approved_by || "—", r.remarks || "—"]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 47, 74] },
    });
    doc.save(`replacements-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><p className="page-title">{tr.carReplacements}</p><p className="page-sub">{tr.replacementsSubtitle}</p></div>
        <button className="btn-primary" onClick={onAdd}>{tr.newReplacement}</button>
      </div>
      <div className="card">
        <div className="card-header">
          <h2>{tr.replacementHistory}</h2>
          <button className="btn-ghost btn-sm" onClick={exportPDF}>📑 {tr.exportPDF}</button>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr>
              <th>{tr.date}</th><th>{tr.driverName}</th><th>{tr.oldCar}</th><th>{tr.newCar}</th>
              <th>{tr.reason}</th><th>{tr.remarks}</th><th>{tr.approvedBy}</th><th></th>
            </tr></thead>
            <tbody>
              {replacements.length === 0 ? (
                <tr><td colSpan={8}><div className="empty"><div className="empty-icon">🔄</div><div className="empty-text">{tr.noReplacements}</div></div></td></tr>
              ) : replacements.map(r => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td><strong>{r.driver}</strong></td>
                  <td><span className="car-badge">{r.old_car}</span></td>
                  <td><span className="car-badge" style={{ borderColor: "var(--green)", color: "var(--green)" }}>{r.new_car}</span></td>
                  <td><span className={reasonCls(r.reason)}>{reasonLabel(r.reason)}</span></td>
                  <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", color: "var(--text2)" }}>{r.remarks || "—"}</td>
                  <td>{r.approved_by || "—"}</td>
                  <td><button className="btn-red" onClick={() => onDelete(r.id)}>🗑</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
