#!/usr/bin/env node
// Prépare la relecture humaine d'une vague de prospection, AVANT tout envoi.
//
//   FACADE_PREVIEW_SECRET=… node prospection/revue.mjs [--out <dossier>] [--base https://apercu.votrefacade.fr]
//
// Lit data/enrichi/*.jsonl (sortie des recherches), garde les lignes `retenu: true`, et pour chacune :
//   - génère la maquette (<out>/p/<jeton>/) avec le profil enrichi data/profils/<slug>.json ;
//   - rédige le premier email à partir de emails/sequence.md ;
// puis écrit <out>/revue.html : une fiche par prospect (maquette en aperçu, email, sources) à valider.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHmac } from 'node:crypto';
import { renderIndex, renderMentions, normalize } from '../generator/render.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? process.argv[i + 1] : d; };
const OUT = resolve(arg('out', join(ROOT, 'out')));
const BASE = arg('base', 'https://apercu.votrefacade.fr').replace(/\/$/, '');
const SECRET = process.env.FACADE_PREVIEW_SECRET;
if (!SECRET) { console.error('FACADE_PREVIEW_SECRET manquant'); process.exit(2); }

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const token = (slug) => createHmac('sha256', SECRET).update(slug).digest('base64url').slice(0, 16);

// Premier email : section « Email 1 » de emails/sequence.md, variables remplacées.
const seq = readFileSync(join(ROOT, 'emails', 'sequence.md'), 'utf8');
const m1 = seq.match(/## Email 1[^\n]*\n+\*\*Objet\*\* : ([^\n]+)\n+([\s\S]*?)\n---/);
if (!m1) throw new Error('Email 1 introuvable dans emails/sequence.md');

const PROBLEMES = {
  aucun_site: (d) => `je n'ai pas trouvé de site internet pour ${d.name}`,
  site_obsolete: (d, e) => `j'ai consulté le site de ${d.name} et relevé un point : ${lcFirst(e.problemes?.[0] || 'il mériterait un coup de neuf')}`,
};
const lcFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

function email(d, e, url) {
  const dirigeant = d._dirigeant;
  const vars = {
    prenom_nom: dirigeant ? dirigeant : '',
    entreprise: d.name,
    ville: d.ville || 'votre secteur',
    metier: d.metier_label.toLowerCase(),
    lien_maquette: url,
    probleme: (PROBLEMES[e.verdict] || PROBLEMES.aucun_site)(d, e),
    pied: `Charles Allouard — Façade · votrefacade.fr\nJe vous écris car vous dirigez une entreprise du bâtiment ; vos coordonnées proviennent de ${e.email_source}. Pour ne plus recevoir mes messages et supprimer la maquette : <lien de désinscription>`,
  };
  const fill = (t) => t.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
  let body = fill(m1[2]).replace(/^Bonjour ,/m, 'Bonjour,');
  return { subject: fill(m1[1]), body };
}

const dir = join(ROOT, 'data', 'enrichi');
const rows = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.jsonl')).flatMap((f) =>
  readFileSync(join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))) : [];
const candidats = new Map(readdirSync(join(ROOT, 'data', 'candidats')).flatMap((f) =>
  readFileSync(join(ROOT, 'data', 'candidats', f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))).map((c) => [c.slug, c]));

const retenus = rows.filter((r) => r.retenu);
const cards = [];
for (const e of retenus) {
  const profil = JSON.parse(readFileSync(join(ROOT, 'data', 'profils', `${e.slug}.json`), 'utf8'));
  if (e.telephone && !profil.telephone) profil.telephone = e.telephone;
  if (e.email && !profil.email) profil.email = e.email;
  const t = token(e.slug);
  const pdir = join(OUT, 'p', t);
  mkdirSync(pdir, { recursive: true });
  writeFileSync(join(pdir, 'index.html'), renderIndex(profil, { preview: true }));
  writeFileSync(join(pdir, 'mentions-legales.html'), renderMentions(profil, { preview: true }));
  const d = normalize(profil);
  // Dirigeant personne physique publié au RNE → « Bonjour Prénom Nom, » ; sinon « Bonjour, ».
  const dir0 = candidats.get(e.slug)?.dirigeants?.[0];
  d._dirigeant = dir0?.prenom && dir0?.nom ? `${dir0.prenom} ${dir0.nom}` : '';
  const mail = email(d, e, `${BASE}/p/${t}/`);
  cards.push({ e, d, t, mail });
}

const stats = {
  examines: rows.length,
  retenus: retenus.length,
  motifs: rows.filter((r) => !r.retenu).reduce((a, r) => ((a[r.motif || 'autre'] = (a[r.motif || 'autre'] || 0) + 1), a), {}),
};

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Revue pilote Façade</title><style>
:root{--ink:#111827;--muted:#6b7280;--line:#e5e7eb;--bg:#f9fafb;--card:#fff;--acc:#b45309}
@media (prefers-color-scheme:dark){:root{--ink:#f3f4f6;--muted:#9ca3af;--line:#374151;--bg:#0b0f19;--card:#111827;--acc:#f59e0b}}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;background:var(--bg);color:var(--ink);line-height:1.5}
.wrap{max-width:1200px;margin:0 auto;padding:24px 16px}h1{margin:0 0 4px}.muted{color:var(--muted)}
.stats{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 28px}.stats span{background:var(--card);border:1px solid var(--line);border-radius:999px;padding:4px 12px;font-size:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;margin-bottom:24px;overflow:hidden}
.head{padding:14px 18px;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:6px 16px;align-items:baseline}
.head b{font-size:18px}.tag{font-size:12px;font-weight:700;text-transform:uppercase;color:var(--acc)}
.body{display:grid;grid-template-columns:1.1fr 1fr}
iframe{width:100%;height:560px;border:0;border-right:1px solid var(--line);background:#fff}
.mail{padding:16px 18px;font-size:14px}.mail pre{white-space:pre-wrap;font:inherit;margin:8px 0 0}
.src{font-size:12px;word-break:break-all}.src a{color:var(--acc)}
@media (max-width:860px){.body{grid-template-columns:1fr}iframe{height:420px;border-right:0;border-bottom:1px solid var(--line)}}
</style></head><body><div class="wrap">
<h1>Revue du pilote Façade</h1><p class="muted">Rien n'a été envoyé. Chaque fiche : la maquette générée et le premier email proposé. Lien de maquette provisoire (domaine non encore configuré).</p>
<div class="stats"><span>${stats.examines} entreprises examinées</span><span><b>${stats.retenus} retenues</b></span>${Object.entries(stats.motifs).map(([k, v]) => `<span>${v} × ${esc(k)}</span>`).join('')}</div>
${cards.map(({ e, d, t, mail }) => `<section class="card"><div class="head"><b>${esc(d.name)}</b><span class="muted">${esc(d.metier_label)} · ${esc(d.ville || '')} · ${esc(d.effectif || '')}</span><span class="tag">${e.verdict === 'aucun_site' ? 'aucun site' : 'site obsolète'}</span>${e.website ? `<a class="src" href="${esc(e.website)}" target="_blank" rel="noopener">${esc(e.website)}</a>` : ''}</div>
<div class="body"><iframe src="p/${t}/index.html" loading="lazy" title="Maquette ${esc(d.name)}"></iframe>
<div class="mail"><div class="muted">À : ${esc(e.email)}</div><div><b>Objet : ${esc(mail.subject)}</b></div><pre>${esc(mail.body)}</pre>
<p class="src">Email publié sur : <a href="${esc(e.email_source)}" target="_blank" rel="noopener">${esc(e.email_source)}</a></p>
${e.problemes?.length ? `<p class="src">Audit : ${e.problemes.map(esc).join(' · ')}</p>` : ''}</div></div></section>`).join('\n')}
</div></body></html>`;
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'revue.html'), html);
console.log(`${stats.retenus}/${stats.examines} retenus → ${join(OUT, 'revue.html')}`);
