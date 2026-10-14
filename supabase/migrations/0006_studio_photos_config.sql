-- Photos des maquettes (prises par Charles sur place ou envoyées par le commerçant), servies en lecture publique
-- sous des noms aléatoires ; écriture uniquement par la fonction « studio » (service role).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('maquettes-photos', 'maquettes-photos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
-- Configuration privée des fonctions (ex. clé API Google Places), lue par le service role uniquement.
-- La clé elle-même n'est jamais versionnée : insert into fc_config (cle, valeur) values ('google_places_key', '…').
create table if not exists fc_config (
  cle text primary key,
  valeur text not null,
  updated_at timestamptz not null default now()
);
alter table fc_config enable row level security;
revoke all on fc_config from anon, authenticated;
