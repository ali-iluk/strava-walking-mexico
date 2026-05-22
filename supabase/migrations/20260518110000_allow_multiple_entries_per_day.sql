-- Allow multiple walk logs per calendar day (morning + evening, etc.)
alter table public.day_entries
  drop constraint if exists day_entries_date_key;

create index if not exists day_entries_date_updated_idx
  on public.day_entries (date desc, updated_at desc);
