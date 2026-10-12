// Maquette en ligne d'un prospect : GET ?t=<preview_token>[&page=mentions] → { name, html }.
// Supabase sert les pages de fonctions en text/plain : la fonction renvoie donc du JSON, et la page
// https://www.konsilys.com/apercu/<jeton> (dépôt esn-manager, com/apercu.html) l'affiche.
// Le rendu utilise le générateur du dépôt : déployer avec generator/render.mjs, metiers.mjs et style.mjs
// à côté de index.ts (même dossier), à chaque modification du générateur. Aucune maquette n'est stockée : désinscription ou perte → 404 immédiat.
// verify_jwt=false : la page publique appelle la fonction sans session (le jeton fait office de secret).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { renderIndex, renderMentions } from './render.mjs';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const ORIGINES = ['https://www.konsilys.com', 'https://konsilys.com'];
const INACTIFS = ['desinscrit', 'perdu', 'bounce', 'exclu'];

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') ?? '';
  const cors = {
    'access-control-allow-origin': ORIGINES.includes(origin) ? origin : ORIGINES[0],
    'access-control-allow-methods': 'GET, OPTIONS',
    vary: 'Origin',
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json; charset=utf-8', 'x-robots-tag': 'noindex', 'cache-control': 'no-store' } });

  const url = new URL(req.url);
  const token = url.searchParams.get('t') ?? '';
  if (!/^[a-f0-9]{24}$/.test(token)) return json({ error: 'lien invalide' }, 400);

  const { data: p } = await sb.from('fc_prospects').select('company,profile,status').eq('preview_token', token).maybeSingle();
  if (!p || !p.profile || INACTIFS.includes(p.status)) return json({ error: 'maquette introuvable ou supprimée' }, 404);

  const base = `/apercu/${token}`;
  const liens = { mentions: `${base}?page=mentions`, accueil: base };
  const html = url.searchParams.get('page') === 'mentions'
    ? renderMentions(p.profile, { preview: true, liens })
    : renderIndex(p.profile, { preview: true, liens });
  return json({ name: p.company, html });
});
