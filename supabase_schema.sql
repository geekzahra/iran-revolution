-- SQL for Supabase SQL Editor

-- 1. Create the victims table
create table public.victims (
  id uuid default gen_random_uuid() primary key,
  name_en text not null,
  name_fa text not null,
  age int,
  death_date date,
  city_id text, -- ID from victims.js cities array
  city_name_en text,
  city_name_fa text,
  image_url text, -- Path in the storage bucket
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.victims enable row level security;

-- 3. Create a policy to allow anyone to read victim data
create policy "Allow public read access"
  on public.victims for select
  using (true);

-- 4. Create a storage bucket for images
-- Note: Buckets are usually created via the UI, but here is the SQL anyway
insert into storage.buckets (id, name, public) 
values ('victim-images', 'victim-images', true);

-- 5. Storage policies for the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'victim-images' );
