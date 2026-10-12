// Désinscription des emails de prospection Konsilys (offre sites internet BTP).
// Supabase sert les pages de fonctions en text/plain : l'interface est la page
// https://www.konsilys.com/desinscription?t=<jeton> (dépôt esn-manager, com/desinscription.html),
// qui appelle cette fonction en JSON.
// GET  ?t=<unsub_token>  → { company, deja } (lecture seule : les antivirus de messagerie ouvrent les liens)
// POST ?t=<unsub_token>  → désinscription. Corps « List-Unsubscribe=One-Click » (clic « Se désabonner » du
//                          client mail, RFC 8058, en-tête List-Unsubscribe pointant ici) → 204 ; sinon → JSON.
// ⚠ Déployer avec verify_jwt=false : appelée depuis un email ou une page publique, sans session.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const ORIGINES = ['https://www.konsilys.com', 'https://konsilys.com'];

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') ?? '';
  const cors = {
    'access-control-allow-origin': ORIGINES.includes(origin) ? origin : ORIGINES[0],
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    vary: 'Origin',
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

  const token = new URL(req.url).searchParams.get('t') ?? '';
  if (!/^[a-f0-9]{36}$/.test(token)) return json({ error: 'lien invalide' }, 400);

  const { data: p } = await sb.from('fc_prospects').select('id,company,email,status').eq('unsub_token', token).maybeSingle();
  if (!p) return json({ error: 'lien invalide ou expiré' }, 404);

  if (req.method === 'GET') return json({ company: p.company, deja: p.status === 'desinscrit' });
  if (req.method !== 'POST') return json({ error: 'méthode non autorisée' }, 405);

  await sb.from('fc_prospects').update({ status: 'desinscrit', next_action_at: null, updated_at: new Date().toISOString() }).eq('id', p.id);
  if (p.email) await sb.from('fc_suppression').upsert({ email: p.email.toLowerCase(), reason: 'lien de désinscription' });

  const oneClick = (await req.text()).includes('List-Unsubscribe=One-Click');
  return oneClick ? new Response(null, { status: 204, headers: cors }) : json({ ok: true, company: p.company });
});
