-- Repairs schema required by the owner and student portal assignment sync.
-- Idempotent: safe to run against the already-patched production database.
alter table public.assignments add column if not exists student_id text;
alter table public.assignments add column if not exists course text;
alter table public.assignments add column if not exists course_code text;
alter table public.assignments add column if not exists subject_code text;
alter table public.assignments add column if not exists instructions text;
alter table public.assignments add column if not exists status text default 'pending';
alter table public.assignments add column if not exists score text;
alter table public.assignments add column if not exists feedback text;
alter table public.assignments add column if not exists urgency text default 'normal';
alter table public.assignments add column if not exists submitted_at timestamptz;
alter table public.assignments add column if not exists submission_notes text;
alter table public.assignments add column if not exists assignment jsonb;
alter table public.assignments add column if not exists updated_at timestamptz default now();

-- The application writes empty due dates and does not use the legacy grade column.
alter table public.assignments alter column due_date drop not null;
alter table public.assignments alter column grade drop not null;

create index if not exists assignments_student_id_created_at_idx
  on public.assignments (student_id, created_at);

-- Student credential upserts use student_id as their conflict target.
create unique index if not exists student_accounts_student_id_uidx
  on public.student_accounts (student_id);
