"use client";
import { useState } from "react";
import type { Report } from "@/lib/supabase";
import { totalOrders, totalKm, getStatus } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";

type SortKey = keyof Report | "totalKm" | "totalOrders";

type Props = {
  reports: Report[];
  filterDriver?: string | null;
  onClearFilter?: () => void;
  onEdit: (r: Report) => void;
  onDelete: (id: number) => void;
  showExport?: boolean;
};

export default function ReportTable({ reports, filterDriver, onClearFilter, onEdit, onDelete, showExport }: Props) {
  const { tr } = useLang();
  const [sortCol, setSortCol] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState(1);

  const sort = (col: SortKey) => {
    if (sortCol === col) setSortDir(d => d * -1);
    else { setSortCol(col); setSortDir(1); }
  };

  const sorted = [...reports].sort((a, b) => {
    if (!sortCol) return 0;
    let av: number | string, bv: number | string;
    if (sortCol === "totalKm")     { av = totalKm(a);     bv = totalKm(b); }
    else if (sortCol === "totalOrders") { av = totalOrders(a); bv = totalOrders(b); }
    else { av = (a as never)[sortCol]; bv = (b as never)[sortCol]; }
    if (typeof av === "string") return av.localeCompare(bv as string) * sortDir;
    return ((av as number) - (bv as number)) * sortDir;
  });

  const Th = ({ col, label }: { col: SortKey; label: string }) => (
    <th onClick={() => sort(col)} style={sortCol === col ? { color: "var(--blue)" } : {}}>
      {label} {sortCol === col ? (sortDir === 1 ? "↑" : "↓") : ""}
    </th>
  );

  const exportCSV = () => {
    const headers = [tr.date, tr.driverName, tr.arabicName, tr.carNumber, tr.startKm, tr.endKm, tr.kmTotal, tr.carWash, tr.appOrders, tr.waOrders, tr.totalOrders, tr.status];
    const rows = sorted.map(r => [r.date, r.driver, r.arabic, r.car, r.start_km, r.end_km, totalKm(r), r.wash, r.app_orders, r.wa_orders, totalOrders(r), getStatus(r)]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `fleet-reports-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const exportPDF = async () => {
    const jspdf = await import("jspdf");
    const jsPDF = jspdf.jsPDF;
    const { default: autoTable } = await import("jspdf-autotable");
    // @ts-ignore
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Fleet Driver Daily Reports", 14, 14);
    doc.setFontSize(9);
    doc.text("Generated: " + new Date().toLocaleDateString(), 14, 20);
    // @ts-ignore
    autoTable(doc, {
      startY: 25,
      head: [[tr.date, tr.driverName, tr.carNumber, tr.startKm, tr.endKm, tr.kmTotal, tr.carWash, tr.appOrders, tr.waOrders, tr.totalOrders, tr.status]],
      body: sorted.map(r => [r.date, r.driver, r.car, r.start_km, r.end_km, totalKm(r), r.wash, r.app_orders, r.wa_orders, totalOrders(r), getStatus(r)]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 47, 74] },
    });
    doc.save(`fleet-reports-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h2>{tr.reports}</h2>
          {filterDriver && (
            <span className="status-badge s-good" style={{ cursor: "pointer" }} onClick={onClearFilter}>
              👤 {filterDriver} ✕
            </span>
          )}
        </div>
        {showExport && (
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn-ghost btn-sm" onClick={exportCSV}>📄 {tr.exportCSV}</button>
            <button className="btn-ghost btn-sm" onClick={exportPDF}>📑 {tr.exportPDF}</button>
          </div>
        )}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <Th col="date"         label={tr.date} />
              <Th col="driver"       label={tr.driverName} />
              <th>{tr.arabicName}</th>
              <Th col="car"          label={tr.carNumber} />
              <Th col="start_km"     label={tr.startKm} />
              <Th col="end_km"       label={tr.endKm} />
              <Th col="totalKm"      label={tr.kmTotal} />
              <th>{tr.carWash}</th>
              <Th col="app_orders"   label={tr.appOrders} />
              <Th col="wa_orders"    label={tr.waOrders} />
              <Th col="totalOrders"  label={tr.totalOrders} />
              <th>{tr.status}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={13}>
                <div className="empty"><div className="empty-icon">📋</div><div className="empty-text">{tr.noReports}</div></div>
              </td></tr>
            ) : sorted.map(r => {
              const s = getStatus(r);
              const statusLabel = s === "Excellent" ? tr.statusExcellent : s === "Good" ? tr.statusGood : tr.statusAverage;
              const statusCls   = s === "Excellent" ? "s-excellent" : s === "Good" ? "s-good" : "s-average";
              return (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td><strong>{r.driver}</strong></td>
                  <td style={{ direction: "rtl", textAlign: "right", color: "var(--purple)" }}>{r.arabic}</td>
                  <td><span className="car-badge">{r.car}</span></td>
                  <td>{r.start_km.toLocaleString()}</td>
                  <td>{r.end_km.toLocaleString()}</td>
                  <td style={{ color: "var(--amber)", fontWeight: 600 }}>{totalKm(r)} km</td>
                  <td style={{ color: r.wash === "Yes" ? "var(--green)" : "var(--text3)" }}>{r.wash === "Yes" ? "✓" : "—"}</td>
                  <td>{r.app_orders}</td>
                  <td>{r.wa_orders}</td>
                  <td style={{ fontWeight: 700 }}>{totalOrders(r)}</td>
                  <td><span className={`status-badge ${statusCls}`}>{statusLabel}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-ghost btn-sm" onClick={() => onEdit(r)}>✏</button>
                      <button className="btn-red" onClick={() => onDelete(r.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
