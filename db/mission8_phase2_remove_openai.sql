drop policy if exists "Users can update own AI review"
  on public.reports;

revoke update on table public.reports from authenticated;

alter table public.reports
  drop column if exists ai_review,
  drop column if exists ai_review_model,
  drop column if exists ai_review_created_at;
