#!/usr/bin/env node
// Sourcing de prospects BTP via l'API publique Recherche d'entreprises (SIRENE/RNE, gratuite, sans clé).
//
//   node prospection/sourcer.mjs --departement 69 --metier maconnerie [--page 1] [--effectif 01,02,03,11,12]
//
// Écrit, pour chaque entreprise active trouvée :
//   data/candidats/<dep>-<metier>-p<page>.jsonl  (une ligne par entreprise)
//   data/profils/<slug>.json                     (brouillon de profil pour generator/build.mjs)
// Le dossier data/ est ignoré par Git : aucune donnée de prospect ne doit être versionnée.
//
// L'API ne dit pas si l'entreprise a un site : c'est l'étape suivante (recherche web + prospection/audit.mjs).
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { titleCase, enseigneUtilisable } from './noms.mjs';
import { METIERS } from '../generator/metiers.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://recherche-entreprises.api.gouv.fr/search';

const TRANCHES = { '01': '1 à 2 salariés', '02': '3 à 5 salariés', '03': '6 à 9 salariés', '11': '10 à 19 salariés', '12': '20 à 49 salariés', '21': '50 à 99 salariés' };
const FORMES = { '1000': 'Entreprise individuelle', '5499': 'SARL', '5498': 'EURL', '5710': 'SAS', '5720': 'SASU', '5410': 'SARL', '5308': 'SNC' };

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : def;
}

const dep = arg('departement');
const metier = arg('metier');
const page = Number(arg('page', '1'));
const effectif = arg('effectif', '01,02,03,11,12');
if (!dep || !METIERS[metier]) {
  console.error(`usage : --departement <code> --metier <${Object.keys(METIERS).join('|')}> [--page N] [--effectif 01,02,...]`);
  process.exit(2);
}

// L'API est parfois instable derrière le proxy : backoff exponentiel, 5 essais.
async function get(url) {
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(url, { headers: { accept: 'application/json' } });
      if (r.status === 429 || r.status >= 500) throw new Error('HTTP ' + r.status);
      if (!r.ok) throw Object.assign(new Error('HTTP ' + r.status), { fatal: true });
      return await r.json();
    } catch (e) {
      if (e.fatal || i >= 4) throw e;
      await new Promise((ok) => setTimeout(ok, 1000 * 2 ** i));
    }
  }
}

const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const params = new URLSearchParams({
  activite_principale: METIERS[metier].naf.join(','),
  departement: dep,
  tranche_effectif_salarie: effectif,
  etat_administratif: 'A',
  per_page: '25',
  page: String(page),
});
const data = await get(`${API}?${params}`);

mkdirSync(join(ROOT, 'data', 'candidats'), { recursive: true });
mkdirSync(join(ROOT, 'data', 'profils'), { recursive: true });

const lines = [];
let created = 0;
let horsZone = 0;
for (const e of data.results || []) {
  const s = e.siege || {};
  // L'API retient une entreprise dès qu'UN établissement est dans le département : on ne garde que les sièges locaux.
  if (s.departement !== dep) { horsZone++; continue; }
  const enseigne = [(s.liste_enseignes || [])[0], s.nom_commercial].find(enseigneUtilisable);
  const nom = titleCase(enseigne || e.nom_raison_sociale || e.nom_complet);
  const slug = slugify(`${nom}-${s.code_postal || dep}`);
  const candidat = {
    siren: e.siren,
    raison_sociale: e.nom_raison_sociale || e.nom_complet,
    nom_commercial: nom,
    naf: e.activite_principale,
    metier,
    forme_juridique: FORMES[e.nature_juridique] || null,
    date_creation: e.date_creation,
    effectif: TRANCHES[e.tranche_effectif_salarie] || null,
    est_rge: !!e.complements?.est_rge,
    adresse: s.adresse,
    code_postal: s.code_postal,
    ville: titleCase(s.libelle_commune),
    // Dirigeants : uniquement le nom et la qualité publiés au RNE, pour adresser le message.
    dirigeants: (e.dirigeants || []).filter((d) => d.type_dirigeant === 'personne physique' && !/commissaire|suppl[ée]ant/i.test(d.qualite || '')).map((d) => ({ prenom: titleCase(String(d.prenoms || '').split(/\s+/)[0]), nom: titleCase(String(d.nom || '').replace(/\s*\(.*?\)/g, '')), qualite: d.qualite })),
    source: `https://annuaire-entreprises.data.gouv.fr/entreprise/${e.siren}`,
    slug,
  };
  lines.push(JSON.stringify(candidat));

  const profilPath = join(ROOT, 'data', 'profils', `${slug}.json`);
  if (!existsSync(profilPath)) {
    const profil = {
      slug,
      raison_sociale: candidat.raison_sociale,
      nom_commercial: nom,
      forme_juridique: candidat.forme_juridique,
      siren: candidat.siren,
      metier,
      annee_creation: candidat.date_creation ? Number(candidat.date_creation.slice(0, 4)) : null,
      effectif: candidat.effectif,
      ville: candidat.ville,
      code_postal: candidat.code_postal,
      adresse: titleCase(candidat.adresse),
      zone_intervention: [candidat.ville],
      // Seules les certifications vérifiées par une source officielle sont affichées.
      certifications: candidat.est_rge ? ['Entreprise RGE'] : [],
      telephone: null,
      email: null,
      sources: [candidat.source],
    };
    writeFileSync(profilPath, JSON.stringify(profil, null, 2) + '\n');
    created++;
  }
}

const out = join(ROOT, 'data', 'candidats', `${dep}-${metier}-p${page}.jsonl`);
writeFileSync(out, lines.join('\n') + (lines.length ? '\n' : ''));
console.log(`${lines.length} entreprises (page ${page}/${data.total_pages ?? '?'}, ${data.total_results ?? '?'} au total) → ${out}`);
console.log(`${horsZone} écartées (siège hors du ${dep}), ${created} nouveaux brouillons de profil dans data/profils/`);
