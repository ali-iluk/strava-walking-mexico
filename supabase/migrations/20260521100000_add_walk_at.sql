alter table public.day_entries
  add column if not exists walk_at timestamptz;

-- Order walks on their calendar day using time-of-day from when they were logged.
update public.day_entries
set walk_at = (date::timestamp + (created_at::time))
where walk_at is null;

alter table public.day_entries
  alter column walk_at set not null,
  alter column walk_at set default now();

create index if not exists day_entries_date_walk_at_idx
  on public.day_entries (date desc, walk_at asc);
