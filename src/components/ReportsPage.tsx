"use client";
import type { Report } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";
import ReportTable from "./ReportTable";

export default function ReportsPage({ reports, filterDriver, onClearFilter, onEdit, onDelete }: {
  reports: Report[]; filterDriver: string | null; onClearFilter: () => void;
  onEdit: (r: Report) => void; onDelete: (id: number) => void;
}) {
  const { tr } = useLang();
  return (
    <>
      <p className="page-title">{tr.dailyReports}</p>
      <p className="page-sub">{tr.reportsSubtitle}</p>
      <ReportTable reports={reports} filterDriver={filterDriver} onClearFilter={onClearFilter} onEdit={onEdit} onDelete={onDelete} showExport />
    </>
  );
}
