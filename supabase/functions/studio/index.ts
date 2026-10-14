// « Studio » de Charles : créer et modifier une maquette sur place, depuis son téléphone, pendant la prospection de rue.
// Page : https://www.konsilys.com/studio (dépôt esn-manager, com/studio.html) → appelle cette fonction en JSON.
// Accès : en-tête `x-studio-key` = code d'accès de Charles (saisi une fois sur son téléphone) ; seule son empreinte SHA-256
// est en base (table fc_studio_acces). verify_jwt=false.
// Déployer avec generator/render.mjs, metiers.mjs, style.mjs et google.mjs à côté de index.ts (comme `apercu`).
//
// Actions (POST { action, ... }) :
//   init                  → { metiers: [{ key, label, famille }] }
//   search { q }          → entreprises actives (annuaire officiel), Rhône d'abord, pour pré-remplir la fiche
//   list                  → les 40 dernières maquettes « terrain »
//   get { token }         → { profile, contact, url }
//   save { token?, profile, contact } → crée ou met à jour la fiche (canal 'terrain') → { token, url, html }
//   archive { token }     → status 'perdu' : la maquette n'est plus visible
//   upload { data, type } → photo prise sur place (base64, déjà réduite par le téléphone) → { src } dans le stockage public
//   google { q }          → fiche Google du commerce (horaires, note, site, photos) si une clé Places est configurée
// Les prospects 'terrain' ne reçoivent jamais d'email automatique (les routines ne traitent que canal = 'email').
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { renderIndex, normalize } from './render.mjs';
import { METIERS, metierFromNaf } from './metiers.mjs';
import { chercherFiche, resoudrePhotos, urlPhoto } from './google.mjs';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const ORIGINES = ['https://www.konsilys.com', 'https://konsilys.com'];
const BASE = 'https://www.konsilys.com/apercu/';
const BUCKET = 'maquettes-photos';
const PHOTOS_URL = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/${BUCKET}/`;
const cleGoogle = async () => (await sb.from('fc_config').select('valeur').eq('cle', 'google_places_key').maybeSingle()).data?.valeur ?? null;

const sha256 = async (s: string) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');
const egal = (a: string, b: string) => {
  if (!a || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};
const txt = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '') || null;
const hex = (v: unknown) => (typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v : undefined);
const titre = (s: string) => s.toLowerCase().replace(/(^|[\s'’-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());

// Ne garde que les champs connus du générateur (le contenu vient d'un formulaire : tout est borné et échappé au rendu).
function nettoyer(p: Record<string, unknown>) {
  const metier = typeof p.metier === 'string' && METIERS[p.metier] ? p.metier : 'general';
  const liste = (v: unknown, n: number) => (Array.isArray(v) ? v : []).slice(0, n);
  const out: Record<string, unknown> = {
    metier,
    nom_commercial: txt(p.nom_commercial, 80),
    raison_sociale: txt(p.raison_sociale, 120),
    siren: typeof p.siren === 'string' && /^\d{9}$/.test(p.siren) ? p.siren : null,
    forme_juridique: txt(p.forme_juridique, 60),
    annee_creation: Number.isInteger(p.annee_creation) ? p.annee_creation : null,
    ville: txt(p.ville, 60),
    code_postal: typeof p.code_postal === 'string' && /^\d{5}$/.test(p.code_postal) ? p.code_postal : null,
    adresse: txt(p.adresse, 160),
    telephone: txt(p.telephone, 30),
    email: txt(p.email, 120),
    horaires: txt(p.horaires, 300),
    accroche: txt(p.accroche, 120),
    description: txt(p.description, 600),
    histoire: txt(p.histoire, 800),
    zone_intervention: liste(p.zone_intervention, 12).map((z) => txt(z, 60)).filter(Boolean),
    services: liste(p.services, 8).map((s: any) => ({ titre: txt(s?.titre, 60), description: txt(s?.description, 240) })).filter((s) => s.titre),
    atouts: liste(p.atouts, 6).map((a) => txt(a, 120)).filter(Boolean),
    certifications: liste(p.certifications, 6).map((c) => txt(c, 60)).filter(Boolean),
    // Photos : fichiers de notre stockage (prises sur place) ou références de la fiche Google du commerce.
    photos: liste(p.photos, 9).map((ph: any) => {
      const src = typeof ph?.src === 'string' ? ph.src : '';
      if (src.startsWith(PHOTOS_URL) && /^[\w-]+\.(jpg|png|webp)$/.test(src.slice(PHOTOS_URL.length))) return { src, origine: 'commercant', legende: txt(ph.legende, 80) ?? undefined };
      if (/^google:places\/[\w-]+\/photos\/[\w-]+$/.test(src)) return { src, origine: 'google', legende: txt(ph.legende, 80) ?? undefined };
      return null;
    }).filter(Boolean),
    google_maps_url: txt(p.google_maps_url, 300),
    google_place_id: typeof p.google_place_id === 'string' && /^[\w-]{10,300}$/.test(p.google_place_id) ? p.google_place_id : null,
    google_note: typeof p.google_note === 'number' && p.google_note >= 1 && p.google_note <= 5 ? Math.round(p.google_note * 10) / 10 : null,
    google_avis: Number.isInteger(p.google_avis) && (p.google_avis as number) > 0 ? p.google_avis : null,
    sources: ['Rencontre sur place (démarchage), informations données par le commerçant'],
  };
  const pal = (p.palette ?? {}) as Record<string, unknown>;
  if (hex(pal.primary) || hex(pal.accent)) out.palette = { ...(hex(pal.primary) && { primary: pal.primary }), ...(hex(pal.accent) && { accent: pal.accent }) };
  for (const k of Object.keys(out)) if (out[k] === null || (Array.isArray(out[k]) && !(out[k] as unknown[]).length)) delete out[k];
  if (!out.nom_commercial && !out.raison_sociale) throw new Error('Indiquez au moins le nom du commerce.');
  return out;
}

const ville = (v: string) => titre(v).replace(/\b(\d+)(?:eme|ème|e)\b/i, '$1e').replace(/\b1er\b/i, '1er');
const sansParentheses = (v: string) => v.replace(/\s*\(.*?\)\s*/g, ' ').trim();

async function sirene(q: string) {
  const chercher = async (dep?: string) => {
    const u = new URL('https://recherche-entreprises.api.gouv.fr/search');
    u.searchParams.set('q', q);
    u.searchParams.set('etat_administratif', 'A');
    u.searchParams.set('per_page', '8');
    if (dep) u.searchParams.set('departement', dep);
    const r = await fetch(u, { headers: { accept: 'application/json' } });
    if (!r.ok) throw new Error('Annuaire des entreprises indisponible, réessayez.');
    return (await r.json()).results || [];
  };
  let res = await chercher('69'); // démarchage autour de Lyon : le Rhône d'abord
  if (!res.length) res = await chercher();
  return res.map((e: any) => {
    const s = e.siege || {};
    const d = (e.dirigeants || []).find((x: any) => x.type_dirigeant === 'personne physique' && !/commissaire|suppl/i.test(x.qualite || ''));
    const metier = metierFromNaf(e.activite_principale) || null;
    return {
      siren: e.siren,
      nom: titre(sansParentheses((s.liste_enseignes || [])[0] || s.nom_commercial || e.nom_raison_sociale || e.nom_complet || '')),
      raison_sociale: e.nom_raison_sociale || e.nom_complet,
      adresse: s.adresse ? ville(s.adresse) : null,
      code_postal: s.code_postal || null,
      ville: s.libelle_commune ? ville(s.libelle_commune) : null,
      metier,
      annee_creation: e.date_creation ? Number(e.date_creation.slice(0, 4)) : null,
      dirigeant: d ? `${titre(String(d.prenoms || '').split(/\s+/)[0])} ${titre(sansParentheses(String(d.nom || '')))}`.trim() : null,
      activite: metier ? METIERS[metier].label : `NAF ${e.activite_principale}`,
    };
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') ?? '';
  const cors = {
    'access-control-allow-origin': ORIGINES.includes(origin) ? origin : ORIGINES[0],
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type, x-studio-key',
    vary: 'Origin',
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });

  if (req.method !== 'POST') return json({ error: 'méthode non autorisée' }, 405);
  const { data: acces } = await sb.from('fc_studio_acces').select('cle_sha256').eq('id', 1).maybeSingle();
  const cle = req.headers.get('x-studio-key') ?? '';
  if (!acces || !cle || !egal(await sha256(cle), acces.cle_sha256)) {
    await new Promise((r) => setTimeout(r, 800)); // freine les essais de codes
    return json({ error: 'code d\'accès incorrect' }, 401);
  }

  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'requête invalide' }, 400); }
  const token = typeof body.token === 'string' && /^[a-f0-9]{24}$/.test(body.token) ? body.token : null;

  try {
    switch (body.action) {
      case 'init':
        return json({ google: !!(await cleGoogle()), metiers: Object.entries(METIERS).map(([key, m]: [string, any]) => ({ key, label: m.label, famille: m.famille || 'btp' })) });

      case 'search': {
        const q = txt(body.q, 100);
        if (!q || q.length < 3) return json({ resultats: [] });
        return json({ resultats: await sirene(q) });
      }

      case 'list': {
        const { data, error } = await sb.from('fc_prospects').select('company, metier, city, status, preview_token, updated_at')
          .eq('canal', 'terrain').neq('status', 'perdu').order('updated_at', { ascending: false }).limit(40);
        if (error) throw error;
        return json({ maquettes: (data || []).map((r) => ({ ...r, url: BASE + r.preview_token })) });
      }

      case 'get': {
        if (!token) return json({ error: 'lien invalide' }, 400);
        const { data } = await sb.from('fc_prospects').select('profile, contact_name, contact_role, email, phone, notes, status, preview_token').eq('preview_token', token).maybeSingle();
        if (!data) return json({ error: 'maquette introuvable' }, 404);
        // Miniatures des photos Google pour l'affichage dans le studio (non enregistrées).
        const cle = await cleGoogle();
        const photos = await Promise.all((data.profile?.photos || []).map(async (ph: any) =>
          String(ph?.src).startsWith('google:') && cle ? { ...ph, apercu: await urlPhoto(ph.src.slice(7), cle, 400).catch(() => null) } : ph));
        return json({ profile: { ...data.profile, photos }, contact: { nom: data.contact_name, role: data.contact_role, email: data.email, telephone: data.phone, notes: data.notes, status: data.status }, url: BASE + token });
      }

      case 'save': {
        const profile = nettoyer(body.profile || {});
        const c = body.contact || {};
        const name = normalize(profile).name;
        const row: Record<string, unknown> = {
          company: name, metier: profile.metier, city: profile.ville ?? null, postal_code: profile.code_postal ?? null,
          departement: (profile.code_postal as string | undefined)?.slice(0, 2) ?? null, siren: profile.siren ?? null,
          contact_name: txt(c.nom, 80), contact_role: txt(c.role, 60), phone: txt(c.telephone, 30) ?? profile.telephone ?? null,
          email: txt(c.email, 120)?.toLowerCase() ?? null, email_source: txt(c.email, 120) ? 'Donné par le commerçant sur place' : null,
          notes: txt(c.notes, 1000), profile, canal: 'terrain', next_action_at: null, updated_by_studio_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        };
        let cible = token;
        if (!cible && profile.siren) {
          // Déjà en base (sourcing email ou téléphone) : on reprend sa fiche et son lien.
          const { data } = await sb.from('fc_prospects').select('preview_token').eq('siren', profile.siren).maybeSingle();
          cible = data?.preview_token ?? null;
        }
        let res;
        if (cible) res = await sb.from('fc_prospects').update({ ...row, status: 'rdv' }).eq('preview_token', cible).select('preview_token').single();
        else res = await sb.from('fc_prospects').insert({ ...row, status: 'rdv' }).select('preview_token').single();
        if (res.error) {
          if (/fc_prospects_email_idx|duplicate key/.test(res.error.message)) throw new Error('Cet email ou ce SIREN est déjà utilisé par une autre fiche.');
          throw res.error;
        }
        const t = res.data.preview_token;
        await sb.from('fc_prospects').update({ preview_url: BASE + t }).eq('preview_token', t);
        const base = `/apercu/${t}`;
        const affiche = await resoudrePhotos(profile, await cleGoogle());
        return json({ token: t, url: BASE + t, html: renderIndex(affiche, { preview: true, liens: { mentions: `${base}?page=mentions`, accueil: base } }) });
      }

      case 'upload': {
        const type = ['image/jpeg', 'image/png', 'image/webp'].includes(body.type) ? body.type : null;
        if (!type || typeof body.data !== 'string') return json({ error: 'photo invalide' }, 400);
        const octets = Uint8Array.from(atob(body.data), (c) => c.charCodeAt(0));
        if (octets.length > 5 * 1024 * 1024) return json({ error: 'photo trop lourde (5 Mo maximum)' }, 400);
        const signature = octets[0] === 0xff && octets[1] === 0xd8 ? 'image/jpeg' : octets[0] === 0x89 && octets[1] === 0x50 ? 'image/png' : octets[8] === 0x57 && octets[9] === 0x45 ? 'image/webp' : null;
        if (signature !== type) return json({ error: 'le fichier n\'est pas une image' }, 400);
        const nom = `${crypto.randomUUID()}.${type.split('/')[1].replace('jpeg', 'jpg')}`;
        const { error } = await sb.storage.from(BUCKET).upload(nom, octets, { contentType: type, cacheControl: '31536000' });
        if (error) throw error;
        return json({ src: PHOTOS_URL + nom });
      }

      case 'google': {
        const cle = await cleGoogle();
        if (!cle) return json({ disponible: false, fiches: [] });
        const q = txt(body.q, 120);
        if (!q || q.length < 3) return json({ disponible: true, fiches: [] });
        return json({ disponible: true, fiches: await chercherFiche(q, cle) });
      }

      case 'archive': {
        if (!token) return json({ error: 'lien invalide' }, 400);
        await sb.from('fc_prospects').update({ status: 'perdu', updated_at: new Date().toISOString() }).eq('preview_token', token).eq('canal', 'terrain');
        return json({ ok: true });
      }

      default:
        return json({ error: 'action inconnue' }, 400);
    }
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 400);
  }
});
