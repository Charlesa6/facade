-- Jeton de maquette : l'URL publique https://www.konsilys.com/apercu/<preview_token> (non devinable).
-- Remplace le jeton HMAC calculé hors ligne : la maquette est rendue à la volée depuis `profile`.
alter table fc_prospects add column if not exists preview_token text unique default encode(gen_random_bytes(12), 'hex');
update fc_prospects set preview_token = encode(gen_random_bytes(12), 'hex') where preview_token is null;
alter table fc_prospects alter column preview_token set not null;
update fc_prospects set preview_url = 'https://www.konsilys.com/apercu/' || preview_token where profile is not null;
-- Canal de prospection : email (adresse publiée) ou téléphone (appel par Charles).
alter table fc_prospects add column if not exists canal text not null default 'email' check (canal in ('email','telephone'));
