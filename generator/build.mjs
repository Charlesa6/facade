#!/usr/bin/env node
// Génère le site d'une entreprise à partir de son profil JSON.
//
//   node generator/build.mjs <profil.json>... [--preview] [--out <dossier>]
//
// --preview : maquette de prospection → bandeau « Maquette », noindex, et publication
//             sous out/p/<jeton>/ où <jeton> = HMAC(FACADE_PREVIEW_SECRET, slug) :
//             URL stable pour un prospect mais impossible à deviner.
// sans      : site de production (référençable, JSON-LD) sous out/sites/<slug>/.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { createHmac } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { renderIndex, renderMentions } from './render.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const preview = args.includes('--preview');
const outIdx = args.indexOf('--out');
const outDir = resolve(outIdx >= 0 ? args[outIdx + 1] : join(ROOT, 'out'));
const files = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');

if (!files.length) {
  console.error('usage : node generator/build.mjs <profil.json>... [--preview] [--out <dossier>]');
  process.exit(2);
}

const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function previewToken(slug, secret = process.env.FACADE_PREVIEW_SECRET) {
  if (!secret) throw new Error('FACADE_PREVIEW_SECRET manquant : requis pour générer des maquettes (jetons non devinables)');
  return createHmac('sha256', secret).update(slug).digest('base64url').slice(0, 16);
}

const results = [];
for (const f of files) {
  const profile = JSON.parse(readFileSync(f, 'utf8'));
  const slug = profile.slug || slugify(profile.nom_commercial || profile.raison_sociale || '');
  const dir = preview ? join(outDir, 'p', previewToken(slug)) : join(outDir, 'sites', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), renderIndex(profile, { preview }));
  writeFileSync(join(dir, 'mentions-legales.html'), renderMentions(profile, { preview }));
  results.push({ slug, dir, path: preview ? `/p/${dir.split('/').pop()}/` : `/sites/${slug}/` });
}

// Hébergement des maquettes : en-têtes noindex sur tout le domaine de prévisualisation.
if (preview) {
  const vercel = join(ROOT, 'previews', 'vercel.json');
  if (existsSync(vercel)) copyFileSync(vercel, join(outDir, 'vercel.json'));
  writeFileSync(join(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
}

for (const r of results) console.log(`${r.slug}\t${r.path}\t${r.dir}`);
