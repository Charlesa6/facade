#!/usr/bin/env node
// Recherche du site d'une entreprise : étape OBLIGATOIRE avant de la classer « aucun site ».
// Méthode (celle d'un humain) : taper le nom de l'entreprise + sa ville dans un moteur de recherche
// et ouvrir les 5-6 premiers résultats. Les annuaires, réseaux sociaux et agrégateurs sont écartés ;
// chaque site restant est ouvert et n'est retenu que si son identité est confirmée (même téléphone,
// même SIREN ou même code postal + nom), puis audité (prospection/audit.mjs).
//
//   node prospection/trouver-site.mjs <profil.json>...        → une ligne JSON par profil
//
// Sortie : { slug, site, verdict, score, problemes, preuve, requetes, resultats }
//   site = null et verdict = 'aucun_site' seulement si aucune des requêtes n'a donné de site confirmé.
// Moteur : DuckDuckGo (version « lite », résultats France). Google, Bing et Qwant ne répondent pas
// exploitablement depuis les conteneurs ; le WebSearch de l'agent (index américain) rate ces sites.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const PAUSE_MS = 2500; // entre deux requêtes au moteur (éviter le blocage)
const N_RESULTATS = 6;

// Domaines qui ne sont jamais « le site de l'entreprise » : annuaires, réseaux sociaux, registres, agrégateurs.
const ANNUAIRES = /(^|\.)(pagesjaunes|societe|pappers|infogreffe|annuaire-entreprises\.data\.gouv|data\.gouv|verif|infonet|lesentreprises|manageo|corporama|kompass|europages|societeinfo|entreprises\.lefigaro|bodacc|facebook|instagram|linkedin|twitter|x|tiktok|youtube|pinterest|google|goo\.gl|maps\.app|apple|tripadvisor|thefork|lafourchette|restaurantguru|petitfute|yelp|planity|treatwell|fresha|kiute|wecasa|houzz|habitatpresto|travaux|quotatis|starofservice|hellopro|batiweb|touscouvreurs|tousartisans|artisans-du-batiment|annuaire-du-batiment|kelbillet|mappy|118712|118000|annuaire|justacote|cylex|hoodspot|horaires|ouvert|lacartedesrestos|mafleuriste|allezlesfleurs|123fleurs|boutiquefleurs-lyon|fleuristes-et-fleurs|interflora|florajet|aquarelle|epicery|ubereats|deliveroo|just-eat|boulangeriespatisseries|chocolat\.guide|wikipedia|indeed|welcometothejungle|hellowork|qualibat|ademe|faire\.gouv|france-renov|rge|autour-de-moi|pages-annuaire|annuaire-mairie|infobel|tupalo|brownbook|place-du-commerce|ma-ville|eat-list|restopolitan|lebonbon|sortiraparis|lyon-france|onlyon|petitpaume|guide-du-routard)\.[a-z.]+$/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chiffres = (s) => String(s || '').replace(/\D/g, '');
const sansAccents = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export async function rechercher(q, n = N_RESULTATS + 2) {
  for (let essai = 0; essai < 3; essai++) {
    try {
      const r = await fetch('https://lite.duckduckgo.com/lite/?kl=fr-fr&q=' + encodeURIComponent(q), { headers: { 'user-agent': UA, 'accept-language': 'fr-FR,fr' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const h = await r.text();
      const out = [];
      for (const m of h.matchAll(/<a[^>]+href="([^"]+)"[^>]*class=['"]result-link['"][^>]*>([\s\S]*?)<\/a>/g)) {
        let u = m[1];
        const uddg = u.match(/uddg=([^&]+)/);
        if (uddg) u = decodeURIComponent(uddg[1]);
        if (u.startsWith('//')) u = 'https:' + u;
        if (/duckduckgo\.com/.test(u)) continue; // publicités et pages d'aide
        out.push({ url: u, titre: m[2].replace(/<[^>]+>/g, '').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').trim() });
        if (out.length >= n) break;
      }
      return out;
    } catch (e) {
      if (essai === 2) throw e;
      await sleep(5000 * (essai + 1));
    }
  }
}

async function page(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': UA, 'accept-language': 'fr-FR,fr' } });
    return { status: r.status, url: r.url, html: await r.text() };
  } catch (e) {
    return { status: 0, url, html: '', erreur: String(e.cause?.code || e.message) };
  } finally {
    clearTimeout(t);
  }
}

// Mots significatifs du nom (pour reconnaître le domaine propre de l'entreprise).
function motsNom(p) {
  return [...new Set(sansAccents(`${p.nom_commercial || ''} ${p.raison_sociale || ''}`).split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !/^(sarl|sas|sasu|eurl|ets|les|des|aux|une|chez|entreprise|societe|maison|lyon)$/.test(w)))];
}
// Un annuaire local affiche aussi le téléphone : le site n'est « le sien » que si son domaine reprend un mot du nom.
const domainePropre = (host, p) => { const h = host.replace(/[^a-z0-9]/g, ''); return motsNom(p).some((w) => h.includes(w)); };

// L'identité est confirmée si la page (accueil ou contact) contient le téléphone, le SIREN,
// ou le code postal ET un mot significatif du nom.
function identite(html, p) {
  const txt = sansAccents(html.replace(/<[^>]+>/g, ' '));
  const num = chiffres(html);
  const tel = chiffres(p.telephone).replace(/^33/, '0');
  if (tel.length >= 9 && (num.includes(tel.slice(1)) )) return 'téléphone';
  if (p.siren && num.includes(chiffres(p.siren))) return 'SIREN';
  const mots = sansAccents(`${p.nom_commercial || ''} ${p.raison_sociale || ''}`).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !/^(sarl|sas|sasu|eurl|entreprise|societe|maison|boulangerie|fleurs|coiffure|restaurant|lyon)$/.test(w));
  if (p.code_postal && txt.includes(p.code_postal) && mots.some((w) => txt.includes(w))) return 'code postal + nom';
  return null;
}

function audit(url) {
  try {
    const out = execFileSync(process.execPath, [fileURLToPath(new URL('./audit.mjs', import.meta.url)), url], { encoding: 'utf8', timeout: 60000 });
    return JSON.parse(out.trim().split('\n').pop());
  } catch {
    return { verdict: 'a_verifier', score: null, problemes: ['Audit impossible : vérifier dans un navigateur'] };
  }
}

export async function trouverSite(p) {
  const ville = (p.ville || '').replace(/\s+\d+(er|e|ème|eme)$/i, '');
  const noms = [...new Set([p.nom_commercial, p.raison_sociale].filter(Boolean).map((n) => n.replace(/\s*\(.*\)\s*/g, ' ').trim()))];
  const requetes = noms.map((n) => `${n} ${ville}`.trim());
  if (p.telephone) requetes.push(`"${p.telephone}"`);
  const vus = new Set();
  const resultats = [];
  for (const q of requetes) {
    const res = await rechercher(q).catch(() => []);
    await sleep(PAUSE_MS);
    for (const r of res.slice(0, N_RESULTATS)) {
      let host;
      try { host = new URL(r.url).hostname.replace(/^www\./, ''); } catch { continue; }
      resultats.push({ requete: q, host, titre: r.titre });
      if (ANNUAIRES.test(host) || vus.has(host)) continue;
      vus.add(host);
      const accueil = `https://${new URL(r.url).hostname}/`;
      let pg = await page(accueil);
      let preuve = pg.html && identite(pg.html, p);
      if (!preuve && pg.html) {
        // Le téléphone est souvent sur la page contact : suivre le premier lien « contact ».
        const lien = pg.html.match(/href="([^"]*contact[^"]*)"/i);
        if (lien) {
          const pc = await page(new URL(lien[1], pg.url || accueil).href);
          preuve = pc.html && identite(pc.html, p);
        }
      }
      if (!preuve && r.url !== accueil) {
        const pr = await page(r.url);
        preuve = pr.html && identite(pr.html, p);
      }
      if (preuve && !domainePropre(host, p)) {
        // Page qui parle de l'entreprise sur un domaine sans rapport avec son nom : probablement un annuaire.
        resultats.push({ requete: q, host, titre: r.titre, a_verifier: `identité trouvée (${preuve}) mais domaine sans rapport avec le nom` });
        continue;
      }
      if (preuve) {
        const a = audit(accueil);
        return { slug: p.slug, site: pg.url || accueil, verdict: a.verdict, score: a.score, problemes: a.problemes, preuve, requetes, resultats };
      }
    }
  }
  return { slug: p.slug, site: null, verdict: 'aucun_site', score: 0, problemes: ['Aucun site trouvé dans les premiers résultats de recherche'], preuve: null, requetes, resultats };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const fichiers = process.argv.slice(2);
  if (!fichiers.length) { console.error('usage : node prospection/trouver-site.mjs <profil.json>...'); process.exit(2); }
  for (const f of fichiers) {
    const p = JSON.parse(readFileSync(f, 'utf8'));
    console.log(JSON.stringify(await trouverSite(p)));
  }
}
