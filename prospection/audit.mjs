#!/usr/bin/env node
// Audit rapide d'un site existant : décide si l'entreprise est une cible (pas de site / site obsolète).
//
//   node prospection/audit.mjs <url-ou-domaine>...
//
// Sortie JSON par site : { url, verdict, score, problemes[] }
//   verdict = aucun_site | site_obsolete | site_correct
// Les « problèmes » détectés servent d'argument concret dans l'email de prospection
// (ex. « votre site ne s'affiche pas correctement sur mobile »).
const targets = process.argv.slice(2);
if (!targets.length) {
  console.error('usage : node prospection/audit.mjs <url-ou-domaine>...');
  process.exit(2);
}

async function fetchTimed(url) {
  const t0 = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0 (compatible; FacadeAudit/1.0)' } });
    const html = await r.text();
    return { ok: r.ok, status: r.status, finalUrl: r.url, html, ms: Date.now() - t0 };
  } finally {
    clearTimeout(timer);
  }
}

async function audit(target) {
  const url = /^https?:\/\//.test(target) ? target : `https://${target}`;
  let res;
  try {
    res = await fetchTimed(url);
  } catch {
    try {
      res = await fetchTimed(url.replace(/^https:/, 'http:'));
    } catch {
      return { url, verdict: 'aucun_site', score: 0, problemes: ['Site injoignable'] };
    }
  }
  if (!res.ok) return { url, verdict: 'aucun_site', score: 0, problemes: [`Le site renvoie une erreur ${res.status}`] };

  const h = res.html;
  const problemes = [];
  let score = 100;
  const minus = (n, msg) => { score -= n; problemes.push(msg); };

  if (!res.finalUrl.startsWith('https://')) minus(25, 'Pas de connexion sécurisée (HTTPS) : les navigateurs affichent « Non sécurisé »');
  if (!/<meta[^>]+name=["']viewport["']/i.test(h)) minus(30, 'Le site n\'est pas adapté aux téléphones');
  const years = [...h.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)].map((m) => Number(m[1]));
  const lastYear = years.length ? Math.max(...years) : null;
  if (lastYear && new Date().getFullYear() - lastYear >= 3) minus(15, `Le site semble ne plus être mis à jour (copyright ${lastYear})`);
  if (/<frameset|<marquee|<font[\s>]|\.swf["']|<table[^>]+width=["']?\d{3,}/i.test(h)) minus(20, 'Technologie web datée (mise en page des années 2000)');
  if (!/href=["']tel:/i.test(h)) minus(10, 'Pas de numéro cliquable depuis un téléphone');
  if (!/<title>[^<]{5,}<\/title>/i.test(h)) minus(10, 'Pas de titre de page (mauvais référencement Google)');
  if (!/<meta[^>]+name=["']description["']/i.test(h)) minus(5, 'Pas de description pour Google');
  if (res.ms > 4000) minus(10, `Chargement lent (${(res.ms / 1000).toFixed(1)} s)`);
  if (/wix\.com|jimdo|e-monsite|site123/i.test(h) && /(free|gratuit|créé avec|made with)/i.test(h)) minus(10, 'Site gratuit avec publicité de l\'hébergeur');
  if (h.length < 1500) minus(20, 'Page quasi vide ou page d\'attente (« site en construction »)');

  score = Math.max(0, score);
  const verdict = score < 70 ? 'site_obsolete' : 'site_correct';
  return { url: res.finalUrl, verdict, score, problemes };
}

for (const t of targets) console.log(JSON.stringify(await audit(t)));
