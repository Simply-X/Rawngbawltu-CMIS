
-- Ledger Module
create table ledger_heads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  name text not null, -- Tithe, Mission, Building
  is_active boolean default true,
  created_at timestamptz default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  family_id uuid references families(id), -- Nullable if generic income
  head_id uuid references ledger_heads(id) not null,
  amount decimal not null,
  description text,
  date date default CURRENT_DATE,
  created_by uuid references members(id),
  created_at timestamptz default now()
);

-- Sunday School Module
create table ss_classes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  name text not null, -- Beginner, Primary
  teacher_id uuid references members(id),
  created_at timestamptz default now()
);

create table ss_students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references ss_classes(id) not null,
  member_id uuid references members(id) not null,
  created_at timestamptz default now()
);
