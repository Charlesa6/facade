// Mise en forme des noms issus des registres (tout en majuscules) : « VILLEFRANCHE-SUR-SAONE » → « Villefranche-sur-Saone ».
const PETITS = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'et', 'en', 'sur', 'sous', 'aux', 'au', 'lès', 'les', 'l', 'd']);
// Accents perdus dans les registres, pour les mots les plus fréquents du BTP et des communes.
const ACCENTS = { batiment: 'bâtiment', batiments: 'bâtiments', electricite: 'électricité', electrique: 'électrique', renovation: 'rénovation', renov: 'rénov', pere: 'père', freres: 'frères', frere: 'frère', saone: 'saône', etancheite: 'étanchéité', energie: 'énergie', energies: 'énergies', metallerie: 'métallerie', habitat: 'habitat', genie: 'génie', thermique: 'thermique', ecole: 'école', eglise: 'église', venissieux: 'vénissieux', decines: 'décines', ecully: 'écully', brindas: 'brindas', ollieres: 'ollières', pres: 'près', federation: 'fédération',
  // Prénoms fréquents (les registres les stockent sans accent)
  rene: 'rené', frederic: 'frédéric', raphael: 'raphaël', jerome: 'jérôme', stephane: 'stéphane', sebastien: 'sébastien', gerard: 'gérard', helene: 'hélène', jeremy: 'jérémy', cedric: 'cédric', gregory: 'grégory', valerie: 'valérie', emilie: 'émilie', francois: 'françois', herve: 'hervé', andre: 'andré', joel: 'joël', noel: 'noël', michael: 'michaël', mickael: 'mickaël', gael: 'gaël', anais: 'anaïs', celine: 'céline', aurelien: 'aurélien', theo: 'théo', leo: 'léo', jose: 'josé', regis: 'régis', remi: 'rémi', remy: 'rémy', benoit: 'benoît', jerémy: 'jérémy', eric: 'éric', emile: 'émile', etienne: 'étienne', amelie: 'amélie', elodie: 'élodie' };
const SIGLES = /^(sarl|sas|sasu|eurl|snc|sci|ets|sa)$/i;

export function titleCase(s) {
  return String(s || '').toLowerCase()
    .split(/([\s-]+)/)
    .map((w, i) => {
      if (/^[\s-]+$/.test(w)) return w;
      w = ACCENTS[w] || w;
      // Sigles : formes juridiques, ou mots courts sans voyelle (« GG », « RMS », « AFC » ressemble à un sigle aussi).
      if (SIGLES.test(w) || (w.length <= 4 && !/[aeiouyàâéèêîôû]/.test(w) && /^\p{L}+$/u.test(w))) return w.toUpperCase();
      if (i > 0 && PETITS.has(w)) return w;
      // Pas de majuscule après une apostrophe (« Ram's »), sauf élision en tête (« L'Atelier », « D'Arcy »).
      // Élision : « L'Atelier » en tête, « Chazay-d'Azergues » ailleurs.
      if (/^[ld]['’]\p{L}/u.test(w)) return (i === 0 ? w[0].toUpperCase() : w[0]) + w[1] + w[2].toUpperCase() + w.slice(3);
      return w.replace(/^(\p{L})/u, (c) => c.toUpperCase());
    })
    .join('');
}

// Enseigne exploitable comme nom commercial ? (les registres contiennent parfois des listes ou des abréviations)
export const enseigneUtilisable = (e) => !!e && e.length <= 40 && !/\.\s*\S+\./.test(e);

// Doit-on saluer le dirigeant par son nom ? Oui si l'adresse est générique (contact@, sarlxxx@…) ou porte
// son nom ; non si elle semble appartenir à une autre personne (« c.debot@ » quand le dirigeant est M. Dadci).
const sansAccent = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export function salutation(email, dirigeant) {
  if (!dirigeant?.nom) return '';
  const local = sansAccent(String(email).split('@')[0]);
  const nom = sansAccent(dirigeant.nom).replace(/[^a-z]/g, '');
  const nominative = /^[a-z]{1,15}[._-][a-z]{2,20}$/.test(local) && !/contact|info|accueil|direction|devis|travaux|sarl|sas|ets|entreprise|batiment|renov/.test(local);
  if (nominative && !local.replace(/[^a-z]/g, '').includes(nom)) return '';
  return `${titleCase(dirigeant.prenom)} ${titleCase(dirigeant.nom)}`;
}
