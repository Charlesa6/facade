#!/usr/bin/env node
// Sourcing via l'annuaire officiel des entreprises RGE (ADEME, open data) : la source la plus rentable.
// Chaque entreprise y DÉCLARE elle-même son email, son téléphone et son site → coordonnées publiées et sourcées.
//
//   node prospection/rge.mjs --departement 69 [--max 60] [--effectif 02,03,11,12]
//
// Étapes : ADEME (email déclaré) → SIRENE (active, siège local, taille, NAF d'un métier couvert)
//          → audit du site déclaré, ou du domaine de l'email s'il est propre à l'entreprise.
// Écrit data/candidats/<dep>-rge.jsonl, data/profils/<slug>.json et data/enrichi/rge.jsonl
// (même format que la recherche manuelle, lu par prospection/revue.mjs).
import { mkdirSync, writeFileSync, existsSync, readdirSync, readFileSync, appendFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { titleCase, enseigneUtilisable } from './noms.mjs';
import { METIERS, metierFromNaf } from '../generator/metiers.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ADEME = 'https://data.ademe.fr/data-fair/api/v1/datasets/liste-des-entreprises-rge-2';
const SIRENE = 'https://recherche-entreprises.api.gouv.fr/search';
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? process.argv[i + 1] : d; };
const dep = arg('departement');
const max = Number(arg('max', '60'));
const tranches = arg('effectif', '02,03,11,12').split(',');
if (!dep) { console.error('usage : --departement <code> [--max N] [--effectif 02,03,...]'); process.exit(2); }

const TRANCHES = { '01': '1 à 2 salariés', '02': '3 à 5 salariés', '03': '6 à 9 salariés', '11': '10 à 19 salariés', '12': '20 à 49 salariés', '21': '50 à 99 salariés' };
const FORMES = { '1000': 'Entreprise individuelle', '5499': 'SARL', '5498': 'EURL', '5710': 'SAS', '5720': 'SASU', '5410': 'SARL', '5308': 'SNC' };
const WEBMAILS = /@(gmail|yahoo|hotmail|outlook|live|icloud|orange|wanadoo|free|sfr|neuf|laposte|bbox|aol|club-internet|numericable)\./i;
const INTERDITS = /^(jobs|job|rh|drh|recrutement|emploi|dpo|rgpd|qualif\w*|compta\w*|factur\w*|noreply|no-reply)@/i;

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
// MX via DNS-over-HTTPS (le résolveur local des conteneurs ne sert pas toujours les MX).
// En cas de doute (réseau), on ne rejette pas : seul un « pas de MX » explicite écarte l'adresse.
async function aDesMx(domaine) {
  try {
    const r = await get(`https://dns.google/resolve?name=${encodeURIComponent(domaine)}&type=MX`);
    if (r.Status === 3) return false; // NXDOMAIN
    return (r.Answer || []).some((a) => a.type === 15) || !r.Answer;
  } catch { return true; }
}
const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// SIREN déjà traités (toutes sources confondues) : on ne re-prospecte jamais deux fois.
const dejaVus = new Set();
for (const d of ['candidats']) {
  const p = join(ROOT, 'data', d);
  if (existsSync(p)) for (const f of readdirSync(p)) for (const l of readFileSync(join(p, f), 'utf8').split('\n').filter(Boolean)) dejaVus.add(JSON.parse(l).siren);
}

// 1. ADEME : toutes les lignes du département avec un email (une ligne par qualification → regroupement par SIRET).
const select = 'siret,nom_entreprise,adresse,code_postal,commune,telephone,email,site_internet';
let url = `${ADEME}/lines?${new URLSearchParams({ qs: `code_postal:${dep}* AND _exists_:email`, size: '1000', select })}`;
const parSiret = new Map();
while (url) {
  const page = await get(url);
  for (const l of page.results) if (!parSiret.has(l.siret)) parSiret.set(l.siret, l);
  url = page.results.length ? page.next : null;
}
console.log(`ADEME : ${parSiret.size} établissements RGE avec email dans le ${dep}`);

mkdirSync(join(ROOT, 'data', 'candidats'), { recursive: true });
mkdirSync(join(ROOT, 'data', 'profils'), { recursive: true });
mkdirSync(join(ROOT, 'data', 'enrichi'), { recursive: true });

const stats = { examines: 0, deja_vus: 0, hors_cible: 0, retenus: 0, site_correct: 0, a_verifier: 0, email_refuse: 0 };
// Les établissements sans site déclaré d'abord : ce sont les meilleures cibles.
const lignes = [...parSiret.values()].sort((a, b) => !!a.site_internet - !!b.site_internet);
for (const a of lignes) {
  if (stats.retenus >= max) break;
  const siren = a.siret.slice(0, 9);
  if (dejaVus.has(siren)) { stats.deja_vus++; continue; }
  dejaVus.add(siren);
  stats.examines++;
  const email = String(a.email).trim().toLowerCase();
  if (INTERDITS.test(email) || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(email)) { stats.email_refuse++; continue; }
  // Domaine sans serveur de messagerie → l'email rebondirait (et abîmerait la réputation d'envoi).
  if (!WEBMAILS.test(email)) {
    if (!(await aDesMx(email.split('@')[1]))) { stats.email_refuse++; continue; }
  }

  // 2. SIRENE : entreprise active, siège dans le département, taille et métier dans la cible.
  const s = await get(`${SIRENE}?${new URLSearchParams({ q: siren, etat_administratif: 'A', per_page: '1' })}`);
  const e = (s.results || []).find((r) => r.siren === siren);
  const metier = e && metierFromNaf(e.activite_principale);
  if (!e || !metier || e.siege?.departement !== dep || !tranches.includes(e.tranche_effectif_salarie)) { stats.hors_cible++; continue; }

  // 3. Site : celui déclaré à l'ADEME, sinon le domaine de l'email s'il est propre à l'entreprise.
  const declare = a.site_internet && !/facebook\.com|instagram\.com|linkedin\.com|pagesjaunes/i.test(a.site_internet) ? a.site_internet : null;
  const cible = declare || (!WEBMAILS.test(email) ? email.split('@')[1] : null);
  let audit = { url: null, verdict: 'aucun_site', problemes: [a.site_internet ? 'Seulement une page de réseau social' : 'Aucun site déclaré'] };
  if (cible) audit = JSON.parse(execFileSync(process.execPath, [join(ROOT, 'prospection', 'audit.mjs'), cible], { encoding: 'utf8' }).trim());
  if (audit.verdict === 'site_correct') stats.site_correct++;
  if (audit.verdict === 'a_verifier') stats.a_verifier++;

  const sg = e.siege;
  const nom = titleCase([(sg.liste_enseignes || [])[0], sg.nom_commercial].find(enseigneUtilisable) || e.nom_raison_sociale || a.nom_entreprise);
  const slug = slugify(`${nom}-${sg.code_postal}`);
  const source = `${ADEME}/lines?qs=siret:${a.siret}`;
  const candidat = {
    siren, raison_sociale: e.nom_raison_sociale || e.nom_complet, nom_commercial: nom, naf: e.activite_principale, metier,
    forme_juridique: FORMES[e.nature_juridique] || null, date_creation: e.date_creation, effectif: TRANCHES[e.tranche_effectif_salarie] || null,
    est_rge: true, adresse: sg.adresse, code_postal: sg.code_postal, ville: titleCase(sg.libelle_commune),
    dirigeants: (e.dirigeants || []).filter((d) => d.type_dirigeant === 'personne physique').map((d) => ({ prenom: titleCase(String(d.prenoms || '').split(/\s+/)[0]), nom: titleCase(String(d.nom || '').replace(/\s*\(.*?\)/g, '')), qualite: d.qualite })),
    source: `https://annuaire-entreprises.data.gouv.fr/entreprise/${siren}`, slug,
  };
  appendFileSync(join(ROOT, 'data', 'candidats', `${dep}-rge.jsonl`), JSON.stringify(candidat) + '\n');

  const profilPath = join(ROOT, 'data', 'profils', `${slug}.json`);
  if (!existsSync(profilPath)) writeFileSync(profilPath, JSON.stringify({
    slug, raison_sociale: candidat.raison_sociale, nom_commercial: nom, forme_juridique: candidat.forme_juridique, siren, metier,
    annee_creation: e.date_creation ? Number(e.date_creation.slice(0, 4)) : null, effectif: candidat.effectif,
    ville: candidat.ville, code_postal: sg.code_postal, adresse: titleCase(sg.adresse), zone_intervention: [candidat.ville],
    certifications: ['Entreprise RGE'], telephone: a.telephone || null, email, sources: [candidat.source, source],
  }, null, 2) + '\n');

  const retenu = ['aucun_site', 'site_obsolete'].includes(audit.verdict);
  if (retenu) stats.retenus++;
  appendFileSync(join(ROOT, 'data', 'enrichi', 'rge.jsonl'), JSON.stringify({
    slug, website: audit.url, verdict: audit.verdict, problemes: audit.problemes, email, email_source: source,
    telephone: a.telephone || null, retenu,
    motif: retenu ? `email déclaré à l'ADEME${WEBMAILS.test(email) ? ' (messagerie grand public)' : ''}` : audit.verdict === 'a_verifier' ? 'site à vérifier' : 'site correct',
  }) + '\n');
  console.log(`${retenu ? '✓' : '·'} ${nom} (${candidat.ville}, ${METIERS[metier].label}, ${candidat.effectif}) — ${audit.verdict}`);
}
console.log(JSON.stringify(stats));
