create table if not exists public.day_entries (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  steps integer not null check (steps >= 0 and steps <= 100000),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists day_entries_date_desc_idx on public.day_entries (date desc);

create or replace function public.set_day_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists day_entries_updated_at on public.day_entries;
create trigger day_entries_updated_at
  before update on public.day_entries
  for each row
  execute function public.set_day_entries_updated_at();

alter table public.day_entries enable row level security;

drop policy if exists "day_entries_anon_select" on public.day_entries;
drop policy if exists "day_entries_anon_insert" on public.day_entries;
drop policy if exists "day_entries_anon_update" on public.day_entries;
drop policy if exists "day_entries_anon_delete" on public.day_entries;

create policy "day_entries_anon_select"
  on public.day_entries for select to anon using (true);

create policy "day_entries_anon_insert"
  on public.day_entries for insert to anon with check (true);

create policy "day_entries_anon_update"
  on public.day_entries for update to anon using (true) with check (true);

create policy "day_entries_anon_delete"
  on public.day_entries for delete to anon using (true);
