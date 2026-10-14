-- Prospects rencontrés en démarchage de rue : maquette créée sur place depuis le « studio » (konsilys.com/studio).
-- Jamais d'email automatique (les routines ne traitent que canal = 'email'). Appliquée via MCP le 14/10/2026.
alter table fc_prospects drop constraint fc_prospects_canal_check;
alter table fc_prospects add constraint fc_prospects_canal_check check (canal = any (array['email','telephone','terrain']));
alter table fc_prospects add column if not exists updated_by_studio_at timestamptz;
