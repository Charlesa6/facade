#!/usr/bin/env node
// Audit rapide d'un site existant : décide si l'entreprise est une cible (pas de site / site obsolète).
//
//   node prospection/audit.mjs <url-ou-domaine>...
//
// Sortie JSON par site : { url, verdict, score, problemes[] }
//   verdict = aucun_site | site_obsolete | site_correct | a_verifier
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

// Verdict `a_verifier` : le script n'a pas pu conclure (proxy, anti-robot, boucle de redirection) →
// vérification humaine ou navigateur. On ne classe JAMAIS « aucun site » sur une simple erreur réseau.
async function audit(target) {
  const url = /^https?:\/\//.test(target) ? target : `https://${target}`;
  const tries = [url, url.replace(/^https:/, 'http:')];
  let res, lastErr;
  for (const u of tries) {
    try {
      res = await fetchTimed(u);
      if (res.ok) break;
      lastErr = `HTTP ${res.status}`;
    } catch (e) {
      lastErr = String(e.cause?.code || e.cause?.message || e.message);
    }
    res = null;
  }
  if (!res) {
    if (/ENOTFOUND|EAI_AGAIN/.test(lastErr)) return { url, verdict: 'aucun_site', score: 0, problemes: ['Le nom de domaine ne répond pas'] };
    return { url, verdict: 'a_verifier', score: null, problemes: [`Audit automatique impossible (${lastErr}) : vérifier dans un navigateur`] };
  }
  const httpsBroken = !res.finalUrl.startsWith('https://') && url.startsWith('https://');

  const h = res.html;
  const problemes = [];
  let score = 100;
  const minus = (n, msg) => { score -= n; problemes.push(msg); };

  // Page d'attente / maintenance / page par défaut de l'hébergeur = pas de vrai site.
  const text = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  if (text.length < 3000 && /site en construction|en cours de construction|under construction|coming soon|bientôt disponible|en maintenance|mode maintenance|maintenance mode|undergoing maintenance|available soon|site not installed|page par défaut|default page|domaine (?:a été )?réservé|this domain|parked/i.test(text))
    return { url: res.finalUrl, verdict: 'aucun_site', score: 0, problemes: ['Le site n\'affiche qu\'une page d\'attente (« en construction » ou maintenance)'] };
  // Page par défaut d'un hébergeur / domaine parqué (OVH, IONOS, Sedo…) : le domaine existe, pas le site.
  if (/\/__ovh\/|Copyright 1999 OVH|url=defaultsite|sedoparking|parkingcrew|bodis\.com|this domain (?:is|may be) for sale|ce domaine est à vendre/i.test(h))
    return { url: res.finalUrl, verdict: 'aucun_site', score: 0, problemes: ['Le nom de domaine n\'affiche que la page par défaut de l\'hébergeur : aucun site en ligne'] };
  if (/There has been a critical error|Erreur critique|Fatal error|Database Error/i.test(text) && text.length < 3000)
    return { url: res.finalUrl, verdict: 'site_obsolete', score: 0, problemes: ['Le site affiche un message d\'erreur au lieu de son contenu'] };
  if (/\.(wixsite\.com|e-monsite\.com|jimdofree\.com|jimdosite\.com|site123\.me|wordpress\.com|webnode\.fr|blogspot\.com)\b/i.test(new URL(res.finalUrl).hostname))
    minus(35, `Site gratuit à l'adresse ${new URL(res.finalUrl).hostname} (publicité de l'hébergeur, pas de nom de domaine propre)`);

  if (httpsBroken) minus(25, 'Certificat de sécurité absent ou invalide : les navigateurs affichent « Non sécurisé »');
  else if (!res.finalUrl.startsWith('https://')) minus(25, 'Pas de connexion sécurisée (HTTPS) : les navigateurs affichent « Non sécurisé »');
  if (!/<meta[^>]+name=["']viewport["']/i.test(h)) minus(30, 'Le site n\'est pas adapté aux téléphones');
  const years = [...h.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)].map((m) => Number(m[1]));
  const lastYear = years.length ? Math.max(...years) : null;
  if (lastYear && new Date().getFullYear() - lastYear >= 3) minus(15, `Le site semble ne plus être mis à jour (copyright ${lastYear})`);
  if (/<frameset|<marquee|<font[\s>]|\.swf["']|<table[^>]+width=["']?\d{3,}/i.test(h)) minus(20, 'Technologie web datée (mise en page des années 2000)');
  if (!/href=["']tel:/i.test(h)) minus(10, 'Pas de numéro cliquable depuis un téléphone');
  if (!/<title>[^<]{5,}<\/title>/i.test(h)) minus(10, 'Pas de titre de page (mauvais référencement Google)');
  if (!/<meta[^>]+name=["']description["']/i.test(h)) minus(5, 'Pas de description pour Google');
  if (res.ms > 4000) minus(10, `Chargement lent (${(res.ms / 1000).toFixed(1)} s)`);
  if (h.length < 1500) minus(20, 'Page quasi vide ou page d\'attente (« site en construction »)');

  score = Math.max(0, score);
  const verdict = score < 70 ? 'site_obsolete' : 'site_correct';
  return { url: res.finalUrl, verdict, score, problemes };
}

for (const t of targets) console.log(JSON.stringify(await audit(t)));
