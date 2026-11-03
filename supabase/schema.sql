create extension if not exists pgcrypto;

create type public.user_role as enum ('SUPER_ADMIN', 'COMPANY_ADMIN', 'CUSTOMER');
create type public.company_status as enum ('ACTIVE', 'SUSPENDED');
create type public.vehicle_status as enum ('PENDING', 'APPROVED', 'REJECTED', 'DISABLED');
create type public.booking_status as enum ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
create type public.payment_status as enum ('PENDING', 'PAID', 'REFUNDED', 'FAILED');

create table public.companies (
  id uuid primary key default gen_random_uuid(), name text not null, logo text, description text,
  email text, phone text, website text, status public.company_status not null default 'ACTIVE',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade, name text not null, email text not null unique,
  phone text, password_hash text, role public.user_role not null default 'CUSTOMER', company_id uuid references public.companies(id) on delete set null,
  profile_image text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade,
  name text not null, category text not null, description text, price numeric(12,2), fuel_type text,
  transmission text, engine text, mileage text, seating_capacity integer, status public.vehicle_status not null default 'PENDING',
  trial_available boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.vehicle_images (
  id uuid primary key default gen_random_uuid(), vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  image_url text not null, is_primary boolean not null default false, created_at timestamptz not null default now()
);
create table public.showrooms (
  id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade,
  name text not null, address text, city text, state text, pincode text, phone text, opening_time time, closing_time time,
  status text not null default 'ACTIVE', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.vehicle_showrooms (vehicle_id uuid references public.vehicles(id) on delete cascade, showroom_id uuid references public.showrooms(id) on delete cascade, primary key (vehicle_id, showroom_id));
create table public.availability (
  id uuid primary key default gen_random_uuid(), vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  showroom_id uuid not null references public.showrooms(id) on delete cascade, date date not null, available boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(vehicle_id, showroom_id, date)
);
create table public.time_slots (
  id uuid primary key default gen_random_uuid(), showroom_id uuid not null references public.showrooms(id) on delete cascade,
  date date not null, start_time time not null, end_time time not null, available boolean not null default true,
  unique(showroom_id, date, start_time, end_time)
);
create table public.bookings (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete restrict, company_id uuid not null references public.companies(id) on delete restrict,
  showroom_id uuid not null references public.showrooms(id) on delete restrict, date date not null, time_slot_id uuid not null references public.time_slots(id) on delete restrict,
  status public.booking_status not null default 'PENDING', payment_status public.payment_status not null default 'PENDING', booking_amount numeric(10,2) not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.payments (id uuid primary key default gen_random_uuid(), booking_id uuid not null references public.bookings(id) on delete cascade, amount numeric(10,2) not null, status public.payment_status not null default 'PENDING', provider_reference text, created_at timestamptz not null default now());
create table public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, title text not null, message text not null, type text not null, is_read boolean not null default false, created_at timestamptz not null default now());
create table public.reviews (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, vehicle_id uuid not null references public.vehicles(id) on delete cascade, booking_id uuid not null references public.bookings(id) on delete cascade, rating integer not null check (rating between 1 and 5), review text, created_at timestamptz not null default now(), unique(user_id, booking_id));

create or replace function public.current_user_role() returns public.user_role language sql stable security definer set search_path = public as $$ select role from public.users where id = auth.uid() $$;
create or replace function public.current_company_id() returns uuid language sql stable security definer set search_path = public as $$ select company_id from public.users where id = auth.uid() $$;
create or replace function public.handle_new_auth_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.users (id, name, email, phone, role) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.email, new.raw_user_meta_data->>'phone', 'CUSTOMER') on conflict (id) do nothing; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
do $$ declare table_name text; begin foreach table_name in array array['companies','users','vehicles','showrooms','availability','bookings'] loop execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.touch_updated_at()', table_name, table_name); end loop; end $$;

alter table public.companies enable row level security; alter table public.users enable row level security; alter table public.vehicles enable row level security; alter table public.vehicle_images enable row level security; alter table public.showrooms enable row level security; alter table public.vehicle_showrooms enable row level security; alter table public.availability enable row level security; alter table public.time_slots enable row level security; alter table public.bookings enable row level security; alter table public.payments enable row level security; alter table public.notifications enable row level security; alter table public.reviews enable row level security;

create policy "public can view active companies" on public.companies for select using (status = 'ACTIVE' or public.current_user_role() = 'SUPER_ADMIN');
create policy "users view own profile" on public.users for select using (id = auth.uid() or public.current_user_role() = 'SUPER_ADMIN');
create policy "users update own profile" on public.users for update using (id = auth.uid() or public.current_user_role() = 'SUPER_ADMIN');
create policy "customers create own profile" on public.users for insert with check (id = auth.uid() and role = 'CUSTOMER');
create policy "admins manage users" on public.users for all using (public.current_user_role() = 'SUPER_ADMIN');
create policy "public view approved trial vehicles" on public.vehicles for select using ((status = 'APPROVED' and trial_available = true) or company_id = public.current_company_id() or public.current_user_role() = 'SUPER_ADMIN');
create policy "company admins manage own vehicles" on public.vehicles for insert with check (company_id = public.current_company_id() and public.current_user_role() = 'COMPANY_ADMIN');
create policy "company admins update own vehicles" on public.vehicles for update using (company_id = public.current_company_id() and public.current_user_role() = 'COMPANY_ADMIN');
create policy "company admins delete own vehicles" on public.vehicles for delete using (company_id = public.current_company_id() and public.current_user_role() = 'COMPANY_ADMIN');
create policy "super admins manage vehicles" on public.vehicles for all using (public.current_user_role() = 'SUPER_ADMIN');
create policy "public can view active showrooms" on public.showrooms for select using (status = 'ACTIVE' or company_id = public.current_company_id() or public.current_user_role() = 'SUPER_ADMIN');
create policy "company admins create own showrooms" on public.showrooms for insert with check (company_id = public.current_company_id() and public.current_user_role() = 'COMPANY_ADMIN');
create policy "company admins update own showrooms" on public.showrooms for update using (company_id = public.current_company_id() and public.current_user_role() = 'COMPANY_ADMIN');
create policy "company admins delete own showrooms" on public.showrooms for delete using (company_id = public.current_company_id() and public.current_user_role() = 'COMPANY_ADMIN');
create policy "super admins manage showrooms" on public.showrooms for all using (public.current_user_role() = 'SUPER_ADMIN');
create policy "vehicle images follow vehicle" on public.vehicle_images for all using (exists (select 1 from public.vehicles v where v.id = vehicle_id and (v.company_id = public.current_company_id() or public.current_user_role() = 'SUPER_ADMIN' or v.status = 'APPROVED')));
create policy "public availability" on public.availability for select using (available = true or public.current_user_role() in ('COMPANY_ADMIN','SUPER_ADMIN'));
create policy "company availability" on public.availability for all using (exists (select 1 from public.vehicles v where v.id = vehicle_id and v.company_id = public.current_company_id()) or public.current_user_role() = 'SUPER_ADMIN');
create policy "public time slots" on public.time_slots for select using (available = true or public.current_user_role() in ('COMPANY_ADMIN','SUPER_ADMIN'));
create policy "company bookings" on public.bookings for select using (user_id = auth.uid() or company_id = public.current_company_id() or public.current_user_role() = 'SUPER_ADMIN');
create policy "customers create own bookings" on public.bookings for insert with check (user_id = auth.uid());
create policy "booking owners and company admins update" on public.bookings for update using (user_id = auth.uid() or company_id = public.current_company_id() or public.current_user_role() = 'SUPER_ADMIN');
create policy "own payments" on public.payments for select using (exists (select 1 from public.bookings b where b.id = booking_id and (b.user_id = auth.uid() or b.company_id = public.current_company_id() or public.current_user_role() = 'SUPER_ADMIN')));
create policy "own notifications" on public.notifications for all using (user_id = auth.uid() or public.current_user_role() = 'SUPER_ADMIN');
create policy "published reviews" on public.reviews for select using (true); create policy "customers create reviews" on public.reviews for insert with check (user_id = auth.uid());

insert into storage.buckets (id, name, public) values ('vehicle-images', 'vehicle-images', true) on conflict (id) do nothing;
create policy "public vehicle image access" on storage.objects for select using (bucket_id = 'vehicle-images');
create policy "authenticated vehicle image upload" on storage.objects for insert to authenticated with check (bucket_id = 'vehicle-images');