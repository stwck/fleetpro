"use client";
import type { Driver, Vehicle, Report } from "@/lib/supabase";
import { totalKm, getStatus } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";
import ReportTable from "./ReportTable";

type Props = {
  reports: Report[]; filteredReports: Report[];
  drivers: Driver[]; vehicles: Vehicle[];
  filterDriver: string | null; onClearFilter: () => void;
  onEdit: (r: Report) => void; onDelete: (id: number) => void;
};

export default function Dashboard({ reports, filteredReports, drivers, vehicles, filterDriver, onClearFilter, onEdit, onDelete }: Props) {
  const { tr } = useLang();
  const excellent = reports.filter(r => getStatus(r) === "Excellent").length;
  const good      = reports.filter(r => getStatus(r) === "Good").length;
  const average   = reports.filter(r => getStatus(r) === "Average").length;
  const kmTotal   = reports.reduce((s, r) => s + totalKm(r), 0);
  const washes    = reports.filter(r => r.wash === "Yes").length;

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">{tr.totalReports}</div><div className="stat-val c-blue">{reports.length}</div><div className="stat-sub">{tr.allTime}</div></div>
        <div className="stat-card"><div className="stat-label">{tr.excellent}</div><div className="stat-val c-green">{excellent}</div><div className="stat-sub">{tr.ordersGte40}</div></div>
        <div className="stat-card"><div className="stat-label">{tr.good}</div><div className="stat-val c-blue">{good}</div><div className="stat-sub">{tr.orders2039}</div></div>
        <div className="stat-card"><div className="stat-label">{tr.average}</div><div className="stat-val c-amber">{average}</div><div className="stat-sub">{tr.ordersLt20}</div></div>
        <div className="stat-card"><div className="stat-label">{tr.totalKm}</div><div className="stat-val c-purple">{kmTotal.toLocaleString()}</div><div className="stat-sub">{tr.allDrivers}</div></div>
        <div className="stat-card"><div className="stat-label">{tr.carWashes}</div><div className="stat-val c-green">{washes}</div><div className="stat-sub">{tr.completed}</div></div>
        <div className="stat-card"><div className="stat-label">{tr.activeDrivers}</div><div className="stat-val c-blue">{drivers.filter(d => d.status === "Active").length}</div><div className="stat-sub">{tr.onFleet}</div></div>
        <div className="stat-card"><div className="stat-label">{tr.vehicles}</div><div className="stat-val c-amber">{vehicles.length}</div><div className="stat-sub">{tr.totalFleet}</div></div>
      </div>
      <ReportTable reports={filteredReports} filterDriver={filterDriver} onClearFilter={onClearFilter} onEdit={onEdit} onDelete={onDelete} showExport />
    </>
  );
}
