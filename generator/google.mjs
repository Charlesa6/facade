// Fiche Google d'un commerce via l'API officielle Google Places (New) — utilisée par les fonctions `studio` et `apercu`.
// Clé : fc_config.cle = 'google_places_key' (projet facade). Sans clé, tout est simplement désactivé.
// Les photos Google ne sont jamais copiées chez nous : la fiche garde la référence (`google:places/…/photos/…`)
// et l'URL d'affichage est redemandée à Google à chaque rendu de la maquette (conditions d'utilisation de Google).
// Elles ne servent qu'aux maquettes : le site de production n'utilise que les photos fournies par le commerçant.
const API = 'https://places.googleapis.com/v1';
const CHAMPS = [
  'places.id', 'places.displayName', 'places.formattedAddress', 'places.nationalPhoneNumber', 'places.websiteUri',
  'places.googleMapsUri', 'places.rating', 'places.userRatingCount', 'places.regularOpeningHours.weekdayDescriptions',
  'places.photos', 'places.businessStatus',
].join(',');

// URL d'affichage (temporaire) d'une photo Google à partir de sa référence « places/…/photos/… ».
export async function urlPhoto(nom, cle, largeur = 1200) {
  const r = await fetch(`${API}/${nom}/media?maxWidthPx=${largeur}&skipHttpRedirect=true&key=${encodeURIComponent(cle)}`);
  if (!r.ok) return null;
  return (await r.json()).photoUri || null;
}

// Recherche d'un commerce (nom + ville) → fiches candidates avec horaires, note, site, et miniatures des photos.
export async function chercherFiche(texte, cle) {
  const r = await fetch(`${API}/places:searchText`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'X-Goog-Api-Key': cle, 'X-Goog-FieldMask': CHAMPS },
    body: JSON.stringify({
      textQuery: texte, languageCode: 'fr', regionCode: 'FR', maxResultCount: 4,
      locationBias: { circle: { center: { latitude: 45.764, longitude: 4.8357 }, radius: 30000 } }, // Lyon
    }),
  });
  if (!r.ok) throw new Error(`Google Places : erreur ${r.status}`);
  const places = (await r.json()).places || [];
  return Promise.all(places.map(async (p) => ({
    place_id: p.id,
    nom: p.displayName?.text || null,
    adresse: p.formattedAddress || null,
    telephone: p.nationalPhoneNumber || null,
    site: p.websiteUri || null,
    google_maps_url: p.googleMapsUri || null,
    note: p.rating ?? null,
    avis: p.userRatingCount ?? null,
    ferme: p.businessStatus && p.businessStatus !== 'OPERATIONAL',
    horaires: (p.regularOpeningHours?.weekdayDescriptions || []).join(' ; ') || null,
    photos: await Promise.all((p.photos || []).slice(0, 8).map(async (ph) => ({
      ref: 'google:' + ph.name,
      miniature: await urlPhoto(ph.name, cle, 400),
      auteur: ph.authorAttributions?.[0]?.displayName || null,
    }))),
  })));
}

// Remplace les références `google:…` des photos d'un profil par des URL affichables (les autres sont gardées telles quelles).
export async function resoudrePhotos(profile, cle) {
  const photos = Array.isArray(profile?.photos) ? profile.photos : [];
  if (!photos.some((ph) => String(ph?.src).startsWith('google:'))) return profile;
  const res = await Promise.all(photos.map(async (ph) => {
    if (!String(ph?.src).startsWith('google:')) return ph;
    const url = cle ? await urlPhoto(ph.src.slice(7), cle).catch(() => null) : null;
    return url ? { ...ph, src: url, origine: 'google' } : null;
  }));
  return { ...profile, photos: res.filter(Boolean) };
}
