-- Konsilys, offre sites internet BTP — base de prospection et de suivi clients.
-- À appliquer sur le projet Supabase dédié `facade` (hxxbhbfueqwsvwqrojea), jamais sur la base du SaaS (rwmstlesxnglpblrurqj).
-- Tables lues/écrites uniquement en SQL d'administration (agents) : RLS activée, aucun accès client.

create extension if not exists pgcrypto;

create table if not exists fc_prospects (
  id              uuid primary key default gen_random_uuid(),
  siren           text unique,
  company         text not null,
  metier          text not null,
  city            text,
  postal_code     text,
  departement     text,
  website         text,                         -- null = aucun site trouvé
  site_verdict    text check (site_verdict in ('aucun_site','site_obsolete','site_correct')),
  site_problems   jsonb not null default '[]',  -- sortie de prospection/audit.mjs
  contact_name    text,
  contact_role    text,
  email           text,
  email_source    text,                         -- URL où l'adresse est publiée (obligatoire pour envoyer)
  phone           text,
  profile         jsonb,                        -- profil complet passé au générateur
  preview_url     text,                         -- maquette privée (noindex)
  status          text not null default 'a_contacter'
                  check (status in ('a_contacter','sequence','repondu','rdv','gagne','perdu','desinscrit','bounce','exclu')),
  step            int not null default 0,
  next_action_at  date default current_date,
  unsub_token     text not null unique default encode(gen_random_bytes(18), 'hex'),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists fc_prospects_status_idx on fc_prospects (status, next_action_at);
create unique index if not exists fc_prospects_email_idx on fc_prospects (lower(email)) where email is not null;

create table if not exists fc_emails (
  id           uuid primary key default gen_random_uuid(),
  prospect_id  uuid not null references fc_prospects(id) on delete cascade,
  step         int not null,
  subject      text not null,
  body         text not null,
  resend_id    text,
  sent_at      timestamptz not null default now()
);

-- Liste d'opposition : prioritaire sur tout envoi.
create table if not exists fc_suppression (
  email      text primary key check (email = lower(email)),
  reason     text,
  created_at timestamptz not null default now()
);

-- Clients signés : site en production + abonnement.
create table if not exists fc_clients (
  id                 uuid primary key default gen_random_uuid(),
  prospect_id        uuid references fc_prospects(id),
  company            text not null,
  domain             text,
  plan               text check (plan in ('essentiel','pro')),
  stripe_customer_id text,
  stripe_sub_id      text,
  site_status        text not null default 'a_produire'
                     check (site_status in ('a_produire','en_validation','en_ligne','suspendu','resilie')),
  profile            jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table fc_prospects   enable row level security;
alter table fc_emails      enable row level security;
alter table fc_suppression enable row level security;
alter table fc_clients     enable row level security;
-- Aucune policy : ni anon ni authenticated n'y ont accès ; seul le service role (agents, Edge Functions).
revoke all on fc_prospects, fc_emails, fc_suppression, fc_clients from anon, authenticated;
