// Mise en forme des noms issus des registres (tout en majuscules) : « VILLEFRANCHE-SUR-SAONE » → « Villefranche-sur-Saone ».
const PETITS = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'et', 'en', 'sur', 'sous', 'aux', 'au', 'lès', 'les', 'l', 'd']);
// Accents perdus dans les registres, pour les mots les plus fréquents du BTP et des communes.
const ACCENTS = { batiment: 'bâtiment', batiments: 'bâtiments', electricite: 'électricité', electrique: 'électrique', renovation: 'rénovation', renov: 'rénov', pere: 'père', freres: 'frères', frere: 'frère', saone: 'saône', etancheite: 'étanchéité', energie: 'énergie', energies: 'énergies', metallerie: 'métallerie', habitat: 'habitat', genie: 'génie', thermique: 'thermique', ecole: 'école', eglise: 'église', venissieux: 'vénissieux', decines: 'décines', ecully: 'écully', brindas: 'brindas', ollieres: 'ollières', pres: 'près', federation: 'fédération' };
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
      return w.replace(/^(\p{L})/u, (c) => c.toUpperCase()).replace(/^([ld]['’])(\p{L})/iu, (m, a, b) => a.toUpperCase() + b.toUpperCase());
    })
    .join('');
}

// Enseigne exploitable comme nom commercial ? (les registres contiennent parfois des listes ou des abréviations)
export const enseigneUtilisable = (e) => !!e && e.length <= 40 && !/\.\s*\S+\./.test(e);
