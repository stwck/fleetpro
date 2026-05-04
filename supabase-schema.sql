-- ─────────────────────────────────────────────────────────────────────────────
-- FleetPro Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Drivers table
create table if not exists drivers (
  id          bigserial primary key,
  name        text not null,
  arabic      text,
  car         text,
  phone       text,
  status      text not null default 'Active',
  created_at  timestamptz default now()
);

-- Vehicles table
create table if not exists vehicles (
  id          bigserial primary key,
  number      text not null unique,
  model       text,
  year        int,
  status      text not null default 'Active',
  driver      text,
  created_at  timestamptz default now()
);

-- Daily reports table
create table if not exists reports (
  id            bigserial primary key,
  date          date not null,
  driver        text not null,
  arabic        text,
  car           text not null,
  start_km      numeric not null default 0,
  end_km        numeric not null default 0,
  wash          text not null default 'No',
  app_orders    int not null default 0,
  wa_orders     int not null default 0,
  created_at    timestamptz default now()
);

-- Vehicle replacements table
create table if not exists replacements (
  id            bigserial primary key,
  date          date not null,
  driver        text not null,
  old_car       text not null,
  new_car       text not null,
  reason        text not null,
  remarks       text,
  approved_by   text,
  created_at    timestamptz default now()
);

-- Enable Row Level Security (open policy for single-company use)
alter table drivers     enable row level security;
alter table vehicles    enable row level security;
alter table reports     enable row level security;
alter table replacements enable row level security;

create policy "Allow all" on drivers      for all using (true) with check (true);
create policy "Allow all" on vehicles     for all using (true) with check (true);
create policy "Allow all" on reports      for all using (true) with check (true);
create policy "Allow all" on replacements for all using (true) with check (true);

-- Sample seed data (optional — delete if you prefer a clean start)
insert into drivers (name, arabic, car, phone, status) values
  ('Ahmed Hassan',  'أحمد حسن',  'DXB-1234', '+971501234567', 'Active'),
  ('Mohammed Ali',  'محمد علي',  'DXB-5678', '+971509876543', 'Active'),
  ('Khalid Omar',   'خالد عمر',  'SHJ-3344', '+971556789012', 'Active');

insert into vehicles (number, model, year, status, driver) values
  ('DXB-1234', 'Toyota Camry',  2023, 'Active', 'Ahmed Hassan'),
  ('DXB-5678', 'Nissan Altima', 2022, 'Active', 'Mohammed Ali'),
  ('SHJ-3344', 'Honda Accord',  2024, 'Active', 'Khalid Omar');

insert into reports (date, driver, arabic, car, start_km, end_km, wash, app_orders, wa_orders) values
  ('2024-01-15', 'Ahmed Hassan', 'أحمد حسن', 'DXB-1234', 10000, 10285, 'Yes', 28, 15),
  ('2024-01-15', 'Mohammed Ali', 'محمد علي', 'DXB-5678', 22000, 22190, 'No',  32,  9),
  ('2024-01-16', 'Ahmed Hassan', 'أحمد حسن', 'DXB-1234', 10285, 10520, 'Yes', 41, 12),
  ('2024-01-16', 'Khalid Omar',  'خالد عمر', 'SHJ-3344',  5000,  5167, 'No',  10,  6);
