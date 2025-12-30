
-- Enable RLS on all tables
alter table tenants enable row level security;
alter table members enable row level security;
alter table families enable row level security;
alter table bials enable row level security;
alter table committees enable row level security;
alter table ledger_heads enable row level security;
alter table transactions enable row level security;
alter table ss_classes enable row level security;
alter table ss_students enable row level security;
alter table prayer_requests enable row level security;

-- Helper function to get current user's tenant_id
create or replace function get_auth_tenant_id()
returns uuid language sql security definer as $$
  select tenant_id from members where auth_user_id = auth.uid() limit 1;
$$;

-- Policies

-- 1. Tenants
-- Public read for discovery (or restrict to own tenant?)
-- For now: Allow read if you are a member OR if it's public listing
create policy "Tenants are viewable by everyone" on tenants
  for select using (true);

create policy "Tenants can be created by authenticated users" on tenants
  for insert with check (auth.role() = 'authenticated'); 
  -- Note: The creator should ideally become a member immediately via trigger/transaction.

-- 2. Members
-- View: Only members of the same tenant
create policy "Members viewable by same tenant" on members
  for select using (
    tenant_id = get_auth_tenant_id()
  );

-- Insert: Self-registration (handled by signup action which uses service role? 
-- If using Client-side generic calls, we need this. But our Signup Action uses generic insert? 
-- Actually, our Action uses `createClient` from `utils/supabase/server`. 
-- If that client uses service role (cookies?), it bypasses RLS?
-- Standard `createClient` uses `ANON_KEY` but with user session. So it respects RLS.
-- Exception: The FIRST member creation (Signup) needs to be allowed.
-- Strategy: Allow insert if `auth_user_id` = `auth.uid()`.
create policy "Users can insert their own member record" on members
  for insert with check (
    auth_user_id = auth.uid()
  );
  
-- Update: Only Internal Admins or Self?
create policy "Admins can update members" on members
  for update using (
    exists (
      select 1 from members m
      where m.auth_user_id = auth.uid()
      and m.tenant_id = members.tenant_id
      and m.role = 'SuperAdmin'
    )
  );

-- 3. Families & Bials
create policy "Families viewable by tenant" on families
  for select using (
    exists (
       select 1 from bials 
       where bials.id = families.bial_id 
       and bials.tenant_id = get_auth_tenant_id()
    )
  );
-- (This join is expensive? Better if family has tenant_id directly. 
-- Feature 3 schema added tenant_id to many tables, but family was early schema. 
-- For now, relying on join or update schema.)

-- 4. Committees
create policy "Committees viewable by tenant" on committees
  for select using (tenant_id = get_auth_tenant_id());

create policy "Admins manage committees" on committees
  for all using (
    exists (
      select 1 from members 
      where auth_user_id = auth.uid() 
      and tenant_id = committees.tenant_id 
      and role = 'SuperAdmin'
    )
  );

-- 5. Operational Tools (Ledger, SS, Prayer)
-- Generic "Same Tenant" policy for Select
create policy "Ledger viewable by tenant" on ledger_heads
  for select using (tenant_id = get_auth_tenant_id());
  
create policy "Transactions viewable by tenant" on transactions
  for select using (tenant_id = get_auth_tenant_id());

-- Write access: Admin or CommitteeAdmin? 
-- Simplified: Authenticated members of tenant can Write for now (Trust model) 
-- OR strictly Admins. 
-- Let's stick to: "Members of tenant can insert" (e.g. Tithing entry by Treasurer?)
create policy "Tenant members can insert transactions" on transactions
  for insert with check (tenant_id = get_auth_tenant_id());

