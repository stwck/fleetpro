"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Driver, Vehicle, Report, Replacement } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import ReportsPage from "@/components/ReportsPage";
import { DriversPage } from "@/components/DriversPage";
import { VehiclesPage } from "@/components/VehiclesPage";
import { ReplacementsPage } from "@/components/ReplacementsPage";
import ReportModal from "@/components/ReportModal";
import DriverModal from "@/components/DriverModal";
import VehicleModal from "@/components/VehicleModal";
import ReplacementModal from "@/components/ReplacementModal";
import Toast from "@/components/Toast";
import LangToggle from "@/components/LangToggle";
import styles from "./page.module.css";

export type Page = "dashboard" | "reports" | "drivers" | "vehicles" | "replacements";

export default function Home() {
  const { tr } = useLang();
  const [page, setPage] = useState<Page>("dashboard");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [replacements, setReplacements] = useState<Replacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDriver, setFilterDriver] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type?: "error" } | null>(null);
  const [reportModal, setReportModal] = useState<{ open: boolean; edit?: Report }>({ open: false });
  const [driverModal, setDriverModal] = useState<{ open: boolean; edit?: Driver }>({ open: false });
  const [vehicleModal, setVehicleModal] = useState<{ open: boolean; edit?: Vehicle }>({ open: false });
  const [replaceModal, setReplaceModal] = useState(false);

  const showToast = (msg: string, type?: "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [d, v, r, rep] = await Promise.all([
      supabase.from("drivers").select("*").order("name"),
      supabase.from("vehicles").select("*").order("number"),
      supabase.from("reports").select("*").order("date", { ascending: false }),
      supabase.from("replacements").select("*").order("date", { ascending: false }),
    ]);
    if (d.data) setDrivers(d.data as Driver[]);
    if (v.data) setVehicles(v.data as Vehicle[]);
    if (r.data) setReports(r.data as Report[]);
    if (rep.data) setReplacements(rep.data as Replacement[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── CRUD helpers ── */
  const saveReport = async (data: Omit<Report, "id">) => {
    const { error } = reportModal.edit
      ? await supabase.from("reports").update(data).eq("id", reportModal.edit.id)
      : await supabase.from("reports").insert(data);
    if (error) { showToast(tr.errorSaving, "error"); return; }
    showToast(reportModal.edit ? tr.reportUpdated : tr.reportSaved);
    setReportModal({ open: false }); fetchAll();
  };

  const deleteReport = async (id: number) => {
    if (!confirm("Delete?")) return;
    await supabase.from("reports").delete().eq("id", id);
    showToast(tr.reportDeleted); fetchAll();
  };

  const saveDriver = async (data: Omit<Driver, "id">) => {
    const { error } = driverModal.edit
      ? await supabase.from("drivers").update(data).eq("id", driverModal.edit.id)
      : await supabase.from("drivers").insert(data);
    if (error) { showToast(tr.errorSaving, "error"); return; }
    showToast(driverModal.edit ? tr.driverUpdated : tr.driverAdded);
    setDriverModal({ open: false }); fetchAll();
  };

  const deleteDriver = async (id: number) => {
    if (!confirm("Delete?")) return;
    await supabase.from("drivers").delete().eq("id", id);
    showToast(tr.driverDeleted); fetchAll();
  };

  const saveVehicle = async (data: Omit<Vehicle, "id">) => {
    const { error } = vehicleModal.edit
      ? await supabase.from("vehicles").update(data).eq("id", vehicleModal.edit.id)
      : await supabase.from("vehicles").insert(data);
    if (error) { showToast(tr.errorSaving, "error"); return; }
    if (data.driver) await supabase.from("drivers").update({ car: data.number }).eq("name", data.driver);
    showToast(vehicleModal.edit ? tr.vehicleUpdated : tr.vehicleAdded);
    setVehicleModal({ open: false }); fetchAll();
  };

  const deleteVehicle = async (id: number) => {
    if (!confirm("Delete?")) return;
    await supabase.from("vehicles").delete().eq("id", id);
    showToast(tr.vehicleDeleted); fetchAll();
  };

  const saveReplacement = async (data: Omit<Replacement, "id">) => {
    const { error } = await supabase.from("replacements").insert(data);
    if (error) { showToast(tr.errorSaving, "error"); return; }
    await supabase.from("drivers").update({ car: data.new_car }).eq("name", data.driver);
    await supabase.from("vehicles").update({ status: data.reason === "Accident" ? "Inactive" : "In Service" }).eq("number", data.old_car);
    const exists = vehicles.find(v => v.number === data.new_car);
    if (exists) await supabase.from("vehicles").update({ driver: data.driver, status: "Active" }).eq("number", data.new_car);
    else await supabase.from("vehicles").insert({ number: data.new_car, model: "—", year: null, status: "Active", driver: data.driver });
    showToast(tr.replacementSaved);
    setReplaceModal(false); fetchAll();
  };

  const deleteReplacement = async (id: number) => {
    if (!confirm("Delete?")) return;
    await supabase.from("replacements").delete().eq("id", id);
    showToast(tr.recordDeleted); fetchAll();
  };

  const filteredReports = reports.filter(r => {
    if (filterDriver && r.driver !== filterDriver) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return r.driver.toLowerCase().includes(q) || r.car.toLowerCase().includes(q) || r.date.includes(q);
  });

  const pageTitles: Record<Page, string> = {
    dashboard: tr.dashboard, reports: tr.dailyReports,
    drivers: tr.drivers, vehicles: tr.vehicles, replacements: tr.carReplacements,
  };

  return (
    <div className={styles.shell}>
      <Sidebar
        page={page} drivers={drivers} filterDriver={filterDriver}
        onNav={p => { setPage(p); setFilterDriver(null); }}
        onFilterDriver={name => { setFilterDriver(p => p === name ? null : name); setPage("reports"); }}
      />

      <div className={styles.main}>
        <div className={styles.topbar}>
          <h1 className={styles.topTitle}>{pageTitles[page]}</h1>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input className={styles.searchInput} placeholder={tr.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <LangToggle />
          <button className="btn-primary" onClick={() => setReportModal({ open: true })}>{tr.addReport}</button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loadingWrap}><div className={styles.spinner} /><p>{tr.connecting}</p></div>
          ) : (
            <>
              {page === "dashboard"    && <Dashboard reports={reports} filteredReports={filteredReports} drivers={drivers} vehicles={vehicles} filterDriver={filterDriver} onClearFilter={() => setFilterDriver(null)} onEdit={r => setReportModal({ open: true, edit: r })} onDelete={deleteReport} />}
              {page === "reports"      && <ReportsPage reports={filteredReports} filterDriver={filterDriver} onClearFilter={() => setFilterDriver(null)} onEdit={r => setReportModal({ open: true, edit: r })} onDelete={deleteReport} />}
              {page === "drivers"      && <DriversPage drivers={drivers} onAdd={() => setDriverModal({ open: true })} onEdit={d => setDriverModal({ open: true, edit: d })} onDelete={deleteDriver} />}
              {page === "vehicles"     && <VehiclesPage vehicles={vehicles} onAdd={() => setVehicleModal({ open: true })} onEdit={v => setVehicleModal({ open: true, edit: v })} onDelete={deleteVehicle} />}
              {page === "replacements" && <ReplacementsPage replacements={replacements} onAdd={() => setReplaceModal(true)} onDelete={deleteReplacement} />}
            </>
          )}
        </div>
      </div>

      {reportModal.open  && <ReportModal     drivers={drivers} edit={reportModal.edit}  onSave={saveReport}      onClose={() => setReportModal({ open: false })} />}
      {driverModal.open  && <DriverModal                       edit={driverModal.edit}  onSave={saveDriver}      onClose={() => setDriverModal({ open: false })} />}
      {vehicleModal.open && <VehicleModal    drivers={drivers} edit={vehicleModal.edit} onSave={saveVehicle}     onClose={() => setVehicleModal({ open: false })} />}
      {replaceModal      && <ReplacementModal drivers={drivers}                          onSave={saveReplacement} onClose={() => setReplaceModal(false)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
