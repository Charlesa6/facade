#!/usr/bin/env node
// Fiche d'appels pour Charles : script, SMS, objections, puis une carte par entreprise à appeler.
//
//   node prospection/appels.mjs --in <export.json> [--out <fichier.html>]
//
// <export.json> : tableau JSON exporté de fc_prospects (requête dans docs/appels.md) avec company, contact_name,
// contact_role, phone, email, city, metier, site_verdict, website, probleme, preview_url, canal, effectif, rge.
// La page est autonome (CSS inline), lisible sur téléphone : numéros cliquables, SMS pré-rempli.
// Elle contient des données de prospects : à garder hors de Git (out/ ou scratchpad).
import { readFileSync, writeFileSync } from 'node:fs';
import { METIERS } from '../generator/metiers.mjs';

const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? process.argv[i + 1] : d; };
const IN = arg('in');
const OUT = arg('out', 'out/appels.html');
if (!IN) { console.error('usage : node prospection/appels.mjs --in <export.json> [--out <fichier.html>]'); process.exit(2); }

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tel = (t) => 'tel:' + String(t).replace(/[^\d+]/g, '').replace(/^0/, '+33');
const de = (w) => (/^[aeiouyhàâéèêëîïôûü]/i.test(w) ? `d'${w}` : `de ${w}`);

// Le constat, formulé pour être dit à l'oral.
function constat(p) {
  const dom = p.website ? new URL(p.website).hostname.replace(/^www\./, '') : null;
  if (p.site_verdict === 'site_obsolete') {
    if (/erreur/i.test(p.probleme || '')) return `j'ai vu que votre site ${dom} affiche un message d'erreur au lieu de votre présentation`;
    if (/HTTPS|sécuris/i.test(p.probleme || '')) return `j'ai vu que votre site ${dom} s'affiche comme « non sécurisé » dans les navigateurs`;
    return `j'ai regardé votre site ${dom} : il mériterait d'être remis à jour`;
  }
  if (dom) return `j'ai vu que votre adresse ${dom} n'affiche pas de site en ligne`;
  if (/facebook/i.test(p.probleme || '')) return `j'ai vu que vous avez une page Facebook, mais pas de site internet`;
  return `je n'ai pas trouvé de site internet pour ${p.company}`;
}

const sms = (p) => `Bonjour, c'est Charles Allouard de Konsilys, suite à notre appel. Voici la maquette du site ${de(p.company)} : ${p.preview_url} — Elle est privée (pas sur Google). Dites-moi ce que vous en pensez !`;

const rows = JSON.parse(readFileSync(IN, 'utf8'));
const avecTel = rows.filter((p) => p.phone);
const sansEmail = avecTel.filter((p) => !p.email);
const avecEmail = avecTel.filter((p) => p.email);
const sansTel = rows.filter((p) => !p.phone);

function carte(p, i) {
  const metier = (METIERS[p.metier] || METIERS.general).label;
  const qui = p.contact_name ? `${esc(p.contact_name)} <span class="m">· ${esc(p.contact_role || '')}</span>` : '<span class="m">Dirigeant non identifié : demander le gérant</span>';
  return `<article class="c" id="p${i}">
  <div class="h"><b>${esc(p.company)}</b><span class="m">${esc(metier)} · ${esc(p.city || '')} · ${esc(p.effectif || '')}${p.rge ? ' · RGE' : ''}</span></div>
  <p>${qui}</p>
  <a class="call" href="${tel(p.phone)}">📞 ${esc(p.phone)}</a>
  <p class="k"><b>Accroche :</b> « ${esc(constat(p).charAt(0).toUpperCase() + constat(p).slice(1))}. »</p>
  <p class="row"><a href="${esc(p.preview_url)}" target="_blank" rel="noopener">Voir sa maquette</a><a href="sms:${String(p.phone).replace(/[^\d+]/g, '')}?&body=${encodeURIComponent(sms(p))}">Envoyer le SMS</a>${p.email ? `<span class="m">✉ ${esc(p.email)}</span>` : ''}</p>
  <div class="res"><label><input type="radio" name="r${i}" value="rdv"> Intéressé / RDV</label><label><input type="radio" name="r${i}" value="rappel"> À rappeler</label><label><input type="radio" name="r${i}" value="non"> Pas intéressé</label><label><input type="radio" name="r${i}" value="stop"> Ne plus appeler</label><label><input type="radio" name="r${i}" value="nrp"> Pas de réponse</label><textarea placeholder="Notes…" data-n="${i}"></textarea></div>
</article>`;
}

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Fiche d'appels — Konsilys</title><style>
:root{--ink:#0F172A;--m:#5B6B7F;--line:#E6EAF1;--bg:#F7F9FC;--card:#fff;--lime:#84CC16;--navy:#1B2B3A}
@media (prefers-color-scheme:dark){:root{--ink:#F1F5F9;--m:#94A3B8;--line:#334155;--bg:#0B1220;--card:#111827}}
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--ink);line-height:1.5}
.w{max-width:860px;margin:0 auto;padding:20px 16px 60px}h1{margin:0 0 4px;font-size:26px}h2{margin:32px 0 12px;font-size:20px}
.m{color:var(--m);font-size:14px}.box{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin:10px 0}
.box p{margin:6px 0}.box ol,.box ul{margin:6px 0;padding-left:20px}details{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 16px;margin:8px 0}
summary{font-weight:700;cursor:pointer}.c{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:12px 0}
.h{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline}.h b{font-size:18px}.c p{margin:6px 0}
.call{display:inline-block;background:var(--lime);color:var(--navy);font-weight:800;font-size:18px;padding:10px 16px;border-radius:10px;text-decoration:none;margin:4px 0}
.k{background:rgba(132,204,22,.12);border-radius:8px;padding:8px 10px}.row{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center}.row a{color:#4D7C0F;font-weight:700}
.res{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:14px;margin-top:8px;border-top:1px solid var(--line);padding-top:8px}.res textarea{width:100%;min-height:44px;font:inherit;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:transparent;color:inherit}
.stats{display:flex;flex-wrap:wrap;gap:8px}.stats span{background:var(--card);border:1px solid var(--line);border-radius:999px;padding:4px 12px;font-size:14px}
</style></head><body><div class="w">
<h1>Fiche d'appels — sites internet BTP</h1>
<p class="m">Générée le ${new Date().toLocaleDateString('fr-FR')}. Les résultats cochés et les notes restent sur cet appareil ; reporte-les ensuite (ou dicte-les à Claude) pour mettre la base à jour.</p>
<div class="stats"><span><b>${sansEmail.length}</b> à appeler en priorité (pas d'email)</span><span><b>${avecEmail.length}</b> ont aussi un email</span><span>${sansTel.length} sans numéro trouvé</span></div>

<h2>Le script (2 minutes)</h2>
<div class="box">
<ol>
<li><b>Présentation</b> — « Bonjour, [Prénom Nom] ? Charles Allouard, de Konsilys, à Lyon. Je vous prends deux minutes, c'est au sujet de [entreprise]. »</li>
<li><b>Accroche</b> — « Je suis consultant en informatique depuis plus de 5 ans, et je crée les sites internet des entreprises et des commerces lyonnais. [Accroche de la carte]. »</li>
<li><b>La maquette</b> — « Plutôt que de vous envoyer un devis, j'ai déjà préparé une maquette du site de [entreprise]. Je vous envoie le lien par SMS, vous y jetez un œil quand vous avez deux minutes ? »</li>
<li><b>Si oui</b> — envoyer le SMS (bouton sur la carte), puis : « Je vous rappelle [jour] pour avoir votre avis ? » → noter le créneau.</li>
<li><b>Le prix, s'il demande</b> — « 39 € HT par mois, la création est offerte : nom de domaine, hébergement et modifications compris. En ligne en 48 heures après votre accord. Engagement d'un an, ensuite sans engagement. »</li>
</ol>
<p class="m">Toujours : poli, court, pas de jargon (« site », « Google », « téléphone », jamais « SEO » ou « responsive »). Pas de promesse de résultat (« premier sur Google », « X clients en plus »).</p>
</div>

<details><summary>Objections fréquentes</summary>
<div class="box" style="border:0;padding:4px 0">
<p><b>« J'ai assez de travail. »</b> — « Tant mieux ! Le site sert aussi à rassurer les clients qui vous découvrent par recommandation, et à recruter. Il travaille pour vous sans que vous y passiez du temps. »</p>
<p><b>« Je n'ai pas besoin d'internet, tout se fait par le bouche-à-oreille. »</b> — « Justement : quelqu'un à qui on vous recommande va presque toujours vérifier sur son téléphone avant d'appeler. Sans site, il ne trouve rien. »</p>
<p><b>« Mon neveu / un ami va me le faire. »</b> — « Très bien. Regardez quand même la maquette, elle est gratuite ; si elle ne vous sert pas, je la supprime. »</p>
<p><b>« C'est trop cher. »</b> — « C'est 39 € HT par mois, tout compris, création offerte : moins qu'un seul client perdu dans l'année. »</p>
<p><b>« Je n'aime pas les engagements. »</b> — « Je comprends. Je note, et je reviens vers vous avec une proposition. » (pas de geste commercial sans décision de ta part)</p>
<p><b>« Comment avez-vous eu mon numéro ? »</b> — « Il est publié dans les annuaires d'entreprises. Si vous préférez ne plus être appelé, je le note tout de suite. » → cocher <i>Ne plus appeler</i>.</p>
<p><b>« Envoyez-moi un email. »</b> — envoyer le SMS ou l'email avec le lien de la maquette, et proposer un rappel.</p>
</div></details>

<details><summary>Après l'appel</summary>
<div class="box" style="border:0;padding:4px 0">
<ul><li><b>Intéressé</b> : SMS envoyé, créneau de rappel noté. Au rappel : corriger les textes « à valider » de la maquette ensemble, puis mise en ligne.</li>
<li><b>Ne plus appeler</b> : le dire à Claude → l'entreprise est retirée (statut « désinscrit ») et sa maquette supprimée.</li>
<li><b>Pas de réponse</b> : rappeler un autre jour, à une autre heure (tôt le matin ou en fin de journée : les artisans sont sur les chantiers).</li></ul>
</div></details>

<h2>À appeler en priorité — pas d'email (${sansEmail.length})</h2>
${sansEmail.map((p, i) => carte(p, i)).join('\n')}

<h2>Ont aussi un email (${avecEmail.length})</h2>
<p class="m">Tu peux les appeler directement, ou laisser partir l'email d'abord et appeler ceux qui ont ouvert le lien.</p>
${avecEmail.map((p, i) => carte(p, i + sansEmail.length)).join('\n')}

${sansTel.length ? `<h2>Sans numéro trouvé (${sansTel.length})</h2><p class="m">${sansTel.map((p) => esc(p.company) + ' (' + esc(p.city || '') + ')').join(' · ')}</p>` : ''}
</div>
<script>
// Résultats et notes mémorisés sur cet appareil uniquement.
try {
  var K = 'konsilys-appels';
  var s = JSON.parse(localStorage.getItem(K) || '{}');
  document.querySelectorAll('.res input').forEach(function (r) { if (s[r.name] === r.value) r.checked = true; r.addEventListener('change', function () { s[r.name] = r.value; localStorage.setItem(K, JSON.stringify(s)); }); });
  document.querySelectorAll('.res textarea').forEach(function (t) { var k = 'n' + t.dataset.n; t.value = s[k] || ''; t.addEventListener('input', function () { s[k] = t.value; localStorage.setItem(K, JSON.stringify(s)); }); });
} catch (e) {}
</script>
</body></html>`;
writeFileSync(OUT, html);
console.log(`${avecTel.length} entreprises à appeler (${sansEmail.length} sans email) → ${OUT}`);
