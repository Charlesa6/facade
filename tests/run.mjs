#!/usr/bin/env node
// Tests du générateur (aucune dépendance) : node tests/run.mjs
import { renderIndex, renderMentions, normalize } from '../generator/render.mjs';
import { METIERS, ICONS, metierFromNaf } from '../generator/metiers.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('✓', name); };

const exemples = readdirSync(new URL('../profiles/exemples/', import.meta.url)).map((f) => JSON.parse(readFileSync(new URL(`../profiles/exemples/${f}`, import.meta.url), 'utf8')));

test('chaque exemple se génère (site + mentions), en maquette et en production', () => {
  for (const p of exemples) for (const preview of [true, false]) {
    const html = renderIndex(p, { preview });
    assert.match(html, /^<!doctype html>/);
    assert.ok(!/undefined|null|\[object Object\]/.test(html.replace(/<script[\s\S]*?<\/script>/g, '')), `valeur vide rendue dans ${p.slug}`);
    assert.match(renderMentions(p, { preview }), /Mentions légales/);
  }
});

test('maquette : noindex + bandeau ; production : ni l\'un ni l\'autre, JSON-LD présent', () => {
  const p = exemples[0];
  const pv = renderIndex(p, { preview: true });
  assert.match(pv, /noindex,nofollow/);
  assert.match(pv, /class="pv"/);
  const prod = renderIndex(p, { preview: false });
  assert.doesNotMatch(prod, /noindex/);
  assert.doesNotMatch(prod, /class="pv"/);
  assert.match(prod, /application\/ld\+json/);
});

test('les contenus génériques sont marqués « à valider »', () => {
  const d = normalize({ raison_sociale: 'X', metier: 'couverture' });
  assert.ok(d.services.every((s) => s.a_valider));
  assert.ok(d.description_a_valider);
  assert.match(renderIndex({ raison_sociale: 'X', metier: 'couverture' }, { preview: true }), /card tbv/);
});

test('aucune certification ni atout inventé quand le profil n\'en fournit pas', () => {
  const html = renderIndex({ raison_sociale: 'X', metier: 'electricite' }, { preview: false });
  assert.doesNotMatch(html, /class="badges"/);
  assert.doesNotMatch(html, /\bRGE\b|Qualibat|décennale/i);
});

test('échappement HTML des champs du profil', () => {
  const html = renderIndex({ raison_sociale: '<script>alert(1)</script>', metier: 'maconnerie', ville: 'A"B' });
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /&lt;script&gt;/);
});

test('JSON-LD non cassable par un « </script> » dans le profil', () => {
  const html = renderIndex({ raison_sociale: 'a</script><b>', metier: 'maconnerie' });
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert.equal(JSON.parse(ld).name, 'a</script><b>');
});

test('tous les codes NAF sont rattachés à un seul métier', () => {
  const seen = new Map();
  for (const [k, m] of Object.entries(METIERS)) for (const naf of m.naf) {
    assert.ok(!seen.has(naf), `${naf} dans ${seen.get(naf)} et ${k}`);
    seen.set(naf, k);
  }
  assert.equal(metierFromNaf('43.22A'), 'plomberie');
});

test('élision devant un métier commençant par une voyelle', () => {
  assert.match(normalize({ raison_sociale: 'X', metier: 'electricite' }).description, /travaux d'électricité/);
  assert.match(normalize({ raison_sociale: 'X', metier: 'maconnerie' }).description, /travaux de maçonnerie/);
});

test('commerces : bouton d\'action du métier, « Nous trouver », pas de devis', () => {
  for (const [metier, cta] of [['restaurant', 'Réserver une table'], ['coiffure', 'Prendre rendez-vous'], ['fleuriste', 'Commander un bouquet'], ['boulangerie', 'Passer commande'], ['fromager', 'Passer commande'], ['boucher', 'Passer commande'], ['poissonnier', 'Passer commande'], ['pharmacie', 'Appeler la pharmacie']]) {
    const html = renderIndex({ raison_sociale: 'X', metier, ville: 'Lyon 3e', adresse: '1 rue A, 69003 Lyon', telephone: '04 00 00 00 00' }, { preview: false });
    assert.match(html, new RegExp(cta));
    assert.match(html, /Nous trouver/);
    assert.match(html, /google\.com\/maps/);
    assert.doesNotMatch(html, /devis/i);
    assert.doesNotMatch(renderIndex({ raison_sociale: 'X', metier }, { preview: false }), /devis/i);
  }
  const ld = renderIndex({ raison_sociale: 'X', metier: 'coiffure' }).match(/"@type":"(\w+)"/)[1];
  assert.equal(ld, 'HairSalon');
});

test('horaires manquants d\'un commerce marqués « à valider »', () => {
  assert.match(renderIndex({ raison_sociale: 'X', metier: 'boulangerie' }, { preview: true }), /class="tbv">[\s\S]*?Horaires d&#39;ouverture à compléter/);
});

test('chaque métier a son pictogramme ; pharmacie sans « commande » ni promesse', () => {
  for (const [k, m] of Object.entries(METIERS)) assert.ok(ICONS[m.icon], `pictogramme manquant : ${k}`);
  const html = renderIndex({ raison_sociale: 'X', metier: 'pharmacie' }, { preview: true });
  assert.match(html, /Appeler la pharmacie/);
  assert.match(html, /"?Pharmacie/);
  assert.doesNotMatch(html, /commande|promo|remise/i);
});

test('photos : principale + galerie ; photos Google seulement dans la maquette ; URL non https refusées', () => {
  const p = { raison_sociale: 'X', metier: 'pharmacie', google_maps_url: 'https://maps.app.goo.gl/abc', google_note: 4.7, google_avis: 120,
    photos: [{ src: 'https://cdn.test/a.jpg', origine: 'commercant' }, { src: 'https://cdn.test/g.jpg', origine: 'google' }, { src: 'javascript:alert(1)' }, { src: 'https://cdn.test/b.jpg"><script>', origine: 'commercant' }] };
  const pv = renderIndex(p, { preview: true });
  assert.match(pv, /class="hero-art hero-photo"[\s\S]*src="https:\/\/cdn\.test\/a\.jpg"/);
  assert.match(pv, /id="photos"[\s\S]*g\.jpg[\s\S]*Photo : fiche Google/);
  assert.doesNotMatch(pv, /javascript:|<script>/);
  assert.match(pv, /Nos avis Google/);
  assert.match(pv, /4,7 ★/);
  const prod = renderIndex(p, { preview: false });
  assert.doesNotMatch(prod, /g\.jpg/);
  assert.doesNotMatch(renderIndex({ raison_sociale: 'X', metier: 'boulangerie', google_maps_url: 'https://evil.test/maps/' }), /avis Google/);
});

test('fromagerie : thème terroir (serif, photo plein écran, rangées alternées)', () => {
  const base = { raison_sociale: 'FROMAGERIE TEST', metier: 'fromager', ville: 'Lyon 2e', telephone: '04 00 00 00 08' };
  const sans = renderIndex(base, { preview: true });
  assert.match(sans, /class="is-preview th-terroir"/);
  assert.match(sans, /family=Merriweather/);
  assert.match(sans, /class="hero-t"/);
  assert.match(sans, /class="blocs-t"[\s\S]*class="num-t">01/);
  assert.ok(!/class="rang/.test(sans), 'pas de cadre vide sans photo');
  assert.match(sans, /class="filigrane"/);
  const ph = (n) => ({ src: `https://x.supabase.co/storage/v1/object/public/maquettes-photos/${n}.jpg` });
  const avec = renderIndex({ ...base, photos: [ph('a'), ph('b'), ph('c'), ph('d'), ph('e'), ph('f')] }, { preview: false });
  assert.match(avec, /hero-t hero-t-photo[\s\S]*a\.jpg/);
  assert.match(avec, /class="rang-vis"><img src="[^"]*b\.jpg/);
  assert.ok(!/<figure><img src="[^"]*b\.jpg/.test(avec), 'photo des rangées non répétée dans la galerie');
  assert.match(avec, /<figure><img src="[^"]*f\.jpg/);
  const boulangerie = renderIndex({ ...base, metier: 'boulangerie' });
  assert.ok(!/<body class="[^"]*th-terroir|family=Merriweather/.test(boulangerie), 'les autres métiers gardent le thème standard');
});

test('boucherie : thème maison (Playfair, bandeau doré, tuiles)', () => {
  const base = { raison_sociale: 'BOUCHERIE TEST', metier: 'boucher', ville: 'Lyon 7e', telephone: '04 00 00 00 09', horaires: 'Mardi-samedi 8 h - 19 h' };
  const sans = renderIndex(base, { preview: true });
  assert.match(sans, /<body class="is-preview th-maison"/);
  assert.match(sans, /family=Playfair\+Display/);
  assert.match(sans, /class="bandeau"><span>Passer commande au <a href="tel:\+33400000009">/);
  assert.match(sans, /class="tuile tuile-vide/);
  const ph = (n) => ({ src: `https://x.supabase.co/storage/v1/object/public/maquettes-photos/${n}.jpg` });
  const avec = renderIndex({ ...base, photos: [ph('a'), ph('b'), ph('c'), ph('d'), ph('e'), ph('f')] });
  assert.match(avec, /hero-m hero-m-photo[\s\S]*a\.jpg/);
  assert.match(avec, /class="tuile( tbv)?"[^>]*>\s*<img src="[^"]*b\.jpg/);
  assert.match(avec, /<figure><img src="[^"]*f\.jpg/);
  const sansInfos = renderIndex({ raison_sociale: 'B', metier: 'boucher' });
  assert.ok(!/class="bandeau"/.test(sansInfos), 'pas de bandeau sans téléphone ni horaires (rien d\'inventé)');
});

test('commerces : thèmes fournil, atelier, boucle, trattoria, marée (photos non répétées, rien d\'inventé)', () => {
  const ph = (n) => ({ src: `https://x.supabase.co/storage/v1/object/public/maquettes-photos/${n}.jpg` });
  const attendus = { boulangerie: ['fournil', 'Montserrat', 'hero-f'], fleuriste: ['atelier', 'Gloock', 'hero-a'], coiffure: ['boucle', 'Bricolage', 'hero-c'], restaurant: ['trattoria', 'Lora', 'hero-r'], poissonnier: ['maree', 'Lato', 'hero-o'] };
  for (const [metier, [theme, police, hero]] of Object.entries(attendus)) {
    const base = { raison_sociale: 'COMMERCE TEST', metier, ville: 'Lyon 3e', telephone: '04 00 00 00 10' };
    const sans = renderIndex(base, { preview: true });
    assert.match(sans, new RegExp(`<body class="is-preview th-${theme}"`), metier);
    assert.match(sans, new RegExp(`family=${police}`), metier);
    assert.match(sans, new RegExp(`class="${hero}"`), metier);
    assert.ok(!/<img/.test(sans), `${metier} : aucune image sans photo`);
    const avec = renderIndex({ ...base, photos: ['a', 'b', 'c', 'd', 'e', 'f'].map(ph) });
    assert.match(avec, new RegExp(`class="${hero} ${hero}-photo"[\\s\\S]*a\\.jpg`), metier);
    assert.equal((avec.match(/b\.jpg/g) || []).length, 1, `${metier} : photo b affichée une seule fois`);
    assert.match(avec, /<figure><img src="[^"]*f\.jpg/, metier);
    assert.doesNotMatch(renderIndex({ raison_sociale: 'X', metier }), /class="bandeau"|class="note-g"/, `${metier} : ni bandeau ni note sans données`);
  }
  assert.match(renderIndex({ raison_sociale: 'X', metier: 'fleuriste', horaires: 'Lundi 9 h - 19 h' }), /class="bandeau"><span class="bandeau-h">Lundi/);
  assert.match(renderIndex({ raison_sociale: 'X', metier: 'poissonnier', google_note: 4.8, google_avis: 52 }), /class="note-g">[\s\S]*4,8 \/ 5 · 52 avis Google/);
});

test('profil sans nom refusé', () => {
  assert.throws(() => normalize({ metier: 'maconnerie' }));
});

console.log(`\n${n} tests OK`);
