
-- Add auth_user_id to members table
alter table members 
add column auth_user_id uuid references auth.users(id);

-- Optional: Create index for faster lookups on login
create index idx_members_auth_user_id on members(auth_user_id);
