-- Create a table for contact messages
create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'new'
);

-- Enable Row Level Security (RLS)
alter table contact_messages enable row level security;

-- Create policy to allow anyone to insert messages (since contact form is public)
create policy "Anyone can insert contact messages"
  on contact_messages for insert
  with check (true);

-- Create policy to allow only authenticated admins (or no one else for now) to view
-- For now, we'll restrict viewing to service_role only or specific users if needed later.
-- This ensures public users can't read other people's messages.
create policy "Only admins can view contact messages"
  on contact_messages for select
  using (false); -- Adjust this if you implement an admin panel later
