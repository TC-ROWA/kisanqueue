create extension if not exists "uuid-ossp";

do $$ begin
  create type user_role as enum ('farmer', 'operator', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type centre_status as enum ('OPEN', 'HIGH_RUSH', 'LIMITED_CAPACITY', 'PAUSED', 'CLOSED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type queue_status as enum (
    'BOOKED', 'ARRIVED', 'WAITING', 'CALLED', 'QUALITY_CHECK',
    'WEIGHING', 'PROCUREMENT', 'COMPLETED', 'CANCELLED', 'NO_SHOW'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type quality_result as enum ('APPROVED', 'REJECTED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('PENDING', 'INITIATED', 'PROCESSING', 'PAID', 'FAILED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type complaint_category as enum ('PAYMENT', 'QUALITY', 'WEIGHT', 'TOKEN', 'CENTRE', 'OTHER');
exception when duplicate_object then null; end $$;

do $$ begin
  create type complaint_status as enum ('OPEN', 'IN_REVIEW', 'RESOLVED', 'REJECTED');
exception when duplicate_object then null; end $$;


create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'farmer',
  full_name text not null,
  mobile text not null unique,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists farmers (
  id uuid primary key references users(id) on delete cascade,
  village text not null,
  district text not null,
  state text not null,
  farmer_id text,
  preferred_language text not null default 'en',
  created_at timestamptz not null default now()
);

create table if not exists procurement_centres (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  village text,
  district text,
  state text,
  latitude double precision not null,
  longitude double precision not null,
  daily_capacity int not null default 100,
  opening_time time not null default '08:00',
  closing_time time not null default '18:00',
  status centre_status not null default 'OPEN',
  paused_reason text,
  reopen_estimate timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists operators (
  id uuid primary key references users(id) on delete cascade,
  centre_id uuid not null references procurement_centres(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists admins (
  id uuid primary key references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists crops (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  msp_rate numeric(10, 2)
);

create table if not exists slots (
  id uuid primary key default uuid_generate_v4(),
  centre_id uuid not null references procurement_centres(id) on delete cascade,
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  capacity int not null default 20,
  booked_count int not null default 0,
  unique (centre_id, slot_date, start_time)
);

create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid not null references farmers(id) on delete cascade,
  centre_id uuid not null references procurement_centres(id),
  slot_id uuid not null references slots(id),
  crop_id uuid not null references crops(id),
  declared_quantity numeric(10, 2) not null,
  token_number text not null unique,
  status text not null default 'CONFIRMED',
  created_at timestamptz not null default now()
);

create table if not exists queue_entries (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  farmer_id uuid not null references farmers(id),
  centre_id uuid not null references procurement_centres(id),
  token_number text not null,
  queue_position int,
  status queue_status not null default 'BOOKED',
  arrival_time timestamptz,
  called_time timestamptz,
  completed_time timestamptz,
  estimated_wait_minutes int,
  created_at timestamptz not null default now()
);

create table if not exists quality_checks (
  id uuid primary key default uuid_generate_v4(),
  queue_entry_id uuid not null references queue_entries(id) on delete cascade,
  moisture numeric(5, 2),
  foreign_matter numeric(5, 2),
  grade text,
  result quality_result not null,
  remarks text,
  checked_by uuid references operators(id),
  created_at timestamptz not null default now()
);

create table if not exists weighments (
  id uuid primary key default uuid_generate_v4(),
  queue_entry_id uuid not null references queue_entries(id) on delete cascade,
  declared_quantity numeric(10, 2) not null,
  actual_weight numeric(10, 2) not null,
  rate numeric(10, 2) not null,
  gross_amount numeric(12, 2) not null,
  weighed_by uuid references operators(id),
  created_at timestamptz not null default now()
);

create table if not exists procurements (
  id uuid primary key default uuid_generate_v4(),
  queue_entry_id uuid not null references queue_entries(id) on delete cascade,
  weighment_id uuid references weighments(id),
  deductions numeric(12, 2) not null default 0,
  net_amount numeric(12, 2) not null,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  procurement_id uuid not null references procurements(id) on delete cascade,
  farmer_id uuid not null references farmers(id),
  amount numeric(12, 2) not null,
  status payment_status not null default 'PENDING',
  method text default 'Direct Bank Transfer',
  reference text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid not null references farmers(id) on delete cascade,
  category text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists complaints (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid not null references farmers(id) on delete cascade,
  category complaint_category not null,
  subject text not null,
  description text not null,
  status complaint_status not null default 'OPEN',
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  complaint_id uuid references complaints(id) on delete cascade,
  file_path text not null,
  uploaded_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references users(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_queue_entries_centre_status on queue_entries (centre_id, status);
create index if not exists idx_bookings_farmer on bookings (farmer_id);
create index if not exists idx_slots_centre_date on slots (centre_id, slot_date);
create index if not exists idx_notifications_farmer on notifications (farmer_id, read);

alter table users enable row level security;
alter table farmers enable row level security;
alter table bookings enable row level security;
alter table queue_entries enable row level security;
alter table quality_checks enable row level security;
alter table weighments enable row level security;
alter table procurements enable row level security;
alter table payments enable row level security;
alter table notifications enable row level security;
alter table complaints enable row level security;
alter table operators enable row level security;
alter table admins enable row level security;

create policy "farmers_select_own" on farmers for select using (auth.uid() = id);
create policy "farmers_update_own" on farmers for update using (auth.uid() = id);

create policy "bookings_select_own" on bookings for select using (auth.uid() = farmer_id);
create policy "bookings_insert_own" on bookings for insert with check (auth.uid() = farmer_id);

create policy "queue_select_own" on queue_entries for select using (auth.uid() = farmer_id);

create policy "notifications_select_own" on notifications for select using (auth.uid() = farmer_id);
create policy "notifications_update_own" on notifications for update using (auth.uid() = farmer_id);

create policy "complaints_select_own" on complaints for select using (auth.uid() = farmer_id);
create policy "complaints_insert_own" on complaints for insert with check (auth.uid() = farmer_id);

create policy "payments_select_own" on payments for select using (auth.uid() = farmer_id);

create policy "operator_queue_select" on queue_entries for select using (
  exists (select 1 from operators o where o.id = auth.uid() and o.centre_id = queue_entries.centre_id)
);
create policy "operator_queue_update" on queue_entries for update using (
  exists (select 1 from operators o where o.id = auth.uid() and o.centre_id = queue_entries.centre_id)
);
create policy "operator_quality_insert" on quality_checks for insert with check (
  exists (
    select 1 from operators o
    join queue_entries q on q.centre_id = o.centre_id
    where o.id = auth.uid() and q.id = quality_checks.queue_entry_id
  )
);
create policy "operator_weighment_insert" on weighments for insert with check (
  exists (
    select 1 from operators o
    join queue_entries q on q.centre_id = o.centre_id
    where o.id = auth.uid() and q.id = weighments.queue_entry_id
  )
);


create policy "admin_all_users" on users for all using (exists (select 1 from admins a where a.id = auth.uid()));

alter table procurement_centres disable row level security;
alter table crops disable row level security;
alter table slots disable row level security;
