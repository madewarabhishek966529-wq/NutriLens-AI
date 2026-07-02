-- =========================================================
-- NutriLens AI — Supabase schema
-- Run this in the Supabase SQL editor.
-- Assumes Google OAuth is enabled under Authentication > Providers.
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- profiles: one row per authenticated user (id = auth.users.id)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  age int,
  gender text check (gender in ('male', 'female', 'other')),
  height_cm numeric,
  weight_kg numeric,
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'athlete')),
  daily_streak int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------
-- food_logs: every AI-analyzed food entry
-- ---------------------------------------------------------
create table if not exists public.food_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  food_name text not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  calories numeric default 0,
  protein_g numeric default 0,
  carbs_g numeric default 0,
  fat_g numeric default 0,
  fiber_g numeric default 0,
  weight_g numeric default 0,
  image_url text,
  notes text,
  raw_analysis jsonb not null default '{}'::jsonb,
  logged_at timestamptz not null default now(),
  created_at timestamptz default now()
);

create index if not exists idx_food_logs_user_date on public.food_logs (user_id, logged_at desc);

-- ---------------------------------------------------------
-- water_logs
-- ---------------------------------------------------------
create table if not exists public.water_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_ml numeric not null,
  logged_at timestamptz not null default now()
);

create index if not exists idx_water_logs_user_date on public.water_logs (user_id, logged_at desc);

-- ---------------------------------------------------------
-- weight_logs (one entry per user per day)
-- ---------------------------------------------------------
create table if not exists public.weight_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric not null,
  logged_date date not null default current_date,
  notes text,
  unique (user_id, logged_date)
);

create index if not exists idx_weight_logs_user_date on public.weight_logs (user_id, logged_date desc);

-- ---------------------------------------------------------
-- favorite_foods
-- ---------------------------------------------------------
create table if not exists public.favorite_foods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  food_name text not null,
  raw_analysis jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- Storage bucket for food images (create via dashboard or here)
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('food-images', 'food-images', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.food_logs enable row level security;
alter table public.water_logs enable row level security;
alter table public.weight_logs enable row level security;
alter table public.favorite_foods enable row level security;

create policy "Users manage their own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage their own food logs" on public.food_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own water logs" on public.water_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own weight logs" on public.weight_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own favorites" on public.favorite_foods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users upload their own food images" on storage.objects
  for all using (bucket_id = 'food-images' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'food-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ---------------------------------------------------------
-- Keep updated_at fresh on profiles
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
