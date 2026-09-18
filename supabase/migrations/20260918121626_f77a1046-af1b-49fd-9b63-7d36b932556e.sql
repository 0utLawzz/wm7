-- 1. Roles infrastructure
do $$ begin
  create type public.app_role as enum ('admin','staff','viewer');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

drop policy if exists "users read own roles" on public.user_roles;
create policy "users read own roles" on public.user_roles
for select to authenticated using (user_id = auth.uid());

drop policy if exists "admins manage roles" on public.user_roles;
create policy "admins manage roles" on public.user_roles
for all to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'))
with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));

-- 2. trademarks
drop policy if exists "authenticated read canonical trademarks" on public.trademarks;
drop policy if exists "authenticated write canonical trademarks" on public.trademarks;
create policy "staff read trademarks" on public.trademarks
for select to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff','viewer')));
create policy "staff insert trademarks" on public.trademarks
for insert to authenticated with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')));
create policy "staff update trademarks" on public.trademarks
for update to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')))
with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')));
create policy "admins delete trademarks" on public.trademarks
for delete to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));

-- 3. agent_assignments
drop policy if exists "editors manage assignments" on public.agent_assignments;
drop policy if exists "staff read assignments" on public.agent_assignments;
create policy "staff read agent assignments" on public.agent_assignments
for select to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff','viewer')));
create policy "staff insert agent assignments" on public.agent_assignments
for insert to authenticated with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')));
create policy "staff update agent assignments" on public.agent_assignments
for update to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')))
with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')));
create policy "admins delete agent assignments" on public.agent_assignments
for delete to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));

-- 4. assignments (broken auth.role()='admin')
drop policy if exists "allow write for admins" on public.assignments;
drop policy if exists "allow read for authenticated" on public.assignments;
drop policy if exists "staff read assignments" on public.assignments;
drop policy if exists "staff insert assignments" on public.assignments;
drop policy if exists "staff update assignments" on public.assignments;
drop policy if exists "staff delete assignments" on public.assignments;
create policy "staff read assignments" on public.assignments
for select to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff','viewer')));
create policy "staff insert assignments" on public.assignments
for insert to authenticated with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')));
create policy "staff update assignments" on public.assignments
for update to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')))
with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')));
create policy "admins delete assignments" on public.assignments
for delete to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));

-- 5. cases
drop policy if exists "allow write for admins" on public.cases;
drop policy if exists "allow read for authenticated" on public.cases;
create policy "staff read cases" on public.cases
for select to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff','viewer')));
create policy "staff write cases" on public.cases
for all to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')))
with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')));

-- 6. client_groups
drop policy if exists "allow write for admins" on public.client_groups;
drop policy if exists "allow read for authenticated" on public.client_groups;
create policy "staff read client groups" on public.client_groups
for select to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff','viewer')));
create policy "staff write client groups" on public.client_groups
for all to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')))
with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')));

-- 7. journal_publications
drop policy if exists "editors manage journal publications" on public.journal_publications;
drop policy if exists "staff read journal publications" on public.journal_publications;
create policy "staff read journal publications" on public.journal_publications
for select to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff','viewer')));
create policy "staff write journal publications" on public.journal_publications
for all to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')))
with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')));

-- 8. trademark_stage_events
drop policy if exists "editors manage stage events" on public.trademark_stage_events;
drop policy if exists "staff read stage events" on public.trademark_stage_events;
create policy "staff read stage events" on public.trademark_stage_events
for select to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff','viewer')));
create policy "staff write stage events" on public.trademark_stage_events
for all to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')))
with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role in ('admin','staff')));

-- 9. audit_logs: admins only
drop policy if exists "audit_logs_auth_select" on public.audit_logs;
create policy "admins read audit logs" on public.audit_logs
for select to authenticated using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));

-- 10. SECURITY DEFINER functions exposed to anon/authenticated
create or replace function public.brandex_record_history(p_trademark_id text)
returns jsonb
language sql
stable
security invoker
set search_path to ''
as $function$
  select jsonb_build_object(
    'timeline', coalesce((
      select jsonb_agg(to_jsonb(e) order by e.started_at desc)
      from public.trademark_stage_events e
      where e.trademark_id = p_trademark_id
    ), '[]'::jsonb),
    'assignments', coalesce((
      select jsonb_agg(to_jsonb(a) order by a.assigned_at desc)
      from public.agent_assignments a
      where a.trademark_id = p_trademark_id
    ), '[]'::jsonb)
  );
$function$;

create or replace function public.brandex_public_search(p_tm_number text)
returns table(tm_cpr_number text, application_name text, status text, sub_status text, filing_date date, journal_number text, journal_date date, current_stage integer, condition text)
language sql
stable
security invoker
set search_path to 'public','pg_temp'
as $function$
select t.tm_cpr_number,t.application_name,t.status,t.sub_status,t.filing_date,t.journal_number,t.journal_date,
  case t.status when 'STAGE 1' then 1 when 'STAGE 2' then 2 when 'STAGE 3' then 3 when 'STAGE 4' then 4 when 'STAGE 5' then 5 else 0 end,
  t.condition
from public.trademarks t
where nullif(trim(p_tm_number),'') is not null and lower(t.tm_cpr_number)=lower(trim(p_tm_number))
limit 1; $function$;

revoke all on function public.brandex_public_search(text) from anon, public;
grant execute on function public.brandex_public_search(text) to authenticated;
revoke all on function public.brandex_record_history(text) from anon, public;
grant execute on function public.brandex_record_history(text) to authenticated;
