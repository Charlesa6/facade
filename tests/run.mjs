#!/usr/bin/env node
// Tests du générateur (aucune dépendance) : node tests/run.mjs
import { renderIndex, renderMentions, normalize } from '../generator/render.mjs';
import { METIERS, metierFromNaf } from '../generator/metiers.mjs';
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
  for (const [metier, cta] of [['restaurant', 'Réserver une table'], ['coiffure', 'Prendre rendez-vous'], ['fleuriste', 'Commander un bouquet'], ['boulangerie', 'Passer commande']]) {
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

test('profil sans nom refusé', () => {
  assert.throws(() => normalize({ metier: 'maconnerie' }));
});

console.log(`\n${n} tests OK`);
