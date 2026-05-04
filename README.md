# FleetPro — Transport Driver & Vehicle Management System

A production-ready, bilingual (English / Arabic RTL) web application for managing transport company drivers, vehicles, and daily performance reports.

---

## Features

- **Daily Driver Reports** — KM readings with odometer display, App + WA orders, auto status (Excellent / Good / Average)
- **Live Dashboard** — 8 stat cards + sortable, filterable report table
- **Driver Management** — Add / edit / delete drivers, auto Arabic name translation
- **Vehicle Management** — Fleet tracking, assignment to drivers, status management
- **Car Replacement System** — Accident / service / maintenance records; automatically updates driver's active car
- **Bilingual UI** — Switch between English and Arabic (full RTL layout) with one click
- **Export** — CSV and PDF from every report table
- **Persistent Storage** — Supabase (PostgreSQL) backend
- **Responsive** — Works on desktop and mobile

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 14 (App Router)           |
| Language    | TypeScript                        |
| Styling     | CSS Modules + CSS Variables       |
| Database    | Supabase (PostgreSQL)             |
| PDF Export  | jsPDF + jsPDF-AutoTable           |
| CSV Export  | Native (no dependency)            |
| i18n        | Custom React Context (EN / AR)    |

---

## Setup — Step by Step

### 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **New Project**, give it a name, set a database password, choose a region
3. Wait ~2 minutes for it to provision

### 2. Run the database schema

1. In your Supabase dashboard, go to **SQL Editor → New query**
2. Open `supabase-schema.sql` from this project
3. Paste the entire contents and click **Run**
4. This creates the 4 tables, enables Row Level Security, and inserts sample data

### 3. Get your API keys

1. In Supabase dashboard go to **Settings → API**
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public key** (long JWT string)

### 4. Configure environment variables

Edit `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with LangProvider
│   ├── page.tsx            # Main shell + all CRUD logic
│   ├── page.module.css     # Shell styles + global utility classes
│   └── globals.css         # CSS variables, RTL rules, base resets
│
├── components/
│   ├── Sidebar.tsx/css     # Navigation + driver filter list
│   ├── LangToggle.tsx/css  # EN / عربي switcher button
│   ├── Dashboard.tsx       # Stats cards + report table
│   ├── ReportsPage.tsx     # Reports page
│   ├── DriversPage.tsx     # Drivers CRUD table
│   ├── VehiclesPage.tsx    # Vehicles CRUD table
│   ├── ReplacementsPage.tsx# Replacement history table
│   ├── ReportTable.tsx     # Shared sortable table + CSV/PDF export
│   ├── ReportModal.tsx     # Add/edit report form with odometer
│   ├── DriverModal.tsx     # Add/edit driver form
│   ├── VehicleModal.tsx    # Add/edit vehicle form
│   ├── ReplacementModal.tsx# Car replacement entry form
│   ├── Modal.module.css    # Shared modal + form styles
│   └── Toast.tsx/css       # Success/error notifications
│
└── lib/
    ├── supabase.ts         # Supabase client + TypeScript types + helpers
    ├── i18n.ts             # All EN + AR translation strings
    └── LangContext.tsx     # React context for language switching
```

---

## Status Logic

| Condition            | Status    | Color  |
|----------------------|-----------|--------|
| Total Orders ≥ 40   | Excellent | Green  |
| Total Orders 20–39  | Good      | Blue   |
| Total Orders < 20   | Average   | Orange |

**Total Orders** = App Orders + WA Orders  
**Total KM** = End KM − Start KM

---

## Car Replacement Flow

When you save a replacement record:
1. The driver's current car is updated to the new car number
2. The old car status is set to `Inactive` (Accident) or `In Service` (other reasons)
3. If the new car doesn't exist in the vehicles table, it is created automatically
4. All history is preserved in the replacements table

---

## Language Switching

Click the **EN / عربي** toggle in the top bar. The entire UI switches instantly:
- All labels, buttons, and messages translate
- Layout direction flips to RTL for Arabic
- Arabic text uses Noto Sans Arabic font
- Arabic names always display RTL regardless of current language

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Add your two environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Any Node host

```bash
npm run build
npm start
```

---

## Database Tables

| Table         | Purpose                              |
|---------------|--------------------------------------|
| `drivers`     | Driver profiles with car assignment  |
| `vehicles`    | Fleet inventory                      |
| `reports`     | Daily performance reports            |
| `replacements`| Vehicle change history               |
