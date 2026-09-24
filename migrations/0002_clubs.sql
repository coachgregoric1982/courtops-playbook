-- Clubs, membership, and subscription plan (trial | club | expired).
create table if not exists clubs (
  id text primary key,
  name text not null,
  short_name text not null default '',
  join_code text not null unique,
  owner_id text not null,
  plan text not null default 'trial',
  plan_expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists clubs_owner_id_idx on clubs (owner_id);
create index if not exists clubs_join_code_idx on clubs (join_code);

create table if not exists club_members (
  club_id text not null references clubs(id) on delete cascade,
  user_id text not null,
  role text not null default 'coach',
  created_at timestamptz not null default now(),
  primary key (club_id, user_id)
);
create index if not exists club_members_user_id_idx on club_members (user_id);
