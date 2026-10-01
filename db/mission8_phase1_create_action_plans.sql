create table if not exists public.action_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_id uuid not null references public.reports(id) on delete cascade,
  pattern_key text not null,
  title text not null,
  action_text text not null,
  status text not null default 'active'
    check (status in ('active', 'completed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint action_plans_user_report_pattern_unique
    unique (user_id, report_id, pattern_key)
);

create index if not exists action_plans_user_created_idx
  on public.action_plans (user_id, created_at desc);

alter table public.action_plans enable row level security;

revoke all on table public.action_plans from anon;
grant select, insert, delete on table public.action_plans to authenticated;
grant update (status, completed_at) on table public.action_plans to authenticated;

drop policy if exists "Users can read own action plans" on public.action_plans;
create policy "Users can read own action plans"
  on public.action_plans
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own action plans" on public.action_plans;
create policy "Users can insert own action plans"
  on public.action_plans
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.reports
      where reports.id = report_id
        and reports.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users can update own action plans" on public.action_plans;
create policy "Users can update own action plans"
  on public.action_plans
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.reports
      where reports.id = report_id
        and reports.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users can delete own action plans" on public.action_plans;
create policy "Users can delete own action plans"
  on public.action_plans
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
