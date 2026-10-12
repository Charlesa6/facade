// Rendu d'un site vitrine BTP à partir d'un profil d'entreprise (voir docs/profil.md).
// Sortie : HTML autonome (CSS inline, pictogrammes SVG inline, aucune ressource externe
// hormis la police Google Fonts) → hébergeable tel quel sur n'importe quel CDN.
import { METIERS, ICONS } from './metiers.mjs';
import { CSS } from './style.mjs';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = (name, size = 24) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${ICONS[name] || ''}</svg>`;
// « de » + élision devant voyelle : « travaux d'électricité », « travaux de maçonnerie ».
const de = (w) => (/^[aeiouyhàâéèêëîïôûü]/i.test(w) ? `d'${w}` : `de ${w}`);
const telHref = (t) => 'tel:' + String(t).replace(/[^\d+]/g, '').replace(/^0/, '+33');

// Normalise le profil : complète avec les préréglages métier, signale ce qui reste à valider.
export function normalize(p) {
  const m = METIERS[p.metier] || METIERS.general;
  const name = p.nom_commercial || p.raison_sociale;
  if (!name) throw new Error('profil sans raison_sociale ni nom_commercial');
  const services = (p.services && p.services.length ? p.services : m.services.map(([titre, description]) => ({ titre, description, a_valider: true })));
  const zone = p.zone_intervention && p.zone_intervention.length ? p.zone_intervention : [p.ville].filter(Boolean);
  const annee = p.annee_creation ? Number(p.annee_creation) : null;
  return {
    ...p,
    name,
    metier_label: p.metier_label || m.label,
    palette: { ...m.palette, ...(p.palette || {}) },
    icon: m.icon,
    services,
    zone,
    annee,
    accroche: p.accroche || `${p.metier_label || m.label} à ${p.ville || 'votre service'}${zone.length > 1 ? ' et alentours' : ''}`,
    description: p.description || `${name} réalise vos travaux ${de((p.metier_label || m.label).toLowerCase())} pour les particuliers, les entreprises et les collectivités${p.ville ? ` à ${p.ville} et dans ses environs` : ''}. Un interlocuteur unique, des devis clairs et des chantiers tenus dans les délais.`,
    description_a_valider: !p.description,
    atouts: p.atouts || [],
    certifications: p.certifications || [],
  };
}

function header(d) {
  return `<header class="hdr"><div class="wrap hdr-in">
  <a class="logo" href="#top"><span class="logo-mark">${icon(d.icon, 22)}</span><span>${esc(d.name)}</span></a>
  <nav class="nav"><a href="#services">Prestations</a><a href="#atouts">L'entreprise</a><a href="#zone">Zone</a><a href="#contact">Contact</a></nav>
  ${d.telephone ? `<a class="btn btn-accent hdr-cta" href="${telHref(d.telephone)}">${icon('phone', 18)}<span>${esc(d.telephone)}</span></a>` : `<a class="btn btn-accent hdr-cta" href="#contact">Devis gratuit</a>`}
</div></header>`;
}

function hero(d) {
  const facts = [];
  const age = d.annee ? new Date().getFullYear() - d.annee : 0;
  if (d.annee) facts.push(age >= 2 ? `<li><b>${age} ans</b><span>d'expérience</span></li>` : `<li><b>${d.annee}</b><span>année de création</span></li>`);
  if (d.effectif) facts.push(`<li><b>${esc(d.effectif)}</b><span>à votre service</span></li>`);
  if (d.zone.length) facts.push(`<li><b>${esc(d.zone[0])}</b><span>${d.zone.length > 1 ? `et ${d.zone.length - 1} autre${d.zone.length > 2 ? 's' : ''} secteur${d.zone.length > 2 ? 's' : ''}` : 'zone d\'intervention'}</span></li>`);
  return `<section class="hero" id="top"><div class="wrap hero-in">
  <div class="hero-txt">
    <p class="eyebrow">${esc(d.metier_label)}${d.ville ? ' · ' + esc(d.ville) : ''}</p>
    <h1>${esc(d.accroche)}</h1>
    <p class="lead${d.description_a_valider ? ' tbv' : ''}">${esc(d.description)}</p>
    <div class="hero-cta"><a class="btn btn-accent btn-lg" href="#contact">Demander un devis gratuit</a>${d.telephone ? `<a class="btn btn-ghost btn-lg" href="${telHref(d.telephone)}">${icon('phone', 18)} Appeler</a>` : ''}</div>
    ${d.certifications.length ? `<ul class="badges">${d.certifications.map((c) => `<li>${icon('check', 16)} ${esc(c)}</li>`).join('')}</ul>` : ''}
  </div>
  <div class="hero-art" aria-hidden="true"><div class="art-card">${icon(d.icon, 120)}</div><div class="art-stripes"></div></div>
</div>${facts.length ? `<div class="wrap"><ul class="facts">${facts.join('')}</ul></div>` : ''}</section>`;
}

function services(d) {
  return `<section class="sec" id="services"><div class="wrap">
  <p class="eyebrow">Nos prestations</p><h2>Ce que nous faisons pour vous</h2>
  <div class="grid">${d.services.map((s) => `<article class="card${s.a_valider ? ' tbv' : ''}"><span class="card-ic">${icon(d.icon, 26)}</span><h3>${esc(s.titre)}</h3><p>${esc(s.description)}</p></article>`).join('')}</div>
</div></section>`;
}

function atouts(d) {
  const items = d.atouts.length ? d.atouts.map((a) => ({ t: a, tbv: false })) : [
    { t: 'Devis détaillé et gratuit, sans engagement', tbv: true },
    { t: 'Un interlocuteur unique du devis à la réception du chantier', tbv: true },
    { t: 'Chantiers propres, délais annoncés et tenus', tbv: true },
  ];
  return `<section class="sec sec-soft" id="atouts"><div class="wrap two">
  <div><p class="eyebrow">L'entreprise</p><h2>Pourquoi choisir ${esc(d.name)}&nbsp;?</h2>
  ${d.histoire ? `<p>${esc(d.histoire)}</p>` : ''}
  <ul class="checks">${items.map((i) => `<li class="${i.tbv ? 'tbv' : ''}">${icon('check', 20)}<span>${esc(i.t)}</span></li>`).join('')}</ul></div>
  <div class="panel"><h3>En bref</h3><dl>
    ${d.forme_juridique ? `<dt>Structure</dt><dd>${esc(d.forme_juridique)}</dd>` : ''}
    ${d.annee ? `<dt>Création</dt><dd>${d.annee}</dd>` : ''}
    ${d.effectif ? `<dt>Équipe</dt><dd>${esc(d.effectif)}</dd>` : ''}
    <dt>Métier</dt><dd>${esc(d.metier_label)}</dd>
    ${d.siren ? `<dt>SIREN</dt><dd>${esc(d.siren.replace(/(\d{3})(?=\d)/g, '$1 '))}</dd>` : ''}
  </dl></div>
</div></section>`;
}

function zone(d) {
  return `<section class="sec" id="zone"><div class="wrap">
  <p class="eyebrow">Zone d'intervention</p><h2>Nous intervenons près de chez vous</h2>
  <ul class="zone">${d.zone.map((z) => `<li>${icon('pin', 18)} ${esc(z)}</li>`).join('')}</ul>
</div></section>`;
}

function contact(d) {
  const subject = encodeURIComponent(`Demande de devis — ${d.name}`);
  const body = encodeURIComponent('Bonjour,\n\nJe souhaite un devis pour les travaux suivants :\n\nAdresse du chantier :\nDélai souhaité :\nTéléphone :\n\nMerci.');
  return `<section class="sec sec-dark" id="contact"><div class="wrap two">
  <div><p class="eyebrow">Contact</p><h2>Parlons de votre projet</h2>
  <p>Décrivez-nous vos travaux : nous revenons vers vous rapidement avec un devis clair.</p>
  <div class="hero-cta">${d.email ? `<a class="btn btn-accent btn-lg" href="mailto:${esc(d.email)}?subject=${subject}&amp;body=${body}">Demander un devis par email</a>` : ''}${d.telephone ? `<a class="btn btn-ghost-w btn-lg" href="${telHref(d.telephone)}">${icon('phone', 18)} ${esc(d.telephone)}</a>` : ''}</div></div>
  <ul class="coords">
    ${d.telephone ? `<li>${icon('phone')}<div><b>Téléphone</b><a href="${telHref(d.telephone)}">${esc(d.telephone)}</a></div></li>` : ''}
    ${d.email ? `<li>${icon('mail')}<div><b>Email</b><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></div></li>` : ''}
    ${d.adresse ? `<li>${icon('pin')}<div><b>Adresse</b><span>${esc(d.adresse)}</span></div></li>` : ''}
    ${d.horaires ? `<li>${icon('clock')}<div><b>Horaires</b><span>${esc(d.horaires)}</span></div></li>` : ''}
  </ul>
</div></section>`;
}

function footer(d, liens = {}) {
  return `<footer class="ftr"><div class="wrap ftr-in">
  <span>© ${new Date().getFullYear()} ${esc(d.raison_sociale || d.name)}</span>
  <a href="${esc(liens.mentions || 'mentions-legales.html')}">Mentions légales</a>
  <span class="made">Site réalisé par Konsilys</span>
</div></footer>`;
}

function previewBanner(d) {
  return `<div class="pv" role="note"><b>Maquette</b> proposée par Konsilys à ${esc(d.name)} — non publiée, non référencée. Les textes <span class="tbv-key">surlignés</span> sont à valider avec vous.</div>`;
}

function head(d, { preview, title, description }) {
  const p = d.palette;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
${preview ? '<meta name="robots" content="noindex,nofollow,noarchive">' : ''}
<meta name="theme-color" content="${esc(p.primary)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>:root{--primary:${p.primary};--accent:${p.accent};--dark:${p.dark};--soft:${p.soft}}${CSS}</style>`;
}

function jsonLd(d) {
  const ld = {
    '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', name: d.name,
    ...(d.telephone && { telephone: d.telephone }), ...(d.email && { email: d.email }),
    ...(d.adresse && { address: { '@type': 'PostalAddress', streetAddress: d.adresse, addressLocality: d.ville, postalCode: d.code_postal, addressCountry: 'FR' } }),
    areaServed: d.zone,
  };
  return `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
}

// `liens` : URLs des pages annexes quand le site n'est pas servi comme fichiers statiques (maquettes en ligne).
export function renderIndex(profile, { preview = false, liens = {} } = {}) {
  const d = normalize(profile);
  const title = `${d.name} — ${d.metier_label}${d.ville ? ' à ' + d.ville : ''}`;
  return `${head(d, { preview, title, description: d.accroche })}${preview ? '' : jsonLd(d)}</head>
<body class="${preview ? 'is-preview' : ''}">${preview ? previewBanner(d) : ''}${header(d)}<main>${hero(d)}${services(d)}${atouts(d)}${zone(d)}${contact(d)}</main>${footer(d, liens)}</body></html>
`;
}

export function renderMentions(profile, { preview = false, liens = {} } = {}) {
  const d = normalize(profile);
  const row = (k, v) => (v ? `<dt>${k}</dt><dd>${esc(v)}</dd>` : '');
  return `${head(d, { preview, title: `Mentions légales — ${d.name}`, description: `Mentions légales du site ${d.name}` })}</head>
<body class="${preview ? 'is-preview' : ''}">${preview ? previewBanner(d) : ''}${header(d)}<main class="sec"><div class="wrap legal">
<h1>Mentions légales</h1>
<h2>Éditeur du site</h2><dl>
${row('Raison sociale', d.raison_sociale)}${row('Forme juridique', d.forme_juridique)}${row('SIREN', d.siren)}${row('Siège', d.adresse)}${row('Téléphone', d.telephone)}${row('Email', d.email)}${row('Directeur de la publication', d.directeur_publication)}
</dl>
${d.assurance_decennale ? `<h2>Assurance décennale</h2><p>${esc(d.assurance_decennale)}</p>` : ''}
<h2>Hébergement</h2><p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com</p>
<h2>Données personnelles</h2><p>Ce site ne dépose aucun cookie et ne collecte aucune donnée personnelle. Les demandes envoyées par email ou par téléphone sont utilisées uniquement pour répondre à votre demande de devis.</p>
<p><a class="link" href="${esc(liens.accueil || 'index.html')}">← Retour au site</a></p>
</div></main>${footer(d, liens)}</body></html>
`;
}
