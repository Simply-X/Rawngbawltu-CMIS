-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type denomination_enum as enum ('PCI', 'BCM', 'SA', 'UPC', 'Custom');
create type role_enum as enum ('SuperAdmin', 'CommitteeAdmin', 'Member');

-- Tables
create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  denomination denomination_enum not null,
  preset_lingo jsonb check (jsonb_typeof(preset_lingo) = 'object'),
  created_at timestamptz default now()
);

create table members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid, -- circular ref deferred
  full_name text not null,
  phone text,
  role role_enum not null default 'Member',
  created_at timestamptz default now()
);

create table bials (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  name text not null,
  elder_id uuid references members(id),
  created_at timestamptz default now()
);

create table families (
  id uuid primary key default gen_random_uuid(),
  bial_id uuid references bials(id),
  head_name text not null,
  created_at timestamptz default now()
);

-- Add circular fk for members -> families
alter table members add constraint members_family_id_fkey foreign key (family_id) references families(id);

create table committees (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  name text not null,
  budget_total decimal default 0,
  created_at timestamptz default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid references committees(id) not null,
  file_url text not null,
  title text not null,
  created_at timestamptz default now()
);
