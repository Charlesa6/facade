#!/usr/bin/env node
// Variante courrier : pour les cibles sans email publié (souvent les meilleures — aucun site, juste un téléphone).
// Une lettre A4 (fenêtre DL à droite) avec un QR code vers LEUR maquette.
//
//   FACADE_PREVIEW_SECRET=… node prospection/courrier.mjs [--out <dossier>] [--base https://apercu.votrefacade.fr]
//
// Lit data/enrichi/*.jsonl : lignes non retenues pour l'email, verdict aucun_site / site_obsolete, sans email,
// et non écartées pour une autre raison (hors cible, fermée, homonyme). Génère <out>/courriers/<slug>.html,
// les maquettes (<out>/p/<jeton>/) et, si Playwright est disponible, <out>/courriers.pdf (toutes les lettres).
// Expéditeur : config/expediteur.json (absent → lettres marquées BROUILLON, champs à compléter).
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHmac } from 'node:crypto';
import { createRequire } from 'node:module';
import { renderIndex, renderMentions, normalize } from '../generator/render.mjs';
import { titleCase } from './noms.mjs';
import { METIERS } from '../generator/metiers.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const qrcode = require('../vendor/qrcode.js');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? process.argv[i + 1] : d; };
const OUT = resolve(arg('out', join(ROOT, 'out')));
const BASE = arg('base', 'https://apercu.votrefacade.fr').replace(/\/$/, '');
const SECRET = process.env.FACADE_PREVIEW_SECRET;
if (!SECRET) { console.error('FACADE_PREVIEW_SECRET manquant'); process.exit(2); }

const cfgPath = join(ROOT, 'config', 'expediteur.json');
const EXP = existsSync(cfgPath) ? JSON.parse(readFileSync(cfgPath, 'utf8')) : null;
const exp = EXP || { nom: 'Charles Allouard', societe: '[Entité juridique Façade — à compléter]', adresse: ['[Adresse]', '[Code postal Ville]'], telephone: '[Téléphone]', email: '[email]@votrefacade.fr', site: 'votrefacade.fr', ville_lettre: 'Lyon', mentions: '[Forme, capital, RCS, SIREN — à compléter]' };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const token = (slug) => createHmac('sha256', SECRET).update(slug).digest('base64url').slice(0, 16);
const de = (w) => (/^[aeiouyhàâéèêëîïôûü]/i.test(w) ? `d'${w}` : `de ${w}`);
const dateLettre = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

function qrSvg(text) {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  return qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
}

// Adresse SIRENE (« 33 AVENUE GABRIEL PERI 69370 SAINT-DIDIER-AU-MONT-D'OR ») → lignes postales.
function lignesAdresse(brute) {
  const m = String(brute || '').match(/^(.*?)\s*(\d{5})\s+(.+)$/);
  if (!m) return [String(brute || '').toUpperCase()];
  return [m[1].toUpperCase(), `${m[2]} ${m[3].toUpperCase()}`];
}

const EXCLUS = /hors cible|filiale|franchise|groupe|liquidation|fermé|homonyme|incertain/i;
const dir = join(ROOT, 'data', 'enrichi');
const rows = readdirSync(dir).filter((f) => f.endsWith('.jsonl')).flatMap((f) => readFileSync(join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)));
const candidats = new Map(readdirSync(join(ROOT, 'data', 'candidats')).flatMap((f) =>
  readFileSync(join(ROOT, 'data', 'candidats', f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))).map((c) => [c.slug, c]));
const cibles = rows.filter((r) => !r.retenu && !r.email && ['aucun_site', 'site_obsolete'].includes(r.verdict) && !EXCLUS.test(r.motif || ''));

mkdirSync(join(OUT, 'courriers'), { recursive: true });
const lettres = [];
for (const r of cibles) {
  const c = candidats.get(r.slug);
  const profil = JSON.parse(readFileSync(join(ROOT, 'data', 'profils', `${r.slug}.json`), 'utf8'));
  if (r.telephone && !profil.telephone) profil.telephone = r.telephone;
  const d = normalize(profil);
  const t = token(r.slug);
  const url = `${BASE}/p/${t}/`;
  mkdirSync(join(OUT, 'p', t), { recursive: true });
  writeFileSync(join(OUT, 'p', t, 'index.html'), renderIndex(profil, { preview: true }));
  writeFileSync(join(OUT, 'p', t, 'mentions-legales.html'), renderMentions(profil, { preview: true }));

  const dg = c?.dirigeants?.[0];
  const attention = dg?.nom ? `À l'attention de ${titleCase(dg.prenom)} ${titleCase(dg.nom)}` : 'À l\'attention de la direction';
  const bonjour = dg?.nom ? `Bonjour ${titleCase(dg.prenom)} ${titleCase(dg.nom)},` : 'Bonjour,';
  const constat = r.verdict === 'site_obsolete' && r.website
    ? `j'ai consulté le site ${de(d.name)} : il mériterait d'être remis au goût du jour, notamment pour l'affichage sur téléphone.`
    : r.website
      ? `j'ai vu que l'adresse ${new URL(r.website).hostname.replace(/^www\./, '')} n'affiche pas de site en ligne.`
      : `je n'ai pas trouvé de site internet pour ${d.name}.`;

  const html = `<section class="lettre">
  ${EXP ? '' : '<div class="brouillon">BROUILLON</div>'}
  <div class="exp"><b>${esc(exp.nom)} — Façade</b><br>${esc(exp.societe)}<br>${exp.adresse.map(esc).join('<br>')}<br>${esc(exp.telephone)} · ${esc(exp.email)}</div>
  <div class="dest"><b>${esc((c?.raison_sociale || d.raison_sociale || d.name).toUpperCase())}</b><br>${esc(attention)}<br>${lignesAdresse(c?.adresse || profil.adresse).map(esc).join('<br>')}</div>
  <p class="date">${esc(exp.ville_lettre)}, le ${dateLettre}</p>
  <p class="objet"><b>Objet : le site internet ${esc(de(d.name))}, déjà prêt</b></p>
  <p>${esc(bonjour)}</p>
  <p>En cherchant ${esc((METIERS[d.metier] || METIERS.general).pros)} à ${esc(titleCase(d.ville || '') || 'votre secteur')}, ${esc(constat)}</p>
  <p>Plutôt que de vous envoyer un devis, j'ai préparé une maquette du site de votre entreprise, à partir de vos informations publiques. Scannez le code ci-dessous avec l'appareil photo de votre téléphone pour la voir :</p>
  <div class="qr">${qrSvg(url)}<div><b>Votre maquette</b><br><span class="url">${esc(url.replace(/^https:\/\//, ''))}</span><br><span class="petit">Privée : elle n'apparaît pas sur Google.</span></div></div>
  <p>Si elle vous plaît, nous l'ajustons ensemble (textes, photos de vos chantiers) et elle est en ligne sous votre nom en 48 heures, pour 49 € HT par mois, nom de domaine et hébergement compris. Sinon, elle sera supprimée d'ici la fin du mois.</p>
  <p>Le plus simple : un appel de 10 minutes au ${esc(exp.telephone)}.</p>
  <p>Bien cordialement,</p>
  <p class="sign">${esc(exp.nom)}<br><span class="petit">Fondateur, Façade</span></p>
  <footer>${esc(exp.societe)} · ${esc(exp.mentions)} · ${esc(exp.site)}<br>Vos coordonnées proviennent des registres publics des entreprises (INSEE/SIRENE). Pour ne plus recevoir nos courriers et supprimer la maquette : ${esc(exp.email)} ou ${esc(exp.telephone)}.</footer>
</section>`;
  writeFileSync(join(OUT, 'courriers', `${r.slug}.html`), page(html));
  lettres.push({ slug: r.slug, name: d.name, html });
}

function page(body) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Courriers Façade</title><style>
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Inter,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;font-size:10.5pt;line-height:1.5;background:#e5e7eb}
.lettre{position:relative;width:210mm;height:297mm;padding:18mm 20mm 16mm;background:#fff;margin:0 auto 10mm;page-break-after:always;overflow:hidden}
.exp{font-size:9pt;color:#374151;width:80mm}
.dest{position:absolute;left:110mm;top:50mm;width:85mm;font-size:10.5pt;line-height:1.4}
.date{margin-top:52mm;text-align:right}.objet{margin:6mm 0 5mm}
p{margin:0 0 3.2mm}.qr{display:flex;gap:6mm;align-items:center;margin:4mm 0 5mm;padding:4mm;border:1px solid #e5e7eb;border-radius:3mm}
.qr svg{width:32mm;height:32mm;flex:none}.url{font-family:ui-monospace,Menlo,monospace;font-size:9pt}.petit{font-size:8.5pt;color:#6b7280}
.sign{margin-top:6mm}footer{position:absolute;left:20mm;right:20mm;bottom:10mm;font-size:7.5pt;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:2mm}
.brouillon{position:absolute;top:120mm;left:0;right:0;text-align:center;font-size:90pt;font-weight:800;color:rgba(220,38,38,.10);transform:rotate(-30deg);pointer-events:none}
@media print{body{background:#fff}.lettre{margin:0}}
</style></head><body>${body}</body></html>`;
}

writeFileSync(join(OUT, 'courriers', 'tous.html'), page(lettres.map((l) => l.html).join('\n')));
console.log(`${lettres.length} courriers → ${join(OUT, 'courriers')}`);
for (const l of lettres) console.log(`  ${l.name}`);

// PDF d'impression (optionnel : nécessite Playwright + Chromium, présents dans l'environnement Claude Code).
try {
  const { chromium } = require('playwright');
  const browser = await chromium.launch(existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' } : {});
  const p = await browser.newPage();
  await p.goto('file://' + join(OUT, 'courriers', 'tous.html'));
  await p.pdf({ path: join(OUT, 'courriers.pdf'), format: 'A4', printBackground: true });
  await browser.close();
  console.log(`PDF → ${join(OUT, 'courriers.pdf')}`);
} catch (e) {
  console.log('(PDF non généré : Playwright indisponible — ouvrir courriers/tous.html et imprimer)');
}
