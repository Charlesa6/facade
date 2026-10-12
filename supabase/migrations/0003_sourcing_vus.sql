-- Mémoire du sourcing automatique : chaque SIREN examiné (retenu ou non) n'est plus jamais réexaminé.
-- Alimentée par `prospection/rge.mjs --sql` (routine quotidienne). Appliquée via MCP le 12/10/2026.
create table if not exists public.fc_sourcing_vus (
  siren text primary key,
  source text not null,
  verdict text,
  motif text,
  examined_at timestamptz not null default now()
);
alter table public.fc_sourcing_vus enable row level security;
revoke all on public.fc_sourcing_vus from anon, authenticated;
insert into public.fc_sourcing_vus (siren, source, verdict, motif)
select siren, 'historique', coalesce(site_verdict,'?'), 'déjà dans fc_prospects' from public.fc_prospects where siren is not null
on conflict do nothing;
