create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  level text not null,
  patterns jsonb not null,
  stats jsonb not null,
  trades jsonb not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists reports_user_created_idx on public.reports (user_id, created_at desc);

alter table public.reports enable row level security;

revoke all on table public.reports from anon;
grant select, insert, delete on table public.reports to authenticated;

drop policy if exists "Users can read own reports" on public.reports;
create policy "Users can read own reports" on public.reports for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own reports" on public.reports;
create policy "Users can insert own reports" on public.reports for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own reports" on public.reports;
create policy "Users can delete own reports" on public.reports for delete to authenticated using ((select auth.uid()) = user_id);
