// Désinscription des emails de prospection Konsilys (offre sites internet BTP).
// GET  ?t=<unsub_token>  → page avec un bouton de confirmation (les antivirus de messagerie
//                          ouvrent les liens automatiquement : un GET ne doit rien modifier)
// POST ?t=<unsub_token>  → désinscription : bouton de la page, ou clic « Se désabonner » du client
//                          mail via l'en-tête List-Unsubscribe-Post (RFC 8058) → 204
// ⚠ Déployer avec verify_jwt=false : le lien est cliqué depuis un email, sans session.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const page = (body: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Désinscription — Konsilys</title><style>body{font-family:system-ui,sans-serif;max-width:520px;margin:15vh auto;padding:0 20px;color:#1f2937;line-height:1.6}h1{font-size:22px}button{font:inherit;font-weight:700;padding:12px 22px;border:0;border-radius:10px;background:#111827;color:#fff;cursor:pointer}</style></head><body><h1>Konsilys</h1>${body}</body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8' } },
  );

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get('t') ?? '';
  if (!/^[a-f0-9]{36}$/.test(token)) return page('<p>Lien de désinscription invalide.</p>', 400);

  const { data: p } = await sb.from('fc_prospects').select('id,email,status').eq('unsub_token', token).maybeSingle();
  if (!p) return page('<p>Lien de désinscription invalide ou expiré.</p>', 404);

  if (req.method === 'GET') {
    if (p.status === 'desinscrit') return page('<p>Vous êtes déjà désinscrit : vous ne recevrez plus aucun email de notre part.</p>');
    return page(`<p>Vous ne souhaitez plus recevoir nos messages ? Un clic suffit, et la maquette préparée pour votre entreprise sera supprimée.</p><form method="post" action="?t=${token}"><button type="submit">Me désinscrire</button></form>`);
  }
  if (req.method !== 'POST') return new Response(null, { status: 405 });

  await sb.from('fc_prospects').update({ status: 'desinscrit', next_action_at: null, updated_at: new Date().toISOString() }).eq('id', p.id);
  if (p.email) await sb.from('fc_suppression').upsert({ email: p.email.toLowerCase(), reason: 'lien de désinscription' });

  const oneClick = (await req.text()).includes('List-Unsubscribe=One-Click');
  return oneClick
    ? new Response(null, { status: 204 })
    : page('<p>C\'est fait : vous ne recevrez plus aucun email de notre part. Votre maquette sera supprimée sous 7 jours.</p>');
});
