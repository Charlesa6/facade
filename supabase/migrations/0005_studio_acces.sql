-- Accès au « studio » (konsilys.com/studio) : empreinte SHA-256 du code d'accès de Charles (le code lui-même n'est stocké nulle part).
-- Appliquée via MCP le 14/10/2026. L'empreinte réelle n'est pas versionnée : pour changer le code,
--   update fc_studio_acces set cle_sha256 = encode(sha256('<nouveau code>'::bytea), 'hex'), updated_at = now() where id = 1;
create table if not exists fc_studio_acces (
  id int primary key default 1 check (id = 1),
  cle_sha256 text not null,
  updated_at timestamptz not null default now()
);
alter table fc_studio_acces enable row level security;
revoke all on fc_studio_acces from anon, authenticated;
