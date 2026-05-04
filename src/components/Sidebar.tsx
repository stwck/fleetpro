"use client";
import type { Driver } from "@/lib/supabase";
import type { Page } from "@/app/page";
import { useLang } from "@/lib/LangContext";
import styles from "./Sidebar.module.css";

const COLORS = [
  { bg: "var(--bluebg)",   fg: "var(--blue)" },
  { bg: "var(--greenbg)",  fg: "var(--green)" },
  { bg: "var(--amberbg)",  fg: "var(--amber)" },
  { bg: "var(--purplebg)", fg: "var(--purple)" },
  { bg: "var(--redbg)",    fg: "var(--red)" },
];

type Props = {
  page: Page;
  drivers: Driver[];
  filterDriver: string | null;
  onNav: (p: Page) => void;
  onFilterDriver: (name: string) => void;
};

export default function Sidebar({ page, drivers, filterDriver, onNav, onFilterDriver }: Props) {
  const { tr } = useLang();

  const NAV: { page: Page; icon: string; label: string }[] = [
    { page: "dashboard",    icon: "📊", label: tr.dashboard },
    { page: "reports",      icon: "📋", label: tr.dailyReports },
    { page: "drivers",      icon: "👤", label: tr.drivers },
    { page: "vehicles",     icon: "🚗", label: tr.vehicles },
    { page: "replacements", icon: "🔄", label: tr.carReplacements },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logoIcon}>🚛</div>
        <div>
          <div className={styles.logoText}>{tr.appName}</div>
          <div className={styles.logoSub}>{tr.appSub}</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV.map((n, i) => (
          <div key={n.page}>
            {i === 2 && <div className={styles.divider} />}
            <div
              className={`${styles.item} ${page === n.page ? styles.active : ""}`}
              onClick={() => onNav(n.page)}
            >
              <span className={styles.icon}>{n.icon}</span>
              <span className={styles.label}>{n.label}</span>
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.driverSection}>
        <div className={styles.driverTitle}>{tr.filterByDriver}</div>
        {drivers.map((d, i) => {
          const c = COLORS[i % COLORS.length];
          const initials = d.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
          return (
            <div
              key={d.id}
              className={`${styles.chip} ${filterDriver === d.name ? styles.chipActive : ""}`}
              onClick={() => onFilterDriver(d.name)}
            >
              <div className={styles.avatar} style={{ background: c.bg, color: c.fg }}>{initials}</div>
              <span className={styles.chipName}>{d.name}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
