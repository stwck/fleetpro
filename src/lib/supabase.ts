import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// ─── Types ────────────────────────────────────────────────────────────────────
export type Driver = {
  id: number;
  name: string;
  arabic: string;
  car: string;
  phone: string;
  status: "Active" | "Inactive";
};

export type Vehicle = {
  id: number;
  number: string;
  model: string;
  year: number | null;
  status: "Active" | "Inactive" | "In Service";
  driver: string;
};

export type Report = {
  id: number;
  date: string;
  driver: string;
  arabic: string;
  car: string;
  start_km: number;
  end_km: number;
  wash: "Yes" | "No";
  app_orders: number;
  wa_orders: number;
};

export type Replacement = {
  id: number;
  date: string;
  driver: string;
  old_car: string;
  new_car: string;
  reason: string;
  remarks: string;
  approved_by: string;
};

// ─── Derived helpers ─────────────────────────────────────────────────────────
export const totalOrders = (r: Report) => r.app_orders + r.wa_orders;
export const totalKm = (r: Report) => r.end_km - r.start_km;
export const getStatus = (r: Report) => {
  const t = totalOrders(r);
  if (t >= 40) return "Excellent";
  if (t >= 20) return "Good";
  return "Average";
};

// ─── Arabic name map ─────────────────────────────────────────────────────────
const arabicMap: Record<string, string> = {
  ahmed:"أحمد",hassan:"حسن",mohammed:"محمد",ali:"علي",khalid:"خالد",
  omar:"عمر",saeed:"سعيد",rashid:"راشد",sultan:"سلطان",hamdan:"حمدان",
  faisal:"فيصل",yusuf:"يوسف",ibrahim:"إبراهيم",abdulla:"عبدالله",
  majid:"ماجد",salem:"سالم",walid:"وليد",nasser:"ناصر",tariq:"طارق",
  bilal:"بلال",zayed:"زايد",mansour:"منصور",adnan:"عدنان",sami:"سامي",
  adam:"آدم",malik:"مالك",kareem:"كريم",hussain:"حسين",hasan:"حسن",
};

export const toArabic = (name: string) =>
  name.trim().split(/\s+/).map(w => {
    const l = w.toLowerCase();
    return arabicMap[l] ?? (l.charAt(0).toUpperCase() + l.slice(1));
  }).join(" ");
