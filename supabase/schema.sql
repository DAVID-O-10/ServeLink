-- ServeLink Supabase schema (optional cloud backend)
create table if not exists businesses (
  id bigint primary key,
  user_id text,
  business_name text not null,
  business_type text,
  category text,
  description text,
  address text,
  location_link text,
  whatsapp text,
  instagram text,
  tiktok text,
  images jsonb default '[]',
  verified boolean default false,
  featured boolean default false,
  created_at timestamptz default now(),
  reviews jsonb default '[]',
  reports jsonb default '[]',
  analytics jsonb default '{"views":0,"whatsappClicks":0,"mapsClicks":0}'
);

alter table businesses enable row level security;

create policy "Public read" on businesses for select using (true);
create policy "Authenticated insert" on businesses for insert with check (auth.uid()::text = user_id);
create policy "Owner update" on businesses for update using (auth.uid()::text = user_id);
create policy "Owner delete" on businesses for delete using (auth.uid()::text = user_id);
