-- Assignment submission workflow: metadata table and private file bucket.
create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id text not null,
  student_id text not null,
  student_name text,
  submission_notes text,
  file_url text,
  file_name text,
  storage_path text,
  submitted_at timestamptz not null default now(),
  status text not null default 'Submitted',
  score text,
  feedback text,
  updated_at timestamptz not null default now()
);
create index if not exists assignment_submissions_assignment_id_idx on public.assignment_submissions (assignment_id);
create index if not exists assignment_submissions_student_id_idx on public.assignment_submissions (student_id);
create unique index if not exists assignment_submissions_assignment_student_uidx on public.assignment_submissions (assignment_id, student_id);

alter table public.assignment_submissions enable row level security;
drop policy if exists "assignment submissions portal access" on public.assignment_submissions;
create policy "assignment submissions portal access" on public.assignment_submissions
  for all to anon, authenticated using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('assignment-submissions', 'assignment-submissions', false, 20971520,
  array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/zip','application/x-zip-compressed','image/png','image/jpeg','image/webp','text/plain'])
on conflict (id) do update set public = false, file_size_limit = 20971520, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "assignment submissions storage portal access" on storage.objects;
create policy "assignment submissions storage portal access" on storage.objects
  for all to anon, authenticated using (bucket_id = 'assignment-submissions')
  with check (bucket_id = 'assignment-submissions');
