-- Create tables for JobSwipe application

-- Enable RLS (Row Level Security)
alter default privileges revoke execute on functions from public;

-- Create user profiles table
create table public.user_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  title text,
  location text,
  about text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create employer profiles table
create table public.employer_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  company_name text,
  email text,
  industry text,
  location text,
  about text,
  website text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create jobs table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.employer_profiles(id) on delete cascade not null,
  title text not null,
  company text not null,
  location text,
  salary text,
  description text not null,
  requirements text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create job skills table
create table public.job_skills (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  skill text not null,
  created_at timestamp with time zone default now() not null
);

-- Create user skills table
create table public.user_skills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  skill text not null,
  created_at timestamp with time zone default now() not null
);

-- Create job preferences table
create table public.job_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  remote boolean default false,
  full_time boolean default false,
  contract boolean default false,
  relocation boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create job swipes table
create table public.job_swipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  liked boolean not null,
  created_at timestamp with time zone default now() not null
);

-- Create candidate swipes table
create table public.candidate_swipes (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.employer_profiles(id) on delete cascade not null,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  liked boolean not null,
  created_at timestamp with time zone default now() not null
);

-- Create matches table
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  employer_id uuid references public.employer_profiles(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null
);

-- Create messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references auth.users on delete cascade not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default now() not null
);

-- Set up Row Level Security (RLS) policies
-- User profiles: users can only read/update their own profile
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Employer profiles: employers can only read/update their own profile
create policy "Employers can view their own profile"
  on public.employer_profiles for select
  using (auth.uid() = id);

create policy "Employers can update their own profile"
  on public.employer_profiles for update
  using (auth.uid() = id);

-- Jobs: employers can create/read/update/delete their own jobs, users can read all jobs
create policy "Employers can create jobs"
  on public.jobs for insert
  with check (auth.uid() = employer_id);

create policy "Employers can view their own jobs"
  on public.jobs for select
  using (auth.uid() = employer_id);

create policy "Users can view all jobs"
  on public.jobs for select
  using (true);

create policy "Employers can update their own jobs"
  on public.jobs for update
  using (auth.uid() = employer_id);

create policy "Employers can delete their own jobs"
  on public.jobs for delete
  using (auth.uid() = employer_id);

-- Enable RLS on all tables
alter table public.user_profiles enable row level security;
alter table public.employer_profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.job_skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.job_preferences enable row level security;
alter table public.job_swipes enable row level security;
alter table public.candidate_swipes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

